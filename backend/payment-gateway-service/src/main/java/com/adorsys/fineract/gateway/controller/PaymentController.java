package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.dto.*;
import com.adorsys.fineract.gateway.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody DepositRequest request
            /*, @AuthenticationPrincipal Jwt jwt*/) {

        // String userExternalId = jwt.getClaimAsString("fineract_external_id");
        // log.info("Deposit request from user: {}, amount: {}, provider: {}",
        //     userExternalId, request.getAmount(), request.getProvider());

        // // Ensure the request is for the authenticated user's account
        // if (!userExternalId.equals(request.getExternalId())) {
        //     log.warn("User {} attempted deposit for different externalId: {}",
        //         userExternalId, request.getExternalId());
        //     return ResponseEntity.status(403).build();
        // }

        PaymentResponse response = paymentService.initiateDeposit(request, idempotencyKey);
        return ResponseEntity.ok(response);
    }

    /**
     * Initiate a withdrawal (customer receives money from their account).
     */
    @PostMapping("/withdraw")
    @Operation(summary = "Initiate withdrawal", description = "Start a withdrawal transaction to mobile money")
    public ResponseEntity<PaymentResponse> initiateWithdrawal(
            @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody WithdrawalRequest request
            /*, @AuthenticationPrincipal Jwt jwt*/) {

        // String userExternalId = jwt.getClaimAsString("fineract_external_id");
        // log.info("Withdrawal request from user: {}, amount: {}, provider: {}",
        //     userExternalId, request.getAmount(), request.getProvider());

        // // Ensure the request is for the authenticated user's account
        // if (!userExternalId.equals(request.getExternalId())) {
        //     log.warn("User {} attempted withdrawal for different externalId: {}",
        //         userExternalId, request.getExternalId());
        //     return ResponseEntity.status(403).build();
        // }

        // TODO: Validate step-up token for withdrawals (WebAuthn)

        PaymentResponse response = paymentService.initiateWithdrawal(request, idempotencyKey);
        return ResponseEntity.ok(response);
    }

    /**
     * Get the status of a transaction.
     */
    @GetMapping("/status/{transactionId}")
    @Operation(summary = "Get transaction status", description = "Check the status of a payment transaction")
    public ResponseEntity<TransactionStatusResponse> getTransactionStatus(
            @PathVariable String transactionId
            /*, @AuthenticationPrincipal Jwt jwt*/) {

        // String userExternalId = jwt.getClaimAsString("fineract_external_id");
        // log.info("Transaction status request: txnId={}, user={}", transactionId, userExternalId);

        TransactionStatusResponse status = paymentService.getTransactionStatus(transactionId);

        // // Ensure the user can only see their own transactions
        // if (!userExternalId.equals(status.getExternalId())) {
        //     log.warn("User {} attempted to view transaction for different user", userExternalId);
        //     return ResponseEntity.status(403).build();
        // }

        return ResponseEntity.ok(status);
    }
}
