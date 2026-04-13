package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
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

    @Autowired
    private InterestPaymentScheduler interestPaymentScheduler;

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
        BigDecimal issuerPrice = new BigDecimal(price);
        request.put("issuerPrice", issuerPrice);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("tvaEnabled", false);              // taxes disabled here for clean balance assertions
        request.put("registrationDutyEnabled", false); // both TVA and reg duty tested in unit tests
        request.put("issuerName", "E2E Test Issuer");
        request.put("bondType", "COUPON");
        request.put("dayCountConvention", "ACT_365");
        request.put("interestRate", interestRate);
        request.put("couponFrequencyMonths", 6);
        request.put("maturityDate", LocalDate.now().plusYears(5).toString());
        request.put("nextCouponDate", LocalDate.now().toString());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

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
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("the user holds {int} units of bond {string}")
    public void userHoldsBondUnits(int units, String symbolRef) {
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
                    .as("Create quote for bond unit %d: %s", i + 1, quoteResp.body().asString())
                    .isEqualTo(201);

            String orderId = quoteResp.jsonPath().getString("orderId");

            // 2. Confirm quote
            Response confirmResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .contentType(ContentType.JSON)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .post("/api/v1/trades/orders/" + orderId + "/confirm");

            assertThat(confirmResp.statusCode())
                    .as("Confirm quote for bond unit %d: %s", i + 1, confirmResp.body().asString())
                    .isEqualTo(202);

            // 3. Poll for FILLED (up to 15s)
            pollUntilTerminal(orderId);
        }

        context.storeValue("bondUnitsHeld", units);
    }

    /**
     * Polls the order status until it reaches a terminal state (FILLED, FAILED, REJECTED).
     */
    private void pollUntilTerminal(String orderId) {
        long deadline = System.currentTimeMillis() + 15_000;
        while (System.currentTimeMillis() < deadline) {
            Response pollResp = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .header("Authorization", "Bearer " + testUserJwt())
                    .get("/api/v1/trades/orders/" + orderId);

            String status = pollResp.jsonPath().getString("status");
            if ("FILLED".equals(status) || "FAILED".equals(status) || "REJECTED".equals(status)) {
                assertThat(status)
                        .as("Order %s ended with: %s", orderId, pollResp.body().asString())
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
                .as("Order %s did not reach FILLED within timeout", orderId)
                .isEqualTo("FILLED");
    }

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

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
                .post("/api/v1/admin/assets/" + assetId + "/redeem");

        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

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
                .get("/api/v1/admin/assets/" + assetId + "/coupons");

        assertThat(response.statusCode()).isEqualTo(200);
        int totalElements = response.jsonPath().getInt("totalElements");
        assertThat(totalElements).isGreaterThan(0);
    }

    @Then("the bond should be in MATURED status")
    public void bondShouldBeMatured() {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId);

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
                .get("/api/v1/admin/assets/" + assetId);

        Number circulatingSupply = response.jsonPath().get("circulatingSupply");
        assertThat(circulatingSupply.intValue()).isEqualTo(0);
    }

    @Then("redemption records should exist for the bond")
    public void redemptionRecordsShouldExist() {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/v1/admin/assets/" + assetId + "/redemptions");

        assertThat(response.statusCode()).isEqualTo(200);
        int totalElements = response.jsonPath().getInt("totalElements");
        assertThat(totalElements).isGreaterThan(0);
    }

    // ---------------------------------------------------------------
    // BTA (Discount Bond) steps
    // ---------------------------------------------------------------

    @Given("an active discount bond asset {string} priced at {int} with supply {int}")
    public void activeDiscountBondAsset(String symbolRef, int faceValue, int supply) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "BTA " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("bondType", "DISCOUNT");
        request.put("dayCountConvention", "ACT_360");
        BigDecimal faceValueBD = new BigDecimal(faceValue);
        BigDecimal issuerPrice = faceValueBD.multiply(new BigDecimal("0.90")); // Issue at 90% of face value
        request.put("issuerPrice", issuerPrice);
        request.put("faceValue", faceValueBD);
        // LP sells below face value (discount) with their spread
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.04"))); // ask is higher than issue
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("1.02"))); // bid is lower than ask
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("issuerName", "Republique du Cameroun");
        request.put("issuerCountry", "CAMEROUN");
        request.put("issueDate", LocalDate.now().minusWeeks(4).toString());
        request.put("maturityDate", LocalDate.now().plusWeeks(52).toString());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create BTA %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        // Activate
        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);

        // Fund LP cash account to cover face-value redemption at maturity.
        // The LP buys BTA at discount but must pay full face value on redemption.
        Long lpCashAccountId = createResp.jsonPath().getLong("lpCashAccountId");
        if (lpCashAccountId != null) {
            fineractTestClient.depositToSavingsAccount(lpCashAccountId,
                    issuerPrice.multiply(new BigDecimal(supply)));
        }
    }

    @Given("the user holds {int} units of discount bond {string}")
    public void userHoldsDiscountBondUnits(int units, String symbolRef) {
        userHoldsBondUnits(units, symbolRef);
    }

    @When("the interest payment scheduler runs for {string}")
    public void interestPaymentSchedulerRunsFor(String symbolRef) {
        // Set the bond's nextCouponDate to today so the scheduler picks it up (if it's a coupon bond)
        String assetId = context.getId("lastAssetId");
        jdbcTemplate.update(
                "UPDATE assets SET next_coupon_date = ? WHERE id = ? AND next_coupon_date IS NOT NULL",
                java.sql.Date.valueOf(LocalDate.now()), assetId);

        // Run the scheduler — for DISCOUNT bonds, nextCouponDate is NULL so the update above is a no-op
        interestPaymentScheduler.processCouponPayments();
    }

    @Then("no pending scheduled payments should exist for {string}")
    public void noPendingScheduledPayments(String symbolRef) {
        String assetId = context.getId("lastAssetId");
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM scheduled_payments WHERE asset_id = ? AND status = 'PENDING'",
                Integer.class, assetId);
        assertThat(count).isEqualTo(0);
    }

    @Then("the accrued interest for the user on {string} should be {int}")
    public void accruedInterestShouldBe(String symbolRef, int expected) {
        String assetId = context.getId("lastAssetId");
        BigDecimal accrued = jdbcTemplate.queryForObject(
                "SELECT COALESCE(accrued_interest, 0) FROM user_positions WHERE asset_id = ? AND user_id = ?",
                BigDecimal.class, assetId, FineractInitializer.getTestUserClientId());
        assertThat(accrued.intValue()).isEqualTo(expected);
    }

    @Then("the user's XAF balance should have increased by approximately {int}")
    public void xafBalanceShouldHaveIncreasedByApprox(int expectedIncrease) {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        BigDecimal actualIncrease = balanceAfter.subtract(balanceBefore);
        // Allow 10% tolerance for fees
        BigDecimal expectedBD = new BigDecimal(expectedIncrease);
        assertThat(actualIncrease).isGreaterThan(expectedBD.multiply(new BigDecimal("0.90")));
    }

    // ---------------------------------------------------------------
    // OTA (Coupon Bond with Accrued Interest) steps
    // ---------------------------------------------------------------

    @Given("an active coupon bond asset {string} priced at {int} with supply {int} and interest rate {double} and coupon due in {int} months")
    public void activeCouponBondWithAccruedInterest(String symbolRef, int price, int supply, double interestRate, int couponDueMonths) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "OTA " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("bondType", "COUPON");
        request.put("dayCountConvention", "ACT_365");
        BigDecimal issuerPrice = new BigDecimal(price);
        request.put("issuerPrice", issuerPrice);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("issuerName", "Republique du Cameroun");
        request.put("issuerCountry", "CAMEROUN");
        request.put("interestRate", interestRate);
        request.put("couponFrequencyMonths", 12);
        request.put("maturityDate", LocalDate.now().plusYears(5).toString());
        // Set next coupon in the future — means last coupon was 12-couponDueMonths ago
        // This creates accrued interest from the last coupon to now
        request.put("nextCouponDate", LocalDate.now().plusMonths(couponDueMonths).toString());

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create OTA %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        // Activate
        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("the user holds {int} units of coupon bond {string}")
    public void userHoldsCouponBondUnits(int units, String symbolRef) {
        userHoldsBondUnits(units, symbolRef);
    }

    // ---------------------------------------------------------------
    // IRCM taxable bond steps
    // ---------------------------------------------------------------

    @Given("an active taxable coupon bond {string} priced at {int} with supply {int} and interest rate {double} and IRCM rate {double}")
    public void activeTaxableCouponBond(String symbolRef, int price, int supply, double interestRate, double ircmRate) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("bondType", "COUPON");
        request.put("dayCountConvention", "ACT_365");
        BigDecimal issuerPrice = new BigDecimal(price);
        request.put("issuerPrice", issuerPrice);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("issuerName", "E2E Corporate Issuer");
        request.put("issuerCountry", "CAMEROUN");
        request.put("interestRate", interestRate);
        request.put("couponFrequencyMonths", 12);
        request.put("maturityDate", LocalDate.now().plusYears(5).toString());
        request.put("nextCouponDate", LocalDate.now().toString());
        // IRCM fields
        request.put("ircmEnabled", true);
        request.put("ircmRateOverride", ircmRate / 100.0); // store as decimal (e.g. 0.165)
        request.put("isGovernmentBond", false);
        request.put("tvaEnabled", false);
        request.put("registrationDutyEnabled", false);

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create taxable bond %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("an active government bond {string} priced at {int} with supply {int} and interest rate {double}")
    public void activeGovernmentBond(String symbolRef, int price, int supply, double interestRate) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("bondType", "COUPON");
        request.put("dayCountConvention", "ACT_365");
        BigDecimal issuerPrice = new BigDecimal(price);
        request.put("issuerPrice", issuerPrice);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("issuerName", "Republique du Cameroun");
        request.put("issuerCountry", "CAMEROUN");
        request.put("interestRate", interestRate);
        request.put("couponFrequencyMonths", 12);
        request.put("maturityDate", LocalDate.now().plusYears(5).toString());
        request.put("nextCouponDate", LocalDate.now().toString());
        // Government bond — IRCM exempt
        request.put("isGovernmentBond", true);
        request.put("ircmEnabled", false);
        request.put("tvaEnabled", false);
        request.put("registrationDutyEnabled", false);

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create government bond %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("an active BVMAC-listed bond {string} priced at {int} with supply {int} and interest rate {double}")
    public void activeBvmacListedBond(String symbolRef, int price, int supply, double interestRate) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("bondType", "COUPON");
        request.put("dayCountConvention", "ACT_365");
        BigDecimal issuerPrice = new BigDecimal(price);
        request.put("issuerPrice", issuerPrice);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.10")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("0.95")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("issuerName", "Société Cotée BVMAC");
        request.put("issuerCountry", "CAMEROUN");
        request.put("interestRate", interestRate);
        request.put("couponFrequencyMonths", 12);
        request.put("maturityDate", LocalDate.now().plusYears(5).toString());
        request.put("nextCouponDate", LocalDate.now().toString());
        request.put("isBvmacListed", true);
        request.put("ircmEnabled", true);
        request.put("isGovernmentBond", false);
        request.put("tvaEnabled", false);
        request.put("registrationDutyEnabled", false);

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create BVMAC bond %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");

        assertThat(activateResp.statusCode()).isEqualTo(200);
    }

    @Given("an active taxable discount bond {string} priced at {int} with face value {int} and supply {int}")
    public void activeTaxableDiscountBond(String symbolRef, int issuerPriceInt, int faceValueInt, int supply) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "BTA " + symbolRef);
        request.put("symbol", symbolRef);
        request.put("currencyCode", symbolRef);
        request.put("category", "BONDS");
        request.put("bondType", "DISCOUNT");
        request.put("dayCountConvention", "ACT_360");
        BigDecimal issuerPrice = new BigDecimal(issuerPriceInt);
        BigDecimal faceValue = new BigDecimal(faceValueInt);
        request.put("issuerPrice", issuerPrice);
        request.put("faceValue", faceValue);
        request.put("lpAskPrice", issuerPrice.multiply(new BigDecimal("1.04")));
        request.put("lpBidPrice", issuerPrice.multiply(new BigDecimal("1.02")));
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("lpClientId", FineractInitializer.getLpClientId());
        request.put("issuerName", "Republique du Cameroun");
        request.put("issuerCountry", "CAMEROUN");
        request.put("issueDate", LocalDate.now().minusWeeks(4).toString());
        request.put("maturityDate", LocalDate.now().plusWeeks(52).toString());
        request.put("ircmEnabled", true);
        request.put("isGovernmentBond", false);
        request.put("tvaEnabled", false);
        request.put("registrationDutyEnabled", false);

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/v1/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create taxable BTA %s: %s", symbolRef, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbolRef);

        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/v1/admin/assets/" + assetId + "/activate");
        assertThat(activateResp.statusCode()).isEqualTo(200);

        Long lpCashAccountId = createResp.jsonPath().getLong("lpCashAccountId");
        if (lpCashAccountId != null) {
            fineractTestClient.depositToSavingsAccount(lpCashAccountId,
                    faceValue.multiply(new BigDecimal(supply)));
        }
    }

    @Then("the user's XAF balance should have increased by less than {int}")
    public void xafBalanceShouldHaveIncreasedByLessThan(int maxIncrease) {
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal balanceAfter = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        BigDecimal actualIncrease = balanceAfter.subtract(balanceBefore);
        assertThat(actualIncrease).isGreaterThan(BigDecimal.ZERO);
        assertThat(actualIncrease).isLessThan(new BigDecimal(maxIncrease));
    }

    @Then("the quote response should contain {string}")
    public void quoteResponseShouldContain(String fieldName) {
        String body = context.getBody();
        assertThat(body).contains(fieldName);
    }

    @Then("the accrued interest in the quote should be greater than {int}")
    public void accruedInterestInQuoteShouldBeGreaterThan(int threshold) {
        Number accruedInterest = context.jsonPath("accruedInterestAmount");
        assertThat(accruedInterest).isNotNull();
        assertThat(accruedInterest.doubleValue()).isGreaterThan(threshold);
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
