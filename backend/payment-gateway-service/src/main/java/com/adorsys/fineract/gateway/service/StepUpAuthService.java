package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.exception.PaymentException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Validates step-up authentication tokens for sensitive operations (withdrawals).
 * Disabled by default; enabled via app.stepup.enabled=true when frontend is ready.
 */
@Slf4j
@Service
public class StepUpAuthService {

    @Value("${app.stepup.enabled:false}")
    private boolean stepUpEnabled;

    @Value("${app.stepup.secret:}")
    private String stepUpSecret;

    public void validateStepUpToken(String userExternalId, String stepUpToken) {
        if (!stepUpEnabled) {
            log.debug("Step-up auth is disabled, skipping validation");
            return;
        }
        if (stepUpToken == null || stepUpToken.isBlank()) {
            throw new PaymentException("Step-up authentication required for withdrawals", "STEP_UP_REQUIRED");
        }
        if (!verifyToken(userExternalId, stepUpToken)) {
            throw new PaymentException("Invalid step-up token", "STEP_UP_INVALID");
        }
    }

    private boolean verifyToken(String userExternalId, String token) {
        if (stepUpSecret == null || stepUpSecret.isEmpty()) {
            log.error("Step-up auth is enabled but secret is not configured");
            return false;
        }
        try {
            // Token format: base64(HMAC-SHA256(externalId:timestamp)) + ":" + timestamp
            String[] parts = token.split(":");
            if (parts.length != 2) {
                log.warn("Invalid step-up token format");
                return false;
            }

            String signature = parts[0];
            String timestamp = parts[1];

            // Verify token is not expired (5 minute window)
            long tokenTime = Long.parseLong(timestamp);
            long now = System.currentTimeMillis() / 1000;
            if (Math.abs(now - tokenTime) > 300) {
                log.warn("Step-up token expired: tokenTime={}, now={}", tokenTime, now);
                return false;
            }

            // Verify HMAC
            String data = userExternalId + ":" + timestamp;
            String expectedSignature = computeHmac(data);
            return expectedSignature.equals(signature);
        } catch (Exception e) {
            log.warn("Step-up token verification failed: {}", e.getMessage());
            return false;
        }
    }

    private String computeHmac(String data) throws Exception {
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(stepUpSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        return Base64.getUrlEncoder().withoutPadding().encodeToString(hash);
    }
}
