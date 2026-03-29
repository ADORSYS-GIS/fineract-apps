package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for stock trading (buy/sell) with Fineract balance verification.
 * Uses the quote-confirm async flow: POST /api/v1/trades/quote → POST /api/v1/trades/orders/{id}/confirm → poll GET.
 */
public class StockTradingSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // Given steps
    // ---------------------------------------------------------------

    @Given("an active stock asset {string} with price {int} and supply {int}")
    public void activeStockAsset(String symbolRef, int price, int supply) {
        BigDecimal issuerPrice = new BigDecimal(price);
        Map<String, Object> request = new java.util.HashMap<>(Map.of(
                "name", "Stock " + symbolRef,
                "symbol", symbolRef,
                "currencyCode", symbolRef,
                "category", "STOCKS",
                "issuerPrice", issuerPrice,
                "lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")),
                "lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")),
                "totalSupply", supply
        ));
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create asset %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeId("assetId_" + symbolRef, assetId);
        context.storeValue("lastSymbol", symbolRef);

        // Activate
        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("the user holds {int} units of {string}")
    public void the_user_holds_units_of(int units, String symbolRef) {
        userBuysUnits(units, symbolRef);
        tradeShouldBeFilled();
    }

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the user buys {int} units of {string}")
    public void userBuysUnits(int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);

        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        quoteConfirmAndPoll(assetId, "BUY", units);
    }

    @When("the user sells {int} units of {string}")
    public void userSellsUnits(int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);

        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        quoteConfirmAndPoll(assetId, "SELL", units);
    }

    @When("the user tries to buy {int} unit of {string}")
    public void userTriesToBuyUnit(int units, String symbolRef) {
        userBuysUnits(units, symbolRef);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the trade should be FILLED")
    public void tradeShouldBeFilled() {
        String status = context.jsonPath("status");
        assertThat(status).isEqualTo("FILLED");
    }

    @Then("the trade should include realized PnL")
    public void tradeShouldIncludeRealizedPnl() {
        Object pnl = context.jsonPath("realizedPnl");
        assertThat(pnl).isNotNull();
    }

    @Then("the user's XAF balance in Fineract should have decreased by approximately {long}")
    public void xafBalanceShouldHaveDecreased(long expectedDecrease) {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        BigDecimal actualDecrease = balanceBefore.subtract(balanceAfter);
        assertThat(actualDecrease.longValue())
                .isCloseTo(expectedDecrease, org.assertj.core.data.Offset.offset(
                        (long) (expectedDecrease * 0.05)));
    }

    @Then("the user's XAF balance in Fineract should have increased")
    public void xafBalanceShouldHaveIncreased() {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        assertThat(balanceAfter).isGreaterThan(balanceBefore);
    }

    @Then("the asset circulating supply should be {int}")
    public void circulatingSupplyShouldBe(int expected) {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId);

        Number circulatingSupply = response.jsonPath().get("circulatingSupply");
        assertThat(circulatingSupply.intValue()).isEqualTo(expected);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    /**
     * Executes the full quote → confirm → poll-for-FILLED flow.
     * Sets the last response to the final polled order response (status 200, status=FILLED).
     */
    private void quoteConfirmAndPoll(String assetId, String side, int units) {
        // 1. Create quote
        Map<String, Object> quoteBody = Map.of(
                "assetId", assetId,
                "side", side,
                "units", units
        );

        Response quoteResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(quoteBody)
                .post("/api/v1/trades/quote");

        assertThat(quoteResp.statusCode())
                .as("Create quote: %s", quoteResp.body().asString())
                .isEqualTo(201);

        String orderId = quoteResp.jsonPath().getString("orderId");
        assertThat(orderId).as("Quote should return orderId").isNotNull();

        // 2. Confirm quote
        Response confirmResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/v1/trades/orders/" + orderId + "/confirm");

        assertThat(confirmResp.statusCode())
                .as("Confirm quote: %s", confirmResp.body().asString())
                .isEqualTo(202);

        // 3. Poll for FILLED (up to 15s)
        long deadline = System.currentTimeMillis() + 15_000;
        while (System.currentTimeMillis() < deadline) {
            Response pollResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .get("/api/v1/trades/orders/" + orderId);

            String status = pollResp.jsonPath().getString("status");
            if ("FILLED".equals(status) || "FAILED".equals(status) || "REJECTED".equals(status)) {
                context.setLastResponse(pollResp);
                return;
            }
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        // Final poll
        Response finalResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/v1/trades/orders/" + orderId);
        context.setLastResponse(finalResp);
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                java.util.List.of());
    }

    private String resolveAssetId(String ref) {
        // First try per-symbol lookup
        String perSymbol = context.getId("assetId_" + ref);
        if (perSymbol != null) {
            return perSymbol;
        }
        // Fall back to last-created asset if symbol matches
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) {
            return stored;
        }
        return ref;
    }
}
