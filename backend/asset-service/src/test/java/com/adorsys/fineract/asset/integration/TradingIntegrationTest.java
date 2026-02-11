package com.adorsys.fineract.asset.integration;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.dto.TradePreviewRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
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
class TradingIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    // Mock external dependencies
    @MockBean private FineractClient fineractClient;
    @MockBean private FineractTokenProvider fineractTokenProvider;

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
    // Trade preview tests
    // -------------------------------------------------------------------------

    @Test
    @Order(1)
    void previewBuy_returnsQuote() throws Exception {
        setupFineractMocks();

        TradePreviewRequest request = new TradePreviewRequest(
                "asset-001", TradeSide.BUY, new BigDecimal("5"));

        mockMvc.perform(post("/api/trades/preview")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feasible").value(true))
                .andExpect(jsonPath("$.assetSymbol").value("TST"))
                .andExpect(jsonPath("$.side").value("BUY"))
                .andExpect(jsonPath("$.basePrice").isNumber())
                .andExpect(jsonPath("$.executionPrice").isNumber())
                .andExpect(jsonPath("$.fee").isNumber())
                .andExpect(jsonPath("$.spreadAmount").isNumber())
                .andExpect(jsonPath("$.netAmount").isNumber());
    }

    @Test
    @Order(2)
    void previewBuy_insufficientInventory_returnBlocker() throws Exception {
        setupFineractMocks();

        // Request more units than total supply (1000)
        TradePreviewRequest request = new TradePreviewRequest(
                "asset-001", TradeSide.BUY, new BigDecimal("9999"));

        mockMvc.perform(post("/api/trades/preview")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feasible").value(false))
                .andExpect(jsonPath("$.blockers").isArray());
    }

    @Test
    @Order(3)
    void previewSell_noPosition_returnBlocker() throws Exception {
        setupFineractMocks();

        TradePreviewRequest request = new TradePreviewRequest(
                "asset-001", TradeSide.SELL, new BigDecimal("5"));

        mockMvc.perform(post("/api/trades/preview")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feasible").value(false))
                .andExpect(jsonPath("$.blockers[?(@=='NO_POSITION')]").exists());
    }

    @Test
    @Order(4)
    void preview_noAuth_returns401() throws Exception {
        TradePreviewRequest request = new TradePreviewRequest(
                "asset-001", TradeSide.BUY, new BigDecimal("5"));

        mockMvc.perform(post("/api/trades/preview")
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
    void previewBuy_assetNotFound_returnBlocker() throws Exception {
        setupFineractMocks();

        TradePreviewRequest request = new TradePreviewRequest(
                "nonexistent-asset", TradeSide.BUY, new BigDecimal("5"));

        mockMvc.perform(post("/api/trades/preview")
                        .with(jwt().jwt(j -> j
                                .subject(EXTERNAL_ID)
                                .claim("fineract_client_id", USER_ID)))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.feasible").value(false))
                .andExpect(jsonPath("$.blockers[0]").value("ASSET_NOT_FOUND"));
    }
}
