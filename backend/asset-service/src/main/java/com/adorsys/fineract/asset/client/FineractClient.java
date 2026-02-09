package com.adorsys.fineract.asset.client;

import com.adorsys.fineract.asset.config.FineractConfig;
import com.adorsys.fineract.asset.exception.AssetException;
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
     * Transfer request for the Fineract Batch API.
     */
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
     * Register currencies in Fineract. Appends new currency to existing list.
     */
    @SuppressWarnings("unchecked")
    public void registerCurrencies(List<String> currencyCodes) {
        try {
            List<Map<String, Object>> existing = getExistingCurrencies();
            List<String> allCodes = new ArrayList<>();
            for (Map<String, Object> currency : existing) {
                allCodes.add((String) currency.get("code"));
            }
            allCodes.addAll(currencyCodes);

            Map<String, Object> body = Map.of("currencies", allCodes);

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
     * Create a savings product for an asset currency.
     *
     * @return The created product ID
     */
    @SuppressWarnings("unchecked")
    public Integer createSavingsProduct(String name, String shortName, String currencyCode,
                                        int decimalPlaces, Long savingsReferenceAccountId,
                                        Long savingsControlAccountId) {
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
            body.put("savingsReferenceAccountId", savingsReferenceAccountId);
            body.put("savingsControlAccountId", savingsControlAccountId);
            body.put("incomeFromFeeAccountId", savingsReferenceAccountId);
            body.put("incomeFromPenaltyAccountId", savingsReferenceAccountId);
            body.put("interestOnSavingsAccountId", savingsControlAccountId);
            body.put("writeOffAccountId", savingsControlAccountId);
            body.put("overdraftPortfolioControlId", savingsControlAccountId);
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
     * Get all savings accounts for a client.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientSavingsAccounts(Long clientId) {
        try {
            Map<String, Object> response = webClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts?clientId={clientId}", clientId)
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            return response != null
                    ? (List<Map<String, Object>>) response.get("pageItems")
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
    @SuppressWarnings("unchecked")
    public Long provisionSavingsAccount(Long clientId, Integer productId,
                                         BigDecimal depositAmount, Long paymentTypeId) {
        try {
            String today = LocalDate.now().format(DATE_FORMAT);
            List<Map<String, Object>> batchRequests = new ArrayList<>();

            // Request 1: Create savings account
            Map<String, Object> createBody = Map.of(
                    "clientId", clientId,
                    "productId", productId,
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "submittedOnDate", today
            );
            Map<String, Object> createReq = new HashMap<>();
            createReq.put("requestId", 1L);
            createReq.put("relativeUrl", "savingsaccounts");
            createReq.put("method", "POST");
            createReq.put("body", objectMapper.writeValueAsString(createBody));
            batchRequests.add(createReq);

            // Request 2: Approve (references savingsId from request 1)
            Map<String, Object> approveBody = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "approvedOnDate", today
            );
            Map<String, Object> approveReq = new HashMap<>();
            approveReq.put("requestId", 2L);
            approveReq.put("relativeUrl", "savingsaccounts/$.1.savingsId?command=approve");
            approveReq.put("method", "POST");
            approveReq.put("reference", 1L);
            approveReq.put("body", objectMapper.writeValueAsString(approveBody));
            batchRequests.add(approveReq);

            // Request 3: Activate (references savingsId from request 1)
            Map<String, Object> activateBody = Map.of(
                    "locale", "en",
                    "dateFormat", "dd MMMM yyyy",
                    "activatedOnDate", today
            );
            Map<String, Object> activateReq = new HashMap<>();
            activateReq.put("requestId", 3L);
            activateReq.put("relativeUrl", "savingsaccounts/$.1.savingsId?command=activate");
            activateReq.put("method", "POST");
            activateReq.put("reference", 1L);
            activateReq.put("body", objectMapper.writeValueAsString(activateBody));
            batchRequests.add(activateReq);

            // Request 4 (optional): Deposit initial supply
            if (depositAmount != null && depositAmount.compareTo(BigDecimal.ZERO) > 0) {
                Map<String, Object> depositBody = new HashMap<>();
                depositBody.put("locale", "en");
                depositBody.put("dateFormat", "dd MMMM yyyy");
                depositBody.put("transactionDate", today);
                depositBody.put("transactionAmount", depositAmount);
                depositBody.put("paymentTypeId", paymentTypeId);

                Map<String, Object> depositReq = new HashMap<>();
                depositReq.put("requestId", 4L);
                depositReq.put("relativeUrl", "savingsaccounts/$.1.savingsId/transactions?command=deposit");
                depositReq.put("method", "POST");
                depositReq.put("reference", 1L);
                depositReq.put("body", objectMapper.writeValueAsString(depositBody));
                batchRequests.add(depositReq);
            }

            List<Map<String, Object>> responses = webClient.post()
                    .uri("/fineract-provider/api/v1/batches?enclosingTransaction=true")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(batchRequests)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract batch provision error: " + b))))
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            // Check individual responses for failures
            if (responses != null) {
                for (Map<String, Object> resp : responses) {
                    Integer statusCode = (Integer) resp.get("statusCode");
                    if (statusCode != null && statusCode >= 400) {
                        String body = (String) resp.get("body");
                        throw new AssetException("Account provisioning failed at step " + resp.get("requestId") + ": " + body);
                    }
                }
            }

            // Extract savingsId from the create response (request 1)
            Long savingsId = null;
            if (responses != null) {
                for (Map<String, Object> resp : responses) {
                    if (((Number) resp.get("requestId")).longValue() == 1L) {
                        String bodyStr = (String) resp.get("body");
                        Map<String, Object> bodyMap = objectMapper.readValue(bodyStr, Map.class);
                        savingsId = ((Number) bodyMap.get("savingsId")).longValue();
                        break;
                    }
                }
            }

            if (savingsId == null) {
                throw new AssetException("Failed to extract savingsId from batch provision response");
            }

            int steps = depositAmount != null ? 4 : 3;
            log.info("Provisioned savings account atomically ({} steps): clientId={}, productId={}, savingsId={}",
                    steps, clientId, productId, savingsId);
            return savingsId;

        } catch (AssetException e) {
            throw e;
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize batch provision body: {}", e.getMessage());
            throw new AssetException("Failed to serialize batch provision request", e);
        } catch (Exception e) {
            log.error("Failed to provision savings account: clientId={}, productId={}, error={}",
                    clientId, productId, e.getMessage());
            throw new AssetException("Failed to provision savings account in Fineract", e);
        }
    }

    /**
     * Execute multiple account transfers atomically using Fineract Batch API.
     * Uses enclosingTransaction=true so if ANY transfer fails, ALL are rolled back.
     *
     * @param transfers List of transfers to execute atomically
     * @return List of batch response items
     * @throws AssetException if the batch request fails or any individual transfer fails
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> executeBatchTransfers(List<BatchTransferRequest> transfers) {
        try {
            String transferDate = LocalDate.now().format(DATE_FORMAT);
            List<Map<String, Object>> batchRequests = new ArrayList<>();

            for (int i = 0; i < transfers.size(); i++) {
                BatchTransferRequest t = transfers.get(i);

                Map<String, Object> transferBody = new HashMap<>();
                transferBody.put("fromOfficeId", 1);
                transferBody.put("fromClientId", 1);
                transferBody.put("fromAccountType", 2); // Savings
                transferBody.put("fromAccountId", t.fromAccountId());
                transferBody.put("toOfficeId", 1);
                transferBody.put("toClientId", 1);
                transferBody.put("toAccountType", 2); // Savings
                transferBody.put("toAccountId", t.toAccountId());
                transferBody.put("transferAmount", t.amount());
                transferBody.put("transferDate", transferDate);
                transferBody.put("transferDescription", t.description());
                transferBody.put("locale", "en");
                transferBody.put("dateFormat", "dd MMMM yyyy");

                Map<String, Object> batchItem = new HashMap<>();
                batchItem.put("requestId", (long) (i + 1));
                batchItem.put("relativeUrl", "accounttransfers");
                batchItem.put("method", "POST");
                batchItem.put("body", objectMapper.writeValueAsString(transferBody));

                batchRequests.add(batchItem);
            }

            List<Map<String, Object>> responses = webClient.post()
                    .uri("/fineract-provider/api/v1/batches?enclosingTransaction=true")
                    .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(batchRequests)
                    .retrieve()
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                            resp -> resp.bodyToMono(String.class)
                                    .flatMap(b -> Mono.error(new AssetException("Fineract batch API error: " + b))))
                    .bodyToMono(List.class)
                    .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                    .block();

            // Check individual responses for failures
            if (responses != null) {
                for (Map<String, Object> resp : responses) {
                    Integer statusCode = (Integer) resp.get("statusCode");
                    if (statusCode != null && statusCode >= 400) {
                        String body = (String) resp.get("body");
                        throw new AssetException("Batch transfer failed (request " + resp.get("requestId") + "): " + body);
                    }
                }
            }

            log.info("Executed batch of {} transfers atomically", transfers.size());
            return responses != null ? responses : List.of();
        } catch (AssetException e) {
            throw e;
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize batch transfer body: {}", e.getMessage());
            throw new AssetException("Failed to serialize batch transfer request", e);
        } catch (Exception e) {
            log.error("Failed to execute batch transfers: {}", e.getMessage());
            throw new AssetException("Failed to execute batch transfers in Fineract", e);
        }
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
