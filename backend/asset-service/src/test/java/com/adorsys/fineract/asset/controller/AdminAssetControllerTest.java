package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
import com.adorsys.fineract.asset.service.AssetCatalogService;
import com.adorsys.fineract.asset.service.AssetProvisioningService;
import com.adorsys.fineract.asset.service.CouponForecastService;
import com.adorsys.fineract.asset.service.InventoryService;
import com.adorsys.fineract.asset.service.PricingService;
import com.adorsys.fineract.asset.service.PrincipalRedemptionService;
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
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminAssetController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminAssetControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;

    @MockBean private AssetProvisioningService provisioningService;
    @MockBean private AssetCatalogService catalogService;
    @MockBean private PricingService pricingService;
    @MockBean private InventoryService inventoryService;
    @MockBean private CouponForecastService couponForecastService;
    @MockBean private InterestPaymentScheduler interestPaymentScheduler;
    @MockBean private InterestPaymentRepository interestPaymentRepository;
    @MockBean private PrincipalRedemptionRepository principalRedemptionRepository;
    @MockBean private PrincipalRedemptionService principalRedemptionService;
    @MockBean private AssetRepository assetRepository;
    @MockBean private com.adorsys.fineract.asset.service.DelistingService delistingService;
    @MockBean private com.adorsys.fineract.asset.repository.IncomeDistributionRepository incomeDistributionRepository;
    @MockBean private com.adorsys.fineract.asset.service.IncomeForecastService incomeForecastService;
    @MockBean private com.adorsys.fineract.asset.service.IncomeDistributionService incomeDistributionService;
    @MockBean private com.adorsys.fineract.asset.service.ScheduledPaymentService scheduledPaymentService;

    // -------------------------------------------------------------------------
    // GET /api/admin/assets
    // -------------------------------------------------------------------------

    @Test
    void listAllAssets_returns200WithPaginatedResults() throws Exception {
        // Arrange
        AssetResponse asset = new AssetResponse(
                "a1", "Test Asset", "TST", null,
                AssetCategory.STOCKS, AssetStatus.ACTIVE,
                new BigDecimal("500"), new BigDecimal("2.5"),
                new BigDecimal("900"), new BigDecimal("1000"),
                null, null, null,
                null, null, null, null, null, null
        );
        when(catalogService.listAllAssets(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(asset)));

        // Act & Assert
        mockMvc.perform(get("/api/admin/assets")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value("a1"))
                .andExpect(jsonPath("$.content[0].symbol").value("TST"))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(catalogService).listAllAssets(any(Pageable.class));
    }

    @Test
    void listAllAssets_pageSizeTooLarge_returns400() throws Exception {
        // Act & Assert: size=200 exceeds max of 100
        mockMvc.perform(get("/api/admin/assets")
                        .param("size", "200"))
                .andExpect(status().isBadRequest());
    }

    // -------------------------------------------------------------------------
    // POST /api/admin/assets
    // -------------------------------------------------------------------------

    @Test
    void createAsset_validRequest_returns201() throws Exception {
        // Arrange
        CreateAssetRequest request = new CreateAssetRequest(
                "Test Asset", "TST", "TST",
                "A test asset", null,
                AssetCategory.STOCKS,
                new BigDecimal("500"), new BigDecimal("1000"),
                0, new BigDecimal("0.005"), new BigDecimal("0.01"),
                LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), null,
                1L,
                null, null, null, null, // exposure limits
                null, null, null, null, null, null, // bond fields
                null, null, null, null // income fields
        );

        AssetDetailResponse response = new AssetDetailResponse(
                "a1", "Test Asset", "TST", "TST",
                "A test asset", null, AssetCategory.STOCKS, AssetStatus.PENDING,
                PriceMode.MANUAL, new BigDecimal("500"), null,
                null, null, null, null,
                new BigDecimal("1000"), BigDecimal.ZERO, new BigDecimal("1000"),
                new BigDecimal("0.005"), new BigDecimal("0.01"),
                0, LocalDate.now().minusMonths(1), LocalDate.now().plusYears(1), null,
                1L, 200L, 300L, 10,
                "Test Company", "Test Asset Token",
                Instant.now(), null,
                null, null, null, null, null, null, null, null, // bond fields + residualDays + subscriptionClosed
                null, null, // bidPrice, askPrice
                null, null, null, null, // exposure limits + lockupDays
                null, null, null, null // income distribution
        );

        when(provisioningService.createAsset(any(CreateAssetRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/admin/assets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value("a1"))
                .andExpect(jsonPath("$.symbol").value("TST"))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.fineractProductId").value(10));

        verify(provisioningService).createAsset(any(CreateAssetRequest.class));
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/assets/{id}/coupon-summary
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // DELETE /api/admin/assets/{id}
    // -------------------------------------------------------------------------

    @Test
    void deleteAsset_returns200() throws Exception {
        doNothing().when(provisioningService).deletePendingAsset("a1");

        mockMvc.perform(delete("/api/admin/assets/a1"))
                .andExpect(status().isOk());

        verify(provisioningService).deletePendingAsset("a1");
    }

    @Test
    void deleteAsset_notPending_returns400() throws Exception {
        doThrow(new com.adorsys.fineract.asset.exception.AssetException("Only PENDING assets can be deleted"))
                .when(provisioningService).deletePendingAsset("a1");

        mockMvc.perform(delete("/api/admin/assets/a1"))
                .andExpect(status().isBadRequest());
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/assets/{id}/coupon-summary
    // -------------------------------------------------------------------------

    @Test
    void couponSummary_returns200() throws Exception {
        PaymentSummaryResponse summary = new PaymentSummaryResponse(
                LocalDate.now(), new BigDecimal("2900"), Instant.now(),
                LocalDate.now().plusMonths(6),
                new BigDecimal("5800"), 0, 2);

        when(scheduledPaymentService.getPaymentSummary("a1", "COUPON")).thenReturn(summary);

        mockMvc.perform(get("/api/admin/assets/a1/coupon-summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lastPaymentDate").isNotEmpty())
                .andExpect(jsonPath("$.totalPaidToDate").value(5800))
                .andExpect(jsonPath("$.failedPaymentCount").value(0))
                .andExpect(jsonPath("$.totalPaymentCount").value(2))
                .andExpect(jsonPath("$.nextScheduledDate").isNotEmpty());

        verify(scheduledPaymentService).getPaymentSummary("a1", "COUPON");
    }

    // -------------------------------------------------------------------------
    // GET /api/admin/assets/{id}/income-summary
    // -------------------------------------------------------------------------

    @Test
    void incomeSummary_returns200() throws Exception {
        PaymentSummaryResponse summary = new PaymentSummaryResponse(
                LocalDate.now(), new BigDecimal("800"), Instant.now(),
                null,
                new BigDecimal("800"), 0, 1);

        when(scheduledPaymentService.getPaymentSummary("a1", "INCOME")).thenReturn(summary);

        mockMvc.perform(get("/api/admin/assets/a1/income-summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPaidToDate").value(800))
                .andExpect(jsonPath("$.totalPaymentCount").value(1))
                .andExpect(jsonPath("$.nextScheduledDate").isEmpty());

        verify(scheduledPaymentService).getPaymentSummary("a1", "INCOME");
    }
}
