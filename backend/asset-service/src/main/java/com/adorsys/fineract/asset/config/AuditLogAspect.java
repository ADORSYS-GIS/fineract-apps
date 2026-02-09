package com.adorsys.fineract.asset.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

/**
 * Audit logging for admin asset management actions.
 * Logs the action, admin identity, and outcome for compliance tracking.
 */
@Slf4j
@Aspect
@Component
public class AuditLogAspect {

    @Around("execution(* com.adorsys.fineract.asset.controller.AdminAssetController.*(..))")
    public Object auditAdminAction(ProceedingJoinPoint joinPoint) throws Throwable {
        String action = joinPoint.getSignature().getName();
        String admin = extractAdminIdentity();
        String args = extractAssetId(joinPoint.getArgs());

        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            log.info("AUDIT: action={}, admin={}, target={}, result=SUCCESS, duration={}ms",
                    action, admin, args, duration);
            return result;
        } catch (Throwable t) {
            long duration = System.currentTimeMillis() - start;
            log.warn("AUDIT: action={}, admin={}, target={}, result=FAILURE, error={}, duration={}ms",
                    action, admin, args, t.getMessage(), duration);
            throw t;
        }
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
}
