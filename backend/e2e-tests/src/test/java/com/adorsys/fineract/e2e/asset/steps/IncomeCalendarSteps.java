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

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for the income calendar endpoint.
 * Exercises: GET /api/v1/portfolio/income-calendar
 */
public class IncomeCalendarSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user requests the income calendar for {int} months")
    public void userRequestsIncomeCalendar(int months) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .queryParam("months", months)
                .get("/api/v1/portfolio/income-calendar");
        context.setLastResponse(response);
    }

    @Then("the income calendar should contain at least {int} projected event(s)")
    public void incomeCalendarShouldContainEvents(int minCount) {
        List<?> events = context.getLastResponse().jsonPath().getList("events");
        assertThat(events).hasSizeGreaterThanOrEqualTo(minCount);
    }

    @Then("the income calendar total expected income should be greater than {int}")
    public void incomeCalendarTotalShouldBeGreaterThan(int minAmount) {
        BigDecimal total = context.getLastResponse().jsonPath()
                .getObject("totalExpectedIncome", BigDecimal.class);
        assertThat(total).isGreaterThan(BigDecimal.valueOf(minAmount));
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                List.of());
    }
}
