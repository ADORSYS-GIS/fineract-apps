package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for portfolio endpoints.
 * Exercises: GET /api/portfolio, /api/portfolio/positions/{assetId}, /api/portfolio/history
 */
public class PortfolioSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user requests their portfolio")
    public void requestPortfolio() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/portfolio");
        context.setLastResponse(response);
    }

    @When("the user requests position detail for asset {string}")
    public void requestPositionDetail(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/portfolio/positions/" + assetId);
        context.setLastResponse(response);
    }

    @When("the user requests their portfolio history for period {string}")
    public void requestPortfolioHistory(String period) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .queryParam("period", period)
                .get("/api/portfolio/history");
        context.setLastResponse(response);
    }

    @Then("the portfolio should have a positive total value")
    public void portfolioShouldHavePositiveTotalValue() {
        Number totalValue = context.getLastResponse().jsonPath().get("totalValue");
        assertThat(totalValue.doubleValue()).isPositive();
    }

    @Then("the portfolio should contain position for {string}")
    public void portfolioShouldContainPosition(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath().getList("positions.symbol");
        assertThat(symbols).contains(symbol);
    }

    @Then("the position should show {int} units held")
    public void positionShouldShowUnits(int expectedUnits) {
        Number totalUnits = context.getLastResponse().jsonPath().get("totalUnits");
        assertThat(totalUnits.intValue()).isEqualTo(expectedUnits);
    }

    @Then("the portfolio total value should be zero or positive")
    public void portfolioTotalValueShouldBeZeroOrPositive() {
        Number totalValue = context.getLastResponse().jsonPath().get("totalValue");
        assertThat(totalValue.doubleValue()).isGreaterThanOrEqualTo(0);
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
