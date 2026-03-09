package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for amount-based trade preview.
 * Now uses POST /api/trades/quote with 'amount' field instead of removed /api/trades/preview.
 */
public class AmountPreviewSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user previews a BUY with amount {int} XAF for asset {string}")
    public void previewBuyWithAmount(int amount, String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + testUserJwt())
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .body(Map.of("assetId", assetId, "side", "BUY", "amount", amount))
                .post("/api/trades/quote");
        context.setLastResponse(response);
        // Cancel quote if created to avoid side effects
        if (response.statusCode() == 201) {
            String orderId = response.jsonPath().getString("orderId");
            if (orderId != null) {
                RestAssured.given()
                        .baseUri("http://localhost:" + port)
                        .header("Authorization", "Bearer " + testUserJwt())
                        .post("/api/trades/orders/" + orderId + "/cancel");
            }
        }
    }

    @Then("the preview units should be greater than {int}")
    public void previewUnitsShouldBeGreaterThan(int minUnits) {
        Number units = context.getLastResponse().jsonPath().get("units");
        assertThat(units.doubleValue()).isGreaterThan(minUnits);
    }

    @Then("the preview should include computedFromAmount equal to {int}")
    public void previewShouldIncludeComputedFromAmount(int expectedAmount) {
        Number computedFromAmount = context.getLastResponse().jsonPath().get("computedFromAmount");
        assertThat(computedFromAmount).isNotNull();
        assertThat(computedFromAmount.intValue()).isEqualTo(expectedAmount);
    }

    @Then("the preview should include a non-negative remainder")
    public void previewShouldIncludeNonNegativeRemainder() {
        Number remainder = context.getLastResponse().jsonPath().get("remainder");
        assertThat(remainder).isNotNull();
        assertThat(remainder.doubleValue()).isGreaterThanOrEqualTo(0);
    }

    @Then("the preview netAmount plus remainder should approximately equal the amount")
    public void previewNetAmountPlusRemainderShouldEqualAmount() {
        Number netAmount = context.getLastResponse().jsonPath().get("netAmount");
        Number remainder = context.getLastResponse().jsonPath().get("remainder");
        Number computedFromAmount = context.getLastResponse().jsonPath().get("computedFromAmount");

        assertThat(netAmount).isNotNull();
        assertThat(remainder).isNotNull();
        assertThat(computedFromAmount).isNotNull();

        double sum = netAmount.doubleValue() + remainder.doubleValue();
        assertThat(sum).isCloseTo(computedFromAmount.doubleValue(),
                org.assertj.core.data.Offset.offset(1.0));
    }

    @Then("the preview should not include computedFromAmount")
    public void previewShouldNotIncludeComputedFromAmount() {
        Object computedFromAmount = context.getLastResponse().jsonPath().get("computedFromAmount");
        assertThat(computedFromAmount).isNull();
    }

    @Then("the preview blockers should contain {string}")
    public void previewBlockersShouldContain(String expectedBlocker) {
        // With the new quote API, blockers are returned as error codes in the error response
        String errorCode = context.getLastResponse().jsonPath().getString("code");
        if (errorCode == null) {
            errorCode = context.getLastResponse().jsonPath().getString("error");
        }
        assertThat(errorCode).isEqualTo(expectedBlocker);
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                List.of());
    }

    private String resolveAssetId(String ref) {
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) {
            return stored;
        }
        return ref;
    }
}
