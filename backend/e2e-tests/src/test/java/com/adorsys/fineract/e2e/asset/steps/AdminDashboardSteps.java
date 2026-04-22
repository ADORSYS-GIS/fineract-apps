package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for admin dashboard summary and audit log E2E tests.
 */
public class AdminDashboardSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ── Setup ──

    @Given("the last order is marked as NEEDS_RECONCILIATION in the database")
    public void markLastOrderAsNeedsReconciliation() {
        String orderId = context.getValue("lastOrderId");
        if (orderId == null) {
            orderId = context.getLastResponse().jsonPath().getString("orderId");
        }
        assertThat(orderId).as("No order ID found in context").isNotNull();
        context.storeValue("lastOrderId", orderId);

        jdbcTemplate.update(
                "UPDATE orders SET status = 'NEEDS_RECONCILIATION' WHERE id = ?",
                orderId);
    }

    // ── Dashboard Summary ──

    @When("the admin gets the dashboard summary")
    public void adminGetsDashboardSummary() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/dashboard/summary");
        context.setLastResponse(response);
    }

    @Then("the dashboard active asset count should be at least {int}")
    public void dashboardActiveAssetCountAtLeast(int minimum) {
        int active = context.getLastResponse().jsonPath().getInt("assets.active");
        assertThat(active).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the dashboard total asset count should be at least {int}")
    public void dashboardTotalAssetCountAtLeast(int minimum) {
        int total = context.getLastResponse().jsonPath().getInt("assets.total");
        assertThat(total).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the dashboard 24h buy volume should be at least {long}")
    public void dashboardBuyVolumeAtLeast(long minimum) {
        Number volume = context.getLastResponse().jsonPath().get("trading.buyVolume24h");
        assertThat(volume.longValue()).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the dashboard 24h trade count should be at least {int}")
    public void dashboardTradeCountAtLeast(int minimum) {
        int count = context.getLastResponse().jsonPath().getInt("trading.tradeCount24h");
        assertThat(count).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the dashboard active investor count should be at least {int}")
    public void dashboardActiveInvestorCountAtLeast(int minimum) {
        long investors = context.getLastResponse().jsonPath().getLong("activeInvestors");
        assertThat(investors).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the dashboard needs reconciliation count should be at least {int}")
    public void dashboardNeedsReconciliationCountAtLeast(int minimum) {
        long count = context.getLastResponse().jsonPath().getLong("orders.needsReconciliation");
        assertThat(count).isGreaterThanOrEqualTo(minimum);
    }

    // ── Audit Log ──

    @When("the admin gets the audit log")
    public void adminGetsAuditLog() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/audit-log");
        context.setLastResponse(response);
    }

    @When("the admin gets the audit log filtered by action {string}")
    public void adminGetsAuditLogByAction(String action) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("action", action)
                .get("/api/v1/admin/audit-log");
        context.setLastResponse(response);
    }

    @When("the admin gets the audit log filtered by asset {string}")
    public void adminGetsAuditLogByAsset(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("assetId", assetId)
                .get("/api/v1/admin/audit-log");
        context.setLastResponse(response);
    }

    @Then("the audit log should contain an entry with action {string} and result {string}")
    public void auditLogShouldContainActionAndResult(String action, String result) {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        boolean found = content.stream().anyMatch(entry ->
                action.equals(entry.get("action")) && result.equals(entry.get("result")));
        assertThat(found)
                .as("Expected audit entry with action=%s, result=%s", action, result)
                .isTrue();
    }

    @Then("the audit log should contain an entry for asset symbol {string}")
    public void auditLogShouldContainAssetSymbol(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath().getList("content.targetAssetSymbol");
        assertThat(symbols).contains(symbol);
    }

    @Then("all audit log entries should have action {string}")
    public void allAuditEntriesShouldHaveAction(String expectedAction) {
        List<String> actions = context.getLastResponse().jsonPath().getList("content.action");
        assertThat(actions).isNotEmpty();
        assertThat(actions).allMatch(a -> a.equals(expectedAction));
    }

    @Then("all audit log entries should reference asset {string}")
    public void allAuditEntriesShouldReferenceAsset(String symbolRef) {
        String expectedAssetId = resolveAssetId(symbolRef);
        List<String> assetIds = context.getLastResponse().jsonPath().getList("content.targetAssetId");
        assertThat(assetIds).isNotEmpty();
        assertThat(assetIds).allMatch(id -> id != null && id.equals(expectedAssetId));
    }

    @Then("the audit log should not contain entries for asset {string}")
    public void auditLogShouldNotContainAsset(String symbolRef) {
        String excludedAssetId = resolveAssetId(symbolRef);
        List<String> assetIds = context.getLastResponse().jsonPath().getList("content.targetAssetId");
        assertThat(assetIds).noneMatch(id -> excludedAssetId.equals(id));
    }

    // ── Helpers ──

    private String resolveAssetId(String ref) {
        if ("lastCreated".equals(ref)) {
            return context.getId("lastAssetId");
        }
        String perSymbol = context.getId("assetId_" + ref);
        if (perSymbol != null) {
            return perSymbol;
        }
        String stored = context.getId("lastAssetId");
        if (stored != null && ref.equals(context.getValue("lastSymbol"))) {
            return stored;
        }
        return ref;
    }
}
