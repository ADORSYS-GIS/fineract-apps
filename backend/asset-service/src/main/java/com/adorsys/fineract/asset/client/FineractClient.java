package com.adorsys.fineract.asset.client;

import com.adorsys.fineract.asset.config.FineractConfig;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.exception.ClientNotProvisionedException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Client for Fineract API operations related to asset management.
 * Handles currency registration, savings product/account creation,
 * and account transfers for trading.
 */
@Slf4j
@Component
public class FineractClient {

    private final FineractConfig config;
    private final FineractTokenProvider tokenProvider;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("dd MMMM yyyy", Locale.ENGLISH);

    public FineractClient(FineractConfig config,
                          FineractTokenProvider tokenProvider,
                          @Qualifier("fineractWebClient") WebClient webClient,
                          ObjectMapper objectMapper) {
        this.config = config;
        this.tokenProvider = tokenProvider;
        this.webClient = webClient;
        this.objectMapper = objectMapper;
    }

    /**
     * Sealed interface for operations that can be included in an atomic Fineract batch.
     */
    public sealed interface BatchOperation permits BatchTransferOp, BatchJournalEntryOp {}

    /**
     * Account transfer between two savings accounts.
     */
    public record BatchTransferOp(
            Long fromAccountId, Long toAccountId,
            BigDecimal amount, String description
    ) implements BatchOperation {}

    /**
     * Manual GL journal entry (debit one account, credit another).
     */
    public record BatchJournalEntryOp(
            Long debitGlAccountId, Long creditGlAccountId,
            BigDecimal amount, String currencyCode, String description
    ) implements BatchOperation {}

