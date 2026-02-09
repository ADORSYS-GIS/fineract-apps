package com.adorsys.fineract.asset.util;

import org.springframework.security.oauth2.jwt.Jwt;

public final class JwtUtils {

    private JwtUtils() {
    }

    public static Long extractUserId(Jwt jwt) {
        Object clientId = jwt.getClaim("fineract_client_id");
        if (clientId instanceof Number) {
            return ((Number) clientId).longValue();
        }
        return (long) jwt.getSubject().hashCode();
    }
}
