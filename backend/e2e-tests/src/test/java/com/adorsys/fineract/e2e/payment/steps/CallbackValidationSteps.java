package com.adorsys.fineract.e2e.payment.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
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
 * Step definitions for callback validation scenarios.
 * Tests invalid subscription keys, non-existent transactions, and duplicate callbacks.
 */
public class CallbackValidationSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("an MTN collection callback with wrong subscription key is sent")
    public void mtnCallbackWithWrongKey() {
        String providerRef = context.getId("providerReference");

        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "SUCCESSFUL",
                "externalId", providerRef,
                "amount", "5000",
                "currency", "XAF",
                "financialTransactionId", "mtn-fin-txn-wrong"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Ocp-Apim-Subscription-Key", "wrong-key")
                .body(callback)
                .post("/api/callbacks/mtn/collection");

        context.storeValue("callbackResponse", response);
    }

    @When("an MTN collection callback for a non-existent transaction is sent")
    public void mtnCallbackForNonExistentTransaction() {
        Map<String, Object> callback = Map.of(
                "referenceId", UUID.randomUUID().toString(),
                "status", "SUCCESSFUL",
                "externalId", UUID.randomUUID().toString(),
                "amount", "5000",
                "currency", "XAF"
        );

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Ocp-Apim-Subscription-Key", "test-collection-key")
                .body(callback)
                .post("/api/callbacks/mtn/collection");

        context.storeValue("callbackResponse", response);
    }
}
