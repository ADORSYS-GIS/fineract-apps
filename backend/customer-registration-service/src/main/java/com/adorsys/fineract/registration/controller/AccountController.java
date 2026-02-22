package com.adorsys.fineract.registration.controller;

import com.adorsys.fineract.registration.dto.SavingsAccountResponse;
import com.adorsys.fineract.registration.dto.TransactionResponse;
import com.adorsys.fineract.registration.service.AccountSecurityService;
import com.adorsys.fineract.registration.service.FineractService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Account Controller for customer self-service.
 *
 * Provides read-only access to customer's savings accounts and transactions.
 * All endpoints verify account ownership before returning data.
 */
@Slf4j
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Accounts", description = "Customer account queries with ownership verification")
@SecurityRequirement(name = "bearer-jwt")
public class AccountController {

    private final AccountSecurityService accountSecurityService;
    private final FineractService fineractService;

    /**
     * Get all savings accounts for the authenticated customer.
     * Customer identity is extracted from JWT token.
     */
    @GetMapping("/savings")
    @Operation(summary = "Get customer's savings accounts",
               description = "Returns all savings accounts owned by the authenticated customer")
    public ResponseEntity<SavingsAccountResponse> getSavingsAccounts(
            @AuthenticationPrincipal Jwt jwt) {

        log.info("Getting savings accounts for customer");

        List<Map<String, Object>> accounts = accountSecurityService.getCustomerSavingsAccounts(jwt);

        return ResponseEntity.ok(SavingsAccountResponse.builder()
                .accounts(accounts)
                .build());
    }

    /**
     * Get a specific savings account by ID.
     * Verifies ownership before returning data.
     */
    @GetMapping("/savings/{accountId}")
    @Operation(summary = "Get savings account details",
               description = "Returns details of a specific savings account after verifying ownership")
    public ResponseEntity<Map<String, Object>> getSavingsAccount(
            @PathVariable Long accountId,
            @AuthenticationPrincipal Jwt jwt) {

        log.info("Getting savings account: {}", accountId);

        // Verify ownership first
        accountSecurityService.verifySavingsAccountOwnership(accountId, jwt);

        Map<String, Object> account = fineractService.getSavingsAccount(accountId);
        if (account == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(account);
    }

    /**
     * Get transactions for a savings account.
     * Verifies ownership before returning data.
     */
    @GetMapping("/savings/{accountId}/transactions")
    @Operation(summary = "Get account transactions",
               description = "Returns transaction history for a savings account after verifying ownership")
    public ResponseEntity<TransactionResponse> getTransactions(
            @PathVariable Long accountId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit,
            @AuthenticationPrincipal Jwt jwt) {

        log.info("Getting transactions for account: {} (page={}, limit={})", accountId, page, limit);

        // Verify ownership first
        accountSecurityService.verifySavingsAccountOwnership(accountId, jwt);

        List<Map<String, Object>> allTransactions = fineractService.getSavingsAccountTransactions(accountId);

        // Apply pagination
        int total = allTransactions.size();
        int start = Math.max(0, (page - 1) * limit);
        int end = Math.min(start + limit, total);
        List<Map<String, Object>> paginatedTransactions = start < total
                ? allTransactions.subList(start, end)
                : List.of();

        return ResponseEntity.ok(TransactionResponse.builder()
                .transactions(paginatedTransactions)
                .total(total)
                .page(page)
                .pageSize(limit)
                .build());
    }
}
