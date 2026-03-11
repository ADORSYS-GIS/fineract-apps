package com.adorsys.fineract.e2e.asset.steps;

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

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for error scenarios: insufficient funds, halted trading,
 * idempotency, and invalid operations.
 * Uses the quote-based API: POST /api/v1/trades/quote with side field.
 */
public class ErrorSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    // ---------------------------------------------------------------
    // Given steps
    // ---------------------------------------------------------------

    @Given("the asset {string} is halted")
    public void assetIsHalted(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/halt");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the user tries to buy {int} units of {string} with insufficient funds")
    public void userTriesToBuyWithInsufficientFunds(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "BUY",
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.setLastResponse(response);
    }

    @When("the user tries to sell {int} units of {string} without holding any")
    public void userTriesToSellWithoutHolding(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "SELL",
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.setLastResponse(response);
    }

    @When("the user tries to buy {int} units of halted asset {string}")
    public void userTriesToBuyHaltedAsset(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "BUY",
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.setLastResponse(response);
    }

    @When("the user sends two identical buy orders for {int} units of {string}")
    public void userSendsIdempotentBuyOrders(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");
        String idempotencyKey = UUID.randomUUID().toString();

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "BUY",
                "units", units
        );

        // First quote request
        Response first = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.storeValue("firstOrderStatus", first.statusCode());
        String orderId = first.jsonPath().getString("orderId");

        // Second quote request with same idempotency key — should return same quote
        Response second = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.setLastResponse(second);

        // Confirm and execute the single quote so we can verify only 1 trade is recorded
        if (orderId != null) {
            Response confirmResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .contentType(ContentType.JSON)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .post("/api/v1/trades/orders/" + orderId + "/confirm");

            if (confirmResp.statusCode() == 202) {
                // Poll for FILLED
                long deadline = System.currentTimeMillis() + 15_000;
                while (System.currentTimeMillis() < deadline) {
                    Response pollResp = RestAssured.given()
                            .baseUri("http://localhost:" + port)
                            .header("Authorization", "Bearer " + testUserJwt())
                            .get("/api/v1/trades/orders/" + orderId);
                    String status = pollResp.jsonPath().getString("status");
                    if ("FILLED".equals(status) || "FAILED".equals(status) || "REJECTED".equals(status)) {
                        break;
                    }
                    try { Thread.sleep(500); } catch (InterruptedException e) {
                        Thread.currentThread().interrupt(); break;
                    }
                }
            }
        }
    }

    @When("the user tries to create a BUY quote for {int} units of {string}")
    public void userTriesToCreateBuyQuote(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "BUY",
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.setLastResponse(response);
    }

    @When("the user buys more units than available supply of {string}")
    public void userBuysMoreThanSupply(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "side", "BUY",
                "units", 999999
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + testUserJwt())
                .body(body)
                .post("/api/v1/trades/quote");

        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the trade should be rejected")
    public void tradeShouldBeRejected() {
        int status = context.getStatusCode();
        assertThat(status).isBetween(400, 499);
    }

    @Then("the idempotent order should return the same result")
    public void idempotentOrderShouldReturnSameResult() {
        int firstStatus = context.getValue("firstOrderStatus");
        int secondStatus = context.getStatusCode();

        assertThat(secondStatus).isEqualTo(firstStatus);
    }

    @Then("only one trade should be recorded in the trade log")
    public void onlyOneTradeRecorded() {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId);

        Number circulatingSupply = response.jsonPath().get("circulatingSupply");
        assertThat(circulatingSupply.intValue()).isEqualTo(1);
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
}
