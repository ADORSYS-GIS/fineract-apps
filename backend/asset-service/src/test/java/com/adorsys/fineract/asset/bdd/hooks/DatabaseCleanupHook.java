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
        jdbcTemplate.execute("DELETE FROM interest_payments");
        jdbcTemplate.execute("DELETE FROM price_history");
        jdbcTemplate.execute("DELETE FROM trade_log");
        jdbcTemplate.execute("DELETE FROM orders");
        jdbcTemplate.execute("DELETE FROM user_positions");
        jdbcTemplate.execute("DELETE FROM user_favorites");
        jdbcTemplate.execute("DELETE FROM asset_prices");
        jdbcTemplate.execute("DELETE FROM assets");
    }
}
