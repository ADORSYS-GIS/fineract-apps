package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for user notification and notification preferences E2E tests.
 */
public class UserNotificationSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    // ── List / Count ──

    @When("the user lists their notifications")
    public void userListsNotifications() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/notifications");
        context.setLastResponse(response);
    }

    @When("the user gets their unread notification count")
    public void userGetsUnreadCount() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/notifications/unread-count");
        context.setLastResponse(response);
    }

    // ── Mark read ──

    @When("the user marks the first notification as read")
    public void userMarksFirstAsRead() {
        Response listResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/notifications");
        List<Integer> ids = listResp.jsonPath().getList("content.id");
        assertThat(ids).as("Notification list should not be empty").isNotEmpty();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/notifications/" + ids.get(0) + "/read");
        context.setLastResponse(response);
        context.storeValue("markedNotificationId", ids.get(0));
    }

    @When("the user marks all notifications as read")
    public void userMarksAllAsRead() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/notifications/read-all");
        context.setLastResponse(response);
    }

    // ── Preferences ──

    @When("the user gets their notification preferences")
    public void userGetsPreferences() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/notifications/preferences");
        context.setLastResponse(response);
    }

    @When("the user updates notification preferences with tradeExecuted disabled")
    public void userDisablesTradeExecuted() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .contentType(ContentType.JSON)
                .body(Map.of("tradeExecuted", false))
                .put("/api/notifications/preferences");
        context.setLastResponse(response);
    }

    @When("the user updates notification preferences with tradeExecuted enabled")
    public void userEnablesTradeExecuted() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .contentType(ContentType.JSON)
                .body(Map.of("tradeExecuted", true))
                .put("/api/notifications/preferences");
        context.setLastResponse(response);
    }

    // ── Assertions ──

    @Then("the notification list should contain a {string} event for asset {string}")
    public void notificationListShouldContainEventForAsset(String eventType, String symbol) {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        boolean found = content.stream().anyMatch(n ->
                eventType.equals(n.get("eventType")) &&
                n.get("title") != null &&
                n.get("title").toString().contains(symbol));
        assertThat(found)
                .as("Expected notification with eventType=%s for asset %s in: %s", eventType, symbol, content)
                .isTrue();
    }

    @Then("the notification list should not contain a {string} event for asset {string}")
    public void notificationListShouldNotContainEventForAsset(String eventType, String symbol) {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        boolean found = content.stream().anyMatch(n ->
                eventType.equals(n.get("eventType")) &&
                n.get("title") != null &&
                n.get("title").toString().contains(symbol));
        assertThat(found)
                .as("Did not expect %s notification for asset %s but found one", eventType, symbol)
                .isFalse();
    }

    @Then("the notification list should have at least {int} entry")
    public void notificationListShouldHaveAtLeastEntries(int minimum) {
        List<?> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content.size()).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the first notification should be marked as read")
    public void firstNotificationShouldBeRead() {
        List<Map<String, Object>> content = context.getLastResponse().jsonPath().getList("content");
        assertThat(content).isNotEmpty();
        Integer markedId = context.getValue("markedNotificationId");
        if (markedId != null) {
            boolean found = content.stream().anyMatch(n ->
                    markedId.equals(n.get("id")) && Boolean.TRUE.equals(n.get("read")));
            assertThat(found).as("Notification %d should be marked as read", markedId).isTrue();
        }
    }

    @Then("the user unread count should be at least {int}")
    public void userUnreadCountShouldBeAtLeast(int minimum) {
        long count = context.getLastResponse().jsonPath().getLong("count");
        assertThat(count).isGreaterThanOrEqualTo(minimum);
    }

    @Then("the user unread count should be {int}")
    public void userUnreadCountShouldBe(int expected) {
        long count = context.getLastResponse().jsonPath().getLong("count");
        assertThat(count).isEqualTo(expected);
    }

    @Then("all notification preferences should be enabled")
    public void allPreferencesShouldBeEnabled() {
        Response resp = context.getLastResponse();
        assertThat(resp.jsonPath().getBoolean("tradeExecuted")).isTrue();
        assertThat(resp.jsonPath().getBoolean("couponPaid")).isTrue();
        assertThat(resp.jsonPath().getBoolean("redemptionCompleted")).isTrue();
        assertThat(resp.jsonPath().getBoolean("assetStatusChanged")).isTrue();
        assertThat(resp.jsonPath().getBoolean("orderStuck")).isTrue();
        assertThat(resp.jsonPath().getBoolean("incomePaid")).isTrue();
        assertThat(resp.jsonPath().getBoolean("treasuryShortfall")).isTrue();
        assertThat(resp.jsonPath().getBoolean("delistingAnnounced")).isTrue();
    }

    @Then("the tradeExecuted preference should be false")
    public void tradeExecutedShouldBeFalse() {
        assertThat(context.getLastResponse().jsonPath().getBoolean("tradeExecuted")).isFalse();
    }

    // ── Helpers ──

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                List.of());
    }
}
