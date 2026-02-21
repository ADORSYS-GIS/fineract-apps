package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 * Step definitions for admin dashboard summary scenarios.
 */
public class DashboardStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ScenarioContext context;

    private static final SimpleGrantedAuthority ADMIN = new SimpleGrantedAuthority("ROLE_ASSET_MANAGER");

    @When("the admin requests the dashboard summary")
    public void adminRequestsDashboardSummary() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/dashboard/summary")
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    @Given("{int} trades executed within the last 24 hours")
    public void tradesExecutedWithinLast24Hours(int count) {
        for (int i = 0; i < count; i++) {
            String orderId = UUID.randomUUID().toString();
            long userId = 100L + i;
            // Insert the parent order first (trade_log.order_id FK references orders)
            jdbcTemplate.update("""
                INSERT INTO orders (id, user_id, user_external_id, asset_id, side, cash_amount,
                    units, status, idempotency_key, created_at, version)
                VALUES (?, ?, ?, 'asset-001', 'BUY', 1000, 10, 'FILLED', ?, NOW(), 0)
                """, orderId, userId, "ext-" + userId, UUID.randomUUID().toString());
            jdbcTemplate.update("""
                INSERT INTO trade_log (id, order_id, user_id, asset_id, side, units, price_per_unit,
                    total_amount, fee, spread_amount, executed_at)
                VALUES (?, ?, ?, 'asset-001', 'BUY', 10, 100, 1000, 5, 0, ?)
                """, UUID.randomUUID().toString(), orderId, userId, Instant.now());
        }
    }

    @Given("{int} distinct users hold positions")
    public void distinctUsersHoldPositions(int count) {
        for (int i = 0; i < count; i++) {
            long userId = 200L + i;
            jdbcTemplate.update("""
                INSERT INTO user_positions (user_id, asset_id, total_units, avg_purchase_price,
                    total_cost_basis, realized_pnl, fineract_savings_account_id, last_trade_at, version)
                VALUES (?, 'asset-001', 10, 100, 1000, 0, ?, ?, 0)
                """, userId, 500L + i, Instant.now());
        }
    }

    @Given("an order with status {string} exists")
    public void orderWithStatusExists(String status) {
        jdbcTemplate.update("""
            INSERT INTO orders (id, user_id, user_external_id, asset_id, side, cash_amount,
                units, status, idempotency_key, created_at, updated_at, version)
            VALUES (?, 1, 'ext-1', 'asset-001', 'BUY', 1000, 10, ?, ?, NOW(), NOW(), 0)
            """, UUID.randomUUID().toString(), status, UUID.randomUUID().toString());
    }
}
