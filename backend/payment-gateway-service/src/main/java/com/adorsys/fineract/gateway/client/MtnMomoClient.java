package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
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
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Client for MTN Mobile Money API.
 *
 * MTN MoMo API documentation: https://momodeveloper.mtn.com/docs/services
 *
 * Flow for Collections (Deposits):
 * 1. Get access token using API user credentials
 * 2. Request to Pay - initiates USSD prompt on customer's phone
 * 3. Customer approves payment on their phone
 * 4. Callback received or poll for status
 *
 * Flow for Disbursements (Withdrawals):
 * 1. Get access token using API user credentials
 * 2. Transfer - sends money to customer's phone
 * 3. Callback received with result
 */
@Slf4j
@Component
public class MtnMomoClient {

    private final MtnMomoConfig config;
    private final WebClient webClient;

    public MtnMomoClient(MtnMomoConfig config, @Qualifier("mtnWebClient") WebClient webClient) {
        this.config = config;
        this.webClient = webClient;
    }

    // Simple token cache (in production, use Redis or similar)
    private final Map<String, TokenInfo> tokenCache = new ConcurrentHashMap<>();

    /**
     * Initiate a collection (deposit) request.
     * This will trigger a USSD prompt on the customer's phone.
     *
     * @param referenceId Unique reference for this transaction
     * @param amount Amount to collect
     * @param phoneNumber Customer's phone number (MSISDN format: 237xxxxxxxxx)
     * @param payerMessage Message shown to payer
     * @return External ID from MTN
     */
    public String requestToPay(String referenceId, BigDecimal amount, String phoneNumber, String payerMessage) {
        log.info("Initiating MTN collection: ref={}, amount={}, phone={}", referenceId, amount, phoneNumber);

        String accessToken = getAccessToken("collection");
        String externalId = UUID.randomUUID().toString();

        Map<String, Object> requestBody = Map.of(
            "amount", amount.toString(),
            "currency", config.getCurrency(),
            "externalId", externalId,
            "payer", Map.of(
                "partyIdType", "MSISDN",
                "partyId", normalizePhoneNumber(phoneNumber)
            ),
            "payerMessage", payerMessage,
            "payeeNote", "Deposit to savings account"
        );

        try {
            webClient.post()
                .uri("/collection/v1_0/requesttopay")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header("X-Reference-Id", referenceId)
                .header("X-Target-Environment", config.getTargetEnvironment())
                .header("Ocp-Apim-Subscription-Key", config.getCollectionSubscriptionKey())
                .header("X-Callback-Url", config.getCallbackUrl() + "/mtn/collection")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    response -> response.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("MTN API error: " + body))))
                .toBodilessEntity()
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            log.info("MTN collection request accepted: ref={}", referenceId);
            return externalId;

        } catch (Exception e) {
            log.error("MTN collection request failed: ref={}, error={}", referenceId, e.getMessage());
            throw new PaymentException("Failed to initiate MTN collection: " + e.getMessage(), e);
        }
    }

    /**
     * Initiate a disbursement (withdrawal) to customer's phone.
     *
     * @param referenceId Unique reference for this transaction
     * @param amount Amount to send
     * @param phoneNumber Recipient's phone number
     * @param payeeNote Note for recipient
     * @return External ID from MTN
     */
    public String transfer(String referenceId, BigDecimal amount, String phoneNumber, String payeeNote) {
        log.info("Initiating MTN disbursement: ref={}, amount={}, phone={}", referenceId, amount, phoneNumber);

        String accessToken = getAccessToken("disbursement");
        String externalId = UUID.randomUUID().toString();

        Map<String, Object> requestBody = Map.of(
            "amount", amount.toString(),
            "currency", config.getCurrency(),
            "externalId", externalId,
            "payee", Map.of(
                "partyIdType", "MSISDN",
                "partyId", normalizePhoneNumber(phoneNumber)
            ),
            "payerMessage", "Withdrawal from savings account",
            "payeeNote", payeeNote
        );

        try {
            webClient.post()
                .uri("/disbursement/v1_0/transfer")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header("X-Reference-Id", referenceId)
                .header("X-Target-Environment", config.getTargetEnvironment())
                .header("Ocp-Apim-Subscription-Key", config.getDisbursementSubscriptionKey())
                .header("X-Callback-Url", config.getCallbackUrl() + "/mtn/disbursement")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    response -> response.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("MTN API error: " + body))))
                .toBodilessEntity()
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            log.info("MTN disbursement request accepted: ref={}", referenceId);
            return externalId;

        } catch (Exception e) {
            log.error("MTN disbursement request failed: ref={}, error={}", referenceId, e.getMessage());
            throw new PaymentException("Failed to initiate MTN disbursement: " + e.getMessage(), e);
        }
    }

    /**
     * Get the status of a collection request.
     */
    public PaymentStatus getCollectionStatus(String referenceId) {
        return getTransactionStatus("collection", referenceId);
    }

    /**
     * Get the status of a disbursement request.
     */
    public PaymentStatus getDisbursementStatus(String referenceId) {
        return getTransactionStatus("disbursement", referenceId);
    }

    private PaymentStatus getTransactionStatus(String product, String referenceId) {
        String accessToken = getAccessToken(product);
        String subscriptionKey = "collection".equals(product)
            ? config.getCollectionSubscriptionKey()
            : config.getDisbursementSubscriptionKey();

        try {
            Map<String, Object> response = webClient.get()
                .uri("/{product}/v1_0/requesttopay/{referenceId}", product, referenceId)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .header("X-Target-Environment", config.getTargetEnvironment())
                .header("Ocp-Apim-Subscription-Key", subscriptionKey)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String status = (String) response.get("status");
            return mapMtnStatus(status);

        } catch (Exception e) {
            log.error("Failed to get MTN transaction status: ref={}, error={}", referenceId, e.getMessage());
            return PaymentStatus.PENDING;
        }
    }

    private String getAccessToken(String product) {
        String cacheKey = product;
        TokenInfo cached = tokenCache.get(cacheKey);

        if (cached != null && !cached.isExpired()) {
            return cached.token;
        }

        String subscriptionKey = "collection".equals(product)
            ? config.getCollectionSubscriptionKey()
            : config.getDisbursementSubscriptionKey();

        String credentials = Base64.getEncoder().encodeToString(
            (config.getApiUserId() + ":" + config.getApiKey()).getBytes()
        );

        try {
            Map<String, Object> response = webClient.post()
                .uri("/{product}/token/", product)
                .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
                .header("Ocp-Apim-Subscription-Key", subscriptionKey)
                .bodyValue("") // Send empty body to satisfy Content-Length requirement
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(10))
                .block();

            String token = (String) response.get("access_token");
            Integer expiresIn = (Integer) response.get("expires_in");

            tokenCache.put(cacheKey, new TokenInfo(token, System.currentTimeMillis() + (expiresIn * 1000L) - 60000));
            return token;

        } catch (Exception e) {
            log.error("Failed to get MTN access token: {}", e.getMessage());
            throw new PaymentException("Failed to authenticate with MTN API", e);
        }
    }

    private String normalizePhoneNumber(String phoneNumber) {
        // Remove spaces, dashes, and plus signs
        String normalized = phoneNumber.replaceAll("[\\s\\-+]", "");

        // Ensure it starts with country code 237 (Cameroon)
        if (!normalized.startsWith("237")) {
            if (normalized.startsWith("0")) {
                normalized = "237" + normalized.substring(1);
            } else {
                normalized = "237" + normalized;
            }
        }

        return normalized;
    }

    private PaymentStatus mapMtnStatus(String mtnStatus) {
        if (mtnStatus == null) return PaymentStatus.PENDING;

        return switch (mtnStatus.toUpperCase()) {
            case "SUCCESSFUL" -> PaymentStatus.SUCCESSFUL;
            case "FAILED" -> PaymentStatus.FAILED;
            case "PENDING" -> PaymentStatus.PENDING;
            case "EXPIRED" -> PaymentStatus.EXPIRED;
            default -> PaymentStatus.PENDING;
        };
    }

    private record TokenInfo(String token, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() >= expiresAt;
        }
    }
}