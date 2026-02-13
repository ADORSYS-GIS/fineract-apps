package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.exception.AssetNotFoundException;
import com.adorsys.fineract.asset.service.AdminOrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
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

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminOrderController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminOrderControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AdminOrderService adminOrderService;

    @Test
    void getResolvableOrders_returns200WithPaginatedResults() throws Exception {
        AdminOrderResponse order = buildAdminOrderResponse("o1", OrderStatus.NEEDS_RECONCILIATION);
        when(adminOrderService.getResolvableOrders(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(order)));

        mockMvc.perform(get("/api/admin/orders")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].orderId").value("o1"))
                .andExpect(jsonPath("$.content[0].status").value("NEEDS_RECONCILIATION"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    void getOrderSummary_returns200WithCounts() throws Exception {
        when(adminOrderService.getOrderSummary())
                .thenReturn(new OrderSummaryResponse(3, 5, 2));

        mockMvc.perform(get("/api/admin/orders/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.needsReconciliation").value(3))
                .andExpect(jsonPath("$.failed").value(5))
                .andExpect(jsonPath("$.manuallyClosed").value(2));
    }

    @Test
    void resolveOrder_returns200WithResolvedOrder() throws Exception {
        AdminOrderResponse resolved = new AdminOrderResponse(
                "o1", "asset1", "TST", TradeSide.BUY,
                new BigDecimal("10"), new BigDecimal("1000"), new BigDecimal("10000"),
                new BigDecimal("50"), BigDecimal.ZERO, OrderStatus.MANUALLY_CLOSED,
                "Resolution: Verified", "user-ext-1", 100L,
                "admin1", Instant.now(), Instant.now(), Instant.now()
        );
        when(adminOrderService.resolveOrder(eq("o1"), eq("Verified"), anyString()))
                .thenReturn(resolved);

        ResolveOrderRequest request = new ResolveOrderRequest("Verified");

        mockMvc.perform(post("/api/admin/orders/o1/resolve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value("o1"))
                .andExpect(jsonPath("$.status").value("MANUALLY_CLOSED"))
                .andExpect(jsonPath("$.resolvedBy").value("admin1"));
    }

    @Test
    void resolveOrder_orderNotFound_returns404() throws Exception {
        when(adminOrderService.resolveOrder(eq("missing"), anyString(), anyString()))
                .thenThrow(new AssetNotFoundException("Order not found: missing"));

        ResolveOrderRequest request = new ResolveOrderRequest("test resolution");

        mockMvc.perform(post("/api/admin/orders/missing/resolve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void resolveOrder_blankResolution_returns400() throws Exception {
        ResolveOrderRequest request = new ResolveOrderRequest("");

        mockMvc.perform(post("/api/admin/orders/o1/resolve")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void getResolvableOrders_pageSizeTooLarge_returnsError() throws Exception {
        mockMvc.perform(get("/api/admin/orders")
                        .param("size", "200"))
                .andExpect(status().isInternalServerError());
    }

    private AdminOrderResponse buildAdminOrderResponse(String orderId, OrderStatus status) {
        return new AdminOrderResponse(
                orderId, "asset1", "TST", TradeSide.BUY,
                new BigDecimal("10"), new BigDecimal("1000"), new BigDecimal("10000"),
                new BigDecimal("50"), BigDecimal.ZERO, status,
                "Some failure reason", "user-ext-1", 100L,
                null, null, Instant.now(), null
        );
    }
}
