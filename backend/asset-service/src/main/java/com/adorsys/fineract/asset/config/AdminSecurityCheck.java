package com.adorsys.fineract.asset.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Set;

/**
 * Exposes the permit-all-admin flag for use in SpEL expressions within {@code @PreAuthorize}.
 * When true, all admin endpoints are accessible without authentication (dev mode).
 */
@Slf4j
@Component("adminSecurity")
public class AdminSecurityCheck {

    private static final Set<String> PRODUCTION_PROFILES = Set.of("kubernetes", "prod", "production");

    @Value("${app.security.permit-all-admin:false}")
    private boolean permitAllAdmin;

    private final Environment environment;

    public AdminSecurityCheck(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void validateNotOpenInProduction() {
        if (permitAllAdmin) {
            boolean isProduction = Arrays.stream(environment.getActiveProfiles())
                    .anyMatch(PRODUCTION_PROFILES::contains);
            if (isProduction) {
                throw new IllegalStateException(
                        "FATAL: app.security.permit-all-admin=true is forbidden in production profiles "
                        + PRODUCTION_PROFILES + ". Active profiles: "
                        + Arrays.toString(environment.getActiveProfiles()));
            }
            log.warn("Admin security is OPEN (permit-all-admin=true). "
                    + "This must only be used in development environments.");
        }
    }

    public boolean isOpen() {
        return permitAllAdmin;
    }
}
