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
     * Get all savings accounts for a client.
     *
     * @param clientId Fineract client ID
     * @return List of savings accounts
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getSavingsAccountsByClientId(Long clientId) {
        log.info("Getting savings accounts for client: {}", clientId);

        try {
            Map<String, Object> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/accounts", clientId)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("savingsAccounts")) {
                return (List<Map<String, Object>>) response.get("savingsAccounts");
            }
            return List.of();
        } catch (Exception e) {
            log.error("Failed to get savings accounts for client {}: {}", clientId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Get a specific savings account by ID.
     *
     * @param accountId Savings account ID
     * @return Savings account details or null if not found
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getSavingsAccount(Long accountId) {
        log.info("Getting savings account: {}", accountId);

        try {
            return fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}", accountId)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            log.error("Failed to get savings account {}: {}", accountId, e.getMessage());
            return null;
        }
    }

    /**
     * Get transactions for a savings account.
     *
     * @param accountId Savings account ID
     * @return List of transactions
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getSavingsAccountTransactions(Long accountId) {
        log.info("Getting transactions for savings account: {}", accountId);

        try {
            Map<String, Object> response = fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/savingsaccounts/{accountId}?associations=transactions", accountId)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("transactions")) {
                return (List<Map<String, Object>>) response.get("transactions");
            }
            return List.of();
        } catch (Exception e) {
            log.error("Failed to get transactions for account {}: {}", accountId, e.getMessage());
            return List.of();
        }
    }

    /**
     * Get the owner (client ID) of a savings account.
     *
     * @param accountId Savings account ID
     * @return Client ID that owns the account, or null if not found
     */
    public Long getSavingsAccountOwner(Long accountId) {
        Map<String, Object> account = getSavingsAccount(accountId);
        if (account != null && account.containsKey("clientId")) {
            return ((Number) account.get("clientId")).longValue();
        }
        return null;
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
     * Store customer address in Fineract.
     */
    public void createClientAddress(Long clientId, RegistrationRequest.AddressDto address) {
        if (address == null) return;

        log.info("Creating address for client: {}", clientId);
        try {
            Map<String, Object> addressPayload = new HashMap<>();
            addressPayload.put("street", address.getStreet());
            addressPayload.put("city", address.getCity());
            addressPayload.put("postalCode", address.getPostalCode());
            addressPayload.put("countryId", 1); // Default country
            addressPayload.put("addressTypeId", 1); // Residential
            if (address.getCountry() != null) {
                addressPayload.put("countryName", address.getCountry());
            }

            fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/addresses?type=1", clientId)
                    .body(addressPayload)
                    .retrieve()
                    .toBodilessEntity();

            log.info("Created address for client: {}", clientId);
        } catch (Exception e) {
            log.warn("Failed to create address for client {}: {}", clientId, e.getMessage());
            // Don't fail registration if address creation fails
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
