package com.adorsys.fineract.e2e.asset.hooks;

import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Per-scenario cleanup hook. Truncates asset-service tables before each scenario
 * to ensure test isolation.
 *
 * <p>Fineract state is NOT cleaned up between scenarios — instead, each scenario
 * uses unique currency codes/symbols (via ScenarioContext.scenarioSuffix) to
 * prevent collisions.
 */
public class ScenarioCleanupHook {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before(order = 0)
    public void cleanAssetServiceDatabase() {
        // Delete in FK-safe order (children first)
        jdbcTemplate.execute("DELETE FROM principal_redemptions");
        jdbcTemplate.execute("DELETE FROM interest_payments");
        jdbcTemplate.execute("DELETE FROM portfolio_snapshots");
        jdbcTemplate.execute("DELETE FROM price_history");
        jdbcTemplate.execute("DELETE FROM trade_log");
        jdbcTemplate.execute("DELETE FROM orders");
        jdbcTemplate.execute("DELETE FROM user_positions");
        jdbcTemplate.execute("DELETE FROM user_favorites");
        jdbcTemplate.execute("DELETE FROM asset_prices");
        jdbcTemplate.execute("DELETE FROM assets");
    }
}
