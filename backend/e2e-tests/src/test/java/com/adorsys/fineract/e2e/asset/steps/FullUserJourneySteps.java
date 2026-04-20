package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for the full user journey integration scenario.
 * Simulates the customer registration and payment deposit via direct Fineract calls,
 * then exercises the asset-service trading and portfolio endpoints.
 */
public class FullUserJourneySteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @Autowired
    private FineractTestClient fineractTestClient;

    // ---------------------------------------------------------------
    // Customer registration (simulated via Fineract)
    // ---------------------------------------------------------------

    @Given("a new customer {string} {string} is registered in Fineract with external ID {string}")
    public void newCustomerRegistered(String firstName, String lastName, String externalId) {
        Long clientId = fineractTestClient.createClient(firstName, lastName, externalId);
        context.storeValue("journeyClientId", clientId);
        context.storeValue("journeyExternalId", externalId);
    }

    @And("the customer has an XAF savings account")
    public void customerHasXafSavingsAccount() {
        Long clientId = context.getValue("journeyClientId");
        Long accountId = fineractTestClient.provisionSavingsAccount(
                clientId, FineractInitializer.getXafSavingsProductId());
        context.storeValue("journeyXafAccountId", accountId);
    }

    // ---------------------------------------------------------------
    // Payment deposit (simulated via Fineract)
    // ---------------------------------------------------------------

    @When("the customer deposits {int} XAF into their account")
    public void customerDeposits(int amount) {
        Long accountId = context.getValue("journeyXafAccountId");
        fineractTestClient.depositToSavingsAccount(accountId, BigDecimal.valueOf(amount));
        context.storeValue("depositAmount", BigDecimal.valueOf(amount));
    }

    @Then("the customer's XAF balance should be {int}")
    public void customerBalanceShouldBe(int expectedBalance) {
        Long accountId = context.getValue("journeyXafAccountId");
        BigDecimal balance = fineractTestClient.getAccountBalance(accountId);
        assertThat(balance.intValue()).isEqualTo(expectedBalance);
    }

    @Then("the customer's XAF balance should have decreased")
    public void customerBalanceShouldHaveDecreased() {
        Long accountId = context.getValue("journeyXafAccountId");
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal currentBalance = fineractTestClient.getAccountBalance(accountId);
        assertThat(currentBalance).isLessThan(balanceBefore);
    }

    @Then("the customer's XAF balance should have increased")
    public void customerBalanceShouldHaveIncreased() {
        Long accountId = context.getValue("journeyXafAccountId");
        BigDecimal balanceBefore = context.getValue("xafBalanceBefore");
        BigDecimal currentBalance = fineractTestClient.getAccountBalance(accountId);
        assertThat(currentBalance).isGreaterThan(balanceBefore);
    }

    // ---------------------------------------------------------------
    // Trading (uses journey user JWT)
    // ---------------------------------------------------------------

    @When("the journey user buys {int} units of {string}")
    public void journeyUserBuys(int units, String symbolRef) {
        Long accountId = context.getValue("journeyXafAccountId");
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(accountId);
        context.storeValue("xafBalanceBefore", balanceBefore);
        quoteConfirmAndPoll(symbolRef, "BUY", units);
    }

    @When("the journey user sells {int} units of {string}")
    public void journeyUserSells(int units, String symbolRef) {
        Long accountId = context.getValue("journeyXafAccountId");
        BigDecimal balanceBefore = fineractTestClient.getAccountBalance(accountId);
        context.storeValue("xafBalanceBefore", balanceBefore);
        quoteConfirmAndPoll(symbolRef, "SELL", units);
    }

    private void quoteConfirmAndPoll(String symbolRef, String side, int units) {
        String assetId = resolveAssetId(symbolRef);
        String externalId = context.getValue("journeyExternalId");
        Long clientId = context.getValue("journeyClientId");

        String jwt = JwtTokenFactory.generateToken(externalId, clientId, List.of());

        // 1. Create quote
        Map<String, Object> quoteBody = Map.of(
                "assetId", assetId,
                "side", side,
                "units", units
        );

        Response quoteResponse = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("X-Idempotency-Key", UUID.randomUUID().toString())
                .header("Authorization", "Bearer " + jwt)
                .body(quoteBody)
                .post("/api/v1/trades/quote");

        assertThat(quoteResponse.statusCode())
                .as("Create quote: %s", quoteResponse.body().asString())
                .isEqualTo(201);

        String orderId = quoteResponse.jsonPath().getString("orderId");

        // 2. Confirm order
        Response confirmResponse = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .contentType(ContentType.JSON)
                .header("Authorization", "Bearer " + jwt)
                .post("/api/v1/trades/orders/" + orderId + "/confirm");

        assertThat(confirmResponse.statusCode())
                .as("Confirm order: %s", confirmResponse.body().asString())
                .isEqualTo(202);

        // 3. Poll until FILLED
        long deadline = System.currentTimeMillis() + 15_000;
        while (System.currentTimeMillis() < deadline) {
            Response statusResponse = RestAssured.given()
                    .baseUri("http://localhost:" + port)
                    .header("Authorization", "Bearer " + jwt)
                    .get("/api/v1/trades/orders/" + orderId);

            String status = statusResponse.jsonPath().getString("status");
            if ("FILLED".equals(status)) {
                context.setLastResponse(statusResponse);
                context.storeId("lastOrderId", orderId);
                return;
            }
            if ("FAILED".equals(status) || "REJECTED".equals(status)) {
                context.setLastResponse(statusResponse);
                assertThat(status).as("Order failed: %s", statusResponse.body().asString())
                        .isEqualTo("FILLED");
                return;
            }
            try { Thread.sleep(500); } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        // Final check
        Response finalResponse = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + jwt)
                .get("/api/v1/trades/orders/" + orderId);
        context.setLastResponse(finalResponse);
        assertThat(finalResponse.jsonPath().getString("status"))
                .as("Order did not reach FILLED within timeout")
                .isEqualTo("FILLED");
    }


    // ---------------------------------------------------------------
    // Portfolio verification
    // ---------------------------------------------------------------

    @Then("the journey user's portfolio should contain {string} with {int} units")
    public void journeyUserPortfolioShouldContain(String symbol, int expectedUnits) {
        String externalId = context.getValue("journeyExternalId");
        Long clientId = context.getValue("journeyClientId");
        String jwt = JwtTokenFactory.generateToken(externalId, clientId, List.of());

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + jwt)
                .get("/api/v1/portfolio");

        assertThat(response.statusCode()).isEqualTo(200);

        List<String> symbols = response.jsonPath().getList("positions.symbol");
        assertThat(symbols).contains(symbol);

        // Find the position for this symbol and verify units
        List<Map<String, Object>> positions = response.jsonPath().getList("positions");
        boolean found = false;
        for (Map<String, Object> pos : positions) {
            if (symbol.equals(pos.get("symbol"))) {
                BigDecimal units = new BigDecimal(pos.get("totalUnits").toString());
                assertThat(units.intValue()).isEqualTo(expectedUnits);
                found = true;
                break;
            }
        }
        assertThat(found).as("Position for %s not found in portfolio", symbol).isTrue();
    }

    @When("the journey user requests their income calendar for {int} months")
    public void journeyUserRequestsIncomeCalendar(int months) {
        String externalId = context.getValue("journeyExternalId");
        Long clientId = context.getValue("journeyClientId");
        String jwt = JwtTokenFactory.generateToken(externalId, clientId, List.of());

        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + jwt)
                .queryParam("months", months)
                .get("/api/v1/portfolio/income-calendar");
        context.setLastResponse(response);
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private String resolveAssetId(String ref) {
        String perSymbol = context.getId("assetId_" + ref);
        if (perSymbol != null) return perSymbol;
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) return stored;
        return ref;
    }
}
