package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 * Step definitions for audit log scenarios.
 */
public class AuditLogStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ScenarioContext context;

    private static final SimpleGrantedAuthority ADMIN = new SimpleGrantedAuthority("ROLE_ASSET_MANAGER");

    // ── When steps ──
    // Note: "the admin activates asset {string}" and "the admin halts asset {string}"
    // are defined in AdminAssetStepDefinitions and shared across features.

    @When("the admin requests the audit log")
    public void adminRequestsAuditLog() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/audit-log")
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin requests the audit log filtered by action {string}")
    public void adminRequestsAuditLogFilteredByAction(String action) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/audit-log")
                        .param("action", action)
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin requests the audit log with page size {int}")
    public void adminRequestsAuditLogWithPageSize(int size) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/audit-log")
                        .param("size", String.valueOf(size))
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    // ── Then steps ──

    @Then("the audit log should contain an entry with action {string}")
    public void auditLogContainsAction(String action) {
        List<?> matches = JsonPath.read(context.getLastResponseBody(),
                "$.content[?(@.action=='" + action + "')]");
        assertThat(matches).isNotEmpty();
    }

    @Then("the audit log entry for {string} should have result {string}")
    public void auditLogEntryHasResult(String action, String result) {
        List<String> results = JsonPath.read(context.getLastResponseBody(),
                "$.content[?(@.action=='" + action + "')].result");
        assertThat(results).contains(result);
    }

    @Then("the first audit log entry should have targetAssetSymbol {string}")
    public void firstAuditLogEntryHasSymbol(String symbol) {
        String actual = JsonPath.read(context.getLastResponseBody(),
                "$.content[0].targetAssetSymbol");
        assertThat(actual).isEqualTo(symbol);
    }

    @Then("the audit log should have exactly {int} entry")
    public void auditLogHasExactlyNEntries(int expected) {
        List<?> content = JsonPath.read(context.getLastResponseBody(), "$.content");
        assertThat(content).hasSize(expected);
    }

    @Then("the audit log page size should be {int}")
    public void auditLogPageSizeIs(int expected) {
        int size = JsonPath.read(context.getLastResponseBody(), "$.size");
        assertThat(size).isEqualTo(expected);
    }
}
