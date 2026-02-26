package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class FineractClientService {

    /**
     * This service encapsulates all client-centric operations with the Fineract API.
     * Its responsibilities include creating new clients, retrieving existing clients by their external ID,
     * and updating a client's profile information. By centralizing these functionalities, it simplifies
     * the interaction with the Fineract client API and improves code organization.
     */
    private static final String CLIENT_ID = "clientId";
    private static final String PAGE_ITEMS = "pageItems";
    private static final String LOCALE = "locale";
    private static final String DATE_FORMAT = "dateFormat";

    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;
    private final DateTimeFormatter dateTimeFormatter;
    private final FineractAddressService fineractAddressService;
    private final FineractCodeValueService fineractCodeValueService;

    public FineractClientService(RestClient fineractRestClient, FineractProperties fineractProperties, FineractAddressService fineractAddressService, FineractCodeValueService fineractCodeValueService) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.dateTimeFormatter = DateTimeFormatter.ofPattern(fineractProperties.getDefaults().getDateFormat());
        this.fineractAddressService = fineractAddressService;
        this.fineractCodeValueService = fineractCodeValueService;
    }

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

    public ProfileUpdateResponse updateClient(Long clientId, ProfileUpdateRequest request) {
        log.info("Updating Fineract client ID: {}", clientId);

        Map<String, Object> payload = new HashMap<>();
        fineractAddressService.putIfPresent(payload, "firstname", request.getFirstName());
        fineractAddressService.putIfPresent(payload, "lastname", request.getLastName());
        fineractAddressService.putIfPresent(payload, "emailAddress", request.getEmailAddress());
        fineractAddressService.putIfPresent(payload, "mobileNo", request.getMobileNo());
        payload.put(LOCALE, fineractProperties.getDefaults().getLocale());
        payload.put(DATE_FORMAT, fineractProperties.getDefaults().getDateFormat());

        try {
            ProfileUpdateResponse response = fineractRestClient.put()
                    .uri("/fineract-provider/api/v1/clients/{clientId}", clientId)
                    .body(payload)
                    .retrieve()
                    .body(ProfileUpdateResponse.class);
            log.info("Successfully updated Fineract client ID: {}", clientId);
            return response;
        } catch (HttpClientErrorException e) {
            log.error("Fineract API update error: {}", e.getResponseBodyAsString(), e);
            throw new RegistrationException("Failed to update Fineract client: " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Failed to update Fineract client {}: {}", clientId, e.getMessage(), e);
            throw new RegistrationException("Failed to update client account", e);
        }
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
            Long genderId = fineractCodeValueService.getDynamicId("Gender", request.getGender());
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
            payload.put("address", List.of(fineractAddressService.buildAddressPayload(request)));
        }

        return payload;
    }
}
