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

    // ── GET /api/admin/orders (filtered) ──

    @Test
    void getOrders_noFilters_returns200() throws Exception {
        AdminOrderResponse order = buildAdminOrderResponse("o1", OrderStatus.NEEDS_RECONCILIATION);
        when(adminOrderService.getFilteredOrders(isNull(), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
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
    void getOrders_withStatusFilter_passesParameter() throws Exception {
        when(adminOrderService.getFilteredOrders(eq(OrderStatus.FAILED), isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of()));

        mockMvc.perform(get("/api/admin/orders").param("status", "FAILED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());

        verify(adminOrderService).getFilteredOrders(eq(OrderStatus.FAILED), isNull(), isNull(), isNull(), isNull(), any(Pageable.class));
    }

    @Test
    void getOrders_withSearchFilter_passesParameter() throws Exception {
        AdminOrderResponse order = buildAdminOrderResponse("o1", OrderStatus.NEEDS_RECONCILIATION);
        when(adminOrderService.getFilteredOrders(isNull(), isNull(), eq("user-ext"), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(order)));

        mockMvc.perform(get("/api/admin/orders").param("search", "user-ext"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].userExternalId").value("user-ext-1"));
    }

    @Test
    void getOrders_pageSizeTooLarge_returnsError() throws Exception {
        mockMvc.perform(get("/api/admin/orders")
                        .param("size", "200"))
                .andExpect(status().isInternalServerError());
        verifyNoInteractions(adminOrderService);
    }

    // ── GET /api/admin/orders/{id} (detail) ──

    @Test
    void getOrderDetail_returns200() throws Exception {
        OrderDetailResponse detail = new OrderDetailResponse(
                "o1", "asset-1", "TST", "Test Asset", TradeSide.BUY,
                new BigDecimal("10"), new BigDecimal("500"), new BigDecimal("5000"),
                new BigDecimal("25"), new BigDecimal("50"),
                OrderStatus.FILLED, null, "user-ext-1", 1L,
                "idemp-key-1", "batch-123", 1L,
                null, null,
                Instant.parse("2025-06-01T10:00:00Z"), null
        );
        when(adminOrderService.getOrderDetail("o1")).thenReturn(detail);

        mockMvc.perform(get("/api/admin/orders/o1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value("o1"))
                .andExpect(jsonPath("$.assetName").value("Test Asset"))
                .andExpect(jsonPath("$.idempotencyKey").value("idemp-key-1"))
                .andExpect(jsonPath("$.fineractBatchId").value("batch-123"));
    }

    @Test
    void getOrderDetail_notFound_returns404() throws Exception {
        when(adminOrderService.getOrderDetail("missing"))
                .thenThrow(new AssetNotFoundException("Order not found: missing"));

        mockMvc.perform(get("/api/admin/orders/missing"))
                .andExpect(status().isNotFound());
    }

    // ── GET /api/admin/orders/asset-options ──

    @Test
    void getAssetOptions_returns200() throws Exception {
        when(adminOrderService.getOrderAssetOptions())
                .thenReturn(List.of(new AssetOptionResponse("asset-1", "TST", "Test Asset")));

        mockMvc.perform(get("/api/admin/orders/asset-options"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].assetId").value("asset-1"))
                .andExpect(jsonPath("$[0].symbol").value("TST"));
    }

    // ── GET /api/admin/orders/summary ──

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

    // ── POST /api/admin/orders/{id}/resolve ──

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
