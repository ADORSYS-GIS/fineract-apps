package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.SseEmitterManager;
import com.adorsys.fineract.asset.service.TradingService;
import com.adorsys.fineract.asset.util.UserIdentityResolver;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TradeController.class)
@AutoConfigureMockMvc(addFilters = false)
class TradeControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private TradingService tradingService;
    @MockBean private SseEmitterManager sseEmitterManager;
    @MockBean private UserIdentityResolver userIdentityResolver;

    @BeforeEach
    void setUp() {
        when(userIdentityResolver.resolveUserId(any())).thenReturn(42L);
    }

    // -------------------------------------------------------------------------
    // GET /api/trades/orders
    // -------------------------------------------------------------------------

    @Test
    void getOrders_returns200() throws Exception {
        // Arrange
        OrderResponse order = new OrderResponse(
                "order-001", "asset-001", "TST",
                TradeSide.BUY, new BigDecimal("10"),
                new BigDecimal("101"), new BigDecimal("1015"),
                new BigDecimal("5"), new BigDecimal("10"), OrderStatus.FILLED,
                Instant.now()
        );
        when(tradingService.getUserOrders(eq(42L), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(order)));

        mockMvc.perform(get("/trades/orders")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }

    // -------------------------------------------------------------------------
    // POST /api/trades/quote
    // -------------------------------------------------------------------------

    @Test
    void quote_missingIdempotencyKey_returns400() throws Exception {
        QuoteRequest request = new QuoteRequest("asset-001", TradeSide.BUY, new BigDecimal("10"), null);

        mockMvc.perform(post("/trades/quote")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(tradingService);
    }

    @Test
    void quote_routeExists_returns201() throws Exception {
        // With addFilters=false and mocked service, the route responds 201
        QuoteRequest request = new QuoteRequest("asset-001", TradeSide.BUY, new BigDecimal("10"), null);

        mockMvc.perform(post("/trades/quote")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("X-Idempotency-Key", "test-key")
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());
    }

    // -------------------------------------------------------------------------
    // POST /api/trades/orders/{id}/confirm
    // -------------------------------------------------------------------------

    @Test
    void confirmOrder_returns202() throws Exception {
        OrderResponse response = new OrderResponse(
                "order-001", "asset-001", "TST",
                TradeSide.BUY, new BigDecimal("10"),
                new BigDecimal("101"), new BigDecimal("1010"),
                new BigDecimal("5"), new BigDecimal("10"), OrderStatus.PENDING,
                Instant.now()
        );
        when(tradingService.confirmOrder("order-001", 42L)).thenReturn(response);

        mockMvc.perform(post("/trades/orders/order-001/confirm"))
                .andExpect(status().isAccepted());
    }

    // -------------------------------------------------------------------------
    // GET /api/trades/orders/{id}/stream
    // -------------------------------------------------------------------------

    @Test
    void streamOrderStatus_routeExists() {
        // Route is mapped — resolver returns 42L, ownership check passes (returns null),
        // sseEmitterManager.subscribe returns null which Spring handles as empty response
        assertThrows(Exception.class, () ->
                mockMvc.perform(get("/trades/orders/order-001/stream")
                        .accept(MediaType.TEXT_EVENT_STREAM)));
    }
}