    /**
     * Get existing currencies registered in Fineract.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getExistingCurrencies() {
        try {
            Map<String, Object> response = webClient.get()
                    .uri("/fineract-provider/api/v1/currencies")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            return response != null
                    ? (List<Map<String, Object>>) response.get("selectedCurrencyOptions")
                    : List.of();
        } catch (Exception e) {
            log.error("Failed to get existing currencies: {}", e.getMessage());
            throw new AssetException("Failed to get currencies from Fineract", e);
        }
    }

    /**
     * Register currencies in Fineract. Appends new currencies to the existing list
     * so that previously registered currencies (e.g. XAF) are not removed.
     */
    @SuppressWarnings("unchecked")
    public void registerCurrencies(List<String> currencyCodes) {
        try {
            // Get existing currencies to avoid removing them
            List<Map<String, Object>> existing = getExistingCurrencies();
            Set<String> allCurrencies = new java.util.LinkedHashSet<>();
            for (Map<String, Object> c : existing) {
                allCurrencies.add((String) c.get("code"));
            }
            allCurrencies.addAll(currencyCodes);

            Map<String, Object> body = Map.of("currencies", new java.util.ArrayList<>(allCurrencies));

            webClient.put()
                    .uri("/fineract-provider/api/v1/currencies")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException(parseFineractError("Failed to register currency", b)))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            log.info("Registered currencies in Fineract: {}", currencyCodes);
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to register currencies: {}", e.getMessage());
            throw new AssetException("Failed to register currencies in Fineract", e);
        }
    }

    /**
     * Best-effort deregistration of a currency from Fineract.
     * Used during rollback if provisioning fails after currency registration.
     */
    @SuppressWarnings("unchecked")
    public void deregisterCurrency(String currencyCode) {
        try {
            List<Map<String, Object>> existing = getExistingCurrencies();
            List<String> remaining = existing.stream()
                    .map(c -> (String) c.get("code"))
                    .filter(code -> !code.equals(currencyCode))
                    .toList();

            Map<String, Object> body = Map.of("currencies", remaining);

            webClient.put()
                    .uri("/fineract-provider/api/v1/currencies")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            // Also delete the custom currency from the reference table
            webClient.delete()
                    .uri("/fineract-provider/api/v1/currencies/custom/{code}", currencyCode)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .toBodilessEntity()
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            log.info("Deregistered currency: {}", currencyCode);
        } catch (Exception e) {
            log.error("ROLLBACK FAILURE: Failed to deregister currency {}. "
                    + "Orphaned resource requires manual cleanup.", currencyCode, e);
        }
    }

    /**
     * Create a savings product for an asset currency.
     *
     * @return The created product ID
     */
    @SuppressWarnings("unchecked")
    public Integer createSavingsProduct(String name, String shortName, String currencyCode,
                                        int decimalPlaces, Long savingsReferenceAccountId,
                                        Long savingsControlAccountId,
                                        Long transfersInSuspenseAccountId,
                                        Long incomeFromInterestId,
                                        Long expenseAccountId) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("name", name);
            body.put("shortName", shortName);
            body.put("currencyCode", currencyCode);
            body.put("digitsAfterDecimal", decimalPlaces);
            body.put("inMultiplesOf", 0);
            body.put("nominalAnnualInterestRate", 0);
            body.put("interestCompoundingPeriodType", 1); // Daily
            body.put("interestPostingPeriodType", 4); // Monthly
            body.put("interestCalculationType", 1); // Daily Balance
            body.put("interestCalculationDaysInYearType", 365);
            body.put("accountingRule", 2); // Cash-based
            // ASSET type accounts
            body.put("savingsReferenceAccountId", savingsReferenceAccountId);
            body.put("overdraftPortfolioControlId", savingsReferenceAccountId);
            // LIABILITY type accounts
            body.put("savingsControlAccountId", savingsControlAccountId);
            body.put("transfersInSuspenseAccountId", savingsControlAccountId);
            // INCOME type accounts
            body.put("incomeFromInterestId", incomeFromInterestId);
            body.put("incomeFromFeeAccountId", incomeFromInterestId);
            body.put("incomeFromPenaltyAccountId", incomeFromInterestId);
            // EXPENSE type accounts
            body.put("interestOnSavingsAccountId", expenseAccountId);
            body.put("writeOffAccountId", expenseAccountId);
            body.put("locale", "en");

            Map<String, Object> response = webClient.post()
                    .uri("/fineract-provider/api/v1/savingsproducts")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException(parseFineractError("Failed to create savings product", b)))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            Integer productId = ((Number) response.get("resourceId")).intValue();
            log.info("Created savings product: name={}, productId={}", name, productId);
            return productId;
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create savings product: {}", e.getMessage());
            throw new AssetException("Failed to create savings product in Fineract", e);
        }
    }

    /**
     * Best-effort deletion of a savings product by ID.
     * Used during rollback if provisioning fails after product creation.
     */
    public void deleteSavingsProduct(Integer productId) {
        try {
            webClient.delete()
                    .uri("/fineract-provider/api/v1/savingsproducts/{productId}", productId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .toBodilessEntity()
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();
            log.info("Rolled back savings product: productId={}", productId);
        } catch (Exception e) {
            // Fineract refuses to delete a product that still has savings accounts.
            // Log the blocking account IDs so ops can close them manually before retrying.
            logBlockingAccountsForProduct(productId);
            log.error("ROLLBACK FAILURE: Failed to delete savings product {} — "
                    + "manually close the accounts above, then DELETE /savingsproducts/{}",
                    productId, productId, e);
        }
    }

    @SuppressWarnings("unchecked")
    private void logBlockingAccountsForProduct(Integer productId) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri(u -> u.path("/fineract-provider/api/v1/savingsaccounts")
                            .queryParam("productId", productId)
                            .queryParam("fields", "id,accountNo,status")
                            .build())
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();
            List<Map<String, Object>> accounts = response != null
                    ? (List<Map<String, Object>>) response.get("pageItems") : List.of();
            if (accounts != null && !accounts.isEmpty()) {
                accounts.forEach(a -> log.warn(
                        "Orphan blocker — savings account id={}, accountNo={}, status={} references productId={}",
                        a.get("id"), a.get("accountNo"),
                        ((Map<?, ?>) a.getOrDefault("status", java.util.Map.of())).get("value"),
                        productId));
            }
        } catch (Exception ignored) {
            // best-effort diagnostic; don't mask the original deletion failure
        }
    }

    /**
     * Find a savings product by its short name.
     *
     * @param shortName The product short name (e.g. "VSAV")
     * @return The product ID, or null if not found
     */
    @SuppressWarnings("unchecked")
    public Integer findSavingsProductByShortName(String shortName) {
        try {
            List<Map<String, Object>> products = webClient.get()
                    .uri("/fineract-provider/api/v1/savingsproducts?fields=id,name,shortName")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            if (products == null) return null;

            return products.stream()
                    .filter(p -> shortName.equals(p.get("shortName")))
                    .map(p -> ((Number) p.get("id")).intValue())
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Failed to find savings product by shortName '{}': {}", shortName, e.getMessage());
            throw new AssetException("Failed to look up savings product: " + shortName, e);
        }
    }

    /**
     * Find a savings product by its full name.
     * Used as a fallback orphan check — Fineract enforces name uniqueness in addition to shortName.
     *
     * @param name The full product name (e.g. "Treasury Bond 5Y Token")
     * @return The product ID, or null if not found
     */
    @SuppressWarnings("unchecked")
    public Integer findSavingsProductByName(String name) {
        try {
            List<Map<String, Object>> products = webClient.get()
                    .uri("/fineract-provider/api/v1/savingsproducts?fields=id,name,shortName")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            if (products == null) return null;

            return products.stream()
                    .filter(p -> name.equals(p.get("name")))
                    .map(p -> ((Number) p.get("id")).intValue())
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            log.error("Failed to find savings product by name '{}': {}", name, e.getMessage());
            throw new AssetException("Failed to look up savings product by name: " + name, e);
        }
    }

    /**
     * Deposit into a savings account (used for initial supply minting).
     *
     * @return Transaction ID
     */
    @SuppressWarnings("unchecked")
    public Long depositToSavingsAccount(Long accountId, BigDecimal amount, Long paymentTypeId) {
        try {
            Map<String, Object> body = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "transactionDate", LocalDate.now().format(DATE_FORMAT),
                    "transactionAmount", amount,
                    "paymentTypeId", paymentTypeId
            );

            Map<String, Object> response = webClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{id}/transactions?command=deposit", accountId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract deposit error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            Long txId = ((Number) response.get("resourceId")).longValue();
            log.info("Deposited to savings account: accountId={}, amount={}, txId={}", accountId, amount, txId);
            return txId;
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to deposit: accountId={}, error={}", accountId, e.getMessage());
            throw new AssetException("Failed to deposit to savings account", e);
        }
    }

    /**
     * Create an account transfer between two savings accounts.
     * Used for both cash and asset legs of a trade.
     *
     * @return Transfer ID
     */
    @SuppressWarnings("unchecked")
    public Long createAccountTransfer(Long fromAccountId, Long toAccountId,
                                       BigDecimal amount, String description) {
        try {
            // Fineract requires officeId/clientId fields but resolves the actual
            // owner from the savings account ID. These values are placeholders.
            Map<String, Object> body = new HashMap<>();
            body.put("fromOfficeId", 1);
            body.put("fromClientId", 1);
            body.put("fromAccountType", 2); // Savings
            body.put("fromAccountId", fromAccountId);
            body.put("toOfficeId", 1);
            body.put("toClientId", 1);
            body.put("toAccountType", 2); // Savings
            body.put("toAccountId", toAccountId);
            body.put("transferAmount", amount);
            body.put("transferDate", LocalDate.now().format(DATE_FORMAT));
            body.put("transferDescription", description);
            body.put("locale", "en");
            body.put("dateFormat", "dd MMMM yyyy");

            Map<String, Object> response = webClient.post()
                    .uri("/fineract-provider/api/v1/accounttransfers")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract transfer error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            Long transferId = ((Number) response.get("resourceId")).longValue();
            log.info("Account transfer: from={}, to={}, amount={}, transferId={}",
                    fromAccountId, toAccountId, amount, transferId);
            return transferId;
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create account transfer: from={}, to={}, error={}",
                    fromAccountId, toAccountId, e.getMessage());
            throw new AssetException("Failed to create account transfer in Fineract", e);
        }
    }

    /**
     * Withdraw from a savings account. Used for fee deductions where the fee
     * is then posted to a GL account via journal entry rather than transferred
     * to another savings account.
     *
     * @return Transaction ID
     */
    @SuppressWarnings("unchecked")
    public Long withdrawFromSavingsAccount(Long savingsAccountId, BigDecimal amount, String note) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("transactionDate", LocalDate.now().format(DATE_FORMAT));
            body.put("transactionAmount", amount);
            body.put("paymentTypeId", 2); // Bank Transfer
            body.put("note", note);
            body.put("locale", "en");
            body.put("dateFormat", "dd MMMM yyyy");

            Map<String, Object> response = webClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/" + savingsAccountId + "/transactions?command=withdrawal")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract withdrawal error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            Long transactionId = ((Number) response.get("resourceId")).longValue();
            log.info("Savings withdrawal: account={}, amount={}, txnId={}", savingsAccountId, amount, transactionId);
            return transactionId;
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to withdraw from savings account {}: {}", savingsAccountId, e.getMessage());
            throw new AssetException("Failed to withdraw from savings account in Fineract", e);
        }
    }

    /**
     * Close a savings account in Fineract. The account balance must be zero
     * before closing. Used during pending asset deletion to clean up treasury accounts.
     */
    public void closeSavingsAccount(Long savingsAccountId, String note) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("withdrawBalance", "false");
            body.put("closedOnDate", LocalDate.now().format(DATE_FORMAT));
            body.put("note", note);
            body.put("locale", "en");
            body.put("dateFormat", "dd MMMM yyyy");

            webClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/" + savingsAccountId + "?command=close")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract close account error: " + b))))
                    .toBodilessEntity()
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            log.info("Closed savings account: {}", savingsAccountId);
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to close savings account {}: {}", savingsAccountId, e.getMessage());
            throw new AssetException("Failed to close savings account in Fineract", e);
        }
    }

    /**
     * Get all savings accounts for a client.
     * Uses the client-specific endpoint which properly filters by client ID.
     * Note: /savingsaccounts?clientId= does NOT filter in Fineract; use /clients/{id}/accounts instead.
     */
    @Retry(name = "fineract")
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientSavingsAccounts(Long clientId) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/accounts?fields=savingsAccounts", clientId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            return response != null
                    ? (List<Map<String, Object>>) response.getOrDefault("savingsAccounts", List.of())
                    : List.of();
        } catch (WebClientRequestException e) {
            log.warn("Network error getting savings accounts for clientId={}: {}", clientId, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Failed to get client savings accounts: clientId={}, error={}", clientId, e.getMessage());
            throw new AssetException("Failed to get client savings accounts from Fineract", e);
        }
    }

    /**
     * Get the available balance of a savings account.
     * Uses Fineract's summary.availableBalance which accounts for holds/pending transactions.
     *
     * @return The available balance, or ZERO if the account has no balance information
     */
    @SuppressWarnings("unchecked")
    public BigDecimal getAccountBalance(Long accountId) {
        Map<String, Object> account = getSavingsAccount(accountId);
        Map<String, Object> summary = (Map<String, Object>) account.get("summary");
        if (summary != null && summary.get("availableBalance") != null) {
            return new BigDecimal(summary.get("availableBalance").toString());
        }
        if (account.get("accountBalance") != null) {
            return new BigDecimal(account.get("accountBalance").toString());
        }
        return BigDecimal.ZERO;
    }

    /**
     * Get savings account details including balance.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getSavingsAccount(Long accountId) {
        try {
            return webClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{id}", accountId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();
        } catch (Exception e) {
            log.error("Failed to get savings account: {}", e.getMessage());
            throw new AssetException("Failed to get savings account from Fineract", e);
        }
    }

    /**
     * Look up a Fineract savings account by its external ID.
     *
     * @param externalId the external ID assigned to the savings account
     * @return the savings account database ID, or null if not found
     */
    @SuppressWarnings("unchecked")
    public Long findSavingsAccountByExternalId(String externalId) {
        try {
            Map<String, Object> resp = webClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/external-id/{externalId}", externalId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();
            return resp != null ? ((Number) resp.get("id")).longValue() : null;
        } catch (Exception e) {
            log.debug("Savings account with external ID '{}' not found: {}", externalId, e.getMessage());
            return null;
        }
    }

    /**
     * Get the display name of a Fineract client by ID.
     *
     * @param clientId the Fineract client ID
     * @return the client's displayName, or null if not found
     */
    @SuppressWarnings("unchecked")
    public String getClientDisplayName(Long clientId) {
        try {
            Map<String, Object> client = webClient.get()
                    .uri("/fineract-provider/api/v1/clients/{id}", clientId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            return client != null ? (String) client.get("displayName") : null;
        } catch (Exception e) {
            log.warn("Failed to look up client displayName for clientId={}: {}", clientId, e.getMessage());
            return null;
        }
    }

    /**
     * Get client by external ID (Keycloak UUID).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getClientByExternalId(String externalId) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri("/fineract-provider/api/v1/clients?externalId={externalId}", externalId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            var pageItems = (List<Map<String, Object>>) response.get("pageItems");
            if (pageItems == null || pageItems.isEmpty()) {
                throw new ClientNotProvisionedException(externalId);
            }

            return pageItems.get(0);
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to get client: externalId={}, error={}", externalId, e.getMessage());
            throw new AssetException("Failed to get client from Fineract", e);
        }
    }

    /**
     * Find a client's active savings account by currency code.
     *
     * @return The savings account ID, or null if not found
     */
    @SuppressWarnings("unchecked")
    public Long findClientSavingsAccountByCurrency(Long clientId, String currencyCode) {
        List<Map<String, Object>> accounts = getClientSavingsAccounts(clientId);
        return accounts.stream()
                .filter(a -> {
                    Map<String, Object> currency = (Map<String, Object>) a.get("currency");
                    Map<String, Object> status = (Map<String, Object>) a.get("status");
                    return currency != null && currencyCode.equals(currency.get("code"))
                            && status != null && Boolean.TRUE.equals(status.get("active"));
                })
                .map(a -> ((Number) a.get("id")).longValue())
                .findFirst()
                .orElse(null);
    }

    /**
     * Atomically provision a savings account: create → approve → activate → optional deposit.
     * Uses Fineract Batch API with enclosingTransaction=true so if ANY step fails, ALL are rolled back.
     *
     * @param clientId      Fineract client ID
     * @param productId     Savings product ID
     * @param depositAmount Amount to deposit after activation (null to skip deposit)
     * @param paymentTypeId Payment type for deposit (required if depositAmount is set)
     * @return The created savings account ID
     */
    @CircuitBreaker(name = "fineract")
    @SuppressWarnings("unchecked")
    public Long provisionSavingsAccount(Long clientId, Integer productId,
                                         BigDecimal depositAmount, Long paymentTypeId) {
        try {
            String today = LocalDate.now().format(DATE_FORMAT);

            // Step 1: Create savings account
            Map<String, Object> createBody = Map.of(
                    "clientId", clientId,
                    "productId", productId,
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "submittedOnDate", today
            );
            Map<String, Object> createResp = fineractPost(
                    "/fineract-provider/api/v1/savingsaccounts", createBody);
            Long savingsId = ((Number) createResp.get("savingsId")).longValue();
            log.info("Created savings account: savingsId={}", savingsId);

            // Step 2: Approve
            Map<String, Object> approveBody = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "approvedOnDate", today
            );
            fineractPost("/fineract-provider/api/v1/savingsaccounts/" + savingsId + "?command=approve", approveBody);
            log.info("Approved savings account: savingsId={}", savingsId);

            // Step 3: Activate
            Map<String, Object> activateBody = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "activatedOnDate", today
            );
            fineractPost("/fineract-provider/api/v1/savingsaccounts/" + savingsId + "?command=activate", activateBody);
            log.info("Activated savings account: savingsId={}", savingsId);

            // Step 4 (optional): Deposit initial supply
            if (depositAmount != null && depositAmount.compareTo(BigDecimal.ZERO) > 0) {
                Map<String, Object> depositBody = new HashMap<>();
                depositBody.put("locale", "en");
                depositBody.put("dateFormat", "dd MMMM yyyy");
                depositBody.put("transactionDate", today);
                depositBody.put("transactionAmount", depositAmount);
                depositBody.put("paymentTypeId", paymentTypeId);
                fineractPost("/fineract-provider/api/v1/savingsaccounts/" + savingsId
                        + "/transactions?command=deposit", depositBody);
                log.info("Deposited {} into savings account: savingsId={}", depositAmount, savingsId);
            }

            log.info("Provisioned savings account: clientId={}, productId={}, savingsId={}",
                    clientId, productId, savingsId);
            return savingsId;

        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to provision savings account: clientId={}, productId={}, error={}",
                    clientId, productId, e.getMessage());
            throw new AssetException("Failed to provision savings account in Fineract", e);
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> fineractPost(String uri, Map<String, Object> body) {
        return webClient.post()
                .uri(uri)
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(body)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                        resp -> resp.bodyToMono(String.class)
                                .flatMap(b -> Mono.error(new AssetException(parseFineractError("Core banking API call failed", b)))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();
    }

    /**
     * Execute operations atomically via Fineract's Batch API.
     * Uses {@code POST /batches?enclosingTransaction=true} so all operations
     * succeed or all are rolled back on the Fineract side.
     *
     * @param operations List of batch transfer operations
     * @return List of batch response items from Fineract
     * @throws AssetException if the batch fails
     */
    @Retry(name = "fineract")
    @CircuitBreaker(name = "fineract")
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> executeAtomicBatch(List<BatchOperation> operations) {
        if (operations.isEmpty()) {
            return List.of();
        }

        List<Map<String, Object>> batchRequests = new ArrayList<>();
        String today = LocalDate.now().format(DATE_FORMAT);

        for (int i = 0; i < operations.size(); i++) {
            BatchOperation op = operations.get(i);
            Map<String, Object> body;
            String relativeUrl;

            switch (op) {
                case BatchTransferOp t -> {
                    body = new HashMap<>();
                    body.put("fromOfficeId", 1);
                    body.put("fromClientId", 1);
                    body.put("fromAccountType", 2);
                    body.put("fromAccountId", t.fromAccountId());
                    body.put("toOfficeId", 1);
                    body.put("toClientId", 1);
                    body.put("toAccountType", 2);
                    body.put("toAccountId", t.toAccountId());
                    body.put("transferAmount", t.amount());
                    body.put("transferDate", today);
                    body.put("transferDescription", t.description());
                    body.put("locale", "en");
                    body.put("dateFormat", "dd MMMM yyyy");
                    relativeUrl = "accounttransfers";
                }
                case BatchJournalEntryOp j -> {
                    body = new HashMap<>();
                    body.put("officeId", 1);
                    body.put("transactionDate", today);
                    body.put("locale", "en");
                    body.put("dateFormat", "dd MMMM yyyy");
                    body.put("currencyCode", j.currencyCode());
                    body.put("comments", j.description() != null ? j.description() : "Settlement");
                    body.put("debits", List.of(Map.of("glAccountId", j.debitGlAccountId(), "amount", j.amount())));
                    body.put("credits", List.of(Map.of("glAccountId", j.creditGlAccountId(), "amount", j.amount())));
                    relativeUrl = "journalentries";
                }
            }

            String bodyJson;
            try {
                bodyJson = objectMapper.writeValueAsString(body);
            } catch (JsonProcessingException e) {
                throw new AssetException("Failed to serialize batch request body", e);
            }

            Map<String, Object> batchItem = new HashMap<>();
            batchItem.put("requestId", (long) (i + 1));
            batchItem.put("relativeUrl", relativeUrl);
            batchItem.put("method", "POST");
            batchItem.put("headers", List.of(Map.of("name", "Content-Type", "value", "application/json")));
            batchItem.put("body", bodyJson);
            batchRequests.add(batchItem);
        }

        try {
            List<Map<String, Object>> responses = webClient.post()
                    .uri("/fineract-provider/api/v1/batches?enclosingTransaction=true")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .header("Fineract-Platform-TenantId", config.getTenant())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(batchRequests)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException(parseFineractError("Failed to provision account", b)))))
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            if (responses != null) {
                for (Map<String, Object> resp : responses) {
                    Integer statusCode = (Integer) resp.get("statusCode");
                    if (statusCode == null || statusCode < 200 || statusCode >= 300) {
                        String respBody = resp.get("body") != null ? resp.get("body").toString() : "unknown error";
                        throw new AssetException("Batch leg " + resp.get("requestId")
                                + " failed with status " + statusCode + ": " + respBody);
                    }
                }
            }

            log.info("Executed {} operations atomically via Fineract Batch API", operations.size());
            return responses != null ? responses : List.of();
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Fineract batch API failed: {}", e.getMessage());
            throw new AssetException("Batch operation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Look up all GL accounts from Fineract and return a map of GL code to database ID.
     * Used at startup to resolve configured GL codes to their actual database IDs.
     *
     * @return Map of GL code (String) to database ID (Long)
     */
    @SuppressWarnings("unchecked")
    public Map<String, Long> lookupGlAccounts() {
        List<Map<String, Object>> accounts = getGlAccountsFull();
        Map<String, Long> codeToId = new HashMap<>();
        if (accounts != null) {
            for (Map<String, Object> acct : accounts) {
                String code = (String) acct.get("glCode");
                Long id = ((Number) acct.get("id")).longValue();
                codeToId.put(code, id);
            }
        }
        return codeToId;
    }

    /**
     * Fetch all GL accounts from Fineract with full details.
     * Returns list of maps containing: id, glCode, name, type.value, parentId, usage.value.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getGlAccountsFull() {
        return webClient.get()
                .uri("/fineract-provider/api/v1/glaccounts")
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .retrieve()
                .bodyToMono(List.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();
    }

    /**
     * Fetch journal entries from Fineract for a specific GL account within a date range.
     * Handles pagination automatically.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getJournalEntries(Long glAccountId, String currencyCode,
                                                        String fromDate, String toDate) {
        List<Map<String, Object>> allEntries = new ArrayList<>();
        int offset = 0;
        int limit = 500;
        boolean hasMore = true;

        while (hasMore) {
            final int currentOffset = offset;
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/fineract-provider/api/v1/journalentries")
                            .queryParam("glAccountId", glAccountId)
                            .queryParam("currencyCode", currencyCode)
                            .queryParam("offset", currentOffset)
                            .queryParam("limit", limit)
                            .queryParamIfPresent("fromDate", Optional.ofNullable(fromDate))
                            .queryParamIfPresent("toDate", Optional.ofNullable(toDate))
                            .build())
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            if (response != null && response.get("pageItems") instanceof List<?> items) {
                allEntries.addAll((List<Map<String, Object>>) items);
                int totalFiltered = response.get("totalFilteredRecords") instanceof Number n
                        ? n.intValue() : items.size();
                hasMore = (offset + limit) < totalFiltered;
                offset += limit;
            } else {
                hasMore = false;
            }
        }
        return allEntries;
    }

    /**
     * Create a manual journal entry in Fineract (for settlement operations).
     * @return journal entry transaction ID
     */
    @SuppressWarnings("unchecked")
    public String createJournalEntry(String debitGlCode, String creditGlCode,
                                      BigDecimal amount, String description) {
        Map<String, Long> glCodeToId = lookupGlAccounts();
        Long debitId = glCodeToId.get(debitGlCode);
        Long creditId = glCodeToId.get(creditGlCode);
        if (debitId == null || creditId == null) {
            throw new AssetException("GL code not found: debit=" + debitGlCode + ", credit=" + creditGlCode);
        }

        String dateStr = java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy", java.util.Locale.ENGLISH));
        Map<String, Object> body = Map.of(
                "officeId", 1,
                "transactionDate", dateStr,
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "currencyCode", "XAF",
                "comments", description != null ? description : "Settlement",
                "debits", List.of(Map.of("glAccountId", debitId, "amount", amount)),
                "credits", List.of(Map.of("glAccountId", creditId, "amount", amount))
        );

        Map<String, Object> response = webClient.post()
                .uri("/fineract-provider/api/v1/journalentries")
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .bodyValue(body)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

        if (response != null && response.get("transactionId") != null) {
            return response.get("transactionId").toString();
        }
        return null;
    }

    /**
     * Look up all payment types from Fineract and return a map of payment type name to database ID.
     * Used at startup to resolve configured payment type names to their actual database IDs.
     *
     * @return Map of payment type name (String) to database ID (Long)
     */
    @SuppressWarnings("unchecked")
    public Map<String, Long> lookupPaymentTypes() {
        List<Map<String, Object>> paymentTypes = webClient.get()
                .uri("/fineract-provider/api/v1/paymenttypes")
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .retrieve()
                .bodyToMono(List.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

        Map<String, Long> nameToId = new HashMap<>();
        if (paymentTypes != null) {
            for (Map<String, Object> pt : paymentTypes) {
                String name = (String) pt.get("name");
                Long id = ((Number) pt.get("id")).longValue();
                nameToId.put(name, id);
            }
        }
        return nameToId;
    }

    private String getAuthHeader() {
        if (config.isOAuthEnabled()) {
            return "Bearer " + tokenProvider.getAccessToken();
        }
        return getBasicAuth();
    }

    private String getBasicAuth() {
        String credentials = config.getUsername() + ":" + config.getPassword();
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Parse a Fineract error response into a human-readable message.
     * Extracts defaultUserMessage from the JSON and adds contextual guidance.
     */
    @SuppressWarnings("unchecked")
    private String parseFineractError(String context, String rawBody) {
        try {
            Map<String, Object> errorResponse = objectMapper.readValue(rawBody, Map.class);
            String userMessage = (String) errorResponse.get("defaultUserMessage");
            if (userMessage != null && !userMessage.isBlank()) {
                String result = context + ": " + userMessage;
                // Add guidance for common errors
                if (userMessage.contains("data integrity issue")) {
                    result += " This usually means an asset with the same name or symbol already exists in the core banking system.";
                }
                return result;
            }
        } catch (Exception ignored) {
            // JSON parsing failed, fall through to raw message
        }
        return context + ": " + rawBody;
    }
}
