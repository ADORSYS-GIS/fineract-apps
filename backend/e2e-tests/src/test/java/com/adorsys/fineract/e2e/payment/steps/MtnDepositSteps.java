package com.adorsys.fineract.e2e.payment.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.payment.support.WireMockProviderStubs;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for MTN MoMo deposit scenarios.
 * Exercises: POST /api/payments/deposit, POST /api/callbacks/mtn/collection
 * WireMock stubs: MTN OAuth token, RequestToPay
 */
public class MtnDepositSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // Given
    // ---------------------------------------------------------------

    @Given("the MTN provider is available for collections")
    public void mtnProviderAvailable() {
        WireMockProviderStubs.stubMtnRequestToPaySuccess();
    }

    @Given("the user has a Fineract XAF account with sufficient balance")
    public void userHasXafAccount() {
        assertThat(FineractInitializer.getTestUserXafAccountId()).isNotNull();
        BigDecimal balance = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        assertThat(balance).isGreaterThan(BigDecimal.ZERO);
    }

    // ---------------------------------------------------------------
    // When
    // ---------------------------------------------------------------

    @When("the user initiates an MTN deposit of {long} XAF")
    public void userInitiatesMtnDeposit(long amount) {
        // Record Fineract balance before deposit
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        String idempotencyKey = UUID.randomUUID().toString();
        context.storeId("idempotencyKey", idempotencyKey);

        Map<String, Object> request = Map.of(
                "externalId", FineractInitializer.TEST_USER_EXTERNAL_ID,
                "accountId", FineractInitializer.getTestUserXafAccountId(),
                "amount", amount,
                "provider", "MTN_MOMO",
                "phoneNumber", "237670000001"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer " + paymentUserJwt())
                .body(request)
                .post("/api/payments/deposit");

        context.setLastResponse(response);

        // Store the transaction ID for callback simulation
        if (response.statusCode() == 200) {
            String transactionId = response.jsonPath().getString("transactionId");
            context.storeId("transactionId", transactionId);
            String providerRef = response.jsonPath().getString("providerReference");
            context.storeId("providerReference", providerRef);
        }
    }

    @When("the MTN collection callback reports SUCCESSFUL for the deposit")
    public void mtnCollectionCallbackSuccessful() {
        String providerRef = context.getId("providerReference");

        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "SUCCESSFUL",
                "externalId", providerRef,
                "amount", "5000",
                "currency", "XAF",
                "financialTransactionId", "mtn-fin-txn-" + UUID.randomUUID()
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Ocp-Apim-Subscription-Key", "test-collection-key")
                .body(callback)
                .post("/api/callbacks/mtn/collection");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @When("the MTN collection callback reports FAILED for the deposit")
    public void mtnCollectionCallbackFailed() {
        String providerRef = context.getId("providerReference");

        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "FAILED",
                "externalId", providerRef,
                "reason", "PAYER_NOT_FOUND"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Ocp-Apim-Subscription-Key", "test-collection-key")
                .body(callback)
                .post("/api/callbacks/mtn/collection");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    // ---------------------------------------------------------------
    // Then
    // ---------------------------------------------------------------

    @Then("the deposit should be in PENDING status")
    public void depositShouldBePending() {
        assertThat(context.getStatusCode()).isEqualTo(200);
        String status = context.jsonPath("status");
        assertThat(status).isEqualTo("PENDING");
    }

    @Then("the deposit transaction should exist with provider MTN_MOMO")
    public void depositTransactionShouldExist() {
        assertThat(context.getStatusCode()).isEqualTo(200);
        String provider = context.jsonPath("provider");
        assertThat(provider).isEqualTo("MTN_MOMO");
    }

    @Then("the transaction status should be {string}")
    public void transactionStatusShouldBe(String expectedStatus) {
        String transactionId = context.getId("transactionId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + paymentUserJwt())
                .get("/api/payments/status/" + transactionId);

        assertThat(response.statusCode()).isEqualTo(200);
        String status = response.jsonPath().getString("status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @Then("the user's Fineract XAF balance should have increased by {long}")
    public void fineractBalanceShouldHaveIncreased(long expectedIncrease) {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        BigDecimal actualIncrease = balanceAfter.subtract(balanceBefore);
        assertThat(actualIncrease.longValue()).isEqualTo(expectedIncrease);
    }

    @Then("the user's Fineract XAF balance should not have changed")
    public void fineractBalanceShouldNotHaveChanged() {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        assertThat(balanceAfter).isEqualByComparingTo(balanceBefore);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private String paymentUserJwt() {
        return JwtTokenFactory.generatePaymentToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId());
    }
}
