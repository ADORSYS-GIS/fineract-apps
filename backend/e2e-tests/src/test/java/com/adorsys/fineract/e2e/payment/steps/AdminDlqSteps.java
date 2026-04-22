package com.adorsys.fineract.e2e.payment.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for admin reversal dead-letter queue E2E tests.
 */
public class AdminDlqSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ── Setup ──

    @Given("there are {int} unresolved reversal dead letter entries in the database")
    public void insertDlqEntries(int count) {
        for (int i = 0; i < count; i++) {
            jdbcTemplate.update(
                    "INSERT INTO reversal_dead_letters " +
                    "(transaction_id, fineract_txn_id, account_id, amount, currency, provider, " +
                    " failure_reason, resolved, created_at) " +
                    "VALUES (?, ?, 1, 5000.00, 'XAF', 'MTN_MOMO', " +
                    " ?, false, NOW())",
                    UUID.randomUUID().toString(),
                    100000L + i,
                    "Fineract reversal failed: account locked (entry " + i + ")");
        }
    }

    // ── Admin DLQ actions ──

    @When("the admin gets the DLQ count")
    public void adminGetsDlqCount() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + adminJwt())
                .get("/api/admin/reversals/dlq/count");
        context.storeValue("adminDlqResponse", response);
    }

    @When("the admin lists unresolved DLQ entries")
    public void adminListsDlqEntries() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + adminJwt())
                .get("/api/admin/reversals/dlq");
        context.storeValue("adminDlqResponse", response);
    }

    @When("the admin resolves the first DLQ entry with notes {string}")
    public void adminResolvesFirstDlqEntry(String notes) {
        Response listResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + adminJwt())
                .get("/api/admin/reversals/dlq");
        List<Integer> ids = listResp.jsonPath().getList("content.id");
        assertThat(ids).as("DLQ list should not be empty").isNotEmpty();
        int firstId = ids.get(0);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + adminJwt())
                .contentType(ContentType.JSON)
                .body(Map.of("resolvedBy", "e2e-admin", "notes", notes))
                .patch("/api/admin/reversals/dlq/" + firstId);
        context.storeValue("adminDlqResponse", response);
    }

    @When("an unauthenticated request is sent to the DLQ count endpoint")
    public void unauthenticatedDlqRequest() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/reversals/dlq/count");
        context.storeValue("unauthDlqResponse", response);
    }

    // ── Assertions ──

    @Then("the admin DLQ response status should be {int}")
    public void adminDlqResponseStatusShouldBe(int expectedStatus) {
        Response response = context.getValue("adminDlqResponse");
        assertThat(response.statusCode()).isEqualTo(expectedStatus);
    }

    @Then("the DLQ count should be {int}")
    public void dlqCountShouldBe(int expected) {
        Response response = context.getValue("adminDlqResponse");
        long count = response.jsonPath().getLong("count");
        assertThat(count).isEqualTo(expected);
    }

    @Then("the DLQ list should have {int} entries")
    public void dlqListShouldHaveEntries(int expected) {
        Response response = context.getValue("adminDlqResponse");
        List<?> entries = response.jsonPath().getList("content");
        assertThat(entries).hasSize(expected);
    }

    @Then("the DLQ list should be empty")
    public void dlqListShouldBeEmpty() {
        Response response = context.getValue("adminDlqResponse");
        List<?> entries = response.jsonPath().getList("content");
        assertThat(entries).isEmpty();
    }

    @Then("each DLQ entry should have a transaction ID and failure reason")
    public void eachDlqEntryShouldHaveFields() {
        Response response = context.getValue("adminDlqResponse");
        List<Map<String, Object>> entries = response.jsonPath().getList("content");
        assertThat(entries).isNotEmpty();
        for (Map<String, Object> entry : entries) {
            assertThat(entry.get("transactionId")).as("transactionId").isNotNull();
            assertThat(entry.get("failureReason")).as("failureReason").isNotNull();
        }
    }

    @Then("the resolved DLQ entry should have resolvedBy {string}")
    public void resolvedDlqShouldHaveResolvedBy(String expectedResolvedBy) {
        Response response = context.getValue("adminDlqResponse");
        String resolvedBy = response.jsonPath().getString("resolvedBy");
        assertThat(resolvedBy).isEqualTo(expectedResolvedBy);
    }

    @Then("the resolved DLQ entry should have notes {string}")
    public void resolvedDlqShouldHaveNotes(String expectedNotes) {
        Response response = context.getValue("adminDlqResponse");
        String notes = response.jsonPath().getString("notes");
        assertThat(notes).isEqualTo(expectedNotes);
    }

    @Then("the unauthenticated DLQ response status should be {int}")
    public void unauthDlqResponseStatusShouldBe(int expectedStatus) {
        Response response = context.getValue("unauthDlqResponse");
        assertThat(response.statusCode()).isEqualTo(expectedStatus);
    }

    // ── Helpers ──

    private String adminJwt() {
        return JwtTokenFactory.generateAdminToken();
    }
}
