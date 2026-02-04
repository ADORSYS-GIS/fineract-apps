package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.FineractConfig;
import com.adorsys.fineract.gateway.exception.PaymentException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Map;

/**
 * Client for Fineract API to create savings transactions.
 *
 * Supports both OAuth2 (default) and Basic Auth authentication,
 * controlled by fineract.auth-type configuration property.
 */
@Slf4j
@Component
public class FineractClient {

    private final FineractConfig config;
    private final FineractTokenProvider tokenProvider;
    private final WebClient webClient;

    public FineractClient(FineractConfig config, FineractTokenProvider tokenProvider, @Qualifier("fineractWebClient") WebClient webClient) {
        this.config = config;
        this.tokenProvider = tokenProvider;
        this.webClient = webClient;
    }

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMMM yyyy", java.util.Locale.ENGLISH);

    /**
     * Create a deposit transaction on a savings account.
     *
     * @param accountId Savings account ID
     * @param amount Deposit amount
     * @param paymentTypeId Payment type ID
     * @param receiptNumber Receipt/reference number from payment provider
     * @return Transaction ID
     */
    public Long createDeposit(Long accountId, BigDecimal amount, Long paymentTypeId, String receiptNumber) {
        LocalDate date = LocalDate.now();
        
        log.info("Creating Fineract deposit: accountId={}, amount={}, paymentTypeId={}, date={}",
            accountId, amount, paymentTypeId, date);

        if (paymentTypeId == null) {
            log.error("PaymentTypeId is NULL! Cannot create deposit.");
            throw new PaymentException("PaymentTypeId is missing for deposit creation");
        }

        Map<String, Object> requestBody = Map.of(
            "locale", "en",
            "dateFormat", "dd MMMM yyyy",
            "transactionDate", date.format(DATE_FORMAT),
            "transactionAmount", amount,
            "paymentTypeId", paymentTypeId,
            "receiptNumber", receiptNumber != null ? receiptNumber : ""
        );
        log.debug("Fineract deposit payload: {}", requestBody);

        try {
            Map<String, Object> response = webClient.post()
                .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}/transactions?command=deposit", accountId)
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("Fineract API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            Long transactionId = ((Number) response.get("resourceId")).longValue();
            log.info("Fineract deposit created: accountId={}, transactionId={}, date={}", accountId, transactionId, date);

            return transactionId;

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create Fineract deposit: accountId={}, error={}", accountId, e.getMessage());
            throw new PaymentException("Failed to create deposit in Fineract: " + e.getMessage(), e);
        }
    }

    /**
     * Create a withdrawal transaction on a savings account.
     *
     * @param accountId Savings account ID
     * @param amount Withdrawal amount
     * @param paymentTypeId Payment type ID
     * @param receiptNumber Receipt/reference number
     * @return Transaction ID
     */
    public Long createWithdrawal(Long accountId, BigDecimal amount, Long paymentTypeId, String receiptNumber) {
        LocalDate date = LocalDate.now();

        log.info("Creating Fineract withdrawal: accountId={}, amount={}, paymentTypeId={}, date={}",
            accountId, amount, paymentTypeId, date);

        Map<String, Object> requestBody = Map.of(
            "locale", "en",
            "dateFormat", "dd MMMM yyyy",
            "transactionDate", date.format(DATE_FORMAT),
            "transactionAmount", amount,
            "paymentTypeId", paymentTypeId,
            "receiptNumber", receiptNumber != null ? receiptNumber : ""
        );

        try {
            Map<String, Object> response = webClient.post()
                .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}/transactions?command=withdrawal", accountId)
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("Fineract API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            Long transactionId = ((Number) response.get("resourceId")).longValue();
            log.info("Fineract withdrawal created: accountId={}, transactionId={}", accountId, transactionId);

            return transactionId;

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to create Fineract withdrawal: accountId={}, error={}", accountId, e.getMessage());
            throw new PaymentException("Failed to create withdrawal in Fineract: " + e.getMessage(), e);
        }
    }

    /**
     * Get savings account details.
     */
    public Map<String, Object> getSavingsAccount(Long accountId) {
        try {
            return webClient.get()
                .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}", accountId)
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

        } catch (Exception e) {
            log.error("Failed to get savings account: accountId={}, error={}", accountId, e.getMessage());
            throw new PaymentException("Failed to get savings account from Fineract: " + e.getMessage(), e);
        }
    }

    /**
     * Get client by external ID.
     */
    public Map<String, Object> getClientByExternalId(String externalId) {
        try {
            Map<String, Object> response = webClient.get()
                .uri("/fineract-provider/api/v1/clients?externalId={externalId}", externalId)
                .header(HttpHeaders.AUTHORIZATION, getAuthHeader())
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            var pageItems = (java.util.List<Map<String, Object>>) response.get("pageItems");
            if (pageItems == null || pageItems.isEmpty()) {
                throw new PaymentException("Client not found: " + externalId);
            }

            return pageItems.get(0);

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to get client: externalId={}, error={}", externalId, e.getMessage());
            throw new PaymentException("Failed to get client from Fineract: " + e.getMessage(), e);
        }
    }

    /**
     * Verify that the account belongs to the customer.
     */
    public boolean verifyAccountOwnership(String externalId, Long accountId) {
        try {
            Map<String, Object> client = getClientByExternalId(externalId);
            Long clientId = ((Number) client.get("id")).longValue();

            Map<String, Object> account = getSavingsAccount(accountId);
            Long accountClientId = ((Number) account.get("clientId")).longValue();

            return clientId.equals(accountClientId);

        } catch (Exception e) {
            log.error("Failed to verify account ownership: externalId={}, accountId={}, error={}",
                externalId, accountId, e.getMessage());
            return false;
        }
    }

    /**
     * Get authorization header based on configured auth type.
     * Uses OAuth2 Bearer token if auth-type=oauth, otherwise Basic Auth.
     */
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
