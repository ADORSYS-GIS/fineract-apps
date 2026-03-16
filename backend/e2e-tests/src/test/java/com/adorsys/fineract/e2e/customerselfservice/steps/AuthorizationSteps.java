package com.adorsys.fineract.e2e.customerselfservice.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.cucumber.datatable.DataTable;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class AuthorizationSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Given("a user is authenticated with the role {string}")
    public void aUserIsAuthenticatedWithTheRole(String role) {
        String token = JwtTokenFactory.generateStaffToken("auth-test-user", List.of(role));
        context.storeValue("jwtToken", token);
    }

    @Given("a user is authenticated with no roles")
    public void aUserIsAuthenticatedWithNoRoles() {
        String token = JwtTokenFactory.generateStaffToken("auth-test-user", Collections.emptyList());
        context.storeValue("jwtToken", token);
    }

    @When("the user attempts to register a new customer with the following details:")
    public void theUserAttemptsToRegisterANewCustomerWithTheFollowingDetails(DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        Map<String, Object> body = new HashMap<>(data);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/register");

        context.setLastResponse(response);
    }

    @When("the user attempts to approve and deposit for the account with details:")
    public void theUserAttemptsToApproveAndDepositForTheAccountWithDetails(DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String savingsAccountId = context.getId("savingsAccountId");

        Map<String, Object> body = new HashMap<>(data);
        body.put("savingsAccountId", Long.parseLong(savingsAccountId));

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }

    @Then("the approval and deposit should fail with a {int} Forbidden status code")
    public void theApprovalAndDepositShouldFailWithAForbiddenStatusCode(int statusCode) {
        Response response = context.getLastResponse();
        assertThat(response.statusCode()).isEqualTo(statusCode);
    }
}
