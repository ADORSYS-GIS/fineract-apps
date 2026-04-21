package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.NokashConfig;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.service.TokenCacheService;
import com.adorsys.fineract.gateway.util.PhoneNumberUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.Map;

@Slf4j
@Component
public class NokashClient {

    private final NokashConfig config;
    private final WebClient webClient;
    private final TokenCacheService tokenCacheService;

    public NokashClient(NokashConfig config, @Qualifier("nokashWebClient") WebClient webClient, TokenCacheService tokenCacheService) {
        this.config = config;
        this.webClient = webClient;
        this.tokenCacheService = tokenCacheService;
    }
    public String initiatePayin(String orderId, BigDecimal amount, String phoneNumber, String paymentMethod) {
        log.info("Initiating NOKASH Payin: orderId={}, amount={}, phone={}, method={}",
            orderId, amount, phoneNumber, paymentMethod);

        String secureCallbackUrl = config.getCallbackUrl() + "/" + orderId;

        Map<String, Object> requestBody = Map.of(
            "i_space_key", config.getISpaceKey(),
            "app_space_key", config.getAppSpaceKey(),
            "payment_type", "CM_MOBILEMONEY",
            "country", config.getCountry(),
            "payment_method", paymentMethod,
            "order_id", orderId,
            "amount", String.valueOf(amount.longValue()),
            "callback_url", secureCallbackUrl,
            "user_data", Map.of("user_phone", PhoneNumberUtils.normalizePhoneNumber(phoneNumber))
        );

        log.info("NOKASH Payin request body: {}", requestBody);

        try {
            Map<String, Object> response = webClient.post()
                .uri("/lapas-on-trans/trans/api-payin-request/407")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("NOKASH API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            log.info("NOKASH Payin response: {}", response);

            if (response != null && "REQUEST_OK".equals(response.get("status"))) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                String id = (String) data.get("id");
                log.info("NOKASH Payin initiated: orderId={}, id={}", orderId, id);
                return id;
            } else {
                String errorMessage = response != null ? (String) response.get("message") : "Unknown error";
                log.error("Failed to initiate NOKASH payin: {}", errorMessage);
                throw new PaymentException("Failed to initiate NOKASH payin: " + errorMessage);
            }

        } catch (Exception e) {
            log.error("NOKASH Payin failed: orderId={}, error={}", orderId, e.getMessage());
            throw new PaymentException("Failed to initiate NOKASH payin: " + e.getMessage(), e);
        }
    }

    public PaymentStatus getTransactionStatus(String transactionId) {
        log.info("Checking NOKASH transaction status for transactionId={}", transactionId);

        Map<String, Object> requestBody = Map.of(
            "transaction_id", transactionId
        );

        log.info("NOKASH getTransactionStatus request body: {}", requestBody);

        try {
            Map<String, Object> response = webClient.post()
                .uri("/lapas-on-trans/trans/310/status-request")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("NOKASH API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            log.info("NOKASH getTransactionStatus response: {}", response);

            if (response != null && "REQUEST_OK".equals(response.get("status"))) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                String nokashStatus = (String) data.get("status");
                log.info("NOKASH status for transactionId={}: {}", transactionId, nokashStatus);
                return toPaymentStatus(nokashStatus);
            } else {
                log.warn("NOKASH status check for transactionId={} returned no data, assuming PENDING", transactionId);
                return PaymentStatus.PENDING;
            }

        } catch (Exception e) {
            log.error("NOKASH status check failed for transactionId={}: {}", transactionId, e.getMessage());
            // It's safer to assume PENDING on error to avoid premature failure
            return PaymentStatus.PENDING;
        }
    }

    private PaymentStatus toPaymentStatus(String nokashStatus) {
        if (nokashStatus == null) {
            return PaymentStatus.PENDING;
        }
        switch (nokashStatus.toUpperCase()) {
            case "SUCCESS":
                return PaymentStatus.SUCCESSFUL;
            case "FAILED":
            case "CANCELLED":
                return PaymentStatus.FAILED;
            default:
                return PaymentStatus.PENDING;
        }
    }

    public String getTemporaryAuthKey() {

        log.info("Requesting temporary auth key from NOKASH with i_space_key={} and app_space_key={}", config.getISpaceKey(), config.getAppSpaceKey());

        try {
            Map<String, Object> response = webClient.post()
                .uri(uriBuilder -> uriBuilder
                    .path("/lapas-on-trans/trans/auth")
                    .queryParam("i_space_key", config.getISpaceKey())
                    .queryParam("app_space_key", config.getAppSpaceKey())
                    .build())
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("NOKASH Auth API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();

            log.info("NOKASH Auth response: {}", response);

            if (response != null && "LOGIN_SUCCESS".equals(response.get("status"))) {
                String tempAuthKey = (String) response.get("data");
                log.info("Successfully retrieved temporary auth key from NOKASH");
                return tempAuthKey;
            } else {
                String errorMessage = response != null ? (String) response.get("message") : "Unknown error";
                log.error("Failed to get temporary auth key from NOKASH: {}", errorMessage);
                throw new PaymentException("Failed to get temporary auth key from NOKASH: " + errorMessage);
            }

        } catch (Exception e) {
            log.error("NOKASH Auth failed: {}", e.getMessage());
            throw new PaymentException("Failed to get temporary auth key from NOKASH: " + e.getMessage(), e);
        }
    }

    public String initiatePayout(String tempAuthKey, String orderId, BigDecimal amount, String phoneNumber, String paymentMethod) {
        log.info("Initiating NOKASH Payout: orderId={}, amount={}, phone={}, paymentMethod={}", orderId, amount, phoneNumber, paymentMethod);

        String secureCallbackUrl = config.getCallbackUrl() + "/" + orderId;

        Map<String, Object> requestBody = Map.of(
            "i_space_key", config.getISpaceKey(),
            "app_space_key", config.getAppSpaceKey(),
            "payment_type", "CM_MOBILEMONEY",
            "payment_method", paymentMethod,
            "country", config.getCountry(),
            "order_id", orderId,
            "amount", String.valueOf(amount.longValue()),
            "callback_url", secureCallbackUrl,
            "user_data", Map.of("user_phone", PhoneNumberUtils.normalizePhoneNumber(phoneNumber))
        );

        log.info("NOKASH Payout request body: {}", requestBody);

        try {
            Map<String, Object> response = webClient.post()
                .uri("/lapas-on-trans/trans/api-payin-request/407")
                .header("auth-code", tempAuthKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(),
                    resp -> resp.bodyToMono(String.class)
                        .flatMap(body -> Mono.error(new PaymentException("NOKASH API error: " + body))))
                .bodyToMono(Map.class)
                .timeout(Duration.ofSeconds(config.getTimeoutSeconds()))
                .block();
            
            log.info("NOKASH Payout response: {}", response);

            if (response != null && "REQUEST_OK".equals(response.get("status"))) {
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                if (data != null) {
                    String id = (String) data.get("id");
                    log.info("NOKASH Payout initiated: orderId={}, id={}", orderId, id);
                    return id;
                }
            }

            String errorMessage = response != null ? (String) response.get("message") : "Unknown error with empty response";
            log.error("Failed to initiate NOKASH payout: {}", errorMessage);
            throw new PaymentException("Failed to initiate NOKASH payout: " + errorMessage);

        } catch (Exception e) {
            log.error("NOKASH Payout failed: orderId={}, error={}", orderId, e.getMessage());
            throw new PaymentException("Failed to initiate NOKASH payout: " + e.getMessage(), e);
        }
    }
}
