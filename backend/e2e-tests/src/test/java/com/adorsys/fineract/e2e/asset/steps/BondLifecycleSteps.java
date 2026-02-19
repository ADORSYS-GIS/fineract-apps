package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import com.adorsys.fineract.asset.scheduler.MaturityScheduler;
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
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for bond lifecycle scenarios: creation, coupon payments,
 * maturity, and principal redemption — all verified against real Fineract.
 */
public class BondLifecycleSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private MaturityScheduler maturityScheduler;

    // ---------------------------------------------------------------
    // Given steps
    // ---------------------------------------------------------------

    @Given("an active bond asset {string} priced at {int} with supply {int} and interest rate {double}")
    public void activeBondAsset(String symbolRef, int price, int supply, double interestRate) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("initialPrice", price);
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("treasuryClientId", FineractInitializer.getTreasuryClientId());
        request.put("issuer", "E2E Test Issuer");
        request.put("interestRate", interestRate);
        request.put("couponFrequencyMonths", 6);
        request.put("maturityDate", LocalDate.now().plusYears(5).toString());
        request.put("nextCouponDate", LocalDate.now().toString());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create bond %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        // Activate
        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("the user holds {int} units of bond {string}")
    public void userHoldsBondUnits(int units, String symbolRef) {
        String assetId = context.getId("lastAssetId");

        for (int i = 0; i < units; i++) {
            Map<String, Object> body = Map.of(
                    "assetId", assetId,
                    "units", 1
            );

            Response response = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .contentType(ContentType.JSON)
                    .header("X-Idempotency-Key", UUID.randomUUID().toString())
                    .header("Authorization", "Bearer " + testUserJwt())
                    .body(body)
                    .post("/api/trades/buy");

            assertThat(response.statusCode()).isIn(200, 201);
        }

        context.storeValue("bondUnitsHeld", units);
    }

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the admin triggers coupon payment for bond {string}")
    public void adminTriggersCouponPayment(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/coupons/trigger");

        context.setLastResponse(response);
    }

    @When("the maturity scheduler runs")
    public void maturitySchedulerRuns() {
        String assetId = context.getId("lastAssetId");
        jdbcTemplate.update(
                "UPDATE assets SET maturity_date = ? WHERE id = ?",
                java.sql.Date.valueOf(LocalDate.now().minusDays(1)), assetId);

        maturityScheduler.matureBonds();
    }

    @When("the admin triggers bond redemption for {string}")
    public void adminTriggersRedemption(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        context.storeValue("xafBalanceBefore", balanceBefore);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/redeem");

        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the coupon trigger should succeed with {int} payments")
    public void couponTriggerShouldSucceed(int expectedPayments) {
        assertThat(context.getStatusCode())
                .as("Coupon trigger response — body: %s", context.getBody())
                .isEqualTo(200);
        int paid = context.jsonPath("holdersPaid");
        assertThat(paid).isEqualTo(expectedPayments);
    }

    @Then("the user's XAF balance should have increased after coupon")
    public void xafBalanceShouldHaveIncreasedAfterCoupon() {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        assertThat(balanceAfter).isGreaterThan(balanceBefore);
    }

    @Then("coupon payment records should exist for the bond")
    public void couponPaymentRecordsShouldExist() {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId + "/coupons");

        assertThat(response.statusCode()).isEqualTo(200);
        int totalElements = response.jsonPath().getInt("totalElements");
        assertThat(totalElements).isGreaterThan(0);
    }

    @Then("the bond should be in MATURED status")
    public void bondShouldBeMatured() {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        String status = response.jsonPath().getString("status");
        assertThat(status).isEqualTo("MATURED");
    }

    @Then("the redemption should succeed")
    public void redemptionShouldSucceed() {
        assertThat(context.getStatusCode())
                .as("Redemption response: %s", context.getBody())
                .isEqualTo(200);
        Number holdersRedeemed = context.jsonPath("holdersRedeemed");
        assertThat(holdersRedeemed.intValue())
                .as("Holders redeemed — response: %s", context.getBody())
                .isGreaterThan(0);
    }

    @Then("the user's XAF balance should have increased after redemption")
    public void xafBalanceShouldHaveIncreasedAfterRedemption() {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());

        assertThat(balanceAfter).isGreaterThan(balanceBefore);
    }

    @Then("the user should no longer hold units of bond {string}")
    public void userShouldNotHoldBondUnits(String symbolRef) {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        Number circulatingSupply = response.jsonPath().get("circulatingSupply");
        assertThat(circulatingSupply.intValue()).isEqualTo(0);
    }

    @Then("redemption records should exist for the bond")
    public void redemptionRecordsShouldExist() {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId + "/redemptions");

        assertThat(response.statusCode()).isEqualTo(200);
        int totalElements = response.jsonPath().getInt("totalElements");
        assertThat(totalElements).isGreaterThan(0);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                java.util.List.of());
    }
}
