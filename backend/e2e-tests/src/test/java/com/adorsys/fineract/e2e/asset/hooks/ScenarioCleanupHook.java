package com.adorsys.fineract.e2e.asset.hooks;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import io.cucumber.java.Before;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Map;

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

    @LocalServerPort
    private int port;

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

        // Register the LP in the asset-service if not already present.
        // liquidity_providers is intentionally not wiped above (LP accounts live in Fineract
        // for the full test run), but we ensure the row exists before any scenario tries to
        // create assets.
        Integer lpCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM liquidity_providers WHERE client_id = ?",
                Integer.class, FineractInitializer.getLpClientId());
        if (lpCount == null || lpCount == 0) {
            RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .contentType(ContentType.JSON)
                    .body(Map.of(
                            "lpClientId", FineractInitializer.getLpClientId(),
                            "lpClientName", "E2E LP"))
                    .post("/api/v1/admin/lp")
                    .then().statusCode(201);
        }
    }
}
