package com.adorsys.fineract.e2e.customerselfservice.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

public class ApproveAndDepositSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private RegistrationSteps registrationSteps;

    @Given("a new customer has been registered with the following details:")
    public void aNewCustomerHasBeenRegisteredWithTheFollowingDetails(io.cucumber.datatable.DataTable dataTable) {
        registrationSteps.aNewCustomerIsRegisteredWithTheFollowingDetails(dataTable);
        Response response = context.getLastResponse();
        assertThat(response.statusCode()).isEqualTo(201);
        Integer savingsAccountId = response.jsonPath().get("savingsAccountId");
        Integer fineractClientId = response.jsonPath().get("fineractClientId");
        assertThat(savingsAccountId).isNotNull().isPositive();
        assertThat(fineractClientId).isNotNull().isPositive();
        context.storeId("savingsAccountId", savingsAccountId.toString());
        context.storeId("clientId", fineractClientId.toString());
    }

    @When("the KYC manager approves, activates, and deposits into the account with the following details:")
    public void theKycManagerApprovesActivatesAndDepositsIntoTheAccountWithTheFollowingDetails(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String savingsAccountId = context.getId("savingsAccountId");

        Map<String, Object> body = new HashMap<>(data);
        body.put("savingsAccountId", Long.parseLong(savingsAccountId));

        String idempotencyKey = UUID.randomUUID().toString();
        context.storeValue("idempotencyKey", idempotencyKey);
        context.storeValue("requestBody", body);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .header("X-Idempotency-Key", idempotencyKey)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }

    @When("the KYC manager attempts to approve and deposit for a non-existent account with details:")
    public void whenTheKycManagerApprovesWithNonExistentAccount(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        long nonExistentSavingsAccountId = 99999L; // An ID that is unlikely to exist

        Map<String, Object> body = new HashMap<>(data);
        body.put("savingsAccountId", nonExistentSavingsAccountId);

        String idempotencyKey = UUID.randomUUID().toString();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .header("X-Idempotency-Key", idempotencyKey)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }

    @When("the KYC manager attempts to approve and deposit without an idempotency key with details:")
    public void whenTheKycManagerApprovesWithoutIdempotencyKey(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String savingsAccountId = context.getId("savingsAccountId");

        Map<String, Object> body = new HashMap<>(data);
        body.put("savingsAccountId", Long.parseLong(savingsAccountId));

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                // No X-Idempotency-Key header
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }

    @Then("the approval and deposit should be successful and return a transactionId")
    public void theApprovalAndDepositShouldBeSuccessfulAndReturnATransactionId() {
        Response response = context.getLastResponse();
        assertThat(response.statusCode()).isEqualTo(200);

        Integer transactionId = response.jsonPath().get("transactionId");
        assertThat(transactionId).isNotNull().isPositive();
        context.storeId("transactionId", transactionId.toString());
    }

    @Then("the approval and deposit should be successful and not return a transactionId")
    public void theApprovalAndDepositShouldBeSuccessfulAndNotReturnATransactionId() {
        Response response = context.getLastResponse();
        assertThat(response.statusCode()).isEqualTo(200);

        // Assert that transactionId is not present or is null
        assertThat((Object) response.jsonPath().get("transactionId")).isNull();
    }

    @And("the same request is sent again")
    public void theSameRequestIsSentAgain() {
        // The previous request details are stored in the context, so we can just re-use them.
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .header("X-Idempotency-Key", context.<String>getValue("idempotencyKey"))
                .contentType(ContentType.JSON)
                .body((Object) context.getValue("requestBody"))
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }

    @Then("the approval and deposit should be successful and return the same transactionId")
    public void theApprovalAndDepositShouldBeSuccessfulAndReturnTheSameTransactionId() {
        Response response = context.getLastResponse();
        assertThat(response.statusCode()).isEqualTo(200);

        Integer transactionId = response.jsonPath().get("transactionId");
        assertThat(transactionId).isNotNull().isPositive();

        // Check that the transactionId is the same as the one from the first request
        assertThat(transactionId).hasToString(context.getId("transactionId"));
    }
}
