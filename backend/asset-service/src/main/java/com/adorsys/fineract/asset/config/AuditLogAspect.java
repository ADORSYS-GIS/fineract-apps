package com.adorsys.fineract.asset.config;

import com.adorsys.fineract.asset.entity.AuditLog;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.AuditLogRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Audit logging for all admin controller actions.
 * Logs to SLF4J and persists to the audit_log table for compliance tracking.
 */
@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class AuditLogAspect {

    private final AuditLogRepository auditLogRepository;
    private final AssetRepository assetRepository;
    private final ObjectMapper objectMapper;

    @Around("execution(* com.adorsys.fineract.asset.controller.AdminAssetController.*(..)) || "
          + "execution(* com.adorsys.fineract.asset.controller.AdminOrderController.*(..)) || "
          + "execution(* com.adorsys.fineract.asset.controller.AdminReconciliationController.*(..)) || "
          + "execution(* com.adorsys.fineract.asset.controller.AdminDashboardController.*(..))")
    public Object auditAdminAction(ProceedingJoinPoint joinPoint) throws Throwable {
        String action = joinPoint.getSignature().getName();
        String admin = extractAdminIdentity();
        String assetId = extractAssetId(joinPoint.getArgs());

        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            log.info("AUDIT: action={}, admin={}, target={}, result=SUCCESS, duration={}ms",
                    action, admin, assetId, duration);
            persistAudit(action, admin, assetId, "SUCCESS", null, duration, joinPoint.getArgs());
            return result;
        } catch (Throwable t) {
            long duration = System.currentTimeMillis() - start;
            log.warn("AUDIT: action={}, admin={}, target={}, result=FAILURE, error={}, duration={}ms",
                    action, admin, assetId, t.getMessage(), duration);
            persistAudit(action, admin, assetId, "FAILURE", t.getMessage(), duration, joinPoint.getArgs());
            throw t;
        }
    }

    private void persistAudit(String action, String admin, String assetId,
                               String result, String error, long durationMs, Object[] args) {
        try {
            String symbol = resolveAssetSymbol(assetId);
            String requestSummary = summarizeRequest(args);

            auditLogRepository.save(AuditLog.builder()
                    .action(action)
                    .adminSubject(admin)
                    .targetAssetId("n/a".equals(assetId) ? null : assetId)
                    .targetAssetSymbol(symbol)
                    .result(result)
                    .errorMessage(truncate(error, 500))
                    .durationMs(durationMs)
                    .requestSummary(requestSummary)
                    .performedAt(Instant.now())
                    .build());
        } catch (Exception e) {
            log.error("Failed to persist audit log: {}", e.getMessage());
        }
    }

    private String resolveAssetSymbol(String assetId) {
        if (assetId == null || "n/a".equals(assetId)) return null;
        try {
            return assetRepository.findById(assetId)
                    .map(a -> a.getSymbol())
                    .orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    private String summarizeRequest(Object[] args) {
        try {
            for (Object arg : args) {
                if (arg != null && !(arg instanceof String)
                        && !arg.getClass().isPrimitive()
                        && !(arg instanceof org.springframework.data.domain.Pageable)) {
                    String json = objectMapper.writeValueAsString(arg);
                    return truncate(json, 1000);
                }
            }
        } catch (Exception e) {
            // Serialization failure is not critical
        }
        return null;
    }

    private String extractAdminIdentity() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        }
        return "unknown";
    }

    private String extractAssetId(Object[] args) {
        for (Object arg : args) {
            if (arg instanceof String s && !s.isEmpty()) {
                return s;
            }
        }
        return "n/a";
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
