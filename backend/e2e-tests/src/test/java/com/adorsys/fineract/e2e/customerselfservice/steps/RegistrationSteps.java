package com.adorsys.fineract.e2e.customerselfservice.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

public class RegistrationSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Given("a KYC manager is authenticated")
    public void kycManagerIsAuthenticated() {
        String token = JwtTokenFactory.generateStaffToken("kyc-manager", List.of("KYC_MANAGER"));
        context.storeValue("jwtToken", token);
    }

    @When("a new customer is registered with the following details:")
    public void aNewCustomerIsRegisteredWithTheFollowingDetails(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String externalId = data.get("externalId");
        assertThat(externalId).as("externalId is required in the test data").isNotNull();

        // Store the externalId for later verification steps
        context.storeId(externalId, externalId); // Store externalId by itself as key

        Map<String, Object> body = new HashMap<>(data);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + context.<String>getValue("jwtToken"))
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/registration/register");

        context.setLastResponse(response);
    }

    @Then("the registration should be successful and return a clientId")
    public void theRegistrationShouldBeSuccessfulAndReturnAClientId() {
        Response response = context.getLastResponse();
        assertThat(response.statusCode()).isEqualTo(201);

        Integer clientId = response.jsonPath().get("fineractClientId");
        assertThat(clientId).isNotNull().isPositive();

        // Store for subsequent steps
        context.storeId("clientId", clientId.toString());
    }

    @And("a corresponding client with id {string} should exist in Fineract")
    public void aCorrespondingClientWithIdShouldExistInFineract(String externalIdKey) {
        String clientIdStr = context.getId("clientId");
        assertThat(clientIdStr).isNotNull();
        Long clientId = Long.parseLong(clientIdStr);

        // Poll for a few seconds to handle any replication delay
        Map<String, Object> client = await().atMost(5, TimeUnit.SECONDS)
                .until(() -> fineractTestClient.getClientById(clientId), Objects::nonNull);

        assertThat(client).isNotNull();
        assertThat(client).containsEntry("id", clientId.intValue());
        
        // Also verify the externalId matches, since we have it
        String externalId = context.getId(externalIdKey);
        assertThat(client).containsEntry("externalId", externalId);
    }
}
