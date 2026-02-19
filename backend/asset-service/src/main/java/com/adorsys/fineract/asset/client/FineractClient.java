package com.adorsys.fineract.asset.client;

import com.adorsys.fineract.asset.config.FineractConfig;
import com.adorsys.fineract.asset.exception.AssetException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
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
    public sealed interface BatchOperation permits BatchTransferOp, BatchWithdrawalOp, BatchJournalEntryOp {}

    /**
     * Account transfer between two savings accounts.
     */
    public record BatchTransferOp(
            Long fromAccountId, Long toAccountId,
            BigDecimal amount, String description
    ) implements BatchOperation {}

    /**
     * Withdrawal from a savings account (e.g. fee deduction).
     */
    public record BatchWithdrawalOp(
            Long savingsAccountId, BigDecimal amount, String note
    ) implements BatchOperation {}

    /**
     * Journal entry (debit + credit) posted directly to GL accounts.
     */
    public record BatchJournalEntryOp(
            Long debitGlAccountId, Long creditGlAccountId,
            BigDecimal amount, String currencyCode, String comments
    ) implements BatchOperation {}

    /**
     * Legacy transfer request. Delegates to {@link BatchTransferOp}.
     * @deprecated Use {@link BatchTransferOp} with {@link #executeAtomicBatch} instead.
     */
    @Deprecated
    public record BatchTransferRequest(
            Long fromAccountId, Long toAccountId,
            BigDecimal amount, String description
    ) {}

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
                                    .flatMap(b -> Mono.error(new AssetException("Fineract currency API error: " + b))))
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
                                    .flatMap(b -> Mono.error(new AssetException("Fineract product API error: " + b))))
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
            log.error("ROLLBACK FAILURE: Failed to delete savings product {}. "
                    + "Orphaned resource requires manual cleanup.", productId, e);
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
                    .uri("/fineract-provider/api/v1/savingsproducts")
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
     * Create a savings account for a client with a given product.
     *
     * @return The created account ID
     */
    @SuppressWarnings("unchecked")
    public Long createSavingsAccount(Long clientId, Integer productId) {
        try {
            Map<String, Object> body = Map.of(
                    "clientId", clientId,
                    "productId", productId,
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "submittedOnDate", LocalDate.now().format(DATE_FORMAT)
            );

            Map<String, Object> response = webClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract account API error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            Long accountId = ((Number) response.get("savingsId")).longValue();
            log.info("Created savings account: clientId={}, productId={}, accountId={}", clientId, productId, accountId);
            return accountId;
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create savings account: {}", e.getMessage());
            throw new AssetException("Failed to create savings account in Fineract", e);
        }
    }

    /**
     * Approve a savings account.
     */
    @SuppressWarnings("unchecked")
    public void approveSavingsAccount(Long accountId) {
        try {
            Map<String, Object> body = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "approvedOnDate", LocalDate.now().format(DATE_FORMAT)
            );

            webClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{id}?command=approve", accountId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract approve error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            log.info("Approved savings account: {}", accountId);
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to approve savings account: {}", e.getMessage());
            throw new AssetException("Failed to approve savings account", e);
        }
    }

    /**
     * Activate a savings account.
     */
    @SuppressWarnings("unchecked")
    public void activateSavingsAccount(Long accountId) {
        try {
            Map<String, Object> body = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "activatedOnDate", LocalDate.now().format(DATE_FORMAT)
            );

            webClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{id}?command=activate", accountId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract activate error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            log.info("Activated savings account: {}", accountId);
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to activate savings account: {}", e.getMessage());
            throw new AssetException("Failed to activate savings account", e);
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
            Map<String, Object> body = new HashMap<>();
            body.put("fromOfficeId", 1);
            body.put("fromClientId", 1); // Will be overridden by account
            body.put("fromAccountType", 2); // Savings
            body.put("fromAccountId", fromAccountId);
            body.put("toOfficeId", 1);
            body.put("toClientId", 1); // Will be overridden by account
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
     * Create a journal entry in Fineract to post directly to GL accounts.
     * Used for fee income recognition: debit fund source, credit fee income GL account.
     *
     * @return Journal entry transaction ID
     */
    @SuppressWarnings("unchecked")
    public Long createJournalEntry(Long debitGlAccountId, Long creditGlAccountId,
                                    BigDecimal amount, String currencyCode, String comments) {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("officeId", 1);
            body.put("transactionDate", LocalDate.now().format(DATE_FORMAT));
            body.put("referenceNumber", UUID.randomUUID().toString());
            body.put("comments", comments);
            body.put("currencyCode", currencyCode);
            body.put("locale", "en");
            body.put("dateFormat", "dd MMMM yyyy");
            body.put("debits", List.of(Map.of("glAccountId", debitGlAccountId, "amount", amount)));
            body.put("credits", List.of(Map.of("glAccountId", creditGlAccountId, "amount", amount)));

            Map<String, Object> response = webClient.post()
                    .uri("/fineract-provider/api/v1/journalentries")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract journal entry error: " + b))))
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            String transactionId = (String) response.get("transactionId");
            log.info("Journal entry: debitGL={}, creditGL={}, amount={} {}, txnId={}",
                    debitGlAccountId, creditGlAccountId, amount, currencyCode, transactionId);
            return transactionId != null ? transactionId.hashCode() & 0xFFFFFFFFL : 0L;
        } catch (AssetException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create journal entry: {}", e.getMessage());
            throw new AssetException("Failed to create journal entry in Fineract", e);
        }
    }

    /**
     * Get all savings accounts for a client.
     * Uses the client-specific endpoint which properly filters by client ID.
     * Note: /savingsaccounts?clientId= does NOT filter in Fineract; use /clients/{id}/accounts instead.
     */
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
                throw new AssetException("Client not found: " + externalId);
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
                                .flatMap(b -> Mono.error(new AssetException("Fineract API error: " + b))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();
    }

    /**
     * Execute multiple account transfers via Fineract Batch API atomically.
     *
     * @param transfers List of transfers to execute
     * @return List of batch response items
     * @throws AssetException if the batch fails
     * @deprecated Use {@link #executeAtomicBatch(List)} with {@link BatchOperation} types instead.
     */
    @Deprecated
    @CircuitBreaker(name = "fineract")
    public List<Map<String, Object>> executeBatchTransfers(List<BatchTransferRequest> transfers) {
        List<BatchOperation> ops = transfers.stream()
                .<BatchOperation>map(t -> new BatchTransferOp(
                        t.fromAccountId(), t.toAccountId(), t.amount(), t.description()))
                .toList();
        return executeAtomicBatch(ops);
    }

    /**
     * Execute mixed operations atomically via Fineract's Batch API.
     * Uses {@code POST /batches?enclosingTransaction=true} so all operations
     * succeed or all are rolled back on the Fineract side.
     *
     * @param operations List of batch operations (transfers, withdrawals, journal entries)
     * @return List of batch response items from Fineract
     * @throws AssetException if the batch fails
     */
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
                case BatchWithdrawalOp w -> {
                    body = new HashMap<>();
                    body.put("transactionDate", today);
                    body.put("transactionAmount", w.amount());
                    body.put("paymentTypeId", 2);
                    body.put("note", w.note());
                    body.put("locale", "en");
                    body.put("dateFormat", "dd MMMM yyyy");
                    relativeUrl = "savingsaccounts/" + w.savingsAccountId() + "/transactions?command=withdrawal";
                }
                case BatchJournalEntryOp j -> {
                    body = new HashMap<>();
                    body.put("officeId", 1);
                    body.put("transactionDate", today);
                    body.put("referenceNumber", UUID.randomUUID().toString());
                    body.put("comments", j.comments());
                    body.put("currencyCode", j.currencyCode());
                    body.put("locale", "en");
                    body.put("dateFormat", "dd MMMM yyyy");
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
                                    .flatMap(b -> Mono.error(new AssetException("Fineract batch API error: " + b))))
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
        List<Map<String, Object>> accounts = webClient.get()
                .uri("/fineract-provider/api/v1/glaccounts")
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .retrieve()
                .bodyToMono(List.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

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
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}
