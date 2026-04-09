package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.exception.PermissionDeniedException;
import com.adorsys.fineract.gateway.service.PaymentService;
import com.adorsys.fineract.gateway.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for payment operations.
 */
@Slf4j
@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Tag(name = "Payments", description = "Deposit and withdrawal operations")
@SecurityRequirement(name = "bearer-jwt")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * Initiate a deposit (customer pays into their account).
     */
    @PostMapping("/deposit")
    @Operation(summary = "Initiate deposit", description = "Start a deposit transaction via mobile money")
    public ResponseEntity<PaymentResponse> initiateDeposit(
            @RequestHeader(value = "X-Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody DepositRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String userExternalId = JwtUtils.extractExternalId(jwt);
        log.info("Deposit request from user: {}, amount: {}, provider: {}",
            userExternalId, request.getAmount(), request.getProvider());

        verifyOwnership(userExternalId, request.getExternalId());

        PaymentResponse response = paymentService.initiateDeposit(request, idempotencyKey);
        return ResponseEntity.ok(response);
    }

    /**
     * Initiate a withdrawal (customer receives money from their account).
     */
    @PostMapping("/withdraw")
    @Operation(summary = "Initiate withdrawal", description = "Start a withdrawal transaction to mobile money")
    public ResponseEntity<PaymentResponse> initiateWithdrawal(
            @RequestHeader(value = "X-Idempotency-Key") String idempotencyKey,
            @Valid @RequestBody WithdrawalRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String userExternalId = JwtUtils.extractExternalId(jwt);
        log.info("Withdrawal request from user: {}, amount: {}, provider: {}",
            userExternalId, request.getAmount(), request.getProvider());

        verifyOwnership(userExternalId, request.getExternalId());

        PaymentResponse response = paymentService.initiateWithdrawal(request, idempotencyKey);
        return ResponseEntity.ok(response);
    }

    /**
     * Get the status of a transaction.
     */
    @GetMapping("/status/{transactionId}")
    @Operation(summary = "Get transaction status", description = "Check the status of a payment transaction")
    public ResponseEntity<TransactionStatusResponse> getTransactionStatus(
            @PathVariable String transactionId,
            @AuthenticationPrincipal Jwt jwt) {

        String userExternalId = JwtUtils.extractExternalId(jwt);
        log.info("Transaction status request: txnId={}, user={}", transactionId, userExternalId);

        TransactionStatusResponse status = paymentService.getTransactionStatus(transactionId);

        verifyOwnership(userExternalId, status.getExternalId());

        return ResponseEntity.ok(status);
    }

    private void verifyOwnership(String userExternalId, String requestExternalId) {
        if (!userExternalId.equals(requestExternalId)) {
            log.warn("User {} attempted operation for different externalId: {}",
                userExternalId, requestExternalId);
            throw new PermissionDeniedException("Cannot perform operation for a different user");
        }
    }
}
