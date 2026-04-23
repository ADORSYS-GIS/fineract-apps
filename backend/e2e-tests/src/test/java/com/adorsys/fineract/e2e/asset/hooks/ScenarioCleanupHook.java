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
        // Delete in FK-safe order (children first).
        // Use TRUNCATE ... CASCADE for efficiency, falling back to DELETE for compatibility.
        String[] tables = {
            "notification_log", "notification_preferences", "audit_log",
            "scheduled_payments", "income_distributions", "principal_redemptions",
            "interest_payments", "portfolio_snapshots", "price_history",
            "purchase_lots", "trade_log", "orders", "user_positions",
            "user_favorites", "settlements",
            "asset_projections", "asset_prices", "assets"
        };
        for (String table : tables) {
            try {
                jdbcTemplate.execute("DELETE FROM " + table);
            } catch (Exception e) {
                // Table may not exist yet (migration not applied) — safe to skip
            }
        }
    }
}
