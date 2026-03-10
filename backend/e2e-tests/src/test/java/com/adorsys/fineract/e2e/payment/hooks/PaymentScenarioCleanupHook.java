package com.adorsys.fineract.e2e.payment.hooks;

import com.adorsys.fineract.e2e.payment.support.WireMockProviderStubs;
import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Per-scenario cleanup hook for payment-gateway E2E tests.
 * Truncates payment-gateway tables and resets WireMock stubs before each scenario.
 */
public class PaymentScenarioCleanupHook {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Before(order = 0)
    public void cleanPaymentGatewayDatabase() {
        // Delete in FK-safe order
        jdbcTemplate.execute("DELETE FROM reversal_dead_letters");
        jdbcTemplate.execute("DELETE FROM payment_transactions");

        // Reset WireMock stubs for clean provider simulation
        WireMockProviderStubs.resetAll();
    }
}
