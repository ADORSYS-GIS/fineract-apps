package com.adorsys.fineract.registration.service.registration;

import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.dto.registration.RegistrationResponse;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import io.micrometer.core.annotation.Timed;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final com.adorsys.fineract.registration.service.FineractService fineractService;
    private final RegistrationMetrics registrationMetrics;

    @Timed(value = "registration.service.register", description = "Time taken to register a new customer")
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public RegistrationResponse register(RegistrationRequest request) {
        log.info("Starting registration process for email: {}", request.getEmail());
        registrationMetrics.incrementRegistrationRequests();
 
        String externalId = request.getExternalId();
        log.info("Using externalId: {}", externalId);
 
        Map<String, Object> client = fineractService.getClientByExternalId(externalId);
 
        Long fineractClientId;
        if (client.isEmpty()) {
            try {
                fineractClientId = fineractService.createClient(request);
                log.info("Successfully created client in Fineract with ID: {}", fineractClientId);
            } catch (Exception e) {
                log.error("Client creation failed for externalId {}: {}", externalId, e.getMessage());
                registrationMetrics.incrementRegistrationFailure("CLIENT_CREATION_FAILED");
                throw e;
            }
        } else {
            fineractClientId = ((Number) client.get("id")).longValue();
            log.info("Client with externalId {} already exists. Found Fineract client ID: {}", externalId, fineractClientId);
        }
 
        List<Map<String, Object>> savingsAccounts = fineractService.getSavingsAccountsByClientId(fineractClientId);
 
        Long savingsAccountId;
        if (savingsAccounts.isEmpty()) {
            try {
                savingsAccountId = fineractService.createSavingsAccount(fineractClientId);
                log.info("Successfully created savings account in Fineract with ID: {}", savingsAccountId);
            } catch (Exception e) {
                log.error("Savings account creation failed for externalId {}: {}", externalId, e.getMessage());
                registrationMetrics.incrementRegistrationFailure("SAVINGS_ACCOUNT_CREATION_FAILED");
                throw e;
            }
        } else {
            savingsAccountId = ((Number) savingsAccounts.get(0).get("id")).longValue();
            log.info("Savings account for Fineract client ID {} already exists. Savings account ID: {}", fineractClientId, savingsAccountId);
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
}
