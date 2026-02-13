package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.config.FineractConfig;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
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


        return payload;
    }

    public void updateClient(Long clientId, com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest request) {
        // TODO: This is a stub. Implement the actual call to Fineract's PUT /clients/{clientId} endpoint.
        log.warn("STUB: FineractService.updateClient is not yet implemented.");
        // In a real implementation, you would build the request body and make the API call.
        // For now, we'll just throw an exception to indicate it's not implemented.
        throw new UnsupportedOperationException("updateClient is not yet implemented");
    }
}
