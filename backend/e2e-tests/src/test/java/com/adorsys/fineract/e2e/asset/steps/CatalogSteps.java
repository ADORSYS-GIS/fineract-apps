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
 * Step definitions for asset catalog browsing and discovery.
 * Exercises: GET /api/assets, /api/assets/{id}, /api/assets/{id}/recent-trades, /api/assets/discover
 */
public class CatalogSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("I request the asset catalog")
    public void requestAssetCatalog() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/assets");
        context.setLastResponse(response);
    }

    @When("I request the asset catalog filtered by category {string}")
    public void requestAssetCatalogByCategory(String category) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .queryParam("category", category)
                .get("/api/assets");
        context.setLastResponse(response);
    }

    @When("I search the asset catalog for {string}")
    public void searchAssetCatalog(String keyword) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .queryParam("search", keyword)
                .get("/api/assets");
        context.setLastResponse(response);
    }

    @When("I request the detail of asset {string}")
    public void requestAssetDetail(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/assets/" + assetId);
        context.setLastResponse(response);
    }

    @When("I request recent trades for asset {string}")
    public void requestRecentTrades(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/assets/" + assetId + "/recent-trades");
        context.setLastResponse(response);
    }

    @Then("the catalog should contain asset {string}")
    public void catalogShouldContainAsset(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath().getList("content.symbol");
        assertThat(symbols).contains(symbol);
    }

    @Then("the asset detail should include symbol {string}")
    public void assetDetailShouldIncludeSymbol(String expectedSymbol) {
        String symbol = context.getLastResponse().jsonPath().getString("symbol");
        assertThat(symbol).isEqualTo(expectedSymbol);
    }

    @Then("the asset detail should include category {string}")
    public void assetDetailShouldIncludeCategory(String expectedCategory) {
        String category = context.getLastResponse().jsonPath().getString("category");
        assertThat(category).isEqualTo(expectedCategory);
    }

    @Then("the asset detail should include name {string}")
    public void assetDetailShouldIncludeName(String expectedName) {
        String name = context.getLastResponse().jsonPath().getString("name");
        assertThat(name).isEqualTo(expectedName);
    }

    @Then("the recent trades list should not be empty")
    public void recentTradesShouldNotBeEmpty() {
        List<?> trades = context.getLastResponse().jsonPath().getList("$");
        assertThat(trades).isNotEmpty();
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
