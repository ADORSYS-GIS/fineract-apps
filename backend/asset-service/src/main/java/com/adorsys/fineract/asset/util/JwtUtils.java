package com.adorsys.fineract.asset.util;

import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtUtils {

    private JwtUtils() {
    }

    /**
     * Extract the Fineract client ID from the JWT claim (fast path).
     * Returns {@code null} when the claim is absent or not a number — caller must handle the fallback.
     */
    public static Long extractClientId(Jwt jwt) {
        Object claim = jwt.getClaim("fineract_client_id");
        if (claim instanceof Number n) return n.longValue();
        if (claim instanceof String s) {
            try { return Long.parseLong(s); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    /**
     * Extract the Keycloak subject (externalId) from the JWT.
     * This is the UUID used as externalId in Fineract client records.
     */
    public static String extractExternalId(Jwt jwt) {
        String subject = jwt.getSubject();
        if (subject == null || subject.isBlank()) {
            throw new IllegalStateException(
                    "JWT is missing the 'sub' claim. Cannot resolve user identity.");
        }
        return subject;
    }
}
