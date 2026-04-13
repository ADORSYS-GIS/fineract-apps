package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
import com.adorsys.fineract.asset.scheduler.IncomeDistributionScheduler;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.repository.AssetRepository;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for scheduled payment E2E scenarios:
 * scheduler creates PENDING records, admin confirms/cancels.
 */
public class ScheduledPaymentSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private InterestPaymentScheduler interestPaymentScheduler;

    @Autowired
    private IncomeDistributionScheduler incomeDistributionScheduler;

    @Autowired
    private AssetRepository assetRepository;

    // ---------------------------------------------------------------
    // Given steps
    // ---------------------------------------------------------------

    @Given("the user holds {int} units of income asset {string}")
    public void userHoldsIncomeAssetUnits(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        for (int i = 0; i < units; i++) {
            // 1. Create quote
            Map<String, Object> quoteBody = Map.of(
                    "assetId", assetId,
                    "side", "BUY",
                    "units", 1
            );

            Response quoteResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .contentType(ContentType.JSON)
                    .header("X-Idempotency-Key", UUID.randomUUID().toString())
                    .header("Authorization", "Bearer " + testUserJwt())
                    .body(quoteBody)
                    .post("/api/v1/trades/quote");

            assertThat(quoteResp.statusCode())
                    .as("Create quote for unit %d of %s: %s", i + 1, symbolRef, quoteResp.body().asString())
                    .isEqualTo(201);

            String orderId = quoteResp.jsonPath().getString("orderId");

            // 2. Confirm quote
            Response confirmResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .contentType(ContentType.JSON)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .post("/api/v1/trades/orders/" + orderId + "/confirm");

            assertThat(confirmResp.statusCode())
                    .as("Confirm quote for unit %d of %s: %s", i + 1, symbolRef, confirmResp.body().asString())
                    .isEqualTo(202);

            // 3. Poll for FILLED (up to 15s)
            pollUntilFilled(orderId, i + 1, symbolRef);
        }
    }

    /**
     * Polls the order status until it reaches FILLED (or terminal failure).
     */
    private void pollUntilFilled(String orderId, int unitNumber, String symbolRef) {
        long deadline = System.currentTimeMillis() + 15_000;
        while (System.currentTimeMillis() < deadline) {
            Response pollResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .get("/api/v1/trades/orders/" + orderId);

            String status = pollResp.jsonPath().getString("status");
            if ("FILLED".equals(status) || "FAILED".equals(status) || "REJECTED".equals(status)) {
                assertThat(status)
                        .as("Buy unit %d of %s order %s: %s", unitNumber, symbolRef, orderId, pollResp.body().asString())
                        .isEqualTo("FILLED");
                return;
            }
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
        // Final check
        Response finalResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/v1/trades/orders/" + orderId);
        assertThat(finalResp.jsonPath().getString("status"))
                .as("Buy unit %d of %s did not reach FILLED within timeout", unitNumber, symbolRef)
                .isEqualTo("FILLED");
    }

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the scheduler creates a pending coupon schedule for {string}")
    public void schedulerCreatesCouponSchedule(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        // Set nextCouponDate to today so the scheduler picks it up
        jdbcTemplate.update(
                "UPDATE assets SET next_coupon_date = ? WHERE id = ?",
                java.sql.Date.valueOf(LocalDate.now()), assetId);

        // Record balance before payment
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        // Reload entity and invoke scheduler method directly
        Asset bond = assetRepository.findById(assetId).orElseThrow();
        interestPaymentScheduler.createPendingAndAdvance(bond);

        // Find the created schedule
        findAndStoreLastSchedule(assetId, "COUPON");
    }

    @When("the scheduler creates a pending income schedule for {string}")
    public void schedulerCreatesIncomeSchedule(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        // Set nextDistributionDate to today
        jdbcTemplate.update(
                "UPDATE assets SET next_distribution_date = ? WHERE id = ?",
                java.sql.Date.valueOf(LocalDate.now()), assetId);

        // Record balance before
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        // Reload and invoke scheduler
        Asset asset = assetRepository.findById(assetId).orElseThrow();
        incomeDistributionScheduler.createPendingAndAdvance(asset);

        // Find the created schedule
        findAndStoreLastSchedule(assetId, "INCOME");
    }

    @When("the admin confirms the scheduled payment")
    public void adminConfirmsScheduledPayment() {
        Long scheduleId = context.getValue("lastScheduleId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/scheduled-payments/" + scheduleId + "/confirm");

        context.setLastResponse(response);
        assertThat(response.statusCode())
                .as("Confirm schedule %d: %s", scheduleId, response.body().asString())
                .isEqualTo(200);
    }

    @When("the admin confirms the scheduled payment with amount per unit {int}")
    public void adminConfirmsWithCustomAmount(int amountPerUnit) {
        Long scheduleId = context.getValue("lastScheduleId");

        Map<String, Object> body = Map.of("amountPerUnit", amountPerUnit);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/v1/admin/scheduled-payments/" + scheduleId + "/confirm");

        context.setLastResponse(response);
        assertThat(response.statusCode())
                .as("Confirm schedule %d with amount %d: %s", scheduleId, amountPerUnit, response.body().asString())
                .isEqualTo(200);
    }

    @When("the admin cancels the scheduled payment with reason {string}")
    public void adminCancelsScheduledPayment(String reason) {
        Long scheduleId = context.getValue("lastScheduleId");

        Map<String, Object> body = Map.of("reason", reason);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(body)
                .post("/api/v1/admin/scheduled-payments/" + scheduleId + "/cancel");

        context.setLastResponse(response);
        assertThat(response.statusCode())
                .as("Cancel schedule %d: %s", scheduleId, response.body().asString())
                .isEqualTo(200);
    }

    @When("the admin lists scheduled payments with status {string}")
    public void adminListsScheduledPaymentsByStatus(String status) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .queryParam("status", status)
                .get("/api/v1/admin/scheduled-payments");

        context.setLastResponse(response);
        assertThat(response.statusCode()).isEqualTo(200);
    }

    @When("the admin lists scheduled payments with type {string}")
    public void adminListsScheduledPaymentsByType(String type) {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .queryParam("type", type)
                .get("/api/v1/admin/scheduled-payments");

        context.setLastResponse(response);
        assertThat(response.statusCode()).isEqualTo(200);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("a PENDING scheduled payment should exist for {string} with type {string}")
    public void pendingScheduleShouldExist(String symbolRef, String expectedType) {
        Long scheduleId = context.getValue("lastScheduleId");
        assertThat(scheduleId).as("Schedule should have been created").isNotNull();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);

        assertThat(response.statusCode()).isEqualTo(200);
        assertThat(response.jsonPath().getString("status")).isEqualTo("PENDING");
        assertThat(response.jsonPath().getString("paymentType")).isEqualTo(expectedType);
    }

    @Then("the estimated amount per unit should be greater than {int}")
    public void estimatedAmountPerUnitGreaterThan(int min) {
        Long scheduleId = context.getValue("lastScheduleId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);

        Number estimatedAmountPerUnit = response.jsonPath().get("estimatedAmountPerUnit");
        assertThat(estimatedAmountPerUnit.doubleValue()).isGreaterThan(min);
    }

    @Then("the scheduled payment holder count should be {int}")
    public void scheduledPaymentHolderCount(int expected) {
        Long scheduleId = context.getValue("lastScheduleId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);

        Number holderCount = response.jsonPath().get("holderCount");
        assertThat(holderCount.intValue()).isEqualTo(expected);
    }

    @Then("the scheduled payment status should be {string}")
    public void scheduledPaymentStatusShouldBe(String expectedStatus) {
        String actualStatus = context.getLastResponse().jsonPath().getString("status");
        assertThat(actualStatus).isEqualTo(expectedStatus);
    }

    @Then("the confirmed payment should have {int} holders paid")
    public void confirmedPaymentHoldersPaid(int expected) {
        Number holdersPaid = context.getLastResponse().jsonPath().get("holdersPaid");
        assertThat(holdersPaid.intValue()).isEqualTo(expected);
    }

    @Then("the actual amount per unit should be {int}")
    public void actualAmountPerUnitShouldBe(int expected) {
        Number actual = context.getLastResponse().jsonPath().get("actualAmountPerUnit");
        assertThat(actual.intValue()).isEqualTo(expected);
    }

    @Then("the listed payments should all have status {string}")
    public void listedPaymentsShouldHaveStatus(String expectedStatus) {
        List<String> statuses = context.getLastResponse().jsonPath().getList("content.status");
        assertThat(statuses).isNotEmpty();
        assertThat(statuses).allMatch(s -> s.equals(expectedStatus));
    }

    @Then("the listed payments should all have payment type {string}")
    public void listedPaymentsShouldHaveType(String expectedType) {
        List<String> types = context.getLastResponse().jsonPath().getList("content.paymentType");
        assertThat(types).isNotEmpty();
        assertThat(types).allMatch(t -> t.equals(expectedType));
    }

    // ---------------------------------------------------------------
    // IRCM withholding assertions (use the detail endpoint)
    // ---------------------------------------------------------------

    @Then("the scheduled payment detail should include IRCM fields")
    public void scheduledPaymentDetailShouldIncludeIrcmFields() {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        assertThat(detail.statusCode()).isEqualTo(200);
        String body = detail.body().asString();
        assertThat(body)
                .as("Detail should contain grossAmountPerUnit — response: %s", body)
                .contains("grossAmountPerUnit");
        assertThat(body)
                .as("Detail should contain ircmWithheldPerUnit — response: %s", body)
                .contains("ircmWithheldPerUnit");
        assertThat(body)
                .as("Detail should contain netAmountPerUnit — response: %s", body)
                .contains("netAmountPerUnit");
        context.storeValue("lastScheduleDetail", body);
    }

    @Then("the gross amount per unit should be greater than {int}")
    public void grossAmountPerUnitShouldBeGreaterThan(int min) {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number gross = detail.jsonPath().get("grossAmountPerUnit");
        assertThat(gross)
                .as("grossAmountPerUnit should be present — response: %s", detail.body().asString())
                .isNotNull();
        assertThat(gross.doubleValue()).isGreaterThan(min);
    }

    @Then("the IRCM withheld per unit should be greater than {int}")
    public void ircmWithheldPerUnitShouldBeGreaterThan(int min) {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number ircm = detail.jsonPath().get("ircmWithheldPerUnit");
        assertThat(ircm)
                .as("ircmWithheldPerUnit should be present — response: %s", detail.body().asString())
                .isNotNull();
        assertThat(ircm.doubleValue()).isGreaterThan(min);
    }

    @Then("the net amount per unit should be less than gross amount per unit")
    public void netAmountPerUnitShouldBeLessThanGross() {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number gross = detail.jsonPath().get("grossAmountPerUnit");
        Number net = detail.jsonPath().get("netAmountPerUnit");
        assertThat(net).isNotNull();
        assertThat(gross).isNotNull();
        assertThat(net.doubleValue())
                .as("netAmountPerUnit (%s) should be < grossAmountPerUnit (%s)", net, gross)
                .isLessThan(gross.doubleValue());
    }

    @Then("the IRCM withheld per unit should be approximately {double} percent of gross per unit")
    public void ircmWithheldShouldBeApproximatelyPercentOfGross(double expectedPercent) {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number gross = detail.jsonPath().get("grossAmountPerUnit");
        Number ircm = detail.jsonPath().get("ircmWithheldPerUnit");
        assertThat(gross).isNotNull();
        assertThat(ircm).isNotNull();
        double expectedIrcm = gross.doubleValue() * (expectedPercent / 100.0);
        assertThat(ircm.doubleValue())
                .as("ircmWithheldPerUnit should be ~%.1f%% of gross %.2f (expected ~%.2f)",
                        expectedPercent, gross.doubleValue(), expectedIrcm)
                .isCloseTo(expectedIrcm, org.assertj.core.data.Percentage.withPercentage(1.0));
    }

    @Then("the IRCM net plus withheld should equal gross amount per unit")
    public void ircmNetPlusWithheldShouldEqualGross() {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number gross = detail.jsonPath().get("grossAmountPerUnit");
        Number net = detail.jsonPath().get("netAmountPerUnit");
        Number ircm = detail.jsonPath().get("ircmWithheldPerUnit");
        assertThat(gross).isNotNull();
        assertThat(net).isNotNull();
        assertThat(ircm).isNotNull();
        double sum = net.doubleValue() + ircm.doubleValue();
        assertThat(sum)
                .as("net (%.2f) + ircm (%.2f) should equal gross (%.2f)", net.doubleValue(), ircm.doubleValue(), gross.doubleValue())
                .isCloseTo(gross.doubleValue(), org.assertj.core.data.Offset.offset(0.01));
    }

    @Then("the scheduled payment should have ircmExempt equal to {word}")
    public void scheduledPaymentShouldHaveIrcmExempt(String expectedValue) {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Boolean ircmExempt = detail.jsonPath().getBoolean("ircmExempt");
        boolean expected = Boolean.parseBoolean(expectedValue);
        assertThat(ircmExempt)
                .as("ircmExempt should be %s — response: %s", expectedValue, detail.body().asString())
                .isEqualTo(expected);
    }

    @Then("the IRCM withheld per unit should be {int}")
    public void ircmWithheldPerUnitShouldBe(int expectedValue) {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number ircm = detail.jsonPath().get("ircmWithheldPerUnit");
        double actual = ircm == null ? 0.0 : ircm.doubleValue();
        assertThat(actual)
                .as("ircmWithheldPerUnit should be %d — response: %s", expectedValue, detail.body().asString())
                .isCloseTo(expectedValue, org.assertj.core.data.Offset.offset(0.01));
    }

    @Then("the net increase should be less than the gross coupon amount")
    public void netIncreaseShouldBeLessThanGrossCouponAmount() {
        Long scheduleId = context.getValue("lastScheduleId");
        Response detail = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/scheduled-payments/" + scheduleId);
        Number gross = detail.jsonPath().get("grossAmountPerUnit");
        assertThat(gross).isNotNull();

        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        BigDecimal netIncrease = balanceAfter.subtract(balanceBefore);

        assertThat(netIncrease.doubleValue())
                .as("Net balance increase (%.2f) should be less than gross coupon (%.2f)", netIncrease.doubleValue(), gross.doubleValue())
                .isLessThan(gross.doubleValue());
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private void findAndStoreLastSchedule(String assetId, String paymentType) {
        // Query the schedule via API
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .queryParam("assetId", assetId)
                .queryParam("type", paymentType)
                .queryParam("status", "PENDING")
                .get("/api/v1/admin/scheduled-payments");

        assertThat(response.statusCode()).isEqualTo(200);
        List<Map<String, Object>> content = response.jsonPath().getList("content");
        assertThat(content)
                .as("Should find at least one PENDING %s schedule for asset %s", paymentType, assetId)
                .isNotEmpty();

        // Store the most recent one
        Number scheduleId = (Number) content.get(0).get("id");
        context.storeValue("lastScheduleId", scheduleId.longValue());
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                List.of());
    }
}
