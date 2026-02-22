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
        Map<String, Object> request = Map.of(
                "name", "Stock " + symbolRef,
                "symbol", symbolRef,
                "currencyCode", symbolRef,
                "category", "STOCKS",
                "initialPrice", price,
                "totalSupply", supply,
                "decimalPlaces", 0,
                "treasuryClientId", FineractInitializer.getTreasuryClientId(),
                "subscriptionStartDate", java.time.LocalDate.now().minusMonths(1).toString(),
                "subscriptionEndDate", java.time.LocalDate.now().plusYears(1).toString()
        );

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/admin/assets");

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
                .post("/api/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
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

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/trades/buy");

        context.setLastResponse(response);
    }

    @When("the user sells {int} units of {string}")
    public void userSellsUnits(int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);

        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/trades/sell");

        context.setLastResponse(response);
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
                .get("/api/admin/assets/" + assetId);

        Number circulatingSupply = response.jsonPath().get("circulatingSupply");
        assertThat(circulatingSupply.intValue()).isEqualTo(expected);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

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
