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
 * Exercises: GET /api/v1/portfolio, /api/v1/portfolio/positions/{assetId}, /api/v1/portfolio/history
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
                .get("/api/v1/portfolio");
        context.setLastResponse(response);
    }

    @When("the user requests position detail for asset {string}")
    public void requestPositionDetail(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/v1/portfolio/positions/" + assetId);
        context.setLastResponse(response);
    }

    @When("the user requests their portfolio history for period {string}")
    public void requestPortfolioHistory(String period) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .queryParam("period", period)
                .get("/api/v1/portfolio/history");
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

    // ---------------------------------------------------------------
    // Bond position assertions
    // ---------------------------------------------------------------

    @Then("the position bondBenefit bondType should be {string}")
    public void positionBondBenefitTypeShouldBe(String expectedType) {
        String bondType = context.getLastResponse().jsonPath().getString("bondBenefit.bondType");
        assertThat(bondType)
                .as("bondBenefit.bondType — response: %s", context.getLastResponse().body().asString())
                .isEqualTo(expectedType);
    }

    @Then("the bond currentYield should be greater than {int}")
    public void bondCurrentYieldShouldBeGreaterThan(int min) {
        Number currentYield = context.getLastResponse().jsonPath().get("currentYield");
        assertThat(currentYield)
                .as("currentYield should be present and > %d", min)
                .isNotNull();
        assertThat(currentYield.doubleValue()).isGreaterThan(min);
    }

    // ---------------------------------------------------------------
    // Income history steps
    // ---------------------------------------------------------------

    @When("the user requests their income history")
    public void requestIncomeHistory() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/v1/portfolio/income-history");
        context.setLastResponse(response);
    }

    @When("the user requests their income history with status {string}")
    public void requestIncomeHistoryWithStatus(String status) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .queryParam("status", status)
                .get("/api/v1/portfolio/income-history");
        context.setLastResponse(response);
    }

    @Then("the income history should contain at least {int} paid event(s)")
    public void incomeHistoryShouldContainPaidEvents(int minCount) {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        long paidCount = statuses == null ? 0 : statuses.stream().filter("PAID"::equals).count();
        assertThat(paidCount)
                .as("Expected >= %d PAID events in income history — response: %s",
                        minCount, context.getLastResponse().body().asString())
                .isGreaterThanOrEqualTo(minCount);
    }

    @Then("the income history paid events should have positive net amounts")
    public void incomeHistoryPaidEventsShouldHavePositiveNetAmounts() {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        List<Number> netAmounts = context.getLastResponse().jsonPath().getList("content.totalNet");
        if (statuses == null) return;
        for (int i = 0; i < statuses.size(); i++) {
            if ("PAID".equals(statuses.get(i))) {
                assertThat(netAmounts.get(i).doubleValue())
                        .as("PAID event at index %d should have positive totalNet", i)
                        .isPositive();
            }
        }
    }

    @Then("the income history summary total paid should be greater than {int}")
    public void incomeHistorySummaryTotalPaidGreaterThan(int min) {
        Number totalPaid = context.getLastResponse().jsonPath().get("summary.totalPaid");
        assertThat(totalPaid)
                .as("summary.totalPaid should be present")
                .isNotNull();
        assertThat(totalPaid.doubleValue())
                .as("summary.totalPaid should be > %d", min)
                .isGreaterThan(min);
    }

    @Then("the first paid event should have IRCM withheld greater than {int}")
    public void firstPaidEventIrcmWithheldGreaterThan(int min) {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        List<Number> ircmWithheld = context.getLastResponse().jsonPath().getList("content.ircmWithheldPerUnit");
        assertThat(statuses).as("income history content should not be empty").isNotEmpty();
        int firstPaidIdx = statuses.indexOf("PAID");
        assertThat(firstPaidIdx).as("At least one PAID event should exist").isGreaterThanOrEqualTo(0);
        assertThat(ircmWithheld.get(firstPaidIdx).doubleValue())
                .as("First PAID event ircmWithheldPerUnit should be > %d", min)
                .isGreaterThan(min);
    }

    @Then("the first paid event net amount should be less than gross amount")
    public void firstPaidEventNetShouldBeLessThanGross() {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        List<Number> grossAmounts = context.getLastResponse().jsonPath().getList("content.grossAmountPerUnit");
        List<Number> netAmounts = context.getLastResponse().jsonPath().getList("content.netAmountPerUnit");
        int firstPaidIdx = statuses.indexOf("PAID");
        assertThat(firstPaidIdx).as("At least one PAID event should exist").isGreaterThanOrEqualTo(0);
        assertThat(netAmounts.get(firstPaidIdx).doubleValue())
                .as("Net amount should be less than gross for IRCM-taxable event")
                .isLessThan(grossAmounts.get(firstPaidIdx).doubleValue());
    }

    @Then("the income history should contain at least {int} scheduled event(s)")
    public void incomeHistoryShouldContainScheduledEvents(int minCount) {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        long scheduledCount = statuses == null ? 0 : statuses.stream().filter("SCHEDULED"::equals).count();
        assertThat(scheduledCount)
                .as("Expected >= %d SCHEDULED events — response: %s",
                        minCount, context.getLastResponse().body().asString())
                .isGreaterThanOrEqualTo(minCount);
    }

    @Then("all income history events should have status {string}")
    public void allIncomeHistoryEventsShouldHaveStatus(String expectedStatus) {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        assertThat(statuses)
                .as("All events should have status %s", expectedStatus)
                .isNotEmpty()
                .allMatch(expectedStatus::equals);
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
