package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.adorsys.fineract.asset.client.FineractClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Step definitions for trading scenarios (buy, sell, preview, idempotency).
 */
public class TradingStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private FineractClient fineractClient;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ScenarioContext context;

    private static final String EXTERNAL_ID = "bdd-user-ext-123";
    private static final Long USER_ID = 42L;

    // -------------------------------------------------------------------------
    // Given steps
    // -------------------------------------------------------------------------

    @Given("Fineract resolves user {string} with client ID {long} and XAF balance {string}")
    public void fineractResolvesUser(String externalId, Long clientId, String balance) {
        when(fineractClient.getClientByExternalId(externalId))
                .thenReturn(Map.of("id", clientId));
        when(fineractClient.findClientSavingsAccountByCurrency(clientId, "XAF"))
                .thenReturn(100L);
        when(fineractClient.getAccountBalance(100L))
                .thenReturn(new BigDecimal(balance));
    }

    @Given("Fineract batch transfers succeed")
    public void fineractBatchTransfersSucceed() {
        when(fineractClient.executeBatchTransfers(anyList())).thenReturn(List.of());
    }

    @Given("user {long} holds {int} units of asset {string} at average price {int}")
    public void userHoldsUnits(Long userId, int units, String assetId, int avgPrice) {
        // Ensure an asset savings account exists for the user
        when(fineractClient.provisionSavingsAccount(anyLong(), anyInt(), any(), anyLong()))
                .thenReturn(200L);

        jdbcTemplate.update("""
            INSERT INTO user_positions (user_id, asset_id, total_units, avg_purchase_price,
                total_cost_basis, realized_pnl, fineract_savings_account_id, last_trade_at, version)
            VALUES (?, ?, ?, ?, ?, 0, 200, ?, 0)
            """, userId, assetId, units, avgPrice, units * avgPrice, Instant.now());

        // Keep circulating supply consistent with positions
        jdbcTemplate.update("UPDATE assets SET circulating_supply = circulating_supply + ? WHERE id = ?", units, assetId);
    }

    @Given("the market is currently closed")
    public void marketIsClosed() {
        // In test profile market is 24/7, but we can't easily override the MarketHoursService
        // in integration context. This step is a placeholder — the market-hours feature
        // would need a more sophisticated mock setup or config override.
        // For now, mark scenarios using this as @wip
    }

    @Given("asset {string} has a validity date of yesterday")
    public void assetHasExpiredValidity(String assetId) {
        jdbcTemplate.update("UPDATE assets SET validity_date = DATEADD('DAY', -1, CURRENT_DATE) WHERE id = ?", assetId);
    }

    // -------------------------------------------------------------------------
    // When steps — Trading
    // -------------------------------------------------------------------------

    @When("the user submits a BUY order for {string} units of asset {string}")
    public void userSubmitsBuyOrder(String units, String assetId) throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();
        context.storeValue("idempotencyKey", idempotencyKey);

        Map<String, Object> body = Map.of("assetId", assetId, "units", new BigDecimal(units));
        MvcResult result = mockMvc.perform(post("/api/trades/buy")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user submits a SELL order for {string} units of asset {string}")
    public void userSubmitsSellOrder(String units, String assetId) throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();
        context.storeValue("idempotencyKey", idempotencyKey);

        Map<String, Object> body = Map.of("assetId", assetId, "units", new BigDecimal(units));
        MvcResult result = mockMvc.perform(post("/api/trades/sell")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user previews a {string} of {string} units of asset {string}")
    public void userPreviewsTrade(String side, String units, String assetId) throws Exception {
        Map<String, Object> body = Map.of(
                "assetId", assetId, "side", side, "units", new BigDecimal(units));
        MvcResult result = mockMvc.perform(post("/api/trades/preview")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user resubmits the same BUY order with the same idempotency key")
    public void userResubmitsSameBuyOrder() throws Exception {
        String idempotencyKey = context.getValue("idempotencyKey");
        Map<String, Object> body = Map.of("assetId", "asset-001", "units", new BigDecimal("5"));
        MvcResult result = mockMvc.perform(post("/api/trades/buy")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user submits a BUY order without an idempotency key for asset {string}")
    public void userSubmitsBuyWithoutIdempotencyKey(String assetId) throws Exception {
        Map<String, Object> body = Map.of("assetId", assetId, "units", new BigDecimal("5"));
        MvcResult result = mockMvc.perform(post("/api/trades/buy")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // Then steps
    // -------------------------------------------------------------------------

    @Then("the trade response should have status {string}")
    public void tradeResponseStatus(String expectedStatus) {
        String status = JsonPath.read(context.getLastResponseBody(), "$.status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @Then("the trade response side should be {string}")
    public void tradeResponseSide(String expectedSide) {
        String side = JsonPath.read(context.getLastResponseBody(), "$.side");
        assertThat(side).isEqualTo(expectedSide);
    }

    @Then("the trade response units should be {string}")
    public void tradeResponseUnits(String expectedUnits) {
        Number units = JsonPath.read(context.getLastResponseBody(), "$.units");
        assertThat(new BigDecimal(units.toString())).isEqualByComparingTo(new BigDecimal(expectedUnits));
    }

    @Then("the trade response should include a non-null orderId")
    public void tradeResponseHasOrderId() {
        String orderId = JsonPath.read(context.getLastResponseBody(), "$.orderId");
        assertThat(orderId).isNotNull().isNotBlank();
    }

    @Then("the trade response should include a positive fee")
    public void tradeResponseHasPositiveFee() {
        Number fee = JsonPath.read(context.getLastResponseBody(), "$.fee");
        assertThat(new BigDecimal(fee.toString())).isPositive();
    }

    @Then("the trade response should include realizedPnl")
    public void tradeResponseHasRealizedPnl() {
        Object pnl = JsonPath.read(context.getLastResponseBody(), "$.realizedPnl");
        assertThat(pnl).isNotNull();
    }

    @Then("the trade response orderId should match the original")
    public void tradeResponseOrderIdMatches() {
        String currentOrderId = JsonPath.read(context.getLastResponseBody(), "$.orderId");
        String originalOrderId = context.getId("lastOrderId");
        if (originalOrderId != null) {
            assertThat(currentOrderId).isEqualTo(originalOrderId);
        }
        // Store for next comparison
        context.storeId("lastOrderId", currentOrderId);
    }

    @Then("the preview should be feasible")
    public void previewIsFeasible() {
        Boolean feasible = JsonPath.read(context.getLastResponseBody(), "$.feasible");
        assertThat(feasible).isTrue();
    }

    @Then("the preview should not be feasible with blocker {string}")
    public void previewNotFeasibleWithBlocker(String blocker) {
        Boolean feasible = JsonPath.read(context.getLastResponseBody(), "$.feasible");
        assertThat(feasible).isFalse();
        List<String> blockers = JsonPath.read(context.getLastResponseBody(), "$.blockers");
        assertThat(blockers).contains(blocker);
    }

    @Then("the preview should include a positive executionPrice")
    public void previewHasPositiveExecutionPrice() {
        Number price = JsonPath.read(context.getLastResponseBody(), "$.executionPrice");
        assertThat(new BigDecimal(price.toString())).isPositive();
    }

    @Then("the preview should include a positive fee")
    public void previewHasPositiveFee() {
        Number fee = JsonPath.read(context.getLastResponseBody(), "$.fee");
        assertThat(new BigDecimal(fee.toString())).isPositive();
    }

    @Then("the preview should include a positive netAmount")
    public void previewHasPositiveNetAmount() {
        Number amount = JsonPath.read(context.getLastResponseBody(), "$.netAmount");
        assertThat(new BigDecimal(amount.toString())).isPositive();
    }
}
