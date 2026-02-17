package com.adorsys.fineract.asset.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Exposes the permit-all-admin flag for use in SpEL expressions within {@code @PreAuthorize}.
 * When true, all admin endpoints are accessible without authentication (dev mode).
 */
@Component("adminSecurity")
public class AdminSecurityCheck {

    @Value("${app.security.permit-all-admin:false}")
    private boolean permitAllAdmin;

    public boolean isOpen() {
        return permitAllAdmin;
    }
}
