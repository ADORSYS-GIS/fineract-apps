package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for income distribution and income benefit projections.
 */
public class IncomeDistributionSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Given("an active income asset {string} with price {int}, supply {int}, income type {string}, rate {double}, frequency {int}")
    public void activeIncomeAsset(String symbol, int price, int supply,
                                   String incomeType, double rate, int frequency) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Income " + symbol);
        request.put("symbol", symbol);
        request.put("currencyCode", symbol);
        request.put("category", "REAL_ESTATE");
        request.put("initialPrice", price);
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("treasuryClientId", FineractInitializer.getTreasuryClientId());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());
        request.put("incomeType", incomeType);
        request.put("incomeRate", rate);
        request.put("distributionFrequencyMonths", frequency);
        request.put("nextDistributionDate", LocalDate.now().plusMonths(frequency).toString());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create income asset %s: %s", symbol, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbol);

        // Activate
        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/activate");
        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Then("the preview should include income benefit projections")
    public void previewShouldIncludeIncomeBenefit() {
        Object incomeBenefit = context.getLastResponse().jsonPath().get("incomeBenefit");
        assertThat(incomeBenefit).isNotNull();
    }

    @Then("the preview should not include income benefit projections")
    public void previewShouldNotIncludeIncomeBenefit() {
        Object incomeBenefit = context.getLastResponse().jsonPath().get("incomeBenefit");
        assertThat(incomeBenefit).isNull();
    }

    @Then("the income benefit income type should be {string}")
    public void incomeBenefitTypeShouldBe(String expectedType) {
        String incomeType = context.getLastResponse().jsonPath()
                .getString("incomeBenefit.incomeType");
        assertThat(incomeType).isEqualTo(expectedType);
    }

    @Then("the income benefit should be variable income")
    public void incomeBenefitShouldBeVariable() {
        Boolean variable = context.getLastResponse().jsonPath()
                .getBoolean("incomeBenefit.variableIncome");
        assertThat(variable).isTrue();
    }
}
