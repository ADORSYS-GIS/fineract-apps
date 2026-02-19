package com.adorsys.fineract.e2e.client;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * REST-Assured client for direct Fineract API interaction in E2E tests.
 * Used for both test setup (creating GL accounts, clients, etc.) and
 * verification (checking balances, transfers, journal entries).
 *
 * <p>Uses basic auth (mifos:password) — no Keycloak needed.
 */
public class FineractTestClient {

    private final String baseUrl;
    private final String basicAuth;
    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.ENGLISH);

    public FineractTestClient(String baseUrl) {
        this.baseUrl = baseUrl;
        this.basicAuth = "Basic " + Base64.getEncoder()
                .encodeToString("mifos:password".getBytes());
    }

    // ---------------------------------------------------------------
    // Setup Methods (for @Given steps and initialization)
    // ---------------------------------------------------------------

    /**
     * Create a GL account in Fineract.
     *
     * @param name    Display name
     * @param glCode  GL code (e.g. "47")
     * @param type    1=Asset, 2=Liability, 4=Income, 5=Expense
     * @param usage   1=Header, 2=Detail
     * @return The created GL account database ID
     */
    public Long createGlAccount(String name, String glCode, int type, int usage) {
        Map<String, Object> body = Map.of(
                "name", name,
                "glCode", glCode,
                "manualEntriesAllowed", true,
                "type", type,
                "usage", usage,
                "description", "E2E test GL account: " + name
        );

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/glaccounts");

        response.then().statusCode(200);
        return response.jsonPath().getLong("resourceId");
    }

    /**
     * Create a payment type in Fineract.
     */
    public Long createPaymentType(String name, int position) {
        Map<String, Object> body = Map.of(
                "name", name,
                "description", "E2E test payment type",
                "isCashPayment", false,
                "position", position
        );

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/paymenttypes");

        response.then().statusCode(200);
        return response.jsonPath().getLong("resourceId");
    }

    /**
     * Register currencies in Fineract.
     */
    public void registerCurrencies(List<String> currencyCodes) {
        Map<String, Object> body = Map.of("currencies", currencyCodes);

        request()
                .body(body)
                .put("/fineract-provider/api/v1/currencies")
                .then().statusCode(200);
    }

    /**
     * Create a savings product for the given currency.
     *
     * @return The created product ID
     */
    public Integer createSavingsProduct(String name, String shortName,
                                         String currencyCode, int decimalPlaces,
                                         Long savingsReferenceAccountId,
                                         Long savingsControlAccountId,
                                         Long transfersInSuspenseId,
                                         Long incomeFromInterestId,
                                         Long expenseAccountId) {
        Map<String, Object> body = new HashMap<>();
        body.put("name", name);
        body.put("shortName", shortName);
        body.put("currencyCode", currencyCode);
        body.put("digitsAfterDecimal", decimalPlaces);
        body.put("inMultiplesOf", 0);
        body.put("nominalAnnualInterestRate", 0);
        body.put("interestCompoundingPeriodType", 1);
        body.put("interestPostingPeriodType", 4);
        body.put("interestCalculationType", 1);
        body.put("interestCalculationDaysInYearType", 365);
        body.put("accountingRule", 2); // Cash-based
        body.put("savingsReferenceAccountId", savingsReferenceAccountId);
        body.put("overdraftPortfolioControlId", savingsReferenceAccountId);
        body.put("savingsControlAccountId", savingsControlAccountId);
        body.put("transfersInSuspenseAccountId", savingsControlAccountId);
        body.put("incomeFromInterestId", incomeFromInterestId);
        body.put("incomeFromFeeAccountId", incomeFromInterestId);
        body.put("incomeFromPenaltyAccountId", incomeFromInterestId);
        body.put("interestOnSavingsAccountId", expenseAccountId);
        body.put("writeOffAccountId", expenseAccountId);
        body.put("locale", "en");

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/savingsproducts");

        response.then().statusCode(200);
        return response.jsonPath().getInt("resourceId");
    }

    /**
     * Create a client in Fineract.
     *
     * @return The created client ID
     */
    public Long createClient(String firstname, String lastname, String externalId) {
        String today = LocalDate.now().format(DATE_FORMAT);
        Map<String, Object> body = new HashMap<>();
        body.put("officeId", 1);
        body.put("firstname", firstname);
        body.put("lastname", lastname);
        body.put("active", true);
        body.put("activationDate", today);
        body.put("dateFormat", "dd MMMM yyyy");
        body.put("locale", "en");
        if (externalId != null) {
            body.put("externalId", externalId);
        }

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/clients");

        response.then().statusCode(200);
        return response.jsonPath().getLong("clientId");
    }

    /**
     * Provision a savings account: create, approve, activate.
     *
     * @return The created savings account ID
     */
    public Long provisionSavingsAccount(Long clientId, Integer productId) {
        String today = LocalDate.now().format(DATE_FORMAT);

        // Create
        Map<String, Object> createBody = Map.of(
                "clientId", clientId,
                "productId", productId,
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "submittedOnDate", today
        );
        Response createResp = request()
                .body(createBody)
                .post("/fineract-provider/api/v1/savingsaccounts");
        createResp.then().statusCode(200);
        Long accountId = createResp.jsonPath().getLong("savingsId");

        // Approve
        Map<String, Object> approveBody = Map.of(
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "approvedOnDate", today
        );
        request().body(approveBody)
                .post("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "?command=approve")
                .then().statusCode(200);

        // Activate
        Map<String, Object> activateBody = Map.of(
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "activatedOnDate", today
        );
        request().body(activateBody)
                .post("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "?command=activate")
                .then().statusCode(200);

        return accountId;
    }

    /**
     * Deposit to a savings account.
     *
     * @return Transaction ID
     */
    public Long depositToSavingsAccount(Long accountId, BigDecimal amount) {
        String today = LocalDate.now().format(DATE_FORMAT);
        Map<String, Object> body = Map.of(
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "transactionDate", today,
                "transactionAmount", amount,
                "paymentTypeId", 1
        );

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "/transactions?command=deposit");

        response.then().statusCode(200);
        return response.jsonPath().getLong("resourceId");
    }

    // ---------------------------------------------------------------
    // Verification Methods (for @Then steps)
    // ---------------------------------------------------------------

    /**
     * Get the available balance of a savings account.
     */
    public BigDecimal getAccountBalance(Long accountId) {
        Response response = request()
                .get("/fineract-provider/api/v1/savingsaccounts/" + accountId);

        response.then().statusCode(200);

        // Try summary.availableBalance first, then accountBalance
        Object availableBalance = response.jsonPath()
                .get("summary.availableBalance");
        if (availableBalance != null) {
            return new BigDecimal(availableBalance.toString());
        }
        Object accountBalance = response.jsonPath().get("accountBalance");
        if (accountBalance != null) {
            return new BigDecimal(accountBalance.toString());
        }
        return BigDecimal.ZERO;
    }

    /**
     * Get all savings accounts for a client.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientSavingsAccounts(Long clientId) {
        Response response = request()
                .get("/fineract-provider/api/v1/clients/" + clientId
                        + "/accounts?fields=savingsAccounts");

        response.then().statusCode(200);
        List<Map<String, Object>> accounts = response.jsonPath()
                .getList("savingsAccounts");
        return accounts != null ? accounts : List.of();
    }

    /**
     * Get savings account transactions.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAccountTransactions(Long accountId) {
        Response response = request()
                .get("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "?associations=transactions");

        response.then().statusCode(200);
        List<Map<String, Object>> txns = response.jsonPath()
                .getList("transactions");
        return txns != null ? txns : List.of();
    }

    /**
     * Get all GL accounts from Fineract.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getGlAccounts() {
        Response response = request()
                .get("/fineract-provider/api/v1/glaccounts");

        response.then().statusCode(200);
        return response.jsonPath().getList("");
    }

    /**
     * Check if a client exists by external ID.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getClientByExternalId(String externalId) {
        Response response = request()
                .get("/fineract-provider/api/v1/clients?externalId=" + externalId);

        response.then().statusCode(200);
        List<Map<String, Object>> pageItems = response.jsonPath()
                .getList("pageItems");
        return pageItems != null && !pageItems.isEmpty() ? pageItems.get(0) : null;
    }

    // ---------------------------------------------------------------
    // Internal
    // ---------------------------------------------------------------

    private RequestSpecification request() {
        return RestAssured.given()
                .baseUri(baseUrl)
                .relaxedHTTPSValidation()
                .header("Authorization", basicAuth)
                .header("Fineract-Platform-TenantId", "default")
                .contentType(ContentType.JSON)
                .accept(ContentType.JSON);
    }
}
