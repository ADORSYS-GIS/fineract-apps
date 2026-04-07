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

import static com.github.tomakehurst.wiremock.client.WireMock.*;
import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for payment provider error scenarios.
 * Tests: API failures, duplicate callbacks, late callbacks after terminal state.
 */
public class ProviderErrorSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // Given
    // ---------------------------------------------------------------

    @Given("the MTN collection API is returning errors")
    public void mtnCollectionApiReturningErrors() {
        // Stub token endpoint (needed before the collection call)
        WireMockProviderStubs.stubMtnCollectionToken();
        // Stub collection to return 500
        stubFor(post(urlPathEqualTo("/collection/v1_0/requesttopay"))
                .willReturn(aResponse().withStatus(500)
                        .withBody("{\"error\":\"INTERNAL_PROCESSING_ERROR\"}")));
    }

    @Given("the MTN disbursement API is returning errors")
    public void mtnDisbursementApiReturningErrors() {
        WireMockProviderStubs.stubMtnTransferFailed();
    }

    // ---------------------------------------------------------------
    // When
    // ---------------------------------------------------------------

    @When("the user attempts an MTN deposit of {long} XAF expecting failure")
    public void userAttemptsMtnDepositExpectingFailure(long amount) {
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        String idempotencyKey = UUID.randomUUID().toString();

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
    }

    @When("the user attempts an MTN withdrawal of {long} XAF expecting failure")
    public void userAttemptsMtnWithdrawalExpectingFailure(long amount) {
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        String idempotencyKey = UUID.randomUUID().toString();

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
                .post("/api/payments/withdraw");

        context.setLastResponse(response);
    }

    @When("the same MTN collection callback reports SUCCESSFUL again")
    public void sameMtnCallbackAgain() {
        String providerRef = context.getId("providerReference");

        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "SUCCESSFUL",
                "externalId", providerRef,
                "amount", "5000",
                "currency", "XAF",
                "financialTransactionId", "mtn-fin-txn-duplicate-" + UUID.randomUUID()
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Ocp-Apim-Subscription-Key", "test-collection-key")
                .body(callback)
                .post("/api/callbacks/mtn/collection");

        // Callbacks always return 200 (safe-to-fail pattern)
        assertThat(response.statusCode()).isEqualTo(200);
    }

    @When("a late MTN collection callback reports SUCCESSFUL for the same deposit")
    public void lateMtnCallbackSuccessful() {
        String providerRef = context.getId("providerReference");

        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "SUCCESSFUL",
                "externalId", providerRef,
                "amount", "5000",
                "currency", "XAF",
                "financialTransactionId", "mtn-fin-txn-late-" + UUID.randomUUID()
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

    @Then("the deposit response should indicate an error")
    public void depositResponseShouldIndicateError() {
        int statusCode = context.getStatusCode();
        // Provider failure should return 4xx or 5xx
        assertThat(statusCode).isGreaterThanOrEqualTo(400);
    }

    @Then("the withdrawal response should indicate an error")
    public void withdrawalResponseShouldIndicateError() {
        int statusCode = context.getStatusCode();
        assertThat(statusCode).isGreaterThanOrEqualTo(400);
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
