package com.adorsys.fineract.registration.service.account;

import java.time.Duration;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.util.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

/**
 * Security service for verifying account ownership.
 *
 * Ensures customers can only access their own accounts by:
 * 1. Extracting fineract_client_id from JWT (fast path)
 * 2. Falling back to sub claim (Keycloak UUID = Fineract externalId) lookup
 * 3. Caching customer's account list in Redis for cross-pod consistency
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccountSecurityService {

    private static final String ACCOUNT_CACHE_KEY_PREFIX = "css:account-ownership:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(10);

    private final FineractService fineractService;
    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * Get the Fineract client ID from the JWT token.
     *
     * @param jwt The JWT token
     * @return Fineract client ID
     * @throws RegistrationException if client ID cannot be determined
     */
    public Long getCustomerClientId(Jwt jwt) {
        // Fast path: fineract_client_id is set after KYC approval
        Long clientId = JwtUtils.extractClientId(jwt);
        if (clientId != null) {
            return clientId;
        }

        // Fallback: resolve via sub claim (Keycloak UUID = Fineract externalId).
        // The sub claim is always present — unlike fineract_external_id which is also
        // a user attribute set only after KYC, making it an equally unreliable fallback.
        String externalId = JwtUtils.extractExternalId(jwt);
        log.info("Looking up client ID via sub/externalId: {}", externalId);
        Map<String, Object> client = fineractService.getClientByExternalId(externalId);
        log.debug("Fineract client lookup result for externalId {}: {}", externalId, client);
        if (client == null || !client.containsKey("id")) {
            throw new RegistrationException("NOT_FOUND", "Customer not found in Fineract", null);
        }

        Long resolvedClientId = ((Number) client.get("id")).longValue();
        log.info("Resolved client ID {} from externalId {}", resolvedClientId, externalId);
        return resolvedClientId;
    }

    /**
     * Verify that the customer owns the specified savings account.
     *
     * @param accountId The savings account ID to verify
     * @param jwt The customer's JWT token
     * @throws RegistrationException if customer doesn't own the account
     */
    public void verifySavingsAccountOwnership(Long accountId, Jwt jwt) {
        Long customerClientId = getCustomerClientId(jwt);
        String key = ACCOUNT_CACHE_KEY_PREFIX + customerClientId;

        // Check Redis cache first
        Object cached = redisTemplate.opsForValue().get(key);
        Set<Long> ownedAccounts = toAccountIdSet(cached);
        if (ownedAccounts != null && ownedAccounts.contains(accountId)) {
            log.debug("Account {} ownership verified from cache for client {}", accountId, customerClientId);
            return;
        }

        // Cache miss - fetch account and verify via Fineract
        Long accountOwnerClientId = fineractService.getSavingsAccountOwner(accountId);
        if (accountOwnerClientId == null) {
            throw new RegistrationException("NOT_FOUND", "Account not found", null);
        }

        if (!accountOwnerClientId.equals(customerClientId)) {
            log.warn("SECURITY: Client {} attempted access to account {} owned by {}",
                    customerClientId, accountId, accountOwnerClientId);
            throw new RegistrationException("FORBIDDEN", "Access denied to account " + accountId, null);
        }

        // Invalidate rather than partially updating — the full set is only written by
        // getCustomerSavingsAccounts, which fetches all accounts in one call. A partial
        // add here could produce an incomplete set across pods.
        redisTemplate.delete(key);
        log.debug("Account {} ownership verified; cache invalidated for client {}", accountId, customerClientId);
    }

    /**
     * Get all savings accounts owned by the customer.
     * Writes the full owned-account set to Redis so all pods share a consistent view.
     *
     * @param jwt The customer's JWT token
     * @return List of savings accounts
     */
    public List<Map<String, Object>> getCustomerSavingsAccounts(Jwt jwt) {
        Long customerClientId = getCustomerClientId(jwt);

        List<Map<String, Object>> accounts = fineractService.getSavingsAccountsByClientId(customerClientId);

        Set<Long> accountIds = new HashSet<>();
        for (Map<String, Object> account : accounts) {
            if (account.containsKey("id")) {
                accountIds.add(((Number) account.get("id")).longValue());
            }
        }
        redisTemplate.opsForValue().set(ACCOUNT_CACHE_KEY_PREFIX + customerClientId, accountIds, CACHE_TTL);

        return accounts;
    }

    /**
     * Invalidate the ownership cache for a customer (call when accounts change).
     *
     * @param clientId The Fineract client ID
     */
    public void invalidateCache(Long clientId) {
        redisTemplate.delete(ACCOUNT_CACHE_KEY_PREFIX + clientId);
        log.info("Invalidated account cache for client {}", clientId);
    }

    /**
     * Convert the raw Redis value to a Set<Long>.
     * GenericJackson2JsonRedisSerializer deserializes JSON numbers as Integer for small values,
     * so we normalize via Number before boxing to Long.
     */
    @SuppressWarnings("unchecked")
    private Set<Long> toAccountIdSet(Object raw) {
        if (raw instanceof Collection<?> c) {
            return c.stream()
                    .map(e -> ((Number) e).longValue())
                    .collect(Collectors.toSet());
        }
        return null;
    }
}