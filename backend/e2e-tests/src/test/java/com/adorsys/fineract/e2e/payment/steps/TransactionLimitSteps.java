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
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for daily transaction limit testing.
 * Daily limits are set to 100,000 XAF in test configuration.
 */
public class TransactionLimitSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user initiates a second MTN deposit of {long} XAF")
    public void userInitiatesSecondMtnDeposit(long amount) {
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
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + paymentUserJwt())
                .body(request)
                .post("/api/payments/deposit");

        context.setLastResponse(response);
    }

    @Then("the response body should contain {string}")
    public void responseBodyShouldContain(String expectedText) {
        assertThat(context.getBody()).contains(expectedText);
    }

    private String paymentUserJwt() {
        return JwtTokenFactory.generatePaymentToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId());
    }
}
