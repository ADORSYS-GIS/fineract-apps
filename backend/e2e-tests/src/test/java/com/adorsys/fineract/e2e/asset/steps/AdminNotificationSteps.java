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
 * Step definitions for admin notification management E2E tests.
 */
public class AdminNotificationSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ── Setup ──

    @Given("the user position for asset {string} is tampered to {int} units")
    public void tamperUserPosition(String symbolRef, int tamperedUnits) {
        String assetId = resolveAssetId(symbolRef);
        jdbcTemplate.update(
                "UPDATE user_positions SET total_units = ? WHERE asset_id = ?",
                tamperedUnits, assetId);
    }

    @Given("there are {int} admin notifications seeded in the database")
    public void seedAdminNotifications(int count) {
        for (int i = 0; i < count; i++) {
            jdbcTemplate.update(
                    "INSERT INTO notification_log (user_id, event_type, title, body, is_read, created_at) " +
                    "VALUES (NULL, 'ADMIN_ALERT', ?, ?, false, NOW() - INTERVAL '" + i + " minutes')",
                    "Seeded Alert #" + i,
                    "System alert for pagination testing #" + i);
        }
    }

    // ── Admin list / count ──

    @When("the admin lists admin notifications")
    public void adminListsNotifications() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/notifications");
        context.setLastResponse(response);
    }

    @When("the admin lists admin notifications on page {int}")
    public void adminListsNotificationsOnPage(int page) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .param("page", page)
                .get("/api/v1/admin/notifications");
        context.setLastResponse(response);
    }

    @When("the admin gets the admin unread notification count")
    public void adminGetsUnreadCount() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/notifications/unread-count");
        context.setLastResponse(response);
    }

    // ── Mark read ──

    @When("the admin marks the first admin notification as read")
    public void adminMarksFirstAsRead() {
        Response listResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/notifications");
        List<Integer> ids = listResp.jsonPath().getList("content.id");
        assertThat(ids).as("Admin notification list should not be empty").isNotEmpty();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .post("/api/v1/admin/notifications/" + ids.get(0) + "/read");
        context.setLastResponse(response);
    }

    @When("the admin marks all admin notifications as read")
    public void adminMarksAllAsRead() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .post("/api/v1/admin/notifications/read-all");
        context.setLastResponse(response);
    }

    // ── Assertions ──

    @Then("the admin notification list should have at least {int} entry")
    public void adminNotifListShouldHaveAtLeast(int minimum) {
        List<?> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content.size())
                .as("Admin notification list size")
                .isGreaterThanOrEqualTo(minimum);
    }

    @Then("the admin notification list should have {int} entries")
    public void adminNotifListShouldHaveEntries(int expected) {
        List<?> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).hasSize(expected);
    }

    @Then("the admin notification page size should be {int}")
    public void adminNotifPageSizeShouldBe(int expectedSize) {
        List<?> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).hasSize(expectedSize);
    }

    @Then("the admin unread count should be at least {int}")
    public void adminUnreadCountShouldBeAtLeast(int minimum) {
        long count = context.getLastResponse().jsonPath().getLong("unreadCount");
        assertThat(count).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the admin unread count should be {int}")
    public void adminUnreadCountShouldBe(int expected) {
        long count = context.getLastResponse().jsonPath().getLong("unreadCount");
        assertThat(count).isEqualTo(expected);
    }

    @Then("the first admin notification should have an event type")
    public void firstAdminNotifShouldHaveEventType() {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).isNotEmpty();
        assertThat(content.get(0).get("eventType")).isNotNull();
    }

    @Then("the first admin notification should have a title")
    public void firstAdminNotifShouldHaveTitle() {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).isNotEmpty();
        assertThat(content.get(0).get("title")).isNotNull();
        assertThat(content.get(0).get("title").toString()).isNotBlank();
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
