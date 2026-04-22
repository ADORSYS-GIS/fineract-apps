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

public class NokashDepositSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Given("the NOKASH provider is available for collections")
    public void nokashProviderAvailable() {
        WireMockProviderStubs.stubNokashRequestToPaySuccess();
    }

    @When("the user initiates a NOKASH deposit of {long} XAF")
    public void userInitiatesNokashDeposit(long amount) {
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

    @When("the NOKASH collection callback reports SUCCESSFUL for the deposit")
    public void nokashCollectionCallbackSuccessful() {
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

    @When("the NOKASH collection callback reports FAILED for the deposit")
    public void nokashCollectionCallbackFailed() {
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

    @Then("the deposit transaction should exist with provider NOKASH")
    public void depositTransactionShouldExist() {
        assertThat(context.getStatusCode()).isEqualTo(200);
        String provider = context.jsonPath("provider");
        assertThat(provider).isEqualTo("NOKASH");
    }

    private String paymentUserJwt() {
        return JwtTokenFactory.generatePaymentToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId());
    }
}
