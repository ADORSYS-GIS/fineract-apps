package com.adorsys.fineract.e2e.registration.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for customer registration endpoints.
 * Exercises: POST /api/registration/register, GET /api/registration/status/{externalId}
 */
public class RegistrationSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("a customer registers with:")
    public void customerRegistersWith(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String suffix = context.getScenarioSuffix();

        // Make email unique per scenario to avoid collisions
        Map<String, Object> body = new HashMap<>();
        if (data.containsKey("firstName")) body.put("firstName", data.get("firstName"));
        if (data.containsKey("lastName")) body.put("lastName", data.get("lastName"));
        if (data.containsKey("phone")) body.put("phone", data.get("phone"));

        // Use email as-is if provided (some scenarios test duplicate detection)
        if (data.containsKey("email")) {
            String email = data.get("email");
            // Append suffix only if it doesn't look like a test-specific email
            if (!email.contains("dup@") && !email.contains("status@")) {
                email = email.replace("@", "-" + suffix + "@");
            }
            body.put("email", email);
        }

        // Optional address fields
        if (data.containsKey("city") || data.containsKey("country")) {
            Map<String, String> address = new HashMap<>();
            if (data.containsKey("city")) address.put("city", data.get("city"));
            if (data.containsKey("country")) address.put("country", data.get("country"));
            body.put("address", address);
        }

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/register");

        context.setLastResponse(response);

        // Store externalId if registration was successful
        if (response.statusCode() == 201) {
            String externalId = response.jsonPath().getString("externalId");
            if (externalId != null) {
                context.storeId("registeredExternalId", externalId);
            }
        }
    }

    @Then("the registration response should include an externalId")
    public void registrationResponseShouldIncludeExternalId() {
        String externalId = context.getLastResponse().jsonPath().getString("externalId");
        assertThat(externalId).isNotNull().isNotBlank();
    }

    @Then("the registration response status should be {string}")
    public void registrationResponseStatusShouldBe(String expectedStatus) {
        String status = context.getLastResponse().jsonPath().getString("status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @When("I check registration status for the registered externalId")
    public void checkRegistrationStatus() {
        String externalId = context.getId("registeredExternalId");
        assertThat(externalId).as("No registered externalId stored").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/registration/status/" + externalId);
        context.setLastResponse(response);
    }

    @Then("the registration status should include kycTier {int}")
    public void registrationStatusShouldIncludeKycTier(int expectedTier) {
        Integer kycTier = context.getLastResponse().jsonPath().getInt("kycTier");
        assertThat(kycTier).isEqualTo(expectedTier);
    }
}
