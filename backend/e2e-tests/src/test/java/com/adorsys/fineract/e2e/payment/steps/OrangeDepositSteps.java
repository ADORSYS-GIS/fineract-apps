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
 * Step definitions for Orange Money deposit scenarios.
 * Exercises: POST /api/payments/deposit, POST /api/callbacks/orange/payment
 */
public class OrangeDepositSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    private static final String NOTIF_TOKEN = "test-orange-notif-token";

    @Given("the Orange provider is available for payments")
    public void orangeProviderAvailable() {
        WireMockProviderStubs.stubOrangeInitPaymentSuccess(NOTIF_TOKEN);
    }

    @When("the user initiates an Orange deposit of {long} XAF")
    public void userInitiatesOrangeDeposit(long amount) {
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        String idempotencyKey = UUID.randomUUID().toString();
        context.storeId("idempotencyKey", idempotencyKey);

        Map<String, Object> request = Map.of(
                "externalId", FineractInitializer.TEST_USER_EXTERNAL_ID,
                "accountId", FineractInitializer.getTestUserXafAccountId(),
                "amount", amount,
                "provider", "ORANGE_MONEY",
                "phoneNumber", "237655000001"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", idempotencyKey)
                .header("Authorization", "Bearer " + paymentUserJwt())
                .body(request)
                .post("/api/payments/deposit");

        context.setLastResponse(response);

        if (response.statusCode() == 200) {
            String transactionId = response.jsonPath().getString("transactionId");
            context.storeId("transactionId", transactionId);
            String providerRef = response.jsonPath().getString("providerReference");
            context.storeId("providerReference", providerRef);
        }
    }

    @When("the Orange payment callback reports SUCCESS for the deposit")
    public void orangeCallbackSuccess() {
        String transactionId = context.getId("transactionId");

        Map<String, Object> callback = Map.of(
                "order_id", transactionId,
                "txnid", "orange-txn-" + UUID.randomUUID(),
                "status", "SUCCESS",
                "amount", context.getLastResponse().jsonPath().getString("amount"),
                "currency", "XAF",
                "notif_token", NOTIF_TOKEN
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/orange/payment");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @When("the Orange payment callback reports CANCELLED for the deposit")
    public void orangeCallbackCancelled() {
        String transactionId = context.getId("transactionId");

        Map<String, Object> callback = Map.of(
                "order_id", transactionId,
                "txnid", "orange-txn-" + UUID.randomUUID(),
                "status", "CANCELLED",
                "amount", "5000",
                "currency", "XAF",
                "notif_token", NOTIF_TOKEN,
                "message", "User cancelled"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(callback)
                .post("/api/callbacks/orange/payment");

        assertThat(response.statusCode()).isEqualTo(200);
    }

    @Then("the deposit should include a payment URL")
    public void depositShouldIncludePaymentUrl() {
        String paymentUrl = context.getLastResponse().jsonPath().getString("paymentUrl");
        assertThat(paymentUrl).isNotNull();
    }

    private String paymentUserJwt() {
        return JwtTokenFactory.generatePaymentToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId());
    }
}
