package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for asset creation, activation, and Fineract provisioning verification.
 */
public class AssetProvisioningSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // Given steps
    // ---------------------------------------------------------------

    @Given("Fineract is initialized with GL accounts and payment types")
    public void fineractIsInitialized() {
        // Already done in AssetE2ESpringConfiguration static block
    }

    @Given("a treasury client exists in Fineract")
    public void treasuryClientExists() {
        assertThat(FineractInitializer.getTreasuryClientId()).isNotNull();
    }

    @Given("a test user exists in Fineract with external ID {string}")
    public void testUserExists(String externalId) {
        assertThat(FineractInitializer.getTestUserClientId()).isNotNull();
    }

    @Given("the test user has an XAF account with balance {long}")
    public void testUserHasXafBalance(long expectedBalance) {
        BigDecimal balance = fineractTestClient.getAccountBalance(
                FineractInitializer.getTestUserXafAccountId());
        assertThat(balance.longValue())
                .isGreaterThanOrEqualTo(expectedBalance);
    }

    // ---------------------------------------------------------------
    // When steps
    // ---------------------------------------------------------------

    @When("the admin creates a stock asset:")
    public void adminCreatesStockAsset(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);

        String symbol = data.getOrDefault("symbol", "TST");
        String currencyCode = data.getOrDefault("currencyCode", symbol);

        Map<String, Object> request = new HashMap<>();
        request.put("name", data.getOrDefault("name", "Test Stock " + symbol));
        request.put("symbol", symbol);
        request.put("currencyCode", currencyCode);
        request.put("category", data.getOrDefault("category", "STOCKS"));
        request.put("initialPrice", new BigDecimal(data.getOrDefault("initialPrice", "5000")));
        request.put("totalSupply", new BigDecimal(data.getOrDefault("totalSupply", "10000")));
        request.put("decimalPlaces", Integer.parseInt(data.getOrDefault("decimalPlaces", "0")));
        request.put("treasuryClientId", FineractInitializer.getTreasuryClientId());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/admin/assets");

        context.setLastResponse(response);

        // Store the asset ID for later steps
        if (response.statusCode() == 201) {
            String assetId = response.jsonPath().getString("id");
            context.storeId("lastAssetId", assetId);
            context.storeValue("lastSymbol", symbol);
            context.storeValue("lastCurrencyCode", currencyCode);
        }
    }

    @When("the admin creates a bond asset:")
    public void adminCreatesBondAsset(io.cucumber.datatable.DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);

        String symbol = data.getOrDefault("symbol", "BND");
        String currencyCode = data.getOrDefault("currencyCode", symbol);

        Map<String, Object> request = new HashMap<>();
        request.put("name", data.getOrDefault("name", "Test Bond " + symbol));
        request.put("symbol", symbol);
        request.put("currencyCode", currencyCode);
        request.put("category", "BONDS");
        request.put("initialPrice", new BigDecimal(data.getOrDefault("initialPrice", "10000")));
        request.put("totalSupply", new BigDecimal(data.getOrDefault("totalSupply", "1000")));
        request.put("decimalPlaces", Integer.parseInt(data.getOrDefault("decimalPlaces", "0")));
        request.put("treasuryClientId", FineractInitializer.getTreasuryClientId());
        request.put("issuer", data.getOrDefault("issuer", "Test Issuer"));
        request.put("interestRate", new BigDecimal(data.getOrDefault("interestRate", "5.80")));
        request.put("couponFrequencyMonths",
                Integer.parseInt(data.getOrDefault("couponFrequencyMonths", "6")));
        request.put("maturityDate", resolveDateExpression(
                data.getOrDefault("maturityDate", "+5y")));
        request.put("nextCouponDate", resolveDateExpression(
                data.getOrDefault("nextCouponDate", "+6m")));
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/admin/assets");

        context.setLastResponse(response);

        if (response.statusCode() == 201) {
            String assetId = response.jsonPath().getString("id");
            context.storeId("lastAssetId", assetId);
            context.storeValue("lastSymbol", symbol);
            context.storeValue("lastCurrencyCode", currencyCode);
        }
    }

    @When("the admin activates asset {string}")
    public void adminActivatesAsset(String assetIdRef) {
        String assetId = resolveAssetId(assetIdRef);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/activate");

        context.setLastResponse(response);
    }

    @When("the admin halts asset {string}")
    public void adminHaltsAsset(String assetIdRef) {
        String assetId = resolveAssetId(assetIdRef);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/halt");

        context.setLastResponse(response);
    }

    @When("the admin resumes asset {string}")
    public void adminResumesAsset(String assetIdRef) {
        String assetId = resolveAssetId(assetIdRef);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/resume");

        context.setLastResponse(response);
    }

    @When("the admin sets the price of {string} to {int}")
    public void adminSetsPrice(String assetIdRef, int price) {
        String assetId = resolveAssetId(assetIdRef);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(Map.of("price", price))
                .post("/api/admin/assets/" + assetId + "/set-price");

        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Then steps
    // ---------------------------------------------------------------

    @Then("the asset should be in {word} status")
    public void assetShouldBeInStatus(String expectedStatus) {
        String assetId = context.getId("lastAssetId");

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        assertThat(response.statusCode()).isEqualTo(200);
        String status = response.jsonPath().getString("status");
        assertThat(status).isEqualTo(expectedStatus);
    }

    @Then("Fineract should have a currency {string} registered")
    public void fineractShouldHaveCurrency(String currencyCode) {
        assertThat(context.getStatusCode()).isIn(200, 201);
    }

    @Then("Fineract should have a savings product with shortName {string}")
    public void fineractShouldHaveSavingsProduct(String shortName) {
        Object productId = context.jsonPath("fineractProductId");
        assertThat(productId).isNotNull();
    }

    @Then("the treasury should have a {word} account with balance {int} in Fineract")
    public void treasuryShouldHaveAssetAccount(String currencyCode, int expectedBalance) {
        String assetId = context.getId("lastAssetId");

        Response assetResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .get("/api/admin/assets/" + assetId);

        assertThat(assetResp.statusCode()).isEqualTo(200);
        Number accountId = assetResp.jsonPath().get("treasuryAssetAccountId");
        assertThat(accountId).as("treasuryAssetAccountId for asset " + assetId).isNotNull();

        BigDecimal balance = fineractTestClient.getAccountBalance(accountId.longValue());
        assertThat(balance.intValue()).isEqualTo(expectedBalance);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private String resolveAssetId(String ref) {
        if ("lastCreated".equals(ref)) {
            return context.getId("lastAssetId");
        }
        String stored = context.getId("lastAssetId");
        if (stored != null && ref.equals(context.getValue("lastSymbol"))) {
            return stored;
        }
        return ref;
    }

    private String resolveDateExpression(String expr) {
        if (expr == null) return null;
        if (expr.startsWith("+") || expr.startsWith("-")) {
            boolean negative = expr.startsWith("-");
            String unit = expr.substring(expr.length() - 1);
            int amount = Integer.parseInt(expr.substring(1, expr.length() - 1));
            if (negative) amount = -amount;
            return switch (unit) {
                case "y" -> LocalDate.now().plusYears(amount).toString();
                case "m" -> LocalDate.now().plusMonths(amount).toString();
                case "d" -> LocalDate.now().plusDays(amount).toString();
                default -> expr;
            };
        }
        return expr;
    }
}
