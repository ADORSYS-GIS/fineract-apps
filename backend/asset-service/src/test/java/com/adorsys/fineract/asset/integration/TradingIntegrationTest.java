package com.adorsys.fineract.asset.integration;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import com.adorsys.fineract.asset.client.GlAccountResolver;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.dto.QuoteRequest;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for trading endpoints.
 * Uses real H2 database with mocked external dependencies.
 */
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Import(TradingIntegrationTest.TestGlConfig.class)
class TradingIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    // Mock external dependencies
    @MockBean private FineractClient fineractClient;
    @MockBean private FineractTokenProvider fineractTokenProvider;
    @MockBean private GlAccountResolver glAccountResolver;

    @TestConfiguration
    static class TestGlConfig {
        @Bean
        public ResolvedGlAccounts resolvedGlAccounts() {
            ResolvedGlAccounts r = new ResolvedGlAccounts();
            r.setDigitalAssetInventoryId(47L);
            r.setCustomerDigitalAssetHoldingsId(65L);
            r.setTransfersInSuspenseId(48L);
            r.setIncomeFromInterestId(87L);
            r.setAssetIssuancePaymentTypeId(22L);
            return r;
        }
    }

    private static final String EXTERNAL_ID = "ext-id-123";
    private static final Long USER_ID = 42L;

    private void setupFineractMocks() {
        // Mock user resolution
        when(fineractClient.getClientByExternalId(EXTERNAL_ID))
                .thenReturn(Map.of("id", USER_ID));

        // Mock XAF account lookup
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF"))
                .thenReturn(100L);

        // Mock balance (sufficient for purchases)
        when(fineractClient.getAccountBalance(100L))
                .thenReturn(new BigDecimal("100000"));
    }

    // -------------------------------------------------------------------------
    // Quote tests (replaces old preview tests)
    // -------------------------------------------------------------------------

    @Test
    @Order(1)
    void quoteBuy_returnsQuotedOrder() throws Exception {
        setupFineractMocks();

        QuoteRequest request = new QuoteRequest(
                "asset-001", TradeSide.BUY, new BigDecimal("5"), null);

        mockMvc.perform(post("/api/trades/quote")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", "idem-buy-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderId").isNotEmpty())
                .andExpect(jsonPath("$.status").value("QUOTED"))
                .andExpect(jsonPath("$.side").value("BUY"))
                .andExpect(jsonPath("$.executionPrice").isNumber())
                .andExpect(jsonPath("$.fee").isNumber())
                .andExpect(jsonPath("$.spreadAmount").isNumber())
                .andExpect(jsonPath("$.netAmount").isNumber());
    }

    @Test
    @Order(2)
    void quoteBuy_insufficientInventory_returnsError() throws Exception {
        setupFineractMocks();

        // Request more units than total supply (1000)
        QuoteRequest request = new QuoteRequest(
                "asset-001", TradeSide.BUY, new BigDecimal("9999"), null);

        mockMvc.perform(post("/api/trades/quote")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", "idem-buy-2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(3)
    void quoteSell_noPosition_returnsError() throws Exception {
        setupFineractMocks();

        QuoteRequest request = new QuoteRequest(
                "asset-001", TradeSide.SELL, new BigDecimal("5"), null);

        mockMvc.perform(post("/api/trades/quote")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", "idem-sell-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @Order(4)
    void quote_noAuth_returns401() throws Exception {
        QuoteRequest request = new QuoteRequest(
                "asset-001", TradeSide.BUY, new BigDecimal("5"), null);

        mockMvc.perform(post("/api/trades/quote")
                        .header("X-Idempotency-Key", "idem-noauth")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // -------------------------------------------------------------------------
    // Order history tests (read-only, no FineractClient needed for basic flow)
    // -------------------------------------------------------------------------

    @Test
    @Order(5)
    void getOrders_authenticated_returns200() throws Exception {
        mockMvc.perform(get("/api/trades/orders")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    @Order(6)
    void getOrders_noAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/trades/orders"))
                .andExpect(status().isUnauthorized());
    }

    // -------------------------------------------------------------------------
    // Asset not found test
    // -------------------------------------------------------------------------

    @Test
    @Order(7)
    void quoteBuy_assetNotFound_returnsError() throws Exception {
        setupFineractMocks();

        QuoteRequest request = new QuoteRequest(
                "nonexistent-asset", TradeSide.BUY, new BigDecimal("5"), null);

        mockMvc.perform(post("/api/trades/quote")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .header("X-Idempotency-Key", "idem-notfound")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().is4xxClientError());
    }
}
