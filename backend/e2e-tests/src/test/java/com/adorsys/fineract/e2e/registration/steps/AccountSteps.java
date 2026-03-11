package com.adorsys.fineract.e2e.registration.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for customer account access and transaction limits.
 * Exercises: GET /api/accounts/savings, GET /api/registration/limits
 */
public class AccountSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the customer requests their savings accounts")
    public void customerRequestsSavingsAccounts() {
        String externalId = context.getId("registeredExternalId");
        assertThat(externalId).as("No registered externalId stored").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + customerJwt(externalId))
                .get("/api/accounts/savings");
        context.setLastResponse(response);
    }

    @When("the customer requests their transaction limits")
    public void customerRequestsTransactionLimits() {
        String externalId = context.getId("registeredExternalId");
        assertThat(externalId).as("No registered externalId stored").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + customerJwt(externalId))
                .get("/api/registration/limits");
        context.setLastResponse(response);
    }

    @Then("the limits response should include a kycTier")
    public void limitsResponseShouldIncludeKycTier() {
        Object kycTier = context.getLastResponse().jsonPath().get("kycTier");
        assertThat(kycTier).isNotNull();
    }

    @Then("the limits response should include daily limits")
    public void limitsResponseShouldIncludeDailyLimits() {
        Object limits = context.getLastResponse().jsonPath().get("limits");
        assertThat(limits).isNotNull();
    }

    private String customerJwt(String externalId) {
        return JwtTokenFactory.generateRegistrationToken(externalId, null);
    }
}
