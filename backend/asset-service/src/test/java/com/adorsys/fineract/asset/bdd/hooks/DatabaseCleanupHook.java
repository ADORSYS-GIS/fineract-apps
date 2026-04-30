package com.adorsys.fineract.asset.bdd.hooks;

import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Cleans the H2 database before each Cucumber scenario.
 * Deletes in FK-safe order to ensure scenario isolation.
 */
public class DatabaseCleanupHook {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before(order = 1)
    public void cleanDatabase() {
        jdbcTemplate.execute("DELETE FROM notification_log");
        jdbcTemplate.execute("DELETE FROM audit_log");
        jdbcTemplate.execute("DELETE FROM income_distributions");
        jdbcTemplate.execute("DELETE FROM reconciliation_reports");
        jdbcTemplate.execute("DELETE FROM interest_payments");
        jdbcTemplate.execute("DELETE FROM scheduled_payments");
        jdbcTemplate.execute("DELETE FROM price_history");
        jdbcTemplate.execute("DELETE FROM trade_log");
        jdbcTemplate.execute("DELETE FROM orders");
        jdbcTemplate.execute("DELETE FROM user_positions");
        jdbcTemplate.execute("DELETE FROM user_favorites");
        jdbcTemplate.execute("DELETE FROM asset_prices");
        jdbcTemplate.execute("DELETE FROM assets");
        jdbcTemplate.execute("DELETE FROM liquidity_providers");

        // Seed LP 1 so all scenarios that create assets via API or direct JDBC work
        jdbcTemplate.execute("""
            INSERT INTO liquidity_providers (client_id, client_name, cash_account_id, spread_account_id, tax_account_id, cash_account_no, spread_account_no, tax_account_no)
            VALUES (1, 'Test LP', 300, 350, 360, '000000300', '000000350', '000000360')
            """);
    }
}
