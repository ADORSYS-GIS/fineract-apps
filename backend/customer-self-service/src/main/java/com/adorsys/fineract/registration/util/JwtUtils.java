package com.adorsys.fineract.registration.util;

import com.adorsys.fineract.registration.exception.security.IdentityClaimException;
import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtUtils {

    private JwtUtils() {}

    /**
     * Extract the Fineract client ID from the JWT (fast path).
     * Returns null if the claim is absent or malformed — caller must handle the fallback.
     */
    public static Long extractClientId(Jwt jwt) {
        Object claim = jwt.getClaim("fineract_client_id");
        if (claim instanceof Number n) return n.longValue();
        if (claim instanceof String s) {
            try {
                return Long.parseLong(s);
            } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    /**
     * Extract the Keycloak subject UUID, used as externalId in Fineract.
     * The {@code sub} claim is always present in Keycloak tokens and equals the
     * Keycloak user UUID, which Fineract stores as the client's {@code externalId}.
     *
     * @throws IdentityClaimException if sub is absent (should never happen with Keycloak)
     */
    public static String extractExternalId(Jwt jwt) {
        String sub = jwt.getSubject();
        if (sub == null || sub.isBlank()) {
            throw new IdentityClaimException("Missing identity claims in token");
        }
        return sub;
    }
}
