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

        assertOk(response, "createGlAccount(" + glCode + ")");
        return response.jsonPath().getLong("resourceId");
    }

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

        assertOk(response, "createPaymentType(" + name + ")");
        return response.jsonPath().getLong("resourceId");
    }

    public Long createFinancialActivityAccount(int financialActivityId, Long glAccountId) {
        Map<String, Object> body = Map.of(
                "financialActivityId", financialActivityId,
                "glAccountId", glAccountId
        );

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/financialactivityaccounts");

        assertOk(response, "createFinancialActivityAccount(" + financialActivityId
                + " -> glAccount " + glAccountId + ")");
        return response.jsonPath().getLong("resourceId");
    }

    public void registerCurrencies(List<String> currencyCodes) {
        Map<String, Object> body = Map.of("currencies", currencyCodes);

        Response response = request()
                .body(body)
                .put("/fineract-provider/api/v1/currencies");

        assertOk(response, "registerCurrencies(" + currencyCodes + ")");
    }

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

        assertOk(response, "createSavingsProduct(" + shortName + ")");
        return response.jsonPath().getInt("resourceId");
    }

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
        body.put("legalFormId", 1); // 1=Person
        if (externalId != null) {
            body.put("externalId", externalId);
        }

        Response response = request()
                .body(body)
                .post("/fineract-provider/api/v1/clients");

        assertOk(response, "createClient(" + firstname + " " + lastname + ")");
        return response.jsonPath().getLong("clientId");
    }

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
        assertOk(createResp, "createSavingsAccount(clientId=" + clientId + ")");
        Long accountId = createResp.jsonPath().getLong("savingsId");

        // Approve
        Map<String, Object> approveBody = Map.of(
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "approvedOnDate", today
        );
        Response approveResp = request().body(approveBody)
                .post("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "?command=approve");
        assertOk(approveResp, "approveSavingsAccount(" + accountId + ")");

        // Activate
        Map<String, Object> activateBody = Map.of(
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "activatedOnDate", today
        );
        Response activateResp = request().body(activateBody)
                .post("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "?command=activate");
        assertOk(activateResp, "activateSavingsAccount(" + accountId + ")");

        return accountId;
    }

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

        assertOk(response, "depositToSavingsAccount(" + accountId + ", " + amount + ")");
        return response.jsonPath().getLong("resourceId");
    }

    // ---------------------------------------------------------------
    // Verification Methods (for @Then steps)
    // ---------------------------------------------------------------

    public BigDecimal getAccountBalance(Long accountId) {
        Response response = request()
                .get("/fineract-provider/api/v1/savingsaccounts/" + accountId);

        assertOk(response, "getAccountBalance(" + accountId + ")");

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

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientSavingsAccounts(Long clientId) {
        Response response = request()
                .get("/fineract-provider/api/v1/clients/" + clientId
                        + "/accounts?fields=savingsAccounts");

        assertOk(response, "getClientSavingsAccounts(" + clientId + ")");
        List<Map<String, Object>> accounts = response.jsonPath()
                .getList("savingsAccounts");
        return accounts != null ? accounts : List.of();
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getAccountTransactions(Long accountId) {
        Response response = request()
                .get("/fineract-provider/api/v1/savingsaccounts/" + accountId
                        + "?associations=transactions");

        assertOk(response, "getAccountTransactions(" + accountId + ")");
        List<Map<String, Object>> txns = response.jsonPath()
                .getList("transactions");
        return txns != null ? txns : List.of();
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getGlAccounts() {
        Response response = request()
                .get("/fineract-provider/api/v1/glaccounts");

        assertOk(response, "getGlAccounts");
        return response.jsonPath().getList("");
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getClientByExternalId(String externalId) {
        Response response = request()
                .get("/fineract-provider/api/v1/clients?externalId=" + externalId);

        assertOk(response, "getClientByExternalId(" + externalId + ")");
        List<Map<String, Object>> pageItems = response.jsonPath()
                .getList("pageItems");
        return pageItems != null && !pageItems.isEmpty() ? pageItems.get(0) : null;
    }

    // ---------------------------------------------------------------
    // Internal
    // ---------------------------------------------------------------

    private void assertOk(Response response, String operation) {
        if (response.statusCode() != 200) {
            throw new RuntimeException("Fineract " + operation + " failed: HTTP "
                    + response.statusCode() + " - " + response.body().asString());
        }
    }

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
