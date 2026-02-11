package com.adorsys.fineract.asset.integration;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.MintSupplyRequest;
import com.adorsys.fineract.asset.dto.UpdateAssetRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for admin endpoints with security enabled.
 * Tests role-based access control and admin CRUD operations.
 */
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Transactional
@Sql(scripts = "classpath:test-data.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class AdminAssetIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private AssetServiceConfig assetServiceConfig;

    // Mock external dependencies
    @MockBean private FineractClient fineractClient;
    @MockBean private FineractTokenProvider fineractTokenProvider;

    // -------------------------------------------------------------------------
    // Security tests
    // -------------------------------------------------------------------------

    @Test
    @Order(1)
    void getAssets_noAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/admin/assets"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    void getAssets_withoutAdminRole_returns403() throws Exception {
        mockMvc.perform(get("/api/admin/assets")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @Order(3)
    void getAssets_withAdminRole_returns200() throws Exception {
        mockMvc.perform(get("/api/admin/assets")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    // -------------------------------------------------------------------------
    // Admin read operations
    // -------------------------------------------------------------------------

    @Test
    @Order(4)
    void getAsset_returns200() throws Exception {
        mockMvc.perform(get("/api/admin/assets/asset-001")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("asset-001"))
                .andExpect(jsonPath("$.symbol").value("TST"))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    // -------------------------------------------------------------------------
    // Asset lifecycle
    // -------------------------------------------------------------------------

    @Test
    @Order(5)
    void activateAsset_pendingToActive_returns200() throws Exception {
        mockMvc.perform(post("/api/admin/assets/asset-002/activate")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(status().isOk());

        // Verify it's now ACTIVE
        mockMvc.perform(get("/api/admin/assets/asset-002")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(jsonPath("$.status").value("ACTIVE"));
    }

    @Test
    @Order(6)
    void haltAsset_activeToHalted_returns200() throws Exception {
        mockMvc.perform(post("/api/admin/assets/asset-001/halt")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(status().isOk());
    }

    @Test
    @Order(7)
    void resumeAsset_haltedToActive_returns200() throws Exception {
        // First halt
        mockMvc.perform(post("/api/admin/assets/asset-001/halt")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(status().isOk());

        // Then resume
        mockMvc.perform(post("/api/admin/assets/asset-001/resume")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER"))))
                .andExpect(status().isOk());
    }

    // -------------------------------------------------------------------------
    // Update operations
    // -------------------------------------------------------------------------

    @Test
    @Order(8)
    void updateAsset_partialUpdate_returns200() throws Exception {
        UpdateAssetRequest update = new UpdateAssetRequest(
                "Updated Test Asset", null, null, null, null, null);

        mockMvc.perform(put("/api/admin/assets/asset-001")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Test Asset"));
    }

    @Test
    @Order(9)
    void mintSupply_returns200() throws Exception {
        // Mock Fineract deposit call (returns transaction ID)
        when(fineractClient.depositToSavingsAccount(anyLong(), any(BigDecimal.class), anyLong()))
                .thenReturn(1L);

        MintSupplyRequest mint = new MintSupplyRequest(new BigDecimal("500"));

        mockMvc.perform(post("/api/admin/assets/asset-001/mint")
                        .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ASSET_MANAGER")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mint)))
                .andExpect(status().isOk());
    }
}
