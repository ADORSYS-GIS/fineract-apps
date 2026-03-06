package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.RecentTradeDto;
import com.adorsys.fineract.asset.dto.TradeSide;
import com.adorsys.fineract.asset.service.AssetCatalogService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AssetCatalogController.class)
@AutoConfigureMockMvc(addFilters = false)
class AssetCatalogControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private AssetCatalogService assetCatalogService;

    // -------------------------------------------------------------------------
    // GET /api/assets/{id}/recent-trades
    // -------------------------------------------------------------------------

    @Test
    void getRecentTrades_returns200WithList() throws Exception {
        // Arrange
        Instant now = Instant.parse("2026-02-19T10:00:00Z");
        List<RecentTradeDto> trades = List.of(
                new RecentTradeDto(new BigDecimal("500"), new BigDecimal("10"), TradeSide.BUY, now),
                new RecentTradeDto(new BigDecimal("510"), new BigDecimal("5"), TradeSide.SELL, now.minusSeconds(60))
        );
        when(assetCatalogService.getRecentTrades("asset-001")).thenReturn(trades);

        // Act & Assert
        mockMvc.perform(get("/api/assets/asset-001/recent-trades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].price").value(500))
                .andExpect(jsonPath("$[0].quantity").value(10))
                .andExpect(jsonPath("$[0].side").value("BUY"))
                .andExpect(jsonPath("$[0].executedAt").exists())
                .andExpect(jsonPath("$[1].side").value("SELL"));

        verify(assetCatalogService).getRecentTrades("asset-001");
    }

    @Test
    void getRecentTrades_emptyList_returns200() throws Exception {
        // Arrange
        when(assetCatalogService.getRecentTrades("asset-002")).thenReturn(Collections.emptyList());

        // Act & Assert
        mockMvc.perform(get("/api/assets/asset-002/recent-trades"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));

        verify(assetCatalogService).getRecentTrades("asset-002");
    }
}
