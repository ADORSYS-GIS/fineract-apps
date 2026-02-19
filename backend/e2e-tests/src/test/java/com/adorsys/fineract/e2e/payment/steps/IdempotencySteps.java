package com.adorsys.fineract.e2e.payment.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for idempotency testing.
 * Verifies that duplicate requests with the same idempotency key return the same result.
 */
public class IdempotencySteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user initiates an MTN deposit of {long} XAF with idempotency key {string}")
    public void userInitiatesDepositWithKey(long amount, String idempotencyKey) {
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

        if (response.statusCode() == 200) {
            String transactionId = response.jsonPath().getString("transactionId");
            // Store first transaction ID for comparison
            if (context.getId("firstTransactionId") == null) {
                context.storeId("firstTransactionId", transactionId);
            }
            context.storeId("transactionId", transactionId);
        }
    }

    @Then("the transaction ID should be the same as the first request")
    public void transactionIdShouldBeSame() {
        String firstId = context.getId("firstTransactionId");
        String currentId = context.getId("transactionId");
        assertThat(currentId).isEqualTo(firstId);
    }

    private String paymentUserJwt() {
        return JwtTokenFactory.generatePaymentToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId());
    }
}
