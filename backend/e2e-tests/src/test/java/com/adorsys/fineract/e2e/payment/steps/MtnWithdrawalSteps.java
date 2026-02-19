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
 * Step definitions for MTN MoMo withdrawal scenarios.
 * Exercises: POST /api/payments/withdraw, POST /api/callbacks/mtn/disbursement
 */
public class MtnWithdrawalSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Given("the MTN provider is available for disbursements")
    public void mtnProviderAvailableForDisbursements() {
        WireMockProviderStubs.stubMtnTransferSuccess();
    }

    @When("the user initiates an MTN withdrawal of {long} XAF")
    public void userInitiatesMtnWithdrawal(long amount) {
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
                .post("/api/payments/withdraw");

        context.setLastResponse(response);

        if (response.statusCode() == 200) {
            String transactionId = response.jsonPath().getString("transactionId");
            context.storeId("transactionId", transactionId);
            String providerRef = response.jsonPath().getString("providerReference");
            context.storeId("providerReference", providerRef);
        }
    }

    @Then("the withdrawal should be in PROCESSING status")
    public void withdrawalShouldBeProcessing() {
        assertThat(context.getStatusCode()).isEqualTo(200);
        String status = context.jsonPath("status");
        assertThat(status).isEqualTo("PROCESSING");
    }

    @When("the MTN disbursement callback reports SUCCESSFUL for the withdrawal")
    public void mtnDisbursementCallbackSuccessful() {
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
                .header("Ocp-Apim-Subscription-Key", "test-disbursement-key")
                .body(callback)
                .post("/api/callbacks/mtn/disbursement");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @When("the MTN disbursement callback reports FAILED for the withdrawal")
    public void mtnDisbursementCallbackFailed() {
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
                .header("Ocp-Apim-Subscription-Key", "test-disbursement-key")
                .body(callback)
                .post("/api/callbacks/mtn/disbursement");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @Then("the user's Fineract XAF balance should have decreased by {long}")
    public void fineractBalanceShouldHaveDecreased(long expectedDecrease) {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        BigDecimal actualDecrease = balanceBefore.subtract(balanceAfter);
        assertThat(actualDecrease.longValue()).isEqualTo(expectedDecrease);
    }

    private String paymentUserJwt() {
        return JwtTokenFactory.generatePaymentToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId());
    }
}
