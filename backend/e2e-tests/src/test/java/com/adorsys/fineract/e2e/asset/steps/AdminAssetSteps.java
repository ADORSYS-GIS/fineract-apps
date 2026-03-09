package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for admin asset operations.
 * Exercises: GET /api/v1/admin/assets, PUT /api/v1/admin/assets/{id}, POST /api/v1/admin/assets/{id}/mint,
 *            GET /api/v1/admin/assets/{id}/coupon-forecast
 */
public class AdminAssetSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the admin lists all assets")
    public void adminListsAllAssets() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets");
        context.setLastResponse(response);
    }

    @When("the admin updates asset {string} with name {string} and description {string}")
    public void adminUpdatesAsset(String symbolRef, String name, String description) {
        String assetId = resolveAssetId(symbolRef);
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("description", description);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(body)
                .put("/api/v1/admin/assets/" + assetId);
        context.setLastResponse(response);
    }

    @When("the admin mints {int} additional units for asset {string}")
    public void adminMintsSupply(int additionalSupply, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(Map.of("additionalSupply", additionalSupply))
                .post("/api/v1/admin/assets/" + assetId + "/mint");
        context.setLastResponse(response);
    }

    @When("the admin requests the coupon forecast for asset {string}")
    public void adminRequestsCouponForecast(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/coupon-forecast");
        context.setLastResponse(response);
    }

    @Then("the admin asset list should contain asset {string}")
    public void adminAssetListShouldContain(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath().getList("content.symbol");
        assertThat(symbols).contains(symbol);
    }

    @Then("the asset total supply should be {int}")
    public void assetTotalSupplyShouldBe(int expectedSupply) {
        String assetId = context.getId("lastAssetId");
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId);
        assertThat(response.statusCode()).isEqualTo(200);
        Number totalSupply = response.jsonPath().get("totalSupply");
        assertThat(totalSupply.intValue()).isEqualTo(expectedSupply);
    }

    @Then("the coupon forecast should include remaining coupon liability")
    public void couponForecastShouldIncludeLiability() {
        Number liability = context.getLastResponse().jsonPath().get("totalRemainingCouponObligation");
        assertThat(liability).isNotNull();
    }

    // ── Coupon / Income endpoints ──

    @When("the admin gets the coupon history for asset {string}")
    public void adminGetsCouponHistory(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/coupons");
        context.setLastResponse(response);
    }

    @When("the admin gets the income distributions for asset {string}")
    public void adminGetsIncomeDistributions(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/income-distributions");
        context.setLastResponse(response);
    }

    @When("the admin gets the income forecast for asset {string}")
    public void adminGetsIncomeForecast(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/income-forecast");
        context.setLastResponse(response);
    }

    @Then("the page should have {int} total elements")
    public void pageShouldHaveTotalElements(int expected) {
        int total = context.getLastResponse().jsonPath().getInt("totalElements");
        assertThat(total).isEqualTo(expected);
    }

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
