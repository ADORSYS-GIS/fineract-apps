package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.time.LocalDate;
import java.util.Map;

/**
 * Step definitions for asset delisting (initiate, cancel).
 */
public class DelistingSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the admin initiates delisting of asset {string} on date {int} days from now")
    public void adminInitiatesDelisting(String symbolRef, int daysFromNow) {
        String assetId = resolveAssetId(symbolRef);
        String delistingDate = LocalDate.now().plusDays(daysFromNow).toString();

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .body(Map.of("delistingDate", delistingDate))
                .post("/api/admin/assets/" + assetId + "/delist");
        context.setLastResponse(response);
    }

    @When("the admin cancels delisting of asset {string}")
    public void adminCancelsDelisting(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .post("/api/admin/assets/" + assetId + "/cancel-delist");
        context.setLastResponse(response);
    }

    private String resolveAssetId(String ref) {
        if ("lastCreated".equals(ref)) {
            return context.getId("lastAssetId");
        }
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) {
            return stored;
        }
        return ref;
    }
}
