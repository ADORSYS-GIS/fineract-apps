package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for extended admin operations:
 * DELETE /api/v1/admin/assets/{id}, GET /api/v1/admin/lp/performance,
 * GET /api/v1/admin/assets/inventory, GET /api/v1/admin/orders/summary,
 * GET /api/v1/admin/assets/{id}/income-summary, GET /api/v1/admin/assets/{id}/redemptions
 */
public class AdminExtendedSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    // ---------------------------------------------------------------
    // Delete Asset
    // ---------------------------------------------------------------

    @When("the admin deletes the pending asset")
    public void adminDeletesPendingAsset() {
        String assetId = context.getId("lastAssetId");
        assertThat(assetId).as("No asset ID stored").isNotNull();
        deleteAsset(assetId);
    }

    @When("the admin deletes asset {string}")
    public void adminDeletesAsset(String ref) {
        String assetId = resolveAssetId(ref);
        deleteAsset(assetId);
    }

    private void deleteAsset(String assetId) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .delete("/api/v1/admin/assets/" + assetId);
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // LP Performance
    // ---------------------------------------------------------------

    @When("the admin requests LP performance summary")
    public void adminRequestsLpPerformance() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/lp/performance");
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Asset Inventory
    // ---------------------------------------------------------------

    @When("the admin requests asset inventory")
    public void adminRequestsInventory() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/inventory");
        context.setLastResponse(response);
    }

    @Then("the inventory should contain asset {string}")
    public void inventoryShouldContainAsset(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath()
                .getList("content.symbol");
        assertThat(symbols).contains(symbol);
    }

    // ---------------------------------------------------------------
    // Order Summary
    // ---------------------------------------------------------------

    @When("the admin requests order summary")
    public void adminRequestsOrderSummary() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/orders/summary");
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Income Summary
    // ---------------------------------------------------------------

    @When("the admin requests income summary for asset {string}")
    public void adminRequestsIncomeSummary(String ref) {
        String assetId = resolveAssetId(ref);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/income-summary");
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Redemption History
    // ---------------------------------------------------------------

    @When("the admin requests redemption history for asset {string}")
    public void adminRequestsRedemptionHistory(String ref) {
        String assetId = resolveAssetId(ref);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/redemptions");
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Generic response assertions
    // ---------------------------------------------------------------

    @Then("the response body should contain field {string}")
    public void responseBodyShouldContainField(String fieldName) {
        Object value = context.getLastResponse().jsonPath().get(fieldName);
        assertThat(value).as("Field '%s' should be present in response", fieldName).isNotNull();
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private String resolveAssetId(String ref) {
        if ("lastCreated".equals(ref)) {
            return context.getId("lastAssetId");
        }
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) {
            return stored;
        }
        return ref;
    }
}
