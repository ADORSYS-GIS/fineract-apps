package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.OrangeMoneyConfig;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.exception.PaymentException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.adorsys.fineract.gateway.service.TokenCacheService;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Base64;
import java.util.Map;

/**
 * Client for Orange Money API.
 *
 * Orange Money WebPay API documentation: https://developer.orange.com/apis/om-webpay
 *
 * Flow for Collections (Deposits):
 * 1. Get access token using OAuth2 client credentials
 * 2. Initialize payment - get payment URL
 * 3. Redirect user to payment URL (or provide USSD code)
 * 4. User completes payment on Orange Money
 * 5. Callback received with result
 *
 * Flow for Disbursements (Withdrawals):
 * 1. Get access token
 * 2. Cash-out request to customer's phone
 * 3. Callback received with result
 */
@Slf4j
@Component
public class OrangeMoneyClient {

    private final OrangeMoneyConfig config;
    private final WebClient webClient;
    private final TokenCacheService tokenCacheService;

    public OrangeMoneyClient(OrangeMoneyConfig config, @Qualifier("orangeWebClient") WebClient webClient, TokenCacheService tokenCacheService) {
        this.config = config;
        this.webClient = webClient;
        this.tokenCacheService = tokenCacheService;
    }

    /**
     * Initialize a web payment (deposit).
     * Returns a payment URL where the customer can complete the transaction.
     *
     * @param orderId Unique order/transaction ID
     * @param amount Amount to collect
     * @param description Payment description
     * @return Payment initialization response with payment URL
     */
    public PaymentInitResponse initializePayment(String orderId, BigDecimal amount, String description) {
        log.info("Initializing Orange Money payment: orderId={}, amount={}", orderId, amount);

        String accessToken = getAccessToken();

        Map<String, Object> requestBody = Map.of(
            "merchant_key", config.getMerchantCode(),
            "currency", config.getCurrency(),
            "order_id", orderId,
            "amount", amount.longValue(),
            "return_url", config.getReturnUrl(),
            "cancel_url", config.getCancelUrl(),
            "notif_url", config.getCallbackUrl() + "/orange/payment",
            "lang", "fr",
            "reference", description
        );

        try {
            Map<String, Object> response = webClient.post()
                .uri("/webpayment")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("Orange API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String status = (String) response.get("status");
            if (!"201".equals(status) && !"200".equals(status)) {
                throw new PaymentException("Orange payment init failed: " + response.get("message"));
            }

            String paymentUrl = (String) response.get("payment_url");
            String payToken = (String) response.get("pay_token");
            String notifToken = (String) response.get("notif_token");

            log.info("Orange payment initialized: orderId={}, payToken={}", orderId, payToken);

            return new PaymentInitResponse(paymentUrl, payToken, notifToken);

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Orange payment init failed: orderId={}, error={}", orderId, e.getMessage());
            throw new PaymentException("Failed to initialize Orange payment: " + e.getMessage(), e);
        }
    }

    /**
     * Initiate a cash-out (withdrawal) to customer's phone.
     *
     * @param orderId Unique order/transaction ID
     * @param amount Amount to send
     * @param phoneNumber Recipient's phone number
     * @return Transaction reference
     */
    public String cashOut(String orderId, BigDecimal amount, String phoneNumber) {
        log.info("Initiating Orange Money cash-out: orderId={}, amount={}, phone={}", orderId, amount, phoneNumber);

        String accessToken = getAccessToken();

        Map<String, Object> requestBody = Map.of(
            "merchant_key", config.getMerchantCode(),
            "currency", config.getCurrency(),
            "order_id", orderId,
            "amount", amount.longValue(),
            "subscriber_msisdn", normalizePhoneNumber(phoneNumber),
            "notif_url", config.getCallbackUrl() + "/orange/cashout"
        );

        try {
            Map<String, Object> response = webClient.post()
                .uri("/cashout")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("Orange API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String status = (String) response.get("status");
            if (!"201".equals(status) && !"200".equals(status)) {
                throw new PaymentException("Orange cash-out failed: " + response.get("message"));
            }

            String txnId = (String) response.get("txnid");
            log.info("Orange cash-out initiated: orderId={}, txnId={}", orderId, txnId);

            return txnId;

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Orange cash-out failed: orderId={}, error={}", orderId, e.getMessage());
            throw new PaymentException("Failed to initiate Orange cash-out: " + e.getMessage(), e);
        }
    }

    /**
     * Check the status of a transaction.
     */
    public PaymentStatus getTransactionStatus(String orderId, String payToken) {
        String accessToken = getAccessToken();

        try {
            Map<String, Object> response = webClient.get()
                .uri(uriBuilder -> uriBuilder
                    .path("/transactionstatus")
                    .queryParam("order_id", orderId)
                    .queryParam("pay_token", payToken)
                    .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String status = (String) response.get("status");
            return mapOrangeStatus(status);

        } catch (Exception e) {
            log.error("Failed to get Orange transaction status: orderId={}, error={}", orderId, e.getMessage());
            return PaymentStatus.PENDING;
        }
    }

    private String getAccessToken() {
        String cacheKey = "orange:default";

        return tokenCacheService.getToken(cacheKey).orElseGet(() -> {
            String credentials = Base64.getEncoder().encodeToString(
                (config.getClientId() + ":" + config.getClientSecret()).getBytes()
            );

            try {
                WebClient tokenClient = WebClient.builder()
                    .baseUrl(config.getTokenUrl())
                    .build();

                Map<String, Object> response = tokenClient.post()
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + credentials)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .bodyValue("grant_type=client_credentials")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(10))
                    .block();

                String token = (String) response.get("access_token");
                Integer expiresIn = (Integer) response.get("expires_in");

                long ttlSeconds = expiresIn - 60; // 60s buffer before expiry
                tokenCacheService.putToken(cacheKey, token, ttlSeconds);
                return token;

            } catch (Exception e) {
                log.error("Failed to get Orange access token: {}", e.getMessage());
                throw new PaymentException("Failed to authenticate with Orange API", e);
            }
        });
    }

    private String normalizePhoneNumber(String phoneNumber) {
        return com.adorsys.fineract.gateway.util.PhoneNumberUtils.normalizePhoneNumber(phoneNumber);
    }

    private PaymentStatus mapOrangeStatus(String orangeStatus) {
        if (orangeStatus == null) return PaymentStatus.PENDING;

        return switch (orangeStatus.toUpperCase()) {
            case "SUCCESS", "SUCCESSFULL" -> PaymentStatus.SUCCESSFUL;
            case "FAILED" -> PaymentStatus.FAILED;
            case "PENDING", "INITIATED" -> PaymentStatus.PENDING;
            case "CANCELLED" -> PaymentStatus.CANCELLED;
            case "EXPIRED" -> PaymentStatus.EXPIRED;
            default -> PaymentStatus.PENDING;
        };
    }

    public record PaymentInitResponse(String paymentUrl, String payToken, String notifToken) {}
}
