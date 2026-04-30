package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.adorsys.fineract.asset.client.FineractClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Step definitions for order management: min order size, cancellation, LP adequacy.
 */
public class OrderManagementStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private FineractClient fineractClient;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ScenarioContext context;

    private static final String EXTERNAL_ID = "bdd-user-ext-123";
    private static final Long USER_ID = 42L;

    // -------------------------------------------------------------------------
    // Min Order Size
    // -------------------------------------------------------------------------

    @Given("asset {string} has a minimum order size of {int} units")
    public void assetHasMinOrderSize(String assetId, int minSize) {
        jdbcTemplate.update("UPDATE assets SET min_order_size = ? WHERE id = ?", minSize, assetId);
    }

    @Given("asset {string} has a minimum order cash amount of {long} XAF")
    public void assetHasMinOrderCashAmount(String assetId, long minCash) {
        jdbcTemplate.update("UPDATE assets SET min_order_cash_amount = ? WHERE id = ?", minCash, assetId);
    }

    // -------------------------------------------------------------------------
    // Order Cancellation
    // -------------------------------------------------------------------------

    @Given("a {word} order exists for user {long} on asset {string}")
    public void orderExistsForUser(String status, Long userId, String assetId) {
        String orderId = UUID.randomUUID().toString();
        context.storeId("targetOrderId", orderId);

        jdbcTemplate.update("""
            INSERT INTO orders (id, asset_id, user_id, user_external_id, side, units,
                execution_price, cash_amount, fee, spread_amount, status,
                idempotency_key, created_at, updated_at, version)
            VALUES (?, ?, ?, ?, 'BUY', 10, 100, 1000, 5, 0, ?, ?, ?, ?, 0)
            """,
            orderId, assetId, userId, "user-ext-" + userId,
            status, UUID.randomUUID().toString(), Instant.now(), Instant.now());
    }

    @When("the user cancels the order")
    public void userCancelsOrder() throws Exception {
        String orderId = context.getId("targetOrderId");
        MvcResult result = mockMvc.perform(post("/trades/orders/" + orderId + "/cancel")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON))
                .andReturn();
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // LP Adequacy
    // -------------------------------------------------------------------------

    @Given("the LP cash account for asset {string} has balance {string}")
    public void lpCashAccountHasBalance(String assetId, String balance) {
        // Get the LP client ID from the asset, then look up the LP's cash account
        Long lpClientId = jdbcTemplate.queryForObject(
                "SELECT lp_client_id FROM assets WHERE id = ?",
                Long.class, assetId);
        Long lpCashAccountId = jdbcTemplate.queryForObject(
                "SELECT cash_account_id FROM liquidity_providers WHERE client_id = ?",
                Long.class, lpClientId);

        // Mock the Fineract balance check to return this balance
        when(fineractClient.getAccountBalance(lpCashAccountId))
                .thenReturn(new BigDecimal(balance));
    }
}
