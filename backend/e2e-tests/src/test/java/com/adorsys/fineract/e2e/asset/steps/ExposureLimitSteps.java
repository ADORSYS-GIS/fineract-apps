package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.Given;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for exposure limit enforcement.
 * Creates assets with maxOrderSize, maxPositionPercent, and dailyTradeLimitXaf.
 */
public class ExposureLimitSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Given("an active stock asset {string} with price {int}, supply {int}, and max order size {int}")
    public void activeStockAssetWithMaxOrderSize(String symbol, int price, int supply, int maxOrderSize) {
        createAndActivateAsset(symbol, price, supply,
                Map.of("maxOrderSize", maxOrderSize));
    }

    @Given("an active stock asset {string} with price {int}, supply {int}, and max position percent {int}")
    public void activeStockAssetWithMaxPosition(String symbol, int price, int supply, int maxPositionPercent) {
        createAndActivateAsset(symbol, price, supply,
                Map.of("maxPositionPercent", maxPositionPercent));
    }

    @Given("an active stock asset {string} with price {int}, supply {int}, and lockup days {int}")
    public void activeStockAssetWithLockup(String symbol, int price, int supply, int lockupDays) {
        createAndActivateAsset(symbol, price, supply,
                Map.of("lockupDays", lockupDays));
    }

    private void createAndActivateAsset(String symbol, int price, int supply,
                                         Map<String, Object> extraFields) {
        Map<String, Object> request = new HashMap<>();
        request.put("name", "Test " + symbol);
        request.put("symbol", symbol);
        request.put("currencyCode", symbol);
        request.put("category", "STOCKS");
        request.put("initialPrice", price);
        request.put("totalSupply", supply);
        request.put("decimalPlaces", 0);
        request.put("treasuryClientId", FineractInitializer.getTreasuryClientId());
        request.put("subscriptionStartDate", LocalDate.now().minusMonths(1).toString());
        request.put("subscriptionEndDate", LocalDate.now().plusYears(1).toString());
        request.putAll(extraFields);

        Response createResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(request)
                .post("/api/admin/assets");

        assertThat(createResp.statusCode())
                .as("Create asset %s: %s", symbol, createResp.body().asString())
                .isEqualTo(201);
        String assetId = createResp.jsonPath().getString("id");
        context.storeId("lastAssetId", assetId);
        context.storeValue("lastSymbol", symbol);

        Response activateResp = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/activate");
        assertThat(activateResp.statusCode()).isEqualTo(200);
    }
}
