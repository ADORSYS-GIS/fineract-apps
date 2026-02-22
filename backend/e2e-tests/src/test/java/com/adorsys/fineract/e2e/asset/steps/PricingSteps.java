package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for pricing and market status endpoints.
 * Exercises: GET /api/prices/{id}, /api/prices/{id}/ohlc, /api/prices/{id}/history, /api/market/status
 */
public class PricingSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("I request the current price of asset {string}")
    public void requestCurrentPrice(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/prices/" + assetId);
        context.setLastResponse(response);
    }

    @When("I request the OHLC data for asset {string}")
    public void requestOhlc(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/prices/" + assetId + "/ohlc");
        context.setLastResponse(response);
    }

    @When("I request the price history for asset {string} with period {string}")
    public void requestPriceHistory(String symbolRef, String period) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .queryParam("period", period)
                .get("/api/prices/" + assetId + "/history");
        context.setLastResponse(response);
    }

    @When("I request the market status")
    public void requestMarketStatus() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/market/status");
        context.setLastResponse(response);
    }

    @Then("the price response should include a positive price")
    public void priceShouldBePositive() {
        Number price = context.getLastResponse().jsonPath().get("currentPrice");
        assertThat(price.doubleValue()).isPositive();
    }

    @Then("the market status should include a schedule")
    public void marketStatusShouldIncludeSchedule() {
        String schedule = context.getLastResponse().jsonPath().getString("schedule");
        assertThat(schedule).isNotNull().isNotEmpty();
    }

    @Then("the market status should include a timezone")
    public void marketStatusShouldIncludeTimezone() {
        String timezone = context.getLastResponse().jsonPath().getString("timezone");
        assertThat(timezone).isNotNull().isNotEmpty();
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
