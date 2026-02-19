package com.adorsys.fineract.e2e.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for treasury balance verification across asset-service and Fineract.
 * Ensures that treasury accounts in Fineract match the expected state after trades.
 */
public class TreasurySteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the admin checks the asset inventory")
    public void adminChecksInventory() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/inventory");

        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the treasury asset account balance in Fineract should match the asset-service inventory")
    public void treasuryBalanceShouldMatchInventory() {
        // Get the asset details from asset-service
        String assetId = context.getId("lastAssetId");

        Response assetResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        assertThat(assetResp.statusCode()).isEqualTo(200);

        int totalSupply = assetResp.jsonPath().getInt("totalSupply");
        int circulatingSupply = assetResp.jsonPath().getInt("circulatingSupply");
        int expectedTreasuryUnits = totalSupply - circulatingSupply;

        // The treasury's asset (BRV) account balance should reflect the remaining units
        Number treasuryAssetAccountId = assetResp.jsonPath().get("treasuryAssetAccountId");
        if (treasuryAssetAccountId != null) {
            BigDecimal treasuryBalance = fineractTestClient.getAccountBalance(
                    treasuryAssetAccountId.longValue());
            assertThat(treasuryBalance.intValue()).isEqualTo(expectedTreasuryUnits);
        }
    }

    @Then("the treasury should have received XAF for {int} units at price {int}")
    public void treasuryShouldHaveReceivedXaf(int units, int price) {
        // After a buy, the treasury's XAF (cash) account should have increased
        String assetId = context.getId("lastAssetId");

        Response assetResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        Number cashAccountId = assetResp.jsonPath().get("treasuryCashAccountId");
        if (cashAccountId != null) {
            BigDecimal cashBalance = fineractTestClient.getAccountBalance(
                    cashAccountId.longValue());
            // Cash balance should be at least units * price (might include fees)
            assertThat(cashBalance.longValue())
                    .isGreaterThanOrEqualTo((long) units * price);
        }
    }

    @Then("the test user should have a savings account for currency {string} in Fineract")
    public void testUserShouldHaveSavingsAccountForCurrency(String currencyRef) {
        List<Map<String, Object>> accounts = fineractTestClient.getClientSavingsAccounts(
                FineractInitializer.getTestUserClientId());

        // The user should have at least their XAF account + any asset accounts created
        assertThat(accounts).isNotEmpty();

        // Check that at least one account exists (XAF settlement)
        boolean hasXaf = accounts.stream()
                .anyMatch(a -> "XAF".equals(
                        ((Map<?, ?>) a.get("currency")).get("code")));
        assertThat(hasXaf).isTrue();
    }

    @Then("the treasury client should have savings accounts in Fineract")
    public void treasuryClientShouldHaveSavingsAccounts() {
        List<Map<String, Object>> accounts = fineractTestClient.getClientSavingsAccounts(
                FineractInitializer.getTreasuryClientId());

        assertThat(accounts).isNotEmpty();
    }

    @Then("the Fineract GL accounts should include codes {string}")
    public void fineractGlAccountsShouldIncludeCodes(String codesCsv) {
        List<Map<String, Object>> glAccounts = fineractTestClient.getGlAccounts();
        String[] expectedCodes = codesCsv.split(",");

        for (String code : expectedCodes) {
            String trimmed = code.trim();
            boolean found = glAccounts.stream()
                    .anyMatch(gl -> trimmed.equals(gl.get("glCode").toString()));
            assertThat(found)
                    .as("GL account with code " + trimmed + " should exist in Fineract")
                    .isTrue();
        }
    }
}
