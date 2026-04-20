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

public class NokashWithdrawalSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Given("the NOKASH provider is available for disbursements")
    public void nokashProviderAvailableForDisbursements() {
        WireMockProviderStubs.stubNokashAuthSuccess();
        WireMockProviderStubs.stubNokashPayoutSuccess();
    }

    @When("the user initiates a NOKASH withdrawal of {long} XAF")
    public void userInitiatesNokashWithdrawal(long amount) {
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        String idempotencyKey = UUID.randomUUID().toString();
        context.storeId("idempotencyKey", idempotencyKey);

        Map<String, Object> request = Map.of(
                "externalId", FineractInitializer.TEST_USER_EXTERNAL_ID,
                "accountId", FineractInitializer.getTestUserXafAccountId(),
                "amount", amount,
                "provider", "NOKASH",
                "phoneNumber", "237670000001",
                "paymentMethod", "MTN_MOMO"
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

    @Then("the NOKASH withdrawal should be in PROCESSING status")
    public void withdrawalShouldBeProcessing() {
        assertThat(context.getStatusCode()).isEqualTo(200);
        String status = context.jsonPath("status");
        assertThat(status).isEqualTo("PROCESSING");
    }

    @When("the NOKASH disbursement callback reports SUCCESSFUL for the withdrawal")
    public void nokashDisbursementCallbackSuccessful() {
        String transactionId = context.getId("transactionId");
        
        Map<String, Object> callback = Map.of(
                "order_id", transactionId,
                "status", "SUCCESS",
                "amount", "5000",
                "reference", "test-reference",
                "payment_method", "MTN_MOMO",
                "message", "Payment successful"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/nokash/" + transactionId);

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @When("the NOKASH disbursement callback reports FAILED for the withdrawal")
    public void nokashDisbursementCallbackFailed() {
        String transactionId = context.getId("transactionId");
        
        Map<String, Object> callback = Map.of(
                "order_id", transactionId,
                "status", "FAILED",
                "amount", "5000",
                "reference", "test-reference",
                "payment_method", "MTN_MOMO",
                "message", "Payment failed"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/nokash/" + transactionId);

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @Then("for NOKASH the user's Fineract XAF balance should have decreased by {long}")
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
