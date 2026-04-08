package com.adorsys.fineract.gateway.util;

import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtUtils {

    private JwtUtils() {}

    /**
     * Extract the Keycloak subject UUID, used as externalId in Fineract.
     * The {@code sub} claim is always present in Keycloak tokens and equals the
     * Keycloak user UUID, which Fineract stores as the client's {@code externalId}.
     * This is the same value previously read from the {@code fineract_external_id}
     * user-attribute claim, which is only set after KYC approval.
     *
     * @return the subject UUID, or null if absent (should never happen with Keycloak)
     */
    public static String extractExternalId(Jwt jwt) {
        return jwt.getSubject();
    }
}
