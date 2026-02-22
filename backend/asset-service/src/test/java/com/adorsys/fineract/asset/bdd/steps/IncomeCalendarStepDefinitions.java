package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 * Step definitions for portfolio income calendar scenarios.
 */
public class IncomeCalendarStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ScenarioContext context;

    private static final String EXTERNAL_ID = "bdd-user-ext-123";
    private static final Long USER_ID = 42L;

    // ── Given steps ──

    @Given("an active asset {string} with income distribution:")
    public void activeAssetWithIncomeDistribution(String assetId, io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        String nextDistStr = data.get("nextDistributionDate");
        LocalDate nextDist = nextDistStr.startsWith("+")
                ? LocalDate.now().plusMonths(Integer.parseInt(nextDistStr.replace("+", "").replace("m", "")))
                : LocalDate.parse(nextDistStr);
        BigDecimal price = new BigDecimal(data.get("price"));

        jdbcTemplate.update("""
            INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
                manual_price, total_supply, circulating_supply, decimal_places, treasury_client_id,
                treasury_asset_account_id, treasury_cash_account_id, fineract_product_id,
                income_type, income_rate, distribution_frequency_months, next_distribution_date,
                subscription_start_date, subscription_end_date, version, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'REAL_ESTATE', 'ACTIVE', 'MANUAL', ?, 1000, 0, 0, 1, 400, 300, NULL,
                ?, ?, ?, ?,
                CURRENT_DATE, DATEADD('YEAR', 1, CURRENT_DATE), 0, NOW(), NOW())
            """, assetId, assetId, assetId, "Income " + assetId, price,
                data.get("incomeType"),
                new BigDecimal(data.get("incomeRate")),
                Integer.parseInt(data.get("distributionFrequencyMonths")),
                nextDist);

        jdbcTemplate.update("""
            INSERT INTO asset_prices (asset_id, current_price, day_open, day_high, day_low,
                day_close, change_24h_percent, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 0, NOW())
            """, assetId, price, price, price, price, price);
    }

    // "user {long} holds {int} units of bond {string}" is in BondStepDefinitions

    @Given("user {long} holds {int} units of asset {string}")
    public void userHoldsAssetUnits(Long userId, int units, String assetId) {
        insertPosition(userId, assetId, units);
    }

    // ── When steps ──

    @When("the user requests the income calendar for {int} months")
    public void userRequestsIncomeCalendar(int months) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/portfolio/income-calendar")
                        .param("months", String.valueOf(months))
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID))))
                .andReturn();
        context.setLastResult(result);
    }

    // ── Then steps ──

    @Then("the income calendar should have {int} events")
    public void incomeCalendarHasNEvents(int expected) {
        List<?> events = JsonPath.read(context.getLastResponseBody(), "$.events");
        assertThat(events).hasSize(expected);
    }

    @Then("the income calendar totalExpectedIncome should be {int}")
    public void incomeCalendarTotalIs(int expected) {
        Number total = JsonPath.read(context.getLastResponseBody(), "$.totalExpectedIncome");
        assertThat(total.intValue()).isEqualTo(expected);
    }

    @Then("the income calendar totalExpectedIncome should be positive")
    public void incomeCalendarTotalIsPositive() {
        Number total = JsonPath.read(context.getLastResponseBody(), "$.totalExpectedIncome");
        assertThat(total.doubleValue()).isPositive();
    }

    @Then("the income calendar should contain events of type {string}")
    public void incomeCalendarContainsType(String type) {
        List<?> matches = JsonPath.read(context.getLastResponseBody(),
                "$.events[?(@.incomeType=='" + type + "')]");
        assertThat(matches).isNotEmpty();
    }

    private void insertPosition(Long userId, String assetId, int units) {
        jdbcTemplate.update("""
            INSERT INTO user_positions (user_id, asset_id, total_units, avg_purchase_price,
                total_cost_basis, realized_pnl, fineract_savings_account_id, last_trade_at, version)
            VALUES (?, ?, ?, 100, ?, 0, 200, ?, 0)
            """, userId, assetId, units, units * 100, Instant.now());
    }
}
