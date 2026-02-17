package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import java.time.format.DateTimeFormatter;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import  com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class FineractService {

    private final Map<String, Long> codeValueCache = new ConcurrentHashMap<>();
    private static final String CLIENT_ID = "clientId";
    private static final String PAGE_ITEMS = "pageItems";
    private static final String SAVINGS_ACCOUNTS = "savingsAccounts";
    private static final String TRANSACTIONS = "transactions";
    private static final String SAVINGS_ID = "savingsId";
    private static final String LOCALE = "locale";
    private static final String DATE_FORMAT = "dateFormat";
    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;
    private final DateTimeFormatter dateTimeFormatter;

    public FineractService(RestClient fineractRestClient, FineractProperties fineractProperties) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.dateTimeFormatter = DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat());
    }

    /**
     * Create a new client in Fineract.
     *
     * @param request    Registration request data
     * @return Fineract client ID
     */
    public Long createClient(RegistrationRequest request) {
        log.info("Creating Fineract client for email: {}", request.getEmail());

        Map<String, Object> clientPayload = buildClientPayload(request);
        log.debug("Fineract client creation request payload: {}", clientPayload);

        try {
            @SuppressWarnings({"unchecked", "null"})
            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients")
                    .body(clientPayload)
                    .retrieve()
                    .body(Map.class);
            log.debug("Fineract client creation successful response: {}", response);
            if (response != null && response.containsKey(CLIENT_ID)) {
                Long clientId = ((Number) response.get(CLIENT_ID)).longValue();
                log.info("Created Fineract client with ID: {}", clientId);
                return clientId;
            }

            throw new RegistrationException("Failed to create Fineract client: invalid response");
        } catch (HttpClientErrorException e) {
            log.error("Fineract API error: {}", e.getResponseBodyAsString(), e);
            throw new RegistrationException("Failed to create Fineract client: " + e.getResponseBodyAsString(), e);
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

            if (response != null && response.containsKey(PAGE_ITEMS)) {
                var pageItems = (List<Map<String, Object>>) response.get(PAGE_ITEMS);
                if (!pageItems.isEmpty()) {
                    return pageItems.get(0);
                }
            }
            return Map.of();
        } catch (Exception e) {
            log.error("Failed to get client by external ID: {}", e.getMessage());
            return Map.of();
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

            if (response != null && response.containsKey(SAVINGS_ACCOUNTS)) {
                return (List<Map<String, Object>>) response.get(SAVINGS_ACCOUNTS);
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
            return Map.of();
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

            if (response != null && response.containsKey(TRANSACTIONS)) {
                return (List<Map<String, Object>>) response.get(TRANSACTIONS);
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
        if (account != null && account.containsKey(CLIENT_ID)) {
            return ((Number) account.get(CLIENT_ID)).longValue();
        }
        return null;
    }



    private Map<String, Object> buildClientPayload(RegistrationRequest request) {
        String currentDate = LocalDate.now().format(dateTimeFormatter);
        Map<String, Object> payload = new HashMap<>();
        payload.put("officeId", fineractProperties.getDefaults().getOfficeId());
        payload.put("firstname", request.getFirstName());
        payload.put("lastname", request.getLastName());
        payload.put("externalId", request.getExternalId());
        payload.put("mobileNo", request.getPhone());
        payload.put("emailAddress", request.getEmail());
        payload.put("active", true);
        payload.put("activationDate", currentDate);
        payload.put("submittedOnDate", currentDate);
        payload.put("legalFormId", fineractProperties.getDefaults().getLegalFormId());
        payload.put(LOCALE, fineractProperties.getDefaults().getLocale());
        payload.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());

        if (request.getDateOfBirth() != null) {
            payload.put("dateOfBirth", request.getDateOfBirth().format(dateTimeFormatter));
        }

        if (request.getGender() != null) {
            Long genderId = getDynamicId("Gender", request.getGender());
            if (genderId != null) {
                payload.put("genderId", genderId);
            }
        }

        boolean hasAddressInfo = request.getAddressType() != null ||
                request.getAddressLine1() != null ||
                request.getAddressLine2() != null ||
                request.getAddressLine3() != null ||
                request.getCity() != null ||
                request.getStateProvince() != null ||
                request.getCountry() != null ||
                request.getPostalCode() != null;

        if (hasAddressInfo) {
            if (request.getAddressType() == null || request.getStateProvince() == null || request.getCountry() == null) {
                throw new RegistrationException("AddressType, State/Province, and Country are required if any address information is provided.");
            }
            payload.put("address", List.of(buildAddressPayload(request)));
        }

        return payload;
    }

    private Map<String, Object> buildAddressPayload(RegistrationRequest request) {
        Map<String, Object> address = new HashMap<>();
        address.put("isActive", true);
    
        putDynamicIdIfPresent(address, "addressTypeId", "ADDRESS_TYPE", request.getAddressType());
        putDynamicIdIfPresent(address, "stateProvinceId", "STATE", request.getStateProvince());
        putDynamicIdIfPresent(address, "countryId", "COUNTRY", request.getCountry());
    
        putIfPresent(address, "addressLine1", request.getAddressLine1());
        putIfPresent(address, "addressLine2", request.getAddressLine2());
        putIfPresent(address, "addressLine3", request.getAddressLine3());
        putIfPresent(address, "city", request.getCity());
    
        String postalCode = request.getPostalCode();
        address.put("postalCode", (postalCode == null || postalCode.isBlank()) ? fineractProperties.getDefaults().getPostalCode() : postalCode);
    
        return address;
    }
    
    private void putIfPresent(Map<String, Object> map, String key, String value) {
        if (value != null && !value.isBlank()) {
            map.put(key, value);
        }
    }
    
    private void putDynamicIdIfPresent(Map<String, Object> map, String mapKey, String codeName, String label) {
        if (label != null && !label.isBlank()) {
            Long id = getDynamicId(codeName, label);
            if (id != null) {
                map.put(mapKey, id);
            }
        }
    }

    @SuppressWarnings("unchecked")
  public void refreshCodeValueCache(String codeName) {
    log.info("Fetching dynamic IDs for code: {}", codeName);
    
    Integer codeId = fineractProperties.getCodes().get(codeName);
    if (codeId == null) {
        log.error("Unknown code name: {}", codeName);
        return;
    }

    try {
        // Use the ID instead of the Name to avoid the 404
        List<Map<String, Object>> values = fineractRestClient.get()
                .uri("/fineract-provider/api/v1/codes/{codeId}/codevalues", codeId)
                .retrieve()
                .body(List.class);

        if (values != null) {
            for (Map<String, Object> val : values) {
                String label = ((String) val.get("name")).toLowerCase();
                Long id = ((Number) val.get("id")).longValue();
                codeValueCache.put(codeName + ":" + label, id);
            }
        }
    } catch (Exception e) {
        log.error("Could not fetch IDs for {} (ID: {}): {}", codeName, codeId, e.getMessage());
    }
}
    
    private Long getDynamicId(String codeName, String label) {
        String key = codeName + ":" + label.toLowerCase();
        if (!codeValueCache.containsKey(key)) {
            refreshCodeValueCache(codeName);
        }
        return codeValueCache.get(key);
    }

    public void updateClient(Long clientId, ProfileUpdateRequest request) {
        log.info("Updating Fineract client ID: {}", clientId);

        Map<String, Object> payload = new HashMap<>();
        payload.put("firstname", request.getFirstName());
        payload.put("lastname", request.getLastName());
        payload.put("emailAddress", request.getEmailAddress());
        payload.put("mobileNo", request.getMobileNo());
        payload.put(LOCALE, fineractProperties.getDefaults().getLocale());
        payload.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());

    try {
            fineractRestClient.put()
                    .uri("/fineract-provider/api/v1/clients/{clientId}", clientId)
                    .body(payload)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Successfully updated Fineract client ID: {}", clientId);
        } catch (HttpClientErrorException e) {
            log.error("Fineract API update error: {}", e.getResponseBodyAsString(), e);
            throw new RegistrationException("Failed to update Fineract client: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Failed to update Fineract client {}: {}", clientId, e.getMessage(), e);
            throw new RegistrationException("Failed to update client account", e);
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
                CLIENT_ID, clientId,
                "productId", fineractProperties.getDefaults().getSavingsProductId(),
                LOCALE, fineractProperties.getDefaults().getLocale(),
                DATE_FORMAT, fineractProperties.getDefaults().getDateFormat(),
                "submittedOnDate", LocalDate.now().format(dateTimeFormatter)
        );

        try {
            @SuppressWarnings({"unchecked", "null"})
            Map<String, Object> response = fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/savingsaccounts")
                    .body(savingsPayload)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey(SAVINGS_ID)) {
                Long savingsId = ((Number) response.get(SAVINGS_ID)).longValue();
                log.info("Created savings account with ID: {}", savingsId);
                return savingsId;
            }

            throw new RegistrationException("Failed to create savings account: invalid response");
        } catch (Exception e) {
            log.error("Failed to create savings account: {}", e.getMessage(), e);
            throw new RegistrationException("Failed to create savings account", e);
        }
    }
}
