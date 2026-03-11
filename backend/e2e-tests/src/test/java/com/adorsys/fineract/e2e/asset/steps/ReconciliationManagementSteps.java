package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for reconciliation report management E2E tests
 * (list, filter, acknowledge, resolve).
 */
public class ReconciliationManagementSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    // ── List / Filter ──

    @When("the admin lists reconciliation reports")
    public void adminListsReports() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/reconciliation/reports");
        context.setLastResponse(response);
    }

    @When("the admin lists reconciliation reports with status {string}")
    public void adminListsReportsWithStatus(String status) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("status", status)
                .get("/api/v1/admin/reconciliation/reports");
        context.setLastResponse(response);
    }

    @When("the admin lists reconciliation reports for asset {string}")
    public void adminListsReportsForAsset(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("assetId", assetId)
                .get("/api/v1/admin/reconciliation/reports");
        context.setLastResponse(response);
    }

    // ── Summary ──

    @When("the admin gets the reconciliation summary")
    public void adminGetsSummary() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/reconciliation/summary");
        context.setLastResponse(response);
    }

    // ── Acknowledge / Resolve ──

    @When("the admin acknowledges the first reconciliation report")
    public void adminAcknowledgesFirst() {
        Long reportId = getFirstReportId();
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .patch("/api/v1/admin/reconciliation/reports/" + reportId + "/acknowledge");
        context.setLastResponse(response);
    }

    @When("the admin resolves the first reconciliation report with notes {string}")
    public void adminResolvesFirst(String notes) {
        Long reportId = getFirstReportId();
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("notes", notes)
                .patch("/api/v1/admin/reconciliation/reports/" + reportId + "/resolve");
        context.setLastResponse(response);
    }

    // ── Assertions ──

    @Then("the reconciliation report list should have at least {int} entry")
    public void reportListShouldHaveAtLeast(int minimum) {
        List<?> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content.size()).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the first reconciliation report should have status {string}")
    public void firstReportShouldHaveStatus(String expectedStatus) {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).isNotEmpty();
        assertThat(content.get(0).get("status")).isEqualTo(expectedStatus);
    }

    @Then("all reconciliation reports should have status {string}")
    public void allReportsShouldHaveStatus(String expectedStatus) {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        assertThat(statuses).isNotEmpty();
        assertThat(statuses).allMatch(s -> s.equals(expectedStatus));
    }

    @Then("all reconciliation reports should reference asset {string}")
    public void allReportsShouldReferenceAsset(String symbolRef) {
        String expectedAssetId = resolveAssetId(symbolRef);
        List<String> assetIds = context.getLastResponse().jsonPath().getList("content.assetId");
        assertThat(assetIds).isNotEmpty();
        assertThat(assetIds).allMatch(id -> id != null && id.equals(expectedAssetId));
    }

    @Then("the open report count should be at least {int}")
    public void openReportCountAtLeast(int minimum) {
        long count = context.getLastResponse().jsonPath().getLong("openReports");
        assertThat(count).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the open report count should be {int}")
    public void openReportCountShouldBe(int expected) {
        long count = context.getLastResponse().jsonPath().getLong("openReports");
        assertThat(count).isEqualTo(expected);
    }

    // ── Helpers ──

    private Long getFirstReportId() {
        Response listResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/reconciliation/reports");
        List<Integer> ids = listResp.jsonPath().getList("content.id");
        assertThat(ids).as("Reconciliation report list should not be empty").isNotEmpty();
        return ids.get(0).longValue();
    }

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
