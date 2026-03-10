package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.And;
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
 * Step definitions for the quote-based async trade flow.
 */
public class QuoteTradingSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the user creates a BUY quote for {int} units of {string}")
    public void userCreatesBuyQuote(int units, String symbolRef) {
        createQuote("BUY", units, symbolRef);
    }

    @When("the user creates a SELL quote for {int} units of {string}")
    public void userCreatesSellQuote(int units, String symbolRef) {
        createQuote("SELL", units, symbolRef);
    }

    @When("the user confirms the quote")
    public void userConfirmsQuote() {
        String orderId = context.getId("lastQuoteOrderId");
        assertThat(orderId).as("No quote order ID stored").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/trades/orders/" + orderId + "/confirm");

        assertThat(response.statusCode())
                .as("Confirm quote: %s", response.body().asString())
                .isEqualTo(202);
        context.setLastResponse(response);
    }

    @When("the user cancels the quote")
    public void userCancelsQuote() {
        String orderId = context.getId("lastQuoteOrderId");
        assertThat(orderId).as("No quote order ID stored").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/trades/orders/" + orderId + "/cancel");

        context.setLastResponse(response);
    }

    @When("the quote TTL expires")
    public void quoteTtlExpires() {
        // Wait for the quote to expire (TTL is 30s + scheduler runs every 10s)
        // Poll until the order status becomes CANCELLED, up to 50s
        String orderId = context.getId("lastQuoteOrderId");
        assertThat(orderId).as("No quote order ID stored").isNotNull();

        long deadline = System.currentTimeMillis() + 50_000;
        while (System.currentTimeMillis() < deadline) {
            Response response = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .get("/api/trades/orders/" + orderId);

            String status = response.jsonPath().getString("status");
            if ("CANCELLED".equals(status)) {
                context.setLastResponse(response);
                return;
            }
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        // If we reach here, fetch one final time
        Response finalResponse = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/trades/orders/" + orderId);
        context.setLastResponse(finalResponse);
    }

    @When("the user tries to confirm the expired quote")
    public void userTriesToConfirmExpiredQuote() {
        String orderId = context.getId("lastQuoteOrderId");
        assertThat(orderId).as("No quote order ID stored").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/trades/orders/" + orderId + "/confirm");

        context.setLastResponse(response);
    }

    @When("the user creates two BUY quotes for {int} units of {string} with the same idempotency key")
    public void userCreatesTwoQuotesWithSameKey(int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        String idempotencyKey = UUID.randomUUID().toString();

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "BUY",
                "units", units
        );

        // Store balance before
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        // First request
        Response first = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/trades/quote");

        context.storeValue("firstQuoteOrderId", first.jsonPath().getString("orderId"));

        // Second request with same key
        Response second = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/trades/quote");

        context.storeValue("secondQuoteOrderId", second.jsonPath().getString("orderId"));
        context.setLastResponse(second);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the quote should be QUOTED")
    public void quoteShouldBeQuoted() {
        String status = context.jsonPath("status");
        assertThat(status).isEqualTo("QUOTED");
    }

    @And("the quote should have an expiry time")
    public void quoteShouldHaveExpiryTime() {
        Object expiresAt = context.jsonPath("quoteExpiresAt");
        assertThat(expiresAt).isNotNull();
    }

    @Then("the order should eventually be FILLED")
    public void orderShouldEventuallyBeFilled() {
        String orderId = context.getId("lastQuoteOrderId");
        assertThat(orderId).as("No quote order ID stored").isNotNull();

        // Poll until FILLED (up to 15s)
        long deadline = System.currentTimeMillis() + 15_000;
        while (System.currentTimeMillis() < deadline) {
            Response response = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .get("/api/trades/orders/" + orderId);

            String status = response.jsonPath().getString("status");
            if ("FILLED".equals(status)) {
                context.setLastResponse(response);
                return;
            }
            if ("FAILED".equals(status) || "REJECTED".equals(status)) {
                context.setLastResponse(response);
                assertThat(status).as("Order failed: %s", response.body().asString()).isEqualTo("FILLED");
                return;
            }
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        // Final check
        Response finalResponse = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/trades/orders/" + orderId);
        context.setLastResponse(finalResponse);
        assertThat(finalResponse.jsonPath().getString("status"))
                .as("Order did not reach FILLED within timeout")
                .isEqualTo("FILLED");
    }

    @Then("the order status should be CANCELLED")
    public void orderStatusShouldBeCancelled() {
        String orderId = context.getId("lastQuoteOrderId");
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/trades/orders/" + orderId);

        assertThat(response.jsonPath().getString("status")).isEqualTo("CANCELLED");
    }

    @Then("the confirmation should be rejected")
    public void confirmationShouldBeRejected() {
        int status = context.getStatusCode();
        assertThat(status).isBetween(400, 499);
    }

    @Then("both responses should have the same order ID")
    public void bothResponsesShouldHaveSameOrderId() {
        String firstId = context.getValue("firstQuoteOrderId");
        String secondId = context.getValue("secondQuoteOrderId");
        assertThat(firstId).isNotNull();
        assertThat(secondId).isNotNull();
        assertThat(firstId).isEqualTo(secondId);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private void createQuote(String side, int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);

        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", side,
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/trades/quote");

        assertThat(response.statusCode())
                .as("Create quote: %s", response.body().asString())
                .isEqualTo(201);

        String orderId = response.jsonPath().getString("orderId");
        context.storeId("lastQuoteOrderId", orderId);
        context.setLastResponse(response);
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                java.util.List.of());
    }

    private String resolveAssetId(String ref) {
        String perSymbol = context.getId("assetId_" + ref);
        if (perSymbol != null) return perSymbol;
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) return stored;
        return ref;
    }
}
