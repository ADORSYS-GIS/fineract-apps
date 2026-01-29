package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.dto.MtnCallbackRequest;
import com.adorsys.fineract.gateway.dto.OrangeCallbackRequest;
import com.adorsys.fineract.gateway.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for payment provider callbacks.
 * These endpoints are called by MTN and Orange when payment status changes.
 */
@Slf4j
@RestController
@RequestMapping("/api/callbacks")
@RequiredArgsConstructor
@Tag(name = "Callbacks", description = "Payment provider callback endpoints")
public class CallbackController {

    private final PaymentService paymentService;

    /**
     * Handle MTN MoMo collection callback (deposit completed).
     */
    @PostMapping("/mtn/collection")
    @Operation(summary = "MTN collection callback", description = "Receive MTN MoMo collection (deposit) status update")
    public ResponseEntity<Void> handleMtnCollectionCallback(
            @RequestBody MtnCallbackRequest callback,
            @RequestHeader(value = "X-Callback-Url", required = false) String callbackUrl) {

        log.info("Received MTN collection callback: ref={}, status={}, externalId={}",
            callback.getReferenceId(), callback.getStatus(), callback.getExternalId());

        try {
            paymentService.handleMtnCollectionCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process MTN collection callback: {}", e.getMessage(), e);
            // Return 200 to prevent retries for processing errors
            return ResponseEntity.ok().build();
        }
    }

    /**
     * Handle MTN MoMo disbursement callback (withdrawal completed).
     */
    @PostMapping("/mtn/disbursement")
    @Operation(summary = "MTN disbursement callback", description = "Receive MTN MoMo disbursement (withdrawal) status update")
    public ResponseEntity<Void> handleMtnDisbursementCallback(
            @RequestBody MtnCallbackRequest callback,
            @RequestHeader(value = "X-Callback-Url", required = false) String callbackUrl) {

        log.info("Received MTN disbursement callback: ref={}, status={}, externalId={}",
            callback.getReferenceId(), callback.getStatus(), callback.getExternalId());

        try {
            paymentService.handleMtnDisbursementCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process MTN disbursement callback: {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }

    /**
     * Handle Orange Money payment callback (deposit completed).
     */
    @PostMapping("/orange/payment")
    @Operation(summary = "Orange payment callback", description = "Receive Orange Money payment (deposit) status update")
    public ResponseEntity<Void> handleOrangePaymentCallback(
            @RequestBody OrangeCallbackRequest callback) {

        log.info("Received Orange payment callback: orderId={}, status={}, txnId={}",
            callback.getOrderId(), callback.getStatus(), callback.getTransactionId());

        try {
            paymentService.handleOrangeCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process Orange payment callback: {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }

    /**
     * Handle Orange Money cash-out callback (withdrawal completed).
     */
    @PostMapping("/orange/cashout")
    @Operation(summary = "Orange cashout callback", description = "Receive Orange Money cash-out (withdrawal) status update")
    public ResponseEntity<Void> handleOrangeCashoutCallback(
            @RequestBody OrangeCallbackRequest callback) {

        log.info("Received Orange cashout callback: orderId={}, status={}, txnId={}",
            callback.getOrderId(), callback.getStatus(), callback.getTransactionId());

        try {
            paymentService.handleOrangeCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process Orange cashout callback: {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }
}
