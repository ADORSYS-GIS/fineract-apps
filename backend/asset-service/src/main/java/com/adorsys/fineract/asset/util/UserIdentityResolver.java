package com.adorsys.fineract.asset.util;

import com.adorsys.fineract.asset.client.FineractClient;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Resolves the Fineract client ID (Long) from a JWT.
 *
 * <p>Fast path: read {@code fineract_client_id} claim directly — present for users who
 * have completed KYC and have the Keycloak mapper configured.
 *
 * <p>Fallback: look up the client in Fineract by the {@code sub} claim (Keycloak UUID),
 * which equals the Fineract {@code externalId}. This handles tokens issued before the
 * mapper was configured or before KYC completion populates the claim.
 */
@Component
@RequiredArgsConstructor
public class UserIdentityResolver {

    private final FineractClient fineractClient;

    public String resolveExternalId(Jwt jwt) {
        return JwtUtils.extractExternalId(jwt);
    }

    public Long resolveUserId(Jwt jwt) {
        Long clientId = JwtUtils.extractClientId(jwt);
        if (clientId != null) {
            return clientId;
        }
        String externalId = JwtUtils.extractExternalId(jwt);
        Map<String, Object> clientData = fineractClient.getClientByExternalId(externalId);
        return ((Number) clientData.get("id")).longValue();
    }
}
