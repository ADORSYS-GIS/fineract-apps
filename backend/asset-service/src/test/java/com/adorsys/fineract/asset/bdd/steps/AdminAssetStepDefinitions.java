package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.adorsys.fineract.asset.client.FineractClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * Step definitions for admin asset management scenarios.
 */
public class AdminAssetStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private FineractClient fineractClient;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private ScenarioContext context;

    private static final SimpleGrantedAuthority ADMIN = new SimpleGrantedAuthority("ROLE_ASSET_MANAGER");

    // -------------------------------------------------------------------------
    // Given steps
    // -------------------------------------------------------------------------

    @Given("Fineract provisioning is mocked to succeed")
    public void fineractProvisioningMocked() {
        Map<String, Object> xafAccount = Map.of(
                "id", 300, "currency", Map.of("code", "XAF"), "status", Map.of("active", true));
        when(fineractClient.getClientSavingsAccounts(anyLong())).thenReturn(List.of(xafAccount));
        when(fineractClient.createSavingsProduct(anyString(), anyString(), anyString(), anyInt(), anyLong(), anyLong(), anyLong(), anyLong(), anyLong()))
                .thenReturn(10);
        when(fineractClient.provisionSavingsAccount(anyLong(), anyInt(), any(BigDecimal.class), anyLong()))
                .thenReturn(400L);
    }

    @Given("Fineract deposit is mocked to succeed")
    public void fineractDepositMocked() {
        when(fineractClient.depositToSavingsAccount(anyLong(), any(BigDecimal.class), anyLong())).thenReturn(1L);
    }

    @Given("an asset with symbol {string} already exists")
    public void assetWithSymbolExists(String symbol) {
        jdbcTemplate.update("""
            INSERT INTO assets (id, symbol, currency_code, name, category, status, price_mode,
                manual_price, total_supply, circulating_supply, decimal_places, treasury_client_id,
                treasury_asset_account_id, treasury_cash_account_id, fineract_product_id, version, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'STOCKS', 'ACTIVE', 'MANUAL', 100, 1000, 0, 0, 1, 400, 300, 10, 0, NOW(), NOW())
            """, "dup-" + symbol, symbol, symbol, "Duplicate " + symbol);
    }

    @Given("asset {string} has been halted by an admin")
    public void assetHalted(String assetId) throws Exception {
        mockMvc.perform(post("/api/admin/assets/" + assetId + "/halt")
                .with(jwt().authorities(ADMIN)));
    }

    @Given("asset {string} is in status {string}")
    public void assetInStatus(String assetId, String status) {
        jdbcTemplate.update("UPDATE assets SET status = ? WHERE id = ?", status, assetId);
    }

    // -------------------------------------------------------------------------
    // When steps — Asset creation
    // -------------------------------------------------------------------------

    @When("the admin creates an asset with:")
    public void adminCreatesAssetWith(io.cucumber.datatable.DataTable dataTable) throws Exception {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        Map<String, Object> request = new HashMap<>();
        request.put("name", data.get("name"));
        request.put("symbol", data.get("symbol"));
        request.put("currencyCode", data.get("currencyCode"));
        request.put("category", data.get("category"));
        request.put("initialPrice", new BigDecimal(data.get("initialPrice")));
        request.put("totalSupply", new BigDecimal(data.get("totalSupply")));
        request.put("decimalPlaces", Integer.parseInt(data.getOrDefault("decimalPlaces", "0")));
        request.put("treasuryClientId", 1L);

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin creates an asset with symbol {string}")
    public void adminCreatesAssetWithSymbol(String symbol) throws Exception {
        Map<String, Object> request = Map.of(
                "name", "Test", "symbol", symbol, "currencyCode", symbol,
                "category", "STOCKS", "initialPrice", 100, "totalSupply", 1000,
                "decimalPlaces", 0, "treasuryClientId", 1L);

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin creates an asset with empty name")
    public void adminCreatesAssetWithEmptyName() throws Exception {
        Map<String, Object> request = Map.of(
                "name", "", "symbol", "X", "currencyCode", "X",
                "category", "STOCKS", "initialPrice", 100, "totalSupply", 1000,
                "decimalPlaces", 0, "treasuryClientId", 1L);

        MvcResult result = mockMvc.perform(post("/api/admin/assets")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // When steps — Lifecycle
    // -------------------------------------------------------------------------

    @When("the admin activates asset {string}")
    public void adminActivatesAsset(String assetId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/admin/assets/" + assetId + "/activate")
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin halts asset {string}")
    public void adminHaltsAsset(String assetId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/admin/assets/" + assetId + "/halt")
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin resumes asset {string}")
    public void adminResumesAsset(String assetId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/admin/assets/" + assetId + "/resume")
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin performs {string} on asset {string}")
    public void adminPerformsAction(String action, String assetId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/admin/assets/" + assetId + "/" + action)
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // When steps — Update and mint
    // -------------------------------------------------------------------------

    @When("the admin updates asset {string} with name {string}")
    public void adminUpdatesName(String assetId, String name) throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("name", name);
        MvcResult result = mockMvc.perform(put("/api/admin/assets/" + assetId)
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin updates asset {string} with tradingFeePercent {string}")
    public void adminUpdatesTradingFee(String assetId, String fee) throws Exception {
        Map<String, Object> request = new HashMap<>();
        request.put("tradingFeePercent", new BigDecimal(fee));
        MvcResult result = mockMvc.perform(put("/api/admin/assets/" + assetId)
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin mints {int} additional units for asset {string}")
    public void adminMintsSupply(int amount, String assetId) throws Exception {
        Map<String, Object> request = Map.of("additionalSupply", amount);
        MvcResult result = mockMvc.perform(post("/api/admin/assets/" + assetId + "/mint")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the admin sets the price of asset {string} to {int}")
    public void adminSetsPrice(String assetId, int price) throws Exception {
        Map<String, Object> request = Map.of("price", price);
        MvcResult result = mockMvc.perform(post("/api/admin/assets/" + assetId + "/set-price")
                        .with(jwt().authorities(ADMIN))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn();
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // Then steps
    // -------------------------------------------------------------------------

    @Then("asset {string} should have status {string}")
    public void assetShouldHaveStatus(String assetId, String expectedStatus) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/assets/" + assetId)
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        String body = result.getResponse().getContentAsString();
        String status = JsonPath.read(body, "$.status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @Then("asset {string} total supply should be {int}")
    public void assetTotalSupplyShouldBe(String assetId, int expected) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/admin/assets/" + assetId)
                        .with(jwt().authorities(ADMIN)))
                .andReturn();
        String body = result.getResponse().getContentAsString();
        Number supply = JsonPath.read(body, "$.totalSupply");
        assertThat(supply.intValue()).isEqualTo(expected);
    }

    @Then("the current price of asset {string} should be {int}")
    public void currentPriceShouldBe(String assetId, int expected) {
        BigDecimal price = jdbcTemplate.queryForObject(
                "SELECT current_price FROM asset_prices WHERE asset_id = ?",
                BigDecimal.class, assetId);
        assertThat(price.intValue()).isEqualTo(expected);
    }
}
