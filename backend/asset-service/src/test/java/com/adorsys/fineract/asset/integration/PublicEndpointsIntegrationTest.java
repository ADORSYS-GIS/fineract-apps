package com.adorsys.fineract.asset.integration;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import com.adorsys.fineract.asset.client.GlAccountResolver;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for public (unauthenticated) endpoints.
 * Verifies that catalog, price, and market endpoints work without JWT.
 */
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@Import(PublicEndpointsIntegrationTest.TestGlConfig.class)
class PublicEndpointsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    // Mock external dependencies to avoid network calls
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

    @Test
    void listAssets_noAuth_returns200() throws Exception {
        mockMvc.perform(get("/api/assets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void getAssetDetail_noAuth_returns200() throws Exception {
        mockMvc.perform(get("/api/assets/asset-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.symbol").value("TST"))
                .andExpect(jsonPath("$.name").value("Test Asset"));
    }

    @Test
    void getPrice_noAuth_returns200() throws Exception {
        mockMvc.perform(get("/api/prices/asset-001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.currentPrice").isNumber());
    }

    @Test
    void getMarketStatus_noAuth_returns200() throws Exception {
        mockMvc.perform(get("/api/market/status"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isOpen").isBoolean());
    }

    @Test
    void getPriceHistory_noAuth_returns200() throws Exception {
        mockMvc.perform(get("/api/prices/asset-001/history")
                        .param("period", "1Y"))
                .andExpect(status().isOk());
    }
}
