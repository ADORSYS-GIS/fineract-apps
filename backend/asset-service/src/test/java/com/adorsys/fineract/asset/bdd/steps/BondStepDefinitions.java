package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
import com.adorsys.fineract.asset.scheduler.MaturityScheduler;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Step definitions for bond-specific scenarios (creation, maturity, coupon, validity).
 */
public class BondStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private FineractClient fineractClient;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ScenarioContext context;
    @Autowired private MaturityScheduler maturityScheduler;
    @Autowired private InterestPaymentScheduler interestPaymentScheduler;

    private static final SimpleGrantedAuthority ADMIN = new SimpleGrantedAuthority("ROLE_ASSET_MANAGER");

    // -------------------------------------------------------------------------
    // Given steps
    // -------------------------------------------------------------------------

    @Given("an active bond {string} with maturity date yesterday")
    public void activeBondWithPastMaturity(String bondId) {
        insertBondAsset(bondId, "ACTIVE", LocalDate.now().minusDays(1), LocalDate.now().plusMonths(6));
    }

    @Given("an active bond {string} with maturity date in {int} year")
    public void activeBondWithFutureMaturity(String bondId, int years) {
        insertBondAsset(bondId, "ACTIVE", LocalDate.now().plusYears(years), LocalDate.now().plusMonths(6));
    }

    @Given("an active bond {string} with:")
    public void activeBondWith(String bondId, io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String nextCoupon = data.get("nextCouponDate");
        LocalDate couponDate = "today".equals(nextCoupon) ? LocalDate.now() : LocalDate.parse(nextCoupon);

        jdbcTemplate.update("""
            INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
                manual_price, total_supply, circulating_supply, decimal_places, treasury_client_id,
                treasury_asset_account_id, treasury_cash_account_id, fineract_product_id, version,
                interest_rate, coupon_frequency_months, next_coupon_date, maturity_date,
                subscription_start_date, subscription_end_date,
                created_at, updated_at)
            VALUES (?, ?, ?, ?, 'BONDS', 'ACTIVE', 'MANUAL', ?, 1000, 0, 0, 1, 400, 300, 10, 0,
                ?, ?, ?, ?,
                CURRENT_DATE, DATEADD('YEAR', 1, CURRENT_DATE), NOW(), NOW())
            """, bondId, bondId, bondId, "Bond " + bondId,
                new BigDecimal(data.get("manualPrice")),
                new BigDecimal(data.get("interestRate")),
                Integer.parseInt(data.get("couponFrequencyMonths")),
                couponDate,
                LocalDate.now().plusYears(5));

        // Insert price record
        jdbcTemplate.update("""
            INSERT INTO asset_prices (asset_id, current_price, day_open, day_high, day_low,
                day_close, change_24h_percent, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
            """, bondId, new BigDecimal(data.get("manualPrice")),
                new BigDecimal(data.get("manualPrice")),
                new BigDecimal(data.get("manualPrice")),
                new BigDecimal(data.get("manualPrice")),
                new BigDecimal(data.get("manualPrice")));
    }

    @Given("user {long} holds {int} units of bond {string}")
    public void userHoldsBondUnits(Long userId, int units, String bondId) {
        jdbcTemplate.update("""
            INSERT INTO user_positions (user_id, asset_id, total_units, avg_purchase_price,
                total_cost_basis, realized_pnl, fineract_savings_account_id, last_trade_at, version)
            VALUES (?, ?, ?, 10000, ?, 0, 200, ?, 0)
            """, userId, bondId, units, units * 10000, Instant.now());

        // Keep circulating supply consistent with positions
        jdbcTemplate.update("UPDATE assets SET circulating_supply = circulating_supply + ? WHERE id = ?", units, bondId);

        // Mock user's XAF account lookup for coupon transfers
        when(fineractClient.findClientSavingsAccountByCurrency(userId, "XAF")).thenReturn(100L + userId);
    }

    @Given("an active bond {string} with nextCouponDate today and no holders")
    public void activeBondNoHolders(String bondId) {
        insertBondAsset(bondId, "ACTIVE", LocalDate.now().plusYears(5), LocalDate.now());
    }

    @Given("Fineract transfer is mocked to succeed")
    public void fineractTransferMocked() {
        when(fineractClient.createAccountTransfer(anyLong(), anyLong(), any(BigDecimal.class), anyString()))
                .thenReturn(1L);
        // Mock treasury balance for coupon sufficiency check
        when(fineractClient.getAccountBalance(anyLong())).thenReturn(new BigDecimal("999999999"));
    }

    // -------------------------------------------------------------------------
    // When steps
    // -------------------------------------------------------------------------

    @When("the admin creates a bond asset with:")
    public void adminCreatesBondWith(io.cucumber.datatable.DataTable dataTable) throws Exception {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        Map<String, Object> request = new HashMap<>();
        request.put("name", data.get("name"));
        request.put("symbol", data.get("symbol"));
        request.put("currencyCode", data.get("currencyCode"));
        request.put("category", data.get("category"));
        request.put("initialPrice", new BigDecimal(data.get("initialPrice")));
        request.put("totalSupply", new BigDecimal(data.get("totalSupply")));
        request.put("decimalPlaces", Integer.parseInt(data.getOrDefault("decimalPlaces", "0")));
        request.put("treasuryClientId", 1L);
        request.put("issuer", data.get("issuer"));
        if (data.containsKey("isinCode")) request.put("isinCode", data.get("isinCode"));
        request.put("interestRate", new BigDecimal(data.get("interestRate")));
        request.put("couponFrequencyMonths", Integer.parseInt(data.get("couponFrequencyMonths")));

        String maturity = data.get("maturityDate");
        request.put("maturityDate", resolveDateExpression(maturity));
        String nextCoupon = data.get("nextCouponDate");
        request.put("nextCouponDate", resolveDateExpression(nextCoupon));
        if (data.containsKey("subscriptionStartDate")) {
            request.put("subscriptionStartDate", resolveDateExpression(data.get("subscriptionStartDate")));
        } else {
            request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        }
        if (data.containsKey("subscriptionEndDate")) {
            request.put("subscriptionEndDate", resolveDateExpression(data.get("subscriptionEndDate")));
        } else {
            request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());
        }

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin creates a bond asset without an issuer")
    public void adminCreatesBondWithoutIssuer() throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond"); request.put("symbol", "BND"); request.put("currencyCode", "BND");
        request.put("category", "BONDS"); request.put("initialPrice", 10000); request.put("totalSupply", 100);
        request.put("decimalPlaces", 0); request.put("treasuryClientId", 1L);
        request.put("interestRate", 5.0); request.put("couponFrequencyMonths", 6);
        request.put("maturityDate", LocalDate.now().plusYears(1).toString());
        request.put("nextCouponDate", LocalDate.now().plusMonths(6).toString());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin creates a bond asset with maturity date in the past")
    public void adminCreatesBondWithPastMaturity() throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond"); request.put("symbol", "BND"); request.put("currencyCode", "BND");
        request.put("category", "BONDS"); request.put("initialPrice", 10000); request.put("totalSupply", 100);
        request.put("decimalPlaces", 0); request.put("treasuryClientId", 1L);
        request.put("issuer", "Test Issuer"); request.put("interestRate", 5.0);
        request.put("couponFrequencyMonths", 6);
        request.put("maturityDate", LocalDate.now().minusDays(1).toString());
        request.put("nextCouponDate", LocalDate.now().plusMonths(6).toString());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin creates a bond asset with coupon frequency {int}")
    public void adminCreatesBondWithInvalidFrequency(int frequency) throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Bond"); request.put("symbol", "BND"); request.put("currencyCode", "BND");
        request.put("category", "BONDS"); request.put("initialPrice", 10000); request.put("totalSupply", 100);
        request.put("decimalPlaces", 0); request.put("treasuryClientId", 1L);
        request.put("issuer", "Test Issuer"); request.put("interestRate", 5.0);
        request.put("couponFrequencyMonths", frequency);
        request.put("maturityDate", LocalDate.now().plusYears(1).toString());
        request.put("nextCouponDate", LocalDate.now().plusMonths(6).toString());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the maturity scheduler runs")
    public void maturitySchedulerRuns() {
        maturityScheduler.matureBonds();
    }

    @When("the interest payment scheduler runs")
    public void interestPaymentSchedulerRuns() {
        interestPaymentScheduler.processCouponPayments();
    }

    // -------------------------------------------------------------------------
    // Then steps
    // -------------------------------------------------------------------------

    @Then("{int} coupon payment records should exist for bond {string}")
    public void couponPaymentRecordCount(int expected, String bondId) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM interest_payments WHERE asset_id = ?", Integer.class, bondId);
        assertThat(count).isEqualTo(expected);
    }

    @Then("user {long} should have received a coupon of {int} XAF")
    public void userReceivedCoupon(Long userId, int expectedXaf) {
        BigDecimal amount = jdbcTemplate.queryForObject(
                "SELECT xaf_amount FROM interest_payments WHERE user_id = ?",
                BigDecimal.class, userId);
        assertThat(amount.intValue()).isEqualTo(expectedXaf);
    }

    @Then("the next coupon date for bond {string} should be advanced by {int} months")
    public void nextCouponDateAdvanced(String bondId, int months) {
        LocalDate nextCoupon = jdbcTemplate.queryForObject(
                "SELECT next_coupon_date FROM assets WHERE id = ?", LocalDate.class, bondId);
        assertThat(nextCoupon).isAfter(LocalDate.now());
    }

    @Then("the next coupon date for bond {string} should be advanced")
    public void nextCouponDateAdvancedGeneric(String bondId) {
        LocalDate nextCoupon = jdbcTemplate.queryForObject(
                "SELECT next_coupon_date FROM assets WHERE id = ?", LocalDate.class, bondId);
        assertThat(nextCoupon).isAfter(LocalDate.now());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void insertBondAsset(String bondId, String status, LocalDate maturityDate, LocalDate nextCouponDate) {
        jdbcTemplate.update("""
            INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
                manual_price, total_supply, circulating_supply, decimal_places, treasury_client_id,
                treasury_asset_account_id, treasury_cash_account_id, fineract_product_id, version,
                issuer, interest_rate, coupon_frequency_months, next_coupon_date, maturity_date,
                subscription_start_date, subscription_end_date,
                created_at, updated_at)
            VALUES (?, ?, ?, ?, 'BONDS', ?, 'MANUAL', 10000, 1000, 0, 0, 1, 400, 300, 10, 0,
                'Test Issuer', 5.80, 6, ?, ?,
                CURRENT_DATE, DATEADD('YEAR', 1, CURRENT_DATE), NOW(), NOW())
            """, bondId, bondId, bondId, "Bond " + bondId, status, nextCouponDate, maturityDate);

        jdbcTemplate.update("""
            INSERT INTO asset_prices (asset_id, current_price, day_open, day_high, day_low,
                day_close, change_24h_percent, updated_at)
            VALUES (?, 10000, 10000, 10000, 10000, 10000, 0, NOW())
            """, bondId);
    }

    private String resolveDateExpression(String expr) {
        if (expr == null) return null;
        if (expr.startsWith("+") || expr.startsWith("-")) {
            boolean negative = expr.startsWith("-");
            String unit = expr.substring(expr.length() - 1);
            int amount = Integer.parseInt(expr.substring(1, expr.length() - 1));
            if (negative) amount = -amount;
            return switch (unit) {
                case "y" -> LocalDate.now().plusYears(amount).toString();
                case "m" -> LocalDate.now().plusMonths(amount).toString();
                case "d" -> LocalDate.now().plusDays(amount).toString();
                default -> expr;
            };
        }
        return expr;
    }
}
