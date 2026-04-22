package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for order resolution and single-asset reconciliation E2E tests.
 */
public class OrderResolutionSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    // ── Order Filtering ──

    @When("the admin lists orders with status {string}")
    public void adminListsOrdersWithStatus(String status) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("status", status)
                .get("/api/v1/admin/orders");
        context.setLastResponse(response);
    }

    // ── Order Detail ──

    @When("the admin gets the detail for the last order")
    public void adminGetsDetailForLastOrder() {
        // The last trade response should have the orderId
        String orderId = context.getValue("lastOrderId");
        if (orderId == null) {
            // Try to get it from the previous response body
            orderId = context.getLastResponse().jsonPath().getString("orderId");
        }
        assertThat(orderId).as("No order ID found in context").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/orders/" + orderId);
        context.setLastResponse(response);
    }

    @Then("the order detail should include fineractBatchId")
    public void orderDetailShouldIncludeFineractBatchId() {
        String batchId = context.getLastResponse().jsonPath().getString("fineractBatchId");
        assertThat(batchId).as("fineractBatchId should not be null").isNotNull();
    }

    @Then("the order detail should include asset symbol {string}")
    public void orderDetailShouldIncludeAssetSymbol(String expectedSymbol) {
        String symbol = context.getLastResponse().jsonPath().getString("symbol");
        assertThat(symbol).isEqualTo(expectedSymbol);
    }

    // ── Asset Options ──

    @When("the admin gets order asset options")
    public void adminGetsOrderAssetOptions() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/orders/asset-options");
        context.setLastResponse(response);
    }

    // ── Order Resolution ──

    @When("the admin resolves the last order with resolution {string}")
    public void adminResolvesLastOrder(String resolution) {
        String orderId = context.getValue("lastOrderId");
        if (orderId == null) {
            orderId = context.getLastResponse().jsonPath().getString("orderId");
        }
        assertThat(orderId).as("No order ID found in context").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(Map.of("resolution", resolution))
                .post("/api/v1/admin/orders/" + orderId + "/resolve");
        context.setLastResponse(response);
    }

    @When("the admin resolves order {string} with resolution {string}")
    public void adminResolvesOrderById(String orderId, String resolution) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(Map.of("resolution", resolution))
                .post("/api/v1/admin/orders/" + orderId + "/resolve");
        context.setLastResponse(response);
    }

    @Then("the order status should be {string}")
    public void orderStatusShouldBe(String expectedStatus) {
        String status = context.getLastResponse().jsonPath().getString("status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @Then("the order resolvedBy should be populated")
    public void orderResolvedByShouldBePopulated() {
        String resolvedBy = context.getLastResponse().jsonPath().getString("resolvedBy");
        assertThat(resolvedBy).isNotNull();
        assertThat(resolvedBy).isNotBlank();
    }

    // ── Helpers ──

    private String resolveAssetId(String symbolRef) {
        if (symbolRef.equalsIgnoreCase("lastCreated")) {
            return context.getId("lastAssetId");
        }
        // Look up by symbol from stored context
        String assetId = context.getId("assetId_" + symbolRef);
        if (assetId == null) {
            assetId = context.getId("lastAssetId");
        }
        assertThat(assetId).as("Cannot resolve asset ID for: " + symbolRef).isNotNull();
        return assetId;
    }
}
