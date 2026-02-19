package com.adorsys.fineract.e2e.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
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
                .post("/api/admin/assets/" + assetId + "/halt");

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
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer dummy")
                .header("X-User-External-Id", FineractInitializer.TEST_USER_EXTERNAL_ID)
                .body(body)
                .post("/api/trades/buy");

        context.setLastResponse(response);
    }

    @When("the user tries to sell {int} units of {string} without holding any")
    public void userTriesToSellWithoutHolding(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer dummy")
                .header("X-User-External-Id", FineractInitializer.TEST_USER_EXTERNAL_ID)
                .body(body)
                .post("/api/trades/sell");

        context.setLastResponse(response);
    }

    @When("the user tries to buy {int} units of halted asset {string}")
    public void userTriesToBuyHaltedAsset(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "units", units
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer dummy")
                .header("X-User-External-Id", FineractInitializer.TEST_USER_EXTERNAL_ID)
                .body(body)
                .post("/api/trades/buy");

        context.setLastResponse(response);
    }

    @When("the user sends two identical buy orders for {int} units of {string}")
    public void userSendsIdempotentBuyOrders(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");
        String idempotencyKey = UUID.randomUUID().toString();

        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "units", units
        );

        // First order
        Response first = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer dummy")
                .header("X-User-External-Id", FineractInitializer.TEST_USER_EXTERNAL_ID)
                .body(body)
                .post("/api/trades/buy");

        context.storeValue("firstOrderStatus", first.statusCode());

        // Second order with same idempotency key
        Response second = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer dummy")
                .header("X-User-External-Id", FineractInitializer.TEST_USER_EXTERNAL_ID)
                .body(body)
                .post("/api/trades/buy");

        context.setLastResponse(second);
    }

    @When("the user buys more units than available supply of {string}")
    public void userBuysMoreThanSupply(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        // Try to buy more than total supply
        Map<String, Object> body = Map.of(
                "assetId", assetId,
                "units", 999999
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer dummy")
                .header("X-User-External-Id", FineractInitializer.TEST_USER_EXTERNAL_ID)
                .body(body)
                .post("/api/trades/buy");

        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the trade should be rejected")
    public void tradeShouldBeRejected() {
        int status = context.getStatusCode();
        // Should be 4xx (400 or 409)
        assertThat(status).isBetween(400, 499);
    }

    @Then("the idempotent order should return the same result")
    public void idempotentOrderShouldReturnSameResult() {
        int firstStatus = context.getValue("firstOrderStatus");
        int secondStatus = context.getStatusCode();

        // Both should succeed (or both fail with same code)
        assertThat(secondStatus).isEqualTo(firstStatus);
    }

    @Then("only one trade should be recorded in the trade log")
    public void onlyOneTradeRecorded() {
        // The idempotency key ensures only one actual trade
        // Verify by checking circulating supply only increased once
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        int circulatingSupply = response.jsonPath().getInt("circulatingSupply");
        // With idempotency, circulating supply should reflect only one trade
        assertThat(circulatingSupply).isEqualTo(1);
    }
}
