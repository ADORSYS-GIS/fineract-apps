package com.adorsys.fineract.registration.service.account;

import java.util.List;

import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.FineractService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Security service for verifying account ownership.
 *
 * Ensures customers can only access their own accounts by:
 * 1. Extracting fineract_client_id from JWT (fast path)
 * 2. Falling back to fineract_external_id lookup if needed
 * 3. Caching customer's account list for fast ownership checks
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccountSecurityService {

    private final FineractService fineractService;

    // Simple in-memory cache for account ownership (consider Redis for production)
    // Key: clientId, Value: Set of owned account IDs
    private final ConcurrentHashMap<Long, Set<Long>> accountOwnershipCache = new ConcurrentHashMap<>();

    /**
     * Get the Fineract client ID from the JWT token.
     *
     * @param jwt The JWT token
     * @return Fineract client ID
     * @throws RegistrationException if client ID cannot be determined
     */
    public Long getCustomerClientId(Jwt jwt) {
        // Primary: Try fineract_client_id claim (fast path)
        Object clientIdClaim = jwt.getClaim("fineract_client_id");
        if (clientIdClaim != null) {
            if (clientIdClaim instanceof Number) {
                return ((Number) clientIdClaim).longValue();
            }
            if (clientIdClaim instanceof String) {
                try {
                    return Long.parseLong((String) clientIdClaim);
                } catch (NumberFormatException e) {
                    log.warn("Invalid fineract_client_id format in JWT: {}", clientIdClaim);
                }
            }
        }

        // Fallback: Lookup via fineract_external_id
        String externalId = jwt.getClaimAsString("fineract_external_id");
        if (externalId == null) {
            throw new RegistrationException("UNAUTHORIZED", "Missing identity claims in token", null);
        }

        log.info("Looking up client ID via external ID: {}", externalId);
        Map<String, Object> client = fineractService.getClientByExternalId(externalId);
        if (client == null || !client.containsKey("id")) {
            throw new RegistrationException("NOT_FOUND", "Customer not found in Fineract", null);
        }

        Long clientId = ((Number) client.get("id")).longValue();
        log.info("Resolved client ID {} from external ID {}", clientId, externalId);

        return clientId;
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
        Set<Long> ownedAccounts = accountOwnershipCache.get(customerClientId);
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

        // Update cache
        accountOwnershipCache.computeIfAbsent(customerClientId, k -> new HashSet<>()).add(accountId);
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

        // Update cache with all owned account IDs
        Set<Long> accountIds = new HashSet<>();
        for (Map<String, Object> account : accounts) {
            if (account.containsKey("id")) {
                accountIds.add(((Number) account.get("id")).longValue());
            }
        }
        accountOwnershipCache.put(customerClientId, accountIds);

        return accounts;
    }

    /**
     * Invalidate cache for a customer (call when accounts change).
     *
     * @param clientId The Fineract client ID
     */
    public void invalidateCache(Long clientId) {
        accountOwnershipCache.remove(clientId);
        log.info("Invalidated account cache for client {}", clientId);
    }
}