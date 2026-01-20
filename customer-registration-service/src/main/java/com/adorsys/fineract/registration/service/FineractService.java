package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.config.FineractConfig;
import com.adorsys.fineract.registration.dto.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class FineractService {

    private final RestClient fineractRestClient;
    private final FineractConfig fineractConfig;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMMM yyyy");

    /**
     * Create a new client in Fineract.
     *
     * @param request    Registration request data
     * @param externalId UUID to link with Keycloak
     * @return Fineract client ID
     */
    public Long createClient(RegistrationRequest request, String externalId) {
        log.info("Creating Fineract client for email: {}", request.getEmail());

        Map<String, Object> clientPayload = buildClientPayload(request, externalId);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients")
                    .body(clientPayload)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("clientId")) {
                Long clientId = ((Number) response.get("clientId")).longValue();
                log.info("Created Fineract client with ID: {}", clientId);
                return clientId;
            }

            throw new RegistrationException("Failed to create Fineract client: invalid response");
        } catch (Exception e) {
            log.error("Failed to create Fineract client: {}", e.getMessage(), e);
            throw new RegistrationException("Failed to create client account", e);
        }
    }

    /**
     * Create a default savings account for the client.
     *
     * @param clientId Fineract client ID
     * @return Savings account ID
     */
    public Long createSavingsAccount(Long clientId) {
        log.info("Creating savings account for client: {}", clientId);

        Map<String, Object> savingsPayload = Map.of(
                "clientId", clientId,
                "productId", fineractConfig.getDefaultSavingsProductId(),
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "submittedOnDate", LocalDate.now().format(DATE_FORMATTER)
        );

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts")
                    .body(savingsPayload)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("savingsId")) {
                Long savingsId = ((Number) response.get("savingsId")).longValue();
                log.info("Created savings account with ID: {}", savingsId);
                return savingsId;
            }

            throw new RegistrationException("Failed to create savings account: invalid response");
        } catch (Exception e) {
            log.error("Failed to create savings account: {}", e.getMessage(), e);
            throw new RegistrationException("Failed to create savings account", e);
        }
    }

    /**
     * Delete a client (for rollback).
     */
    public void deleteClient(Long clientId) {
        log.info("Deleting Fineract client: {}", clientId);
        try {
            fineractRestClient.delete()
                    .uri("/fineract-provider/api/v1/clients/{clientId}", clientId)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Deleted Fineract client: {}", clientId);
        } catch (Exception e) {
            log.error("Failed to delete Fineract client {}: {}", clientId, e.getMessage());
        }
    }

    /**
     * Get client by external ID.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getClientByExternalId(String externalId) {
        try {
            Map<String, Object> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients?externalId={externalId}", externalId)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("pageItems")) {
                var pageItems = (java.util.List<Map<String, Object>>) response.get("pageItems");
                if (!pageItems.isEmpty()) {
                    return pageItems.get(0);
                }
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to get client by external ID: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Upload document for KYC.
     */
    public Long uploadDocument(Long clientId, String name, String description, byte[] content, String contentType) {
        log.info("Uploading document for client {}: {}", clientId, name);

        // TODO: Implement multipart file upload to Fineract document API
        // POST /fineract-provider/api/v1/clients/{clientId}/documents

        throw new UnsupportedOperationException("Document upload not yet implemented");
    }

    private Map<String, Object> buildClientPayload(RegistrationRequest request, String externalId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("officeId", fineractConfig.getDefaultOfficeId());
        payload.put("firstname", request.getFirstName());
        payload.put("lastname", request.getLastName());
        payload.put("externalId", externalId);
        payload.put("mobileNo", request.getPhone());
        payload.put("emailAddress", request.getEmail());
        payload.put("active", false); // Pending KYC activation
        payload.put("legalFormId", 1); // Person
        payload.put("locale", "en");
        payload.put("dateFormat", "dd MMMM yyyy");

        if (request.getDateOfBirth() != null) {
            payload.put("dateOfBirth", request.getDateOfBirth().format(DATE_FORMATTER));
        }

        if (request.getGender() != null) {
            // Gender code value depends on Fineract configuration
            // Typically: 1 = Male, 2 = Female
            int genderCode = "Male".equalsIgnoreCase(request.getGender()) ? 1 : 2;
            payload.put("genderId", genderCode);
        }

        return payload;
    }
}
