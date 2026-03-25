package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for accounting GL mappings E2E tests.
 * Uses delta-based assertions for trial balance (Fineract journal entries persist across scenarios).
 * Uses exact assertions for fee-tax summary (local DB tables are cleaned per scenario).
 */
public class AccountingSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // Given steps
    // ---------------------------------------------------------------

    /**
     * Creates an active stock asset with an explicit trading fee percent.
     * The lpAskPrice is set to issuerPrice * 1.10, lpBidPrice to issuerPrice * 0.95.
     * Registration duty is enabled by default (rate = 0.02).
     */
    @Given("an active stock asset {string} with fee {double} and price {int} and supply {int}")
    public void activeStockAssetWithFee(String symbolRef, double feePercent, int price, int supply) {
        BigDecimal issuerPrice = new BigDecimal(price);

        Map<String, Object> request = new HashMap<>();
        request.put("name", "Stock " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "STOCKS");
        request.put("issuerPrice", issuerPrice);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("tradingFeePercent", new BigDecimal(String.valueOf(feePercent)));
        request.put("registrationDutyEnabled", true);
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create asset %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeId("assetId_" + symbolRef, assetId);
        context.storeValue("lastSymbol", symbolRef);

        // Activate
        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    // ---------------------------------------------------------------
    // When steps — admin accounting endpoints
    // ---------------------------------------------------------------

    @When("the admin snapshots the trial balance")
    public void adminSnapshotsTrialBalance() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/accounting/trial-balance");
        assertThat(response.statusCode()).isEqualTo(200);

        // Store current GL credits/debits as snapshot for delta comparison
        List<Map<String, Object>> entries = response.jsonPath().getList("entries");
        if (entries != null) {
            for (Map<String, Object> entry : entries) {
                String glCode = (String) entry.get("glCode");
                context.storeValue("snapshot_credits_" + glCode,
                        new BigDecimal(entry.get("creditAmount").toString()));
                context.storeValue("snapshot_debits_" + glCode,
                        new BigDecimal(entry.get("debitAmount").toString()));
            }
        }
    }

    @When("the admin requests the trial balance")
    public void adminRequestsTrialBalance() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/accounting/trial-balance");
        context.setLastResponse(response);
    }

    @When("the admin requests the trial balance for currency {string}")
    public void adminRequestsTrialBalanceForCurrency(String currencyCode) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("currencyCode", currencyCode)
                .get("/api/v1/admin/accounting/trial-balance");
        context.setLastResponse(response);
    }

    @When("the admin requests the fee and tax summary")
    public void adminRequestsFeeTaxSummary() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/accounting/fee-tax-summary");
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps — trial balance assertions (delta-based)
    // ---------------------------------------------------------------

    @Then("the trial balance currency should be {string}")
    public void trialBalanceCurrencyShouldBe(String expectedCurrency) {
        String currency = context.jsonPath("currencyCode");
        assertThat(currency).isEqualTo(expectedCurrency);
    }

    /**
     * Delta-based: compares current credits against the snapshot taken before trades.
     * If no snapshot exists, assumes the baseline was zero.
     */
    @Then("the trial balance GL {string} credits should have increased by {long}")
    public void trialBalanceGlCreditsShouldHaveIncreasedBy(String glCode, long expectedDelta) {
        BigDecimal snapshotCredits = context.getValue("snapshot_credits_" + glCode);
        if (snapshotCredits == null) snapshotCredits = BigDecimal.ZERO;

        List<Map<String, Object>> entries = context.jsonPath("entries");
        BigDecimal currentCredits = findGlAmount(entries, glCode, "creditAmount");

        BigDecimal delta = currentCredits.subtract(snapshotCredits);
        assertThat(delta)
                .as("GL %s credit delta (current=%s, snapshot=%s)", glCode, currentCredits, snapshotCredits)
                .isEqualByComparingTo(BigDecimal.valueOf(expectedDelta));
    }

    /**
     * Delta-based: compares current debits against the snapshot taken before trades.
     */
    @Then("the trial balance GL {string} debits should have increased by {long}")
    public void trialBalanceGlDebitsShouldHaveIncreasedBy(String glCode, long expectedDelta) {
        BigDecimal snapshotDebits = context.getValue("snapshot_debits_" + glCode);
        if (snapshotDebits == null) snapshotDebits = BigDecimal.ZERO;

        List<Map<String, Object>> entries = context.jsonPath("entries");
        BigDecimal currentDebits = findGlAmount(entries, glCode, "debitAmount");

        BigDecimal delta = currentDebits.subtract(snapshotDebits);
        assertThat(delta)
                .as("GL %s debit delta (current=%s, snapshot=%s)", glCode, currentDebits, snapshotDebits)
                .isEqualByComparingTo(BigDecimal.valueOf(expectedDelta));
    }

    // ---------------------------------------------------------------
    // Then steps — fee-tax summary assertions (exact, DB cleaned per scenario)
    // ---------------------------------------------------------------

    @Then("the fee-tax summary report type should be {string}")
    public void feeTaxSummaryReportTypeShouldBe(String expectedType) {
        String reportType = context.jsonPath("reportType");
        assertThat(reportType).isEqualTo(expectedType);
    }

    @Then("the fee-tax summary total should be {long}")
    public void feeTaxSummaryTotalShouldBe(long expectedTotal) {
        Object total = context.jsonPath("total");
        assertThat(total).isNotNull();
        assertThat(new BigDecimal(total.toString()))
                .as("Fee-tax summary total")
                .isEqualByComparingTo(BigDecimal.valueOf(expectedTotal));
    }

    @Then("the fee-tax summary total should be greater than {long}")
    public void feeTaxSummaryTotalShouldBeGreaterThan(long threshold) {
        Object total = context.jsonPath("total");
        assertThat(total).isNotNull();
        assertThat(new BigDecimal(total.toString()))
                .as("Fee-tax summary total should be > %d", threshold)
                .isGreaterThan(BigDecimal.valueOf(threshold));
    }

    @Then("the fee-tax summary entry for GL {string} should have amount {long}")
    public void feeTaxSummaryEntryForGlShouldHaveAmount(String glCode, long expectedAmount) {
        List<Map<String, Object>> entries = context.jsonPath("entries");
        assertThat(entries).as("Fee-tax summary entries should not be null").isNotNull();

        Map<String, Object> entry = entries.stream()
                .filter(e -> glCode.equals(e.get("glCode")))
                .findFirst()
                .orElse(null);

        assertThat(entry)
                .as("Fee-tax summary should have an entry for GL code %s", glCode)
                .isNotNull();

        assertThat(new BigDecimal(entry.get("amount").toString()))
                .as("GL %s amount", glCode)
                .isEqualByComparingTo(BigDecimal.valueOf(expectedAmount));
    }

    // ---------------------------------------------------------------
    // Then steps — filled order assertions
    // ---------------------------------------------------------------

    @And("the filled order fee should be {long}")
    public void filledOrderFeeShouldBe(long expectedFee) {
        Object fee = context.jsonPath("fee");
        assertThat(fee).as("Filled order should have fee field").isNotNull();
        assertThat(new BigDecimal(fee.toString()))
                .as("Filled order fee")
                .isEqualByComparingTo(BigDecimal.valueOf(expectedFee));
    }

    // ---------------------------------------------------------------
    // Then steps — delta with tolerance (for rounding)
    // ---------------------------------------------------------------

    @Then("the trial balance GL {string} credits should have increased by at least {long}")
    public void trialBalanceGlCreditsShouldHaveIncreasedByAtLeast(String glCode, long minDelta) {
        BigDecimal snapshotCredits = context.getValue("snapshot_credits_" + glCode);
        if (snapshotCredits == null) snapshotCredits = BigDecimal.ZERO;

        List<Map<String, Object>> entries = context.jsonPath("entries");
        BigDecimal currentCredits = findGlAmount(entries, glCode, "creditAmount");
        BigDecimal delta = currentCredits.subtract(snapshotCredits);

        assertThat(delta)
                .as("GL %s credit delta (current=%s, snapshot=%s) should be >= %d",
                        glCode, currentCredits, snapshotCredits, minDelta)
                .isGreaterThanOrEqualTo(BigDecimal.valueOf(minDelta));
    }

    // ---------------------------------------------------------------
    // Then steps — double-entry integrity (adapted from gitops Phase 3)
    // ---------------------------------------------------------------

    @Then("the trial balance total debits should equal total credits")
    public void trialBalanceTotalDebitsShouldEqualTotalCredits() {
        List<Map<String, Object>> entries = context.jsonPath("entries");
        assertThat(entries).as("Trial balance entries").isNotNull();

        BigDecimal totalDebits = BigDecimal.ZERO;
        BigDecimal totalCredits = BigDecimal.ZERO;
        for (Map<String, Object> entry : entries) {
            totalDebits = totalDebits.add(new BigDecimal(entry.get("debitAmount").toString()));
            totalCredits = totalCredits.add(new BigDecimal(entry.get("creditAmount").toString()));
        }

        BigDecimal diff = totalDebits.subtract(totalCredits).abs();
        assertThat(diff)
                .as("Double-entry integrity: debits(%s) should equal credits(%s), diff=%s",
                        totalDebits, totalCredits, diff)
                .isLessThanOrEqualTo(new BigDecimal("1")); // tolerance of 1 for rounding
    }

    // ---------------------------------------------------------------
    // Then steps — fee collection account (adapted from gitops Phase 4)
    // ---------------------------------------------------------------

    @Then("the fee collection account balance should match total order fees")
    public void feeCollectionAccountBalanceShouldMatchTotalOrderFees() {
        // Get fee collection savings account balance from Fineract
        Long feeAccountId = FineractInitializer.getFeeCollectionAccountId();
        assertThat(feeAccountId).as("Fee collection account ID").isNotNull();

        Map<String, Object> accountDetail = fineractTestClient.getSavingsAccount(feeAccountId);
        BigDecimal actualBalance = BigDecimal.ZERO;
        if (accountDetail != null && accountDetail.get("summary") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> summary = (Map<String, Object>) accountDetail.get("summary");
            Object balanceObj = summary.get("accountBalance");
            if (balanceObj != null) actualBalance = new BigDecimal(balanceObj.toString());
        }

        // Get total fees from fee-tax summary endpoint
        Response summaryResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/accounting/fee-tax-summary");
        assertThat(summaryResp.statusCode()).isEqualTo(200);

        BigDecimal totalFees = BigDecimal.ZERO;
        List<Map<String, Object>> entries = summaryResp.jsonPath().getList("entries");
        if (entries != null) {
            for (Map<String, Object> entry : entries) {
                if ("88".equals(entry.get("glCode"))) {
                    totalFees = new BigDecimal(entry.get("amount").toString());
                    break;
                }
            }
        }

        BigDecimal diff = actualBalance.subtract(totalFees).abs();
        assertThat(diff)
                .as("Fee collection balance (%s) should match reported fees (%s), diff=%s",
                        actualBalance, totalFees, diff)
                .isLessThanOrEqualTo(new BigDecimal("2")); // tolerance for rounding
    }

    // ---------------------------------------------------------------
    // When/Then steps — reconciliation
    // ---------------------------------------------------------------

    @When("the admin triggers reconciliation")
    public void adminTriggersReconciliation() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/reconciliation/trigger");
        context.setLastResponse(response);
    }

    @Then("the reconciliation should report {int} discrepancies")
    public void reconciliationShouldReportDiscrepancies(int expectedCount) {
        Object discrepancies = context.jsonPath("totalDiscrepancies");
        assertThat(discrepancies).as("Reconciliation discrepancy count").isNotNull();
        assertThat(Integer.parseInt(discrepancies.toString()))
                .as("Expected %d discrepancies", expectedCount)
                .isEqualTo(expectedCount);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private BigDecimal findGlAmount(List<Map<String, Object>> entries, String glCode, String field) {
        if (entries == null) return BigDecimal.ZERO;
        return entries.stream()
                .filter(e -> glCode.equals(e.get("glCode")))
                .findFirst()
                .map(e -> new BigDecimal(e.get(field).toString()))
                .orElse(BigDecimal.ZERO);
    }
}
