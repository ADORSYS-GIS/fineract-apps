package com.adorsys.fineract.e2e.payment.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for security testing.
 * Verifies: 401 without JWT, callbacks are permitAll.
 */
public class SecuritySteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("a deposit request is sent without authentication")
    public void depositWithoutAuth() {
        Map<String, Object> request = Map.of(
                "externalId", FineractInitializer.TEST_USER_EXTERNAL_ID,
                "accountId", 1,
                "amount", 5000,
                "provider", "MTN_MOMO",
                "phoneNumber", "237670000001"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .body(request)
                .post("/api/payments/deposit");

        context.setLastResponse(response);
    }

    @When("a status check is sent without authentication")
    public void statusCheckWithoutAuth() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/payments/status/" + UUID.randomUUID());

        context.setLastResponse(response);
    }

    @When("a callback is sent without authentication to the MTN collection endpoint")
    public void callbackWithoutAuth() {
        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "SUCCESSFUL",
                "externalId", UUID.randomUUID().toString()
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/mtn/collection");

        context.storeValue("callbackResponse", response);
    }

    @Then("the response status should be {int}")
    public void responseStatusShouldBe(int expectedStatus) {
        assertThat(context.getStatusCode()).isEqualTo(expectedStatus);
    }

    @Then("the callback response status should be {int}")
    public void callbackResponseStatusShouldBe(int expectedStatus) {
        Response callbackResp = context.getValue("callbackResponse");
        if (callbackResp != null) {
            assertThat(callbackResp.statusCode()).isEqualTo(expectedStatus);
        } else {
            assertThat(context.getStatusCode()).isEqualTo(expectedStatus);
        }
    }
}
