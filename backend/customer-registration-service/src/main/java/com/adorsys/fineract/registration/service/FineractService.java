package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.config.FineractConfig;
import com.adorsys.fineract.registration.dto.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
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
     *
     * @param clientId    Fineract client ID
     * @param name        Document name
     * @param description Document description
     * @param content     File content as byte array
     * @param contentType MIME type of the file
     * @param fileName    Original file name
     * @return Fineract document ID
     */
    @SuppressWarnings("unchecked")
    public Long uploadDocument(Long clientId, String name, String description, byte[] content, String contentType, String fileName) {
        log.info("Uploading document for client {}: {} ({})", clientId, name, contentType);

        try {
            // Create a ByteArrayResource that provides a filename
            ByteArrayResource fileResource = new ByteArrayResource(content) {
                @Override
                public String getFilename() {
                    return fileName;
                }
            };

            // Build multipart body
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("name", name);
            body.add("description", description);

            // Add file with proper headers
            HttpHeaders fileHeaders = new HttpHeaders();
            fileHeaders.setContentType(MediaType.parseMediaType(contentType));
            HttpEntity<ByteArrayResource> filePart = new HttpEntity<>(fileResource, fileHeaders);
            body.add("file", filePart);

            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/documents", clientId)
                    .contentType(MediaType.MULTIPART_FORM_DATA)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("resourceId")) {
                Long documentId = ((Number) response.get("resourceId")).longValue();
                log.info("Uploaded document with ID: {} for client: {}", documentId, clientId);
                return documentId;
            }

            throw new RegistrationException("Failed to upload document: invalid response");
        } catch (Exception e) {
            log.error("Failed to upload document for client {}: {}", clientId, e.getMessage(), e);
            throw new RegistrationException("Failed to upload document: " + e.getMessage(), e);
        }
    }

    /**
     * Get documents for a client by external ID.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientDocumentsByExternalId(String externalId) {
        log.info("Getting documents for client with external ID: {}", externalId);

        Map<String, Object> client = getClientByExternalId(externalId);
        if (client == null) {
            log.warn("Client not found for external ID: {}", externalId);
            return List.of();
        }

        Long clientId = ((Number) client.get("id")).longValue();
        return getClientDocuments(clientId);
    }

    /**
     * Get documents for a client by client ID.
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientDocuments(Long clientId) {
        log.info("Getting documents for client: {}", clientId);

        try {
            List<Map<String, Object>> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/documents", clientId)
                    .retrieve()
                    .body(List.class);

            return response != null ? response : List.of();
        } catch (Exception e) {
            log.error("Failed to get documents for client {}: {}", clientId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Get a specific document's metadata.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDocument(Long clientId, Long documentId) {
        log.info("Getting document {} for client {}", documentId, clientId);

        try {
            return fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/documents/{documentId}", clientId, documentId)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Failed to get document {} for client {}: {}", documentId, clientId, e.getMessage());
            return null;
        }
    }

    /**
     * Activate a client account.
     */
    public void activateClient(Long clientId) {
        log.info("Activating client: {}", clientId);

        Map<String, Object> payload = Map.of(
                "locale", "en",
                "dateFormat", "dd MMMM yyyy",
                "activationDate", java.time.LocalDate.now().format(DATE_FORMATTER)
        );

        try {
            fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients/{clientId}?command=activate", clientId)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Activated client: {}", clientId);
        } catch (Exception e) {
            log.error("Failed to activate client {}: {}", clientId, e.getMessage(), e);
            throw new RegistrationException("Failed to activate client", e);
        }
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
            payload.put("genderId", fineractConfig.getDefaultGenderId());
        }

        return payload;
    }
}
