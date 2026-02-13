package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.dto.CinetPayCallbackRequest;
import com.adorsys.fineract.gateway.dto.MtnCallbackRequest;
import com.adorsys.fineract.gateway.dto.OrangeCallbackRequest;
import com.adorsys.fineract.gateway.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
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
    private final MtnMomoConfig mtnConfig;

    /**
     * Handle MTN MoMo collection callback (deposit completed).
     */
    @PostMapping("/mtn/collection")
    @Operation(summary = "MTN collection callback", description = "Receive MTN MoMo collection (deposit) status update")
    public ResponseEntity<Void> handleMtnCollectionCallback(
            @RequestBody MtnCallbackRequest callback,
            @RequestHeader(value = "X-Callback-Url", required = false) String callbackUrl,
            @RequestHeader(value = "Ocp-Apim-Subscription-Key", required = false) String subscriptionKey) {

        log.info("Received MTN collection callback: ref={}, status={}, externalId={}",
            callback.getReferenceId(), callback.getStatus(), callback.getExternalId());

        if (!isValidMtnCallback(subscriptionKey)) {
            log.warn("Invalid MTN collection callback: subscription key mismatch");
            return ResponseEntity.ok().build();
        }

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
            @RequestHeader(value = "X-Callback-Url", required = false) String callbackUrl,
            @RequestHeader(value = "Ocp-Apim-Subscription-Key", required = false) String subscriptionKey) {

        log.info("Received MTN disbursement callback: ref={}, status={}, externalId={}",
            callback.getReferenceId(), callback.getStatus(), callback.getExternalId());

        if (!isValidMtnCallback(subscriptionKey)) {
            log.warn("Invalid MTN disbursement callback: subscription key mismatch");
            return ResponseEntity.ok().build();
        }

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

    /**
     * Handle CinetPay payment callback (deposit completed).
     * CinetPay is a gateway - callback includes actual payment method (MOMO, OM).
     */
    @PostMapping(value = "/cinetpay/payment", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "CinetPay payment callback", description = "Receive CinetPay payment (deposit) status update")
    public ResponseEntity<Void> handleCinetPayPaymentCallback(
            @RequestBody CinetPayCallbackRequest callback,
            @RequestHeader(value = "x-token", required = false) String xToken) {

        log.info("Received CinetPay payment callback: transactionId={}, status={}, method={}",
            callback.getTransactionId(), callback.getResultCode(), callback.getPaymentMethod());
        
        callback.setXToken(xToken);

        try {
            paymentService.handleCinetPayCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process CinetPay payment callback: {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }

    /**
     * Handle CinetPay payment callback via Form Data (x-www-form-urlencoded).
     */
    @PostMapping(value = "/cinetpay/payment", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Operation(summary = "CinetPay payment callback (Form)", description = "Receive CinetPay payment status update via form data")
    public ResponseEntity<Void> handleCinetPayPaymentCallbackForm(
            @RequestParam MultiValueMap<String, String> formData,
            @RequestHeader(value = "x-token", required = false) String xToken) {

        log.info("Received CinetPay payment callback (Form): {}", formData);
        CinetPayCallbackRequest callback = mapToCinetPayRequest(formData);
        callback.setXToken(xToken);

        try {
            paymentService.handleCinetPayCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process CinetPay payment callback (Form): {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }

    /**
     * Handle CinetPay transfer callback (withdrawal completed).
     */
    @PostMapping(value = "/cinetpay/transfer", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "CinetPay transfer callback", description = "Receive CinetPay transfer (withdrawal) status update")
    public ResponseEntity<Void> handleCinetPayTransferCallback(
            @RequestBody CinetPayCallbackRequest callback,
            @RequestHeader(value = "x-token", required = false) String xToken) {

        log.info("Received CinetPay transfer callback: transactionId={}, status={}",
            callback.getTransactionId(), callback.getResultCode());
        
        callback.setXToken(xToken);

        try {
            paymentService.handleCinetPayCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process CinetPay transfer callback: {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }

    /**
     * Handle CinetPay transfer callback via Form Data (x-www-form-urlencoded).
     */
    @PostMapping(value = "/cinetpay/transfer", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    @Operation(summary = "CinetPay transfer callback (Form)", description = "Receive CinetPay transfer status update via form data")
    public ResponseEntity<Void> handleCinetPayTransferCallbackForm(
            @RequestParam MultiValueMap<String, String> formData,
            @RequestHeader(value = "x-token", required = false) String xToken) {

        log.info("Received CinetPay transfer callback (Form): {}", formData);
        CinetPayCallbackRequest callback = mapToCinetPayTransferRequest(formData);
        callback.setXToken(xToken);

        try {
            paymentService.handleCinetPayCallback(callback);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to process CinetPay transfer callback (Form): {}", e.getMessage(), e);
            return ResponseEntity.ok().build();
        }
    }

    private CinetPayCallbackRequest mapToCinetPayRequest(MultiValueMap<String, String> formData) {
        String paymentMethod = formData.getFirst("cpm_payment_method");
        if (paymentMethod == null) {
            paymentMethod = formData.getFirst("payment_method");
        }

        String phoneNumber = formData.getFirst("cpm_cell_phone_num");
        if (phoneNumber == null) {
            phoneNumber = formData.getFirst("cel_phone_num");
        }

        String resultCode = formData.getFirst("cpm_result");
        if (resultCode == null && "SUCCES".equalsIgnoreCase(formData.getFirst("cpm_error_message"))) {
            resultCode = "00";
        }

        return CinetPayCallbackRequest.builder()
            .siteId(formData.getFirst("cpm_site_id"))
            .transactionId(formData.getFirst("cpm_trans_id"))
            .transactionDate(formData.getFirst("cpm_trans_date"))
            .amount(formData.getFirst("cpm_amount"))
            .currency(formData.getFirst("cpm_currency"))
            .paymentMethod(paymentMethod)
            .phonePrefix(formData.getFirst("cpm_phone_prefixe"))
            .phoneNumber(phoneNumber)
            .resultCode(resultCode)
            .errorMessage(formData.getFirst("cpm_error_message"))
            .paymentId(formData.getFirst("cpm_payid"))
            .customData(formData.getFirst("cpm_custom"))
            .language(formData.getFirst("cpm_language"))
            .version(formData.getFirst("cpm_version"))
            .paymentConfig(formData.getFirst("cpm_payment_config"))
            .pageAction(formData.getFirst("cpm_page_action"))
            .designation(formData.getFirst("cpm_designation"))
            .signature(formData.getFirst("signature"))
            .build();
    }

    /**
     * Validate MTN callback subscription key.
     * Fail-open when key is not configured (dev mode).
     */
    private boolean isValidMtnCallback(String subscriptionKey) {
        String collectionKey = mtnConfig.getCollectionSubscriptionKey();
        String disbursementKey = mtnConfig.getDisbursementSubscriptionKey();

        // Fail-open if subscription keys are not configured (dev/sandbox mode)
        if ((collectionKey == null || collectionKey.isEmpty()) &&
            (disbursementKey == null || disbursementKey.isEmpty())) {
            return true;
        }

        if (subscriptionKey == null || subscriptionKey.isEmpty()) {
            return false;
        }

        return subscriptionKey.equals(collectionKey) || subscriptionKey.equals(disbursementKey);
    }

    private CinetPayCallbackRequest mapToCinetPayTransferRequest(MultiValueMap<String, String> formData) {
        return CinetPayCallbackRequest.builder()
            .transactionId(formData.getFirst("transaction_id")) // CinetPay ID
            .clientTransactionId(formData.getFirst("client_transaction_id")) // Our ID
            .amount(formData.getFirst("amount"))
            .receiver(formData.getFirst("receiver"))
            .sendingStatus(formData.getFirst("sending_status"))
            .treatmentStatus(formData.getFirst("treatment_status"))
            .operatorTransactionId(formData.getFirst("operator_transaction_id"))
            .transactionDate(formData.getFirst("validated_at"))
            .errorMessage(formData.getFirst("comment")) // Mapping comment to error/message
            .build();
    }
}
