package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.CinetPayConfig;
import com.adorsys.fineract.gateway.dto.CinetPayCallbackRequest;
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

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Client for CinetPay API.
 *
 * CinetPay API documentation: https://docs.cinetpay.com/
 *
 * Flow for Collections (Deposits):
 * 1. Initialize payment with API key + site_id in request body
 * 2. Get payment_url for customer redirect
 * 3. Customer completes payment (chooses MTN/Orange/etc.)
 * 4. Callback received with payment_method and status
 *
 * Flow for Disbursements (Withdrawals):
 * 1. Get auth token via login endpoint (5 min TTL)
 * 2. Initiate transfer to customer's phone
 * 3. Callback received with result
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CinetPayClient {

    private final CinetPayConfig config;

    @Qualifier("cinetpayWebClient")
    private final WebClient webClient;

    // Token cache for transfer API (5 min TTL)
    private final Map<String, TokenInfo> tokenCache = new ConcurrentHashMap<>();

    /**
     * Initialize a payment (deposit).
     * Returns a payment URL where customer can complete the transaction and choose payment method.
     *
     * @param transactionId Unique transaction ID
     * @param amount Amount to collect
     * @param description Payment description
     * @param customerPhone Customer's phone number (for pre-fill)
     * @return Payment initialization response with payment URL
     */
    public PaymentInitResponse initializePayment(String transactionId, BigDecimal amount,
                                                  String description, String customerPhone) {
        log.info("Initializing CinetPay payment: transactionId={}, amount={}", transactionId, amount);

        String normalizedPhone = normalizePhoneNumber(customerPhone);

        Map<String, Object> requestBody = Map.of(
            "apikey", config.getApiKey(),
            "site_id", config.getSiteId(),
            "transaction_id", transactionId,
            "amount", amount.intValue(),
            "currency", config.getCurrency(),
            "description", description,
            "customer_phone_number", normalizedPhone,
            "customer_name", "Customer",
            "customer_surname", "",
            "notify_url", config.getCallbackUrl() + "/payment",
            "return_url", config.getReturnUrl(),
            "cancel_url", config.getCancelUrl(),
            "channels", "ALL",
            "lang", "fr"
        );

        try {
            Map<String, Object> response = webClient.post()
                .uri(config.getBaseUrl() + "/v2/payment")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("CinetPay API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String code = String.valueOf(response.get("code"));
            if (!"201".equals(code)) {
                String message = (String) response.get("message");
                throw new PaymentException("CinetPay payment init failed: " + message);
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            String paymentUrl = (String) data.get("payment_url");
            String paymentToken = (String) data.get("payment_token");

            log.info("CinetPay payment initialized: transactionId={}, paymentToken={}",
                transactionId, paymentToken);

            return new PaymentInitResponse(paymentUrl, paymentToken);

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("CinetPay payment init failed: transactionId={}, error={}",
                transactionId, e.getMessage());
            throw new PaymentException("Failed to initialize CinetPay payment: " + e.getMessage(), e);
        }
    }

    /**
     * Initiate a transfer (withdrawal) to customer's mobile wallet.
     *
     * @param transactionId Unique transaction ID
     * @param amount Amount to transfer
     * @param phoneNumber Recipient's phone number
     * @param phonePrefix Phone prefix (237 for Cameroon)
     * @return Transfer reference
     */
    public String initiateTransfer(String transactionId, BigDecimal amount,
                                   String phoneNumber, String phonePrefix) {
        log.info("Initiating CinetPay transfer: transactionId={}, amount={}, phone={}",
            transactionId, amount, phoneNumber);

        String token = getAuthToken();
        String normalizedPhone = normalizePhoneNumber(phoneNumber);

        // Extract prefix and number
        String prefix = phonePrefix;
        String number = normalizedPhone;
        if (normalizedPhone.startsWith("237")) {
            prefix = "237";
            number = normalizedPhone.substring(3);
        }

        Map<String, Object> requestBody = Map.of(
            "transaction_id", transactionId,
            "amount", amount.intValue(),
            "currency", config.getCurrency(),
            "prefix", prefix,
            "phone", number,
            "notify_url", config.getCallbackUrl() + "/transfer"
        );

        try {
            Map<String, Object> response = WebClient.builder()
                .baseUrl(config.getTransferUrl())
                .build()
                .post()
                .uri("/v1/transfer/money/send/contact")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("CinetPay transfer error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String code = String.valueOf(response.get("code"));
            if (!"0".equals(code)) {
                String message = (String) response.get("message");
                throw new PaymentException("CinetPay transfer failed: " + message);
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            String transferId = String.valueOf(data.get("id"));

            log.info("CinetPay transfer initiated: transactionId={}, transferId={}",
                transactionId, transferId);

            return transferId;

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("CinetPay transfer failed: transactionId={}, error={}",
                transactionId, e.getMessage());
            throw new PaymentException("Failed to initiate CinetPay transfer: " + e.getMessage(), e);
        }
    }

    /**
     * Verify transaction status.
     *
     * @param transactionId Transaction ID to check
     * @return Payment status
     */
    public PaymentStatus verifyTransaction(String transactionId) {
        log.info("Verifying CinetPay transaction: transactionId={}", transactionId);

        Map<String, Object> requestBody = Map.of(
            "apikey", config.getApiKey(),
            "site_id", config.getSiteId(),
            "transaction_id", transactionId
        );

        try {
            Map<String, Object> response = webClient.post()
                .uri(config.getBaseUrl() + "/v2/payment/check")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            String code = String.valueOf(response.get("code"));
            return mapCinetPayStatus(code);

        } catch (Exception e) {
            log.error("Failed to verify CinetPay transaction: transactionId={}, error={}",
                transactionId, e.getMessage());
            return PaymentStatus.PENDING;
        }
    }

    /**
     * Validate callback signature to ensure it's from CinetPay.
     *
     * @param callback The callback request
     * @return true if signature is valid
     */
    public boolean validateCallbackSignature(CinetPayCallbackRequest callback) {
        // Verify site_id matches
        if (!config.getSiteId().equals(callback.getSiteId())) {
            log.warn("CinetPay callback site_id mismatch: expected={}, received={}",
                config.getSiteId(), callback.getSiteId());
            return false;
        }

        // CinetPay uses HMAC-SHA256 for signature validation
        if (callback.getSignature() == null) {
            log.warn("CinetPay callback missing signature");
            return false;
        }

        try {
            String dataToSign = callback.getSiteId() +
                callback.getTransactionId() +
                callback.getAmount() +
                config.getApiKey();

            String expectedSignature = generateHmacSha256(dataToSign, config.getApiKey());
            boolean valid = expectedSignature.equalsIgnoreCase(callback.getSignature());

            if (!valid) {
                log.warn("CinetPay callback signature mismatch: transactionId={}",
                    callback.getTransactionId());
            }

            return valid;

        } catch (Exception e) {
            log.error("Failed to validate CinetPay signature: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Get auth token for transfer API. Tokens have 5 minute TTL.
     */
    private String getAuthToken() {
        TokenInfo cached = tokenCache.get("default");

        if (cached != null && !cached.isExpired()) {
            return cached.token;
        }

        Map<String, Object> requestBody = Map.of(
            "apikey", config.getApiKey(),
            "password", config.getApiPassword()
        );

        try {
            Map<String, Object> response = WebClient.builder()
                .baseUrl(config.getTransferUrl())
                .build()
                .post()
                .uri("/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(10))
                .block();

            String code = String.valueOf(response.get("code"));
            if (!"0".equals(code)) {
                throw new PaymentException("CinetPay auth failed: " + response.get("message"));
            }

            @SuppressWarnings("unchecked")
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            String token = (String) data.get("token");

            // Cache for 4 minutes (tokens expire in 5 minutes)
            tokenCache.put("default", new TokenInfo(token,
                System.currentTimeMillis() + (4 * 60 * 1000L)));

            return token;

        } catch (PaymentException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to get CinetPay auth token: {}", e.getMessage());
            throw new PaymentException("Failed to authenticate with CinetPay", e);
        }
    }

    /**
     * Normalize phone number to Cameroon format (237XXXXXXXXX).
     */
    public String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }

        String normalized = phoneNumber.replaceAll("[\\s\\-+]", "");

        if (!normalized.startsWith("237")) {
            if (normalized.startsWith("0")) {
                normalized = "237" + normalized.substring(1);
            } else {
                normalized = "237" + normalized;
            }
        }

        return normalized;
    }

    private PaymentStatus mapCinetPayStatus(String code) {
        if (code == null) return PaymentStatus.PENDING;

        return switch (code) {
            case "00" -> PaymentStatus.SUCCESSFUL;
            case "600", "602" -> PaymentStatus.FAILED;
            case "627" -> PaymentStatus.CANCELLED;
            case "201" -> PaymentStatus.PENDING;
            default -> PaymentStatus.PENDING;
        };
    }

    private String generateHmacSha256(String data, String key) throws Exception {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] signedBytes = sha256Hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return HexFormat.of().formatHex(signedBytes);
    }

    public record PaymentInitResponse(String paymentUrl, String paymentToken) {}

    private record TokenInfo(String token, long expiresAt) {
        boolean isExpired() {
            return System.currentTimeMillis() >= expiresAt;
        }
    }
}
