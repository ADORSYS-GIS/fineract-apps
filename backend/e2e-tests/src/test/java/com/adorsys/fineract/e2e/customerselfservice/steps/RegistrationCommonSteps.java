package com.adorsys.fineract.e2e.customerselfservice.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Shared Given steps and common assertions for registration E2E tests.
 */
public class RegistrationCommonSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Given("Fineract is initialized for registration tests")
    public void fineractIsInitialized() {
        // FineractInitializer.initialize() is called in the static block of
        // RegistrationE2ESpringConfiguration — this step is a no-op safety guard.
        FineractInitializer.initialize(fineractTestClient);
    }

    @Given("a registered customer exists for KYC testing")
    public void registeredCustomerExistsForKyc() {
        String suffix = context.getScenarioSuffix();
        String email = "kyc-user-" + suffix + "@e2e.test";

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(Map.of(
                        "firstName", "KYC",
                        "lastName", "User" + suffix,
                        "email", email,
                        "phone", "+23760000" + String.format("%04d", Integer.parseInt(suffix) + 1000)
                ))
                .post("/api/registration/register");

        assertThat(response.statusCode())
                .as("Register customer for KYC: %s", response.body().asString())
                .isEqualTo(201);

        String externalId = response.jsonPath().getString("externalId");
        context.storeId("registeredExternalId", externalId);
    }

    @Given("a registered customer exists with a savings account")
    public void registeredCustomerExistsWithSavingsAccount() {
        // First, register a customer
        registeredCustomerExistsForKyc();
        // The registration service creates the Fineract client + savings account automatically
    }

    @Then("the response status should be {int}")
    public void responseStatusShouldBe(int expectedStatus) {
        assertThat(context.getStatusCode())
                .as("Response: %s", context.getBody())
                .isEqualTo(expectedStatus);
    }
}
