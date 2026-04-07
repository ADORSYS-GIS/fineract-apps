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
                null, null, null, // issuerName, lpName, couponAmountPerUnit
                null, // bondType
                null, null, null, null, null // isinCode, maturityDate, interestRate, currentYield, residualDays
        );
        when(catalogService.listAllAssets(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(asset)));

        // Act & Assert
        mockMvc.perform(get("/admin/assets")
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
        mockMvc.perform(get("/admin/assets")
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
                "Test Asset", "TST", "TST", // name, symbol, currencyCode
                "A test asset", null, // description, imageUrl
                AssetCategory.STOCKS, // category
                new BigDecimal("500"), null, new BigDecimal("1000"), // issuerPrice, faceValue, totalSupply
                0, new BigDecimal("0.005"), // decimalPlaces, tradingFeePercent
                null, // spreadPercent (null = use default 0.3%)
                new BigDecimal("550"), new BigDecimal("475"), // lpAskPrice, lpBidPrice
                1L, // lpClientId
                null, null, null, null, null, null, // maxPositionPercent, maxOrderSize, dailyTradeLimitXaf, lockupDays, minOrderSize, minOrderCashAmount
                null, null, null, // bondType, dayCountConvention, issuerCountry
                null, null, null, null, null, null, // issuerName, isinCode, maturityDate, interestRate, couponFrequencyMonths, nextCouponDate
                null, null, null, null, // incomeType, incomeRate, distributionFrequencyMonths, nextDistributionDate
                null, null, null, null, null, null, null, null, null, // tax config
                false, null // tvaEnabled, tvaRate
        );

        AssetDetailResponse response = new AssetDetailResponse(
                "a1", "Test Asset", "TST", "TST", // id, name, symbol, currencyCode
                "A test asset", null, // description, imageUrl
                AssetCategory.STOCKS, AssetStatus.PENDING, PriceMode.MANUAL, // category, status, priceMode
                null, null, null, null, null, // change24hPercent, dayOpen, dayHigh, dayLow, dayClose
                new BigDecimal("1000"), BigDecimal.ZERO, new BigDecimal("1000"), // totalSupply, circulatingSupply, availableSupply
                new BigDecimal("0.005"), // tradingFeePercent
                0, // decimalPlaces
                null, new BigDecimal("500"), null, // issuerName, issuerPrice, faceValue
                1L, 200L, 300L, null, null, 10, // lpClientId, lpAssetAccountId, lpCashAccountId, lpSpreadAccountId, lpTaxAccountId, fineractProductId
                "Test Company", "Test Asset Token", // lpClientName, fineractProductName
                null, null, // lpMarginPerUnit, lpMarginPercent
                Instant.now(), null, // createdAt, updatedAt
                null, null, null, // bondType, dayCountConvention, issuerCountry
                null, null, null, null, null, null, null, null, // isinCode, maturityDate, interestRate, currentYield, couponFrequencyMonths, nextCouponDate, residualDays, couponAmountPerUnit
                null, null, // bidPrice, askPrice
                null, null, null, null, null, null, // maxPositionPercent, maxOrderSize, dailyTradeLimitXaf, minOrderSize, minOrderCashAmount, lockupDays
                null, null, null, null, // incomeType, incomeRate, distributionFrequencyMonths, nextDistributionDate
                null, null, // delistingDate, delistingRedemptionPrice
                null, null, null, null, null, null, null, null, null, // tax config fields
                false, null // tvaEnabled, tvaRate
        );

        when(provisioningService.createAsset(any(CreateAssetRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/admin/assets")
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

        mockMvc.perform(delete("/admin/assets/a1"))
                .andExpect(status().isOk());

        verify(provisioningService).deletePendingAsset("a1");
    }

    @Test
    void deleteAsset_notPending_returns400() throws Exception {
        doThrow(new com.adorsys.fineract.asset.exception.AssetException("Only PENDING assets can be deleted"))
                .when(provisioningService).deletePendingAsset("a1");

        mockMvc.perform(delete("/admin/assets/a1"))
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

        mockMvc.perform(get("/admin/assets/a1/coupon-summary"))
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

        mockMvc.perform(get("/admin/assets/a1/income-summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalPaidToDate").value(800))
                .andExpect(jsonPath("$.totalPaymentCount").value(1))
                .andExpect(jsonPath("$.nextScheduledDate").isEmpty());

        verify(scheduledPaymentService).getPaymentSummary("a1", "INCOME");
    }
}
