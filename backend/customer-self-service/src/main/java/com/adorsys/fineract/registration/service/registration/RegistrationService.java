package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.registration.RegistrationResponse;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import com.adorsys.fineract.registration.dto.batch.BatchRequest ;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.exception.JsonSerializationException;
import com.adorsys.fineract.registration.config.FineractProperties;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private static final String CONTENT_TYPE_HEADER = "Content-Type";
    private static final String APPLICATION_JSON = "application/json";

    private final FineractService fineractService;
    private final RegistrationMetrics registrationMetrics;
    private final FineractBatchService fineractBatchService;
    private final FineractClientService fineractClientService;
    private final FineractProperties fineractProperties;

    @Timed(value = "registration.service.register", description = "Time taken to register a new customer")
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public RegistrationResponse register(RegistrationRequest request) {
        log.info("Starting registration process for email: {}", request.getEmail());
        registrationMetrics.incrementRegistrationRequests();

        String externalId = request.getExternalId();
        log.info("Using externalId: {}", externalId);

        Map<String, Object> client = fineractService.getClientByExternalId(externalId);

        if (!client.isEmpty()) {
            Long fineractClientId = ((Number) client.get("id")).longValue();
            log.info("Client with externalId {} already exists. Found Fineract client ID: {}", externalId, fineractClientId);
            List<Map<String, Object>> savingsAccounts = fineractService.getSavingsAccountsByClientId(fineractClientId);
            if (!savingsAccounts.isEmpty()) {
                Long savingsAccountId = ((Number) savingsAccounts.get(0).get("id")).longValue();
                log.info("Savings account for Fineract client ID {} already exists. Savings account ID: {}", fineractClientId, savingsAccountId);
                RegistrationResponse response = new RegistrationResponse();
                response.setSuccess(true);
                response.setStatus("success");
                response.setFineractClientId(fineractClientId);
                response.setSavingsAccountId(savingsAccountId);
                return response;
            }
        }

        List<BatchRequest> batchRequests = buildBatchRequests(request);
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
                fineractClientId = JsonPath.read(batchResponse.getBody(), "$.clientId");
            } else if (batchResponse.getRequestId() == 2) {
                savingsAccountId = JsonPath.read(batchResponse.getBody(), "$.savingsId");
            }
        }

        RegistrationResponse response = new RegistrationResponse();
        response.setSuccess(true);
        response.setStatus("success");
        response.setFineractClientId(fineractClientId);
        response.setSavingsAccountId(savingsAccountId);

        log.info("Registration process completed successfully for externalId: {}", externalId);
        registrationMetrics.incrementRegistrationSuccess();

        return response;
    }

    private List<BatchRequest> buildBatchRequests(RegistrationRequest request) {
        java.util.List<BatchRequest> batchRequests = new java.util.ArrayList<>();

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
        createSavingsAccountRequest.setHeaders(List.of(new BatchRequest.Header(CONTENT_TYPE_HEADER, APPLICATION_JSON)));
        createSavingsAccountRequest.setBody(String.format("{'clientId':'$.1.resourceId','productId':%d,'locale':'%s','dateFormat':'%s','submittedOnDate':'%s'}",
                fineractProperties.getDefaults().getSavingsProductId(), fineractProperties.getDefaults().getLocale(), fineractProperties.getDefaults().getDateFormat(), LocalDate.now().format(DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat()))));
        batchRequests.add(createSavingsAccountRequest);
        
        // Approve Savings Account Request
        BatchRequest approveSavingsAccountRequest = new BatchRequest();
        approveSavingsAccountRequest.setRequestId(3L);
        approveSavingsAccountRequest.setMethod("POST");
        approveSavingsAccountRequest.setRelativeUrl("savingsaccounts/$.2.resourceId?command=approve");
        approveSavingsAccountRequest.setHeaders(List.of(new BatchRequest.Header(CONTENT_TYPE_HEADER, APPLICATION_JSON)));
        approveSavingsAccountRequest.setBody(String.format("{'approvedOnDate':'%s','locale':'%s','dateFormat':'%s'}",
                java.time.LocalDate.now().format(DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat())), fineractProperties.getDefaults().getLocale(), fineractProperties.getDefaults().getDateFormat()));
        batchRequests.add(approveSavingsAccountRequest);

        // Activate Savings Account Request
        BatchRequest activateSavingsAccountRequest = new BatchRequest();
        activateSavingsAccountRequest.setRequestId(4L);
        activateSavingsAccountRequest.setMethod("POST");
        activateSavingsAccountRequest.setRelativeUrl("savingsaccounts/$.2.resourceId?command=activate");
        activateSavingsAccountRequest.setHeaders(List.of(new BatchRequest.Header(CONTENT_TYPE_HEADER, APPLICATION_JSON)));
        activateSavingsAccountRequest.setBody(String.format("{'activatedOnDate':'%s','locale':'%s','dateFormat':'%s'}",
                LocalDate.now().format(DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat())), fineractProperties.getDefaults().getLocale(), fineractProperties.getDefaults().getDateFormat()));
        batchRequests.add(activateSavingsAccountRequest);

        if (request.getDepositAmount() != null && request.getDepositAmount().compareTo(BigDecimal.ZERO) > 0) {
            BatchRequest depositRequest = new BatchRequest();
            depositRequest.setRequestId(5L);
            depositRequest.setMethod("POST");
            depositRequest.setRelativeUrl("savingsaccounts/$.2.resourceId/transactions?command=deposit");
            depositRequest.setHeaders(List.of(new BatchRequest.Header(CONTENT_TYPE_HEADER, APPLICATION_JSON)));
            depositRequest.setBody(String.format("{'locale':'%s','dateFormat':'%s','transactionDate':'%s','transactionAmount':%s,'paymentTypeId':%d}",
                    fineractProperties.getDefaults().getLocale(), fineractProperties.getDefaults().getDateFormat(),LocalDate.now().format(DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat())), request.getDepositAmount(), fineractProperties.getDefaults().getPaymentTypeId()));
            batchRequests.add(depositRequest);
        }
        
        return batchRequests;
    }

    private String buildClientPayload(RegistrationRequest request) {
        try {
            return new ObjectMapper().writeValueAsString(fineractClientService.buildClientPayload(request));
        } catch (JsonProcessingException e) {
            throw new JsonSerializationException("Error serializing client payload", e);
        }
    }
}
