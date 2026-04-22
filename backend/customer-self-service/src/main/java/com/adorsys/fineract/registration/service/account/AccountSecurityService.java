package com.adorsys.fineract.registration.service.account;

import java.util.Collections;
import java.util.List;

import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.util.JwtUtils;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Security service for verifying account ownership.
 *
 * Ensures customers can only access their own accounts by:
 * 1. Extracting fineract_client_id from JWT (fast path)
 * 2. Falling back to sub claim (Keycloak UUID = Fineract externalId) lookup
 * 3. Caching customer's account list for fast ownership checks
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccountSecurityService {

    private final FineractService fineractService;

    // Key: clientId, Value: Set of owned account IDs
    private final Cache<Long, Set<Long>> accountOwnershipCache = Caffeine.newBuilder()
            .maximumSize(5_000)
            .expireAfterWrite(10, TimeUnit.MINUTES)
            .build();

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

        // Check cache first
        Set<Long> ownedAccounts = accountOwnershipCache.getIfPresent(customerClientId);
        if (ownedAccounts != null && ownedAccounts.contains(accountId)) {
            log.debug("Account {} ownership verified from cache for client {}", accountId, customerClientId);
            return;
        }

        // Cache miss - fetch account and verify
        Long accountOwnerClientId = fineractService.getSavingsAccountOwner(accountId);
        if (accountOwnerClientId == null) {
            throw new RegistrationException("NOT_FOUND", "Account not found", null);
        }

        if (!accountOwnerClientId.equals(customerClientId)) {
            log.warn("SECURITY: Client {} attempted access to account {} owned by {}",
                    customerClientId, accountId, accountOwnerClientId);
            throw new RegistrationException("FORBIDDEN", "Access denied to account " + accountId, null);
        }

        // Update cache atomically — merge the new account ID into the existing set without
        // mutating the cached reference, which would be unsafe under concurrent reads.
        accountOwnershipCache.asMap().merge(
                customerClientId,
                Collections.singleton(accountId),
                (existing, added) -> {
                    Set<Long> combined = new HashSet<>(existing);
                    combined.addAll(added);
                    return Collections.unmodifiableSet(combined);
                }
        );
        log.debug("Account {} ownership verified and cached for client {}", accountId, customerClientId);
    }

    /**
     * Get all savings accounts owned by the customer.
     * Results are cached for performance.
     *
     * @param jwt The customer's JWT token
     * @return List of savings accounts
     */
    public List<Map<String, Object>> getCustomerSavingsAccounts(Jwt jwt) {
        Long customerClientId = getCustomerClientId(jwt);

        List<Map<String, Object>> accounts = fineractService.getSavingsAccountsByClientId(customerClientId);

        // Populate cache with all owned account IDs as an unmodifiable set to prevent
        // accidental mutation of the cached reference from concurrent callers.
        Set<Long> accountIds = new HashSet<>();
        for (Map<String, Object> account : accounts) {
            if (account.containsKey("id")) {
                accountIds.add(((Number) account.get("id")).longValue());
            }
        }
        accountOwnershipCache.put(customerClientId, Collections.unmodifiableSet(accountIds));

        return accounts;
    }

    /**
     * Invalidate cache for a customer (call when accounts change).
     *
     * @param clientId The Fineract client ID
     */
    public void invalidateCache(Long clientId) {
        accountOwnershipCache.invalidate(clientId);
        log.info("Invalidated account cache for client {}", clientId);
    }
}