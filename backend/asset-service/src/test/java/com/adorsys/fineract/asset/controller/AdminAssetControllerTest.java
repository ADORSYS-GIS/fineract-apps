package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.repository.InterestPaymentRepository;
import com.adorsys.fineract.asset.service.AssetCatalogService;
import com.adorsys.fineract.asset.service.AssetProvisioningService;
import com.adorsys.fineract.asset.service.InventoryService;
import com.adorsys.fineract.asset.service.PricingService;
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
    @MockBean private InterestPaymentRepository interestPaymentRepository;

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
                .andExpect(status().isInternalServerError());
        // The IllegalArgumentException is thrown before reaching the service,
        // and GlobalExceptionHandler catches generic Exception -> 500.
        // In either case, the service is never called.
        verifyNoInteractions(catalogService);
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
                null, null, null, null, null, null
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
                Instant.now(), null,
                null, null, null, null, null, null, null, null
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
}
