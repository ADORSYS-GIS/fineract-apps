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
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

/**
 * Step definitions for trading scenarios (quote-based flow).
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
        // LP cash balance check (for SELL trades — checkBalanceInsideLock)
        when(fineractClient.getAccountBalance(anyLong()))
                .thenReturn(new BigDecimal("999999999"));
        // Override with specific user balance (Mockito: last-wins for specific matchers)
        when(fineractClient.getAccountBalance(100L))
                .thenReturn(new BigDecimal(balance));
    }

    @Given("Fineract batch transfers succeed")
    public void fineractBatchTransfersSucceed() {
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of());
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

    @Given("asset {string} has a subscription end date of yesterday")
    public void assetHasExpiredSubscription(String assetId) {
        jdbcTemplate.update("UPDATE assets SET subscription_end_date = DATEADD('DAY', -1, CURRENT_DATE) WHERE id = ?", assetId);
    }

    @Given("asset {string} has a subscription start date in the future")
    public void assetHasFutureSubscriptionStart(String assetId) {
        jdbcTemplate.update("UPDATE assets SET subscription_start_date = DATEADD('DAY', 1, CURRENT_DATE) WHERE id = ?", assetId);
    }

    // -------------------------------------------------------------------------
    // When steps — Quote-based trading flow
    // -------------------------------------------------------------------------

    @When("the user creates a BUY quote for {string} units of asset {string}")
    public void userCreatesBuyQuote(String units, String assetId) throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();
        context.storeValue("idempotencyKey", idempotencyKey);

        Map<String, Object> body = Map.of(
                "assetId", assetId, "side", "BUY", "units", new BigDecimal(units));
        MvcResult result = mockMvc.perform(post("/trades/quote")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);

        // Store orderId for confirm step
        if (result.getResponse().getStatus() == 201) {
            String orderId = JsonPath.read(result.getResponse().getContentAsString(), "$.orderId");
            context.storeValue("lastOrderId", orderId);
        }
    }

    @When("the user creates a SELL quote for {string} units of asset {string}")
    public void userCreatesSellQuote(String units, String assetId) throws Exception {
        String idempotencyKey = UUID.randomUUID().toString();
        context.storeValue("idempotencyKey", idempotencyKey);

        Map<String, Object> body = Map.of(
                "assetId", assetId, "side", "SELL", "units", new BigDecimal(units));
        MvcResult result = mockMvc.perform(post("/trades/quote")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);

        // Store orderId for confirm step
        if (result.getResponse().getStatus() == 201) {
            String orderId = JsonPath.read(result.getResponse().getContentAsString(), "$.orderId");
            context.storeValue("lastOrderId", orderId);
        }
    }

    @When("the user confirms the quoted order")
    public void userConfirmsQuotedOrder() throws Exception {
        String orderId = context.getValue("lastOrderId");
        MvcResult result = mockMvc.perform(post("/trades/orders/" + orderId + "/confirm")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID))))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user resubmits the same quote with the same idempotency key")
    public void userResubmitsSameQuote() throws Exception {
        String idempotencyKey = context.getValue("idempotencyKey");
        Map<String, Object> body = Map.of(
                "assetId", "asset-001", "side", "BUY", "units", new BigDecimal("5"));
        MvcResult result = mockMvc.perform(post("/trades/quote")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", idempotencyKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user creates a BUY quote without an idempotency key for asset {string}")
    public void userCreatesQuoteWithoutIdempotencyKey(String assetId) throws Exception {
        Map<String, Object> body = Map.of(
                "assetId", assetId, "side", "BUY", "units", new BigDecimal("5"));
        MvcResult result = mockMvc.perform(post("/trades/quote")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andReturn();
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // Then steps — Quote response
    // -------------------------------------------------------------------------

    @Then("the quote response should have status {string}")
    public void quoteResponseStatus(String expectedStatus) {
        String status = JsonPath.read(context.getLastResponseBody(), "$.status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @Then("the quote response side should be {string}")
    public void quoteResponseSide(String expectedSide) {
        String side = JsonPath.read(context.getLastResponseBody(), "$.side");
        assertThat(side).isEqualTo(expectedSide);
    }

    @Then("the quote response units should be {string}")
    public void quoteResponseUnits(String expectedUnits) {
        Number units = JsonPath.read(context.getLastResponseBody(), "$.units");
        assertThat(new BigDecimal(units.toString())).isEqualByComparingTo(new BigDecimal(expectedUnits));
    }

    @Then("the quote response should include a non-null orderId")
    public void quoteResponseHasOrderId() {
        String orderId = JsonPath.read(context.getLastResponseBody(), "$.orderId");
        assertThat(orderId).isNotNull().isNotBlank();
    }

    @Then("the quote response should include a positive fee")
    public void quoteResponseHasPositiveFee() {
        Number fee = JsonPath.read(context.getLastResponseBody(), "$.fee");
        assertThat(new BigDecimal(fee.toString())).isPositive();
    }

    // -------------------------------------------------------------------------
    // Then steps — Order response (after confirm)
    // -------------------------------------------------------------------------

    @Then("the order response should have status {string}")
    public void orderResponseStatus(String expectedStatus) {
        String status = JsonPath.read(context.getLastResponseBody(), "$.status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    // -------------------------------------------------------------------------
    // Tax-related steps
    // -------------------------------------------------------------------------

    @Then("the quote response should include a tax breakdown")
    public void quoteResponseIncludesTaxBreakdown() {
        Object taxBreakdown = JsonPath.read(context.getLastResponseBody(), "$.taxBreakdown");
        assertThat(taxBreakdown).isNotNull();
    }

    @Then("the tax breakdown registration duty should be greater than 0")
    public void taxBreakdownRegDutyPositive() {
        Number amount = JsonPath.read(context.getLastResponseBody(), "$.taxBreakdown.registrationDutyAmount");
        assertThat(new BigDecimal(amount.toString())).isPositive();
    }

    @Then("the tax breakdown registration duty amount should be 0")
    public void taxBreakdownRegDutyZero() {
        Number amount = JsonPath.read(context.getLastResponseBody(), "$.taxBreakdown.registrationDutyAmount");
        assertThat(new BigDecimal(amount.toString())).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Given("asset {string} has registration duty disabled")
    public void assetHasRegistrationDutyDisabled(String assetId) {
        jdbcTemplate.update("UPDATE assets SET registration_duty_enabled = false WHERE id = ?", assetId);
    }
}
