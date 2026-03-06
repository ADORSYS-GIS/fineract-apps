package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for trade preview and order history.
 * Exercises: POST /api/trades/preview, GET /api/trades/orders, /api/trades/orders/{id}
 */
public class TradePreviewSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user previews a BUY of {int} units of {string}")
    public void previewBuy(int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .body(Map.of("assetId", assetId, "side", "BUY", "units", units))
                .post("/api/trades/preview");
        context.setLastResponse(response);
    }

    @When("the user previews a SELL of {int} units of {string}")
    public void previewSell(int units, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .body(Map.of("assetId", assetId, "side", "SELL", "units", units))
                .post("/api/trades/preview");
        context.setLastResponse(response);
    }

    @When("the user requests their order history")
    public void requestOrderHistory() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/trades/orders");
        context.setLastResponse(response);
    }

    @When("the user requests their order history for asset {string}")
    public void requestOrderHistoryForAsset(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .queryParam("assetId", assetId)
                .get("/api/trades/orders");
        context.setLastResponse(response);
    }

    @When("the user requests the detail of the last order")
    public void requestLastOrderDetail() {
        String orderId = context.jsonPath("orderId");
        assertThat(orderId).as("orderId from last trade response").isNotNull();
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/trades/orders/" + orderId);
        context.setLastResponse(response);
    }

    @Then("the preview should be feasible")
    public void previewShouldBeFeasible() {
        Boolean feasible = context.getLastResponse().jsonPath().getBoolean("feasible");
        assertThat(feasible).isTrue();
    }

    @Then("the preview should not be feasible")
    public void previewShouldNotBeFeasible() {
        Boolean feasible = context.getLastResponse().jsonPath().getBoolean("feasible");
        assertThat(feasible).isFalse();
    }

    @Then("the preview should show side {string}")
    public void previewShouldShowSide(String expectedSide) {
        String side = context.getLastResponse().jsonPath().getString("side");
        assertThat(side).isEqualTo(expectedSide);
    }

    @Then("the preview should show a positive gross amount")
    public void previewShouldShowPositiveGrossAmount() {
        Number grossAmount = context.getLastResponse().jsonPath().get("grossAmount");
        assertThat(grossAmount.doubleValue()).isPositive();
    }

    @Then("the order history should contain at least {int} order")
    public void orderHistoryShouldContain(int minOrders) {
        List<?> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).hasSizeGreaterThanOrEqualTo(minOrders);
    }

    @Then("the order detail should show status {string}")
    public void orderDetailShouldShowStatus(String expectedStatus) {
        String status = context.getLastResponse().jsonPath().getString("status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                List.of());
    }

    private String resolveAssetId(String ref) {
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) {
            return stored;
        }
        return ref;
    }
}
