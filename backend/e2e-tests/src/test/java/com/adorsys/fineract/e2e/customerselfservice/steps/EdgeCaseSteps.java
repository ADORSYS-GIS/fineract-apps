package com.adorsys.fineract.e2e.customerselfservice.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.HashMap;
import java.util.Map;

public class EdgeCaseSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @When("the KYC manager attempts to approve and deposit with the same idempotency key but a different deposit amount:")
    public void theKycManagerAttemptsToApproveAndDepositWithTheSameIdempotencyKeyButADifferentDepositAmount(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String savingsAccountId = context.getId("savingsAccountId");
        String idempotencyKey = context.getValue("idempotencyKey");

        Map<String, Object> body = new HashMap<>(data);
        body.put("savingsAccountId", Long.parseLong(savingsAccountId));

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .header("X-Idempotency-Key", idempotencyKey)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }

    @And("the account is already active")
    public void theAccountIsAlreadyActive() {
        String savingsAccountId = context.getId("savingsAccountId");
        fineractTestClient.provisionSavingsAccount(Long.parseLong(context.getId("clientId")), 1, savingsAccountId);
    }

    @When("the KYC manager attempts to approve and deposit with a malformed idempotency key {string} and details:")
    public void theKycManagerAttemptsToApproveAndDepositWithAMalformedIdempotencyKeyAndDetails(String idempotencyKey, io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String savingsAccountId = context.getId("savingsAccountId");

        Map<String, Object> body = new HashMap<>(data);
        body.put("savingsAccountId", Long.parseLong(savingsAccountId));

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .header("X-Idempotency-Key", idempotencyKey)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/approve-and-deposit");

        context.setLastResponse(response);
    }
}
