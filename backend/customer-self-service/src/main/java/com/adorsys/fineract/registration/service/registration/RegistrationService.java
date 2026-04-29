package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.batch.BatchRequest;
import com.adorsys.fineract.registration.dto.batch.BatchResponse;
import com.adorsys.fineract.registration.dto.deposit.DepositRequest;
import com.adorsys.fineract.registration.dto.deposit.DepositResponse;
import com.adorsys.fineract.registration.dto.registration.ClientAndAccountResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.ValidationException;
import com.adorsys.fineract.registration.exception.JsonSerializationException;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.service.account.AccountSecurityService;
import com.adorsys.fineract.registration.service.fineract.FineractAccountService;
import com.adorsys.fineract.registration.service.fineract.FineractBatchService;
import com.adorsys.fineract.registration.service.fineract.FineractClientService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jayway.jsonpath.JsonPath;
import io.micrometer.core.annotation.Timed;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String CONTENT_TYPE_HEADER = "Content-Type";
    private static final String APPLICATION_JSON = "application/json";
    private static final String STATUS_SUCCESS = "success";
    private static final String SAVINGS_ACCOUNT_STATUS_PENDING_APPROVAL = "savingsAccountStatusType.submitted.and.pending.approval";

    private final FineractService fineractService;
    private final RegistrationMetrics registrationMetrics;
    private final FineractBatchService fineractBatchService;
    private final FineractClientService fineractClientService;
    private final FineractAccountService fineractAccountService;
    private final FineractProperties fineractProperties;
    private final AccountSecurityService accountSecurityService;

    @Timed(value = "registration.service.registerClientAndAccount", description = "Time taken to register a new customer and create an account")
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public ClientAndAccountResponse registerClientAndAccount(RegistrationRequest request) {
        log.info("Starting registration process for email: {}", request.getEmail());
        registrationMetrics.incrementRegistrationRequests();

        String externalId = request.getExternalId();
        log.info("Using externalId: {}", externalId);

        Map<String, Object> client = fineractService.getClientByExternalId(externalId);

        if (!client.isEmpty()) {
            throw new RegistrationException("CONFLICT", "Client with externalId " + externalId + " already exists.");
        }

        // Pre-check unique mobileNo: Fineract enforces it at the DB level and would
        // otherwise return an opaque batch 403 that wedges the KYC flow.
        String phone = request.getPhone();
        if (phone != null && !phone.isBlank()) {
            Map<String, Object> existingByPhone = fineractService.getClientByMobileNo(phone);
            if (!existingByPhone.isEmpty()) {
                Object existingExternalId = existingByPhone.get("externalId");
                log.warn("Cannot register externalId={} — phone {} already linked to externalId={}",
                        externalId, phone, existingExternalId);
                registrationMetrics.incrementRegistrationFailure("DUPLICATE_PHONE");
                throw new RegistrationException(
                        "DUPLICATE_PHONE",
                        "Phone number is already linked to another account.",
                        "phone");
            }
        }

        List<BatchRequest> batchRequests = buildClientAndAccountBatchRequests(request);
        List<BatchResponse> batchResponses = fineractBatchService.sendBatchRequest(batchRequests);

        Long fineractClientId = null;
        Long savingsAccountId = null;

        for (BatchResponse batchResponse : batchResponses) {
            if (batchResponse.getStatusCode() != 200) {
                log.error("Batch request failed with status code: {} and body: {}", batchResponse.getStatusCode(), batchResponse.getBody());
                registrationMetrics.incrementRegistrationFailure("BATCH_REQUEST_FAILED");
                throw new RegistrationException("Batch request failed");
            }

            if (batchResponse.getRequestId() == 1) {
                fineractClientId = ((Number) JsonPath.read(batchResponse.getBody(), "$.clientId")).longValue();
            } else if (batchResponse.getRequestId() == 2) {
                savingsAccountId = ((Number) JsonPath.read(batchResponse.getBody(), "$.savingsId")).longValue();
            }
        }

        ClientAndAccountResponse response = new ClientAndAccountResponse();
        response.setSuccess(true);
        response.setStatus(STATUS_SUCCESS);
        response.setFineractClientId(fineractClientId);
        response.setSavingsAccountId(savingsAccountId);

        log.info("Registration process completed successfully for externalId: {}", externalId);
        registrationMetrics.incrementRegistrationSuccess();
        if (fineractClientId != null) {
            try {
                accountSecurityService.invalidateCache(fineractClientId);
            } catch (Exception e) {
                // Cache invalidation is best-effort — a Redis failure must not roll back
                // an already-succeeded Fineract registration and return a false 500.
                log.warn("Failed to invalidate account ownership cache for client {}: {}",
                         fineractClientId, e.getMessage());
            }
        }

        return response;
    }

    private List<BatchRequest> buildClientAndAccountBatchRequests(RegistrationRequest request) {
        List<BatchRequest> batchRequests = new ArrayList<>();

        // Create Client Request
        BatchRequest createClientRequest = new BatchRequest();
        createClientRequest.setRequestId(1L);
        createClientRequest.setMethod("POST");
        createClientRequest.setRelativeUrl("clients");
        createClientRequest.setHeaders(List.of(new BatchRequest.Header(CONTENT_TYPE_HEADER, APPLICATION_JSON)));
        createClientRequest.setBody(buildClientPayload(request));
        batchRequests.add(createClientRequest);

        // Create Savings Account Request
        BatchRequest createSavingsAccountRequest = new BatchRequest();
        createSavingsAccountRequest.setRequestId(2L);
        createSavingsAccountRequest.setMethod("POST");
        createSavingsAccountRequest.setRelativeUrl("savingsaccounts");
        createSavingsAccountRequest.setReference(1L);
        createSavingsAccountRequest.setHeaders(List.of(new BatchRequest.Header(CONTENT_TYPE_HEADER, APPLICATION_JSON)));
        createSavingsAccountRequest.setBody(String.format("{\"clientId\":\"$.resourceId\",\"productId\":%d,\"submittedOnDate\":\"%s\",\"locale\":\"%s\",\"dateFormat\":\"%s\"}",
                fineractProperties.getDefaults().getSavingsProductId(),
                LocalDate.now().format(DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat())),
                fineractProperties.getDefaults().getLocale(),
                fineractProperties.getDefaults().getDateFormat()));
        batchRequests.add(createSavingsAccountRequest);
        
        return batchRequests;
    }

    private String buildClientPayload(RegistrationRequest request) {
        try {
            return new ObjectMapper().writeValueAsString(fineractClientService.buildClientPayload(request));
        } catch (JsonProcessingException e) {
            throw new JsonSerializationException("Error serializing client payload", e);
        }
    }

    @Timed(value = "registration.service.fundAccount", description = "Time taken to fund a customer's account")
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public DepositResponse fundAccount(DepositRequest request, String idempotencyKey) {
        log.info("Starting account funding process for savings account: {}", request.getSavingsAccountId());

        if (request.getDepositAmount() != null && request.getDepositAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new ValidationException("Deposit amount cannot be negative.", "depositAmount");
        }

        Map<String, Object> savingsAccount = fineractAccountService.getSavingsAccount(request.getSavingsAccountId());
        if (savingsAccount == null || savingsAccount.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Savings account with id " + request.getSavingsAccountId() + " not found.");
        }
        
        if (savingsAccount.get("status") instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> status = (Map<String, Object>) savingsAccount.get("status");
            if (SAVINGS_ACCOUNT_STATUS_PENDING_APPROVAL.equals(status.get("code"))) {
                fineractAccountService.approveSavingsAccount(request.getSavingsAccountId());
                fineractAccountService.activateSavingsAccount(request.getSavingsAccountId());
            }
        }

        Long transactionId = null;
        if (request.getDepositAmount() != null && request.getDepositAmount().compareTo(BigDecimal.ZERO) > 0) {
            Map<String, Object> depositResponse = fineractAccountService.makeDeposit(request.getSavingsAccountId(), request.getDepositAmount(), request.getPaymentType(), idempotencyKey);
            transactionId = ((Number) depositResponse.get("resourceId")).longValue();
        }

        DepositResponse response = new DepositResponse();
        response.setSuccess(true);
        response.setStatus(STATUS_SUCCESS);
        response.setSavingsAccountId(request.getSavingsAccountId());
        response.setTransactionId(transactionId);

        log.info("Account funding process completed successfully for savings account: {}", request.getSavingsAccountId());

        return response;
    }
}
