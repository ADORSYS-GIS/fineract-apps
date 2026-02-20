package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.profile.AddressRequest;
import com.adorsys.fineract.registration.dto.profile.AddressResponse;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import com.adorsys.fineract.registration.exception.FineractApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class FineractAddressService {

    private static final String ADDRESS_TYPE = "ADDRESS_TYPE";
    private static final String STATE = "STATE";
    private static final String COUNTRY = "COUNTRY";
    private static final String ADDRESS_TYPE_ID = "addressTypeId";
    private static final String STATE_PROVINCE_ID = "stateProvinceId";
    private static final String COUNTRY_ID = "countryId";
    private static final String ADDRESS_LINE_1 = "addressLine1";
    private static final String ADDRESS_LINE_2 = "addressLine2";
    private static final String ADDRESS_LINE_3 = "addressLine3";
    private static final String CITY = "city";
    private static final String POSTAL_CODE = "postalCode";

    /**
     * This service centralizes all address-related operations for Fineract clients.
     * It is responsible for retrieving a client's registered addresses and for constructing
     * the address payload required by the Fineract API when creating or updating client information.
     * This encapsulates the specific logic for address handling, making it reusable and easier to maintain.
     */
    private final RestClient fineractRestClient;
    private final FineractProperties fineractProperties;
    private final FineractCodeValueService fineractCodeValueService;

    public FineractAddressService(RestClient fineractRestClient, FineractProperties fineractProperties, FineractCodeValueService fineractCodeValueService) {
        this.fineractRestClient = fineractRestClient;
        this.fineractProperties = fineractProperties;
        this.fineractCodeValueService = fineractCodeValueService;
    }

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getClientAddresses(Long clientId) {
        log.info("Getting addresses for client: {}", clientId);

        try {
            return fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/addresses", clientId)
                    .retrieve()
                    .body(List.class);
        } catch (Exception e) {
            log.error("Failed to get addresses for client {}: {}", clientId, e.getMessage());
            return List.of();
        }
    }

    public Map<String, Object> buildAddressPayload(RegistrationRequest request) {
        Map<String, Object> address = new HashMap<>();
        address.put("isActive", true);

        putDynamicIdIfPresent(address, ADDRESS_TYPE_ID, ADDRESS_TYPE, request.getAddressType());
        putDynamicIdIfPresent(address, STATE_PROVINCE_ID, STATE, request.getStateProvince());
        putDynamicIdIfPresent(address, COUNTRY_ID, COUNTRY, request.getCountry());

        putIfPresent(address, ADDRESS_LINE_1, request.getAddressLine1());
        putIfPresent(address, ADDRESS_LINE_2, request.getAddressLine2());
        putIfPresent(address, ADDRESS_LINE_3, request.getAddressLine3());
        putIfPresent(address, CITY, request.getCity());

        String postalCode = request.getPostalCode();
        address.put(POSTAL_CODE, (postalCode == null || postalCode.isBlank()) ? fineractProperties.getDefaults().getPostalCode() : postalCode);

        return address;
    }

    public void putIfPresent(Map<String, Object> map, String key, String value) {
        if (value != null && !value.isBlank()) {
            map.put(key, value);
        }
    }

    private void putDynamicIdIfPresent(Map<String, Object> map, String mapKey, String codeName, String label) {
        if (label != null && !label.isBlank()) {
            Long id = fineractCodeValueService.getDynamicId(codeName, label);
            if (id != null) {
                map.put(mapKey, id);
            }
        }
    }
    public AddressResponse createClientAddress(Long clientId, AddressRequest addressRequest) {
        log.info("Creating address for client: {}", clientId);
        Map<String, Object> body = new HashMap<>();
        body.put("street", addressRequest.getStreet());
        body.put(ADDRESS_LINE_1, addressRequest.getAddressLine1());
        body.put(ADDRESS_LINE_2, addressRequest.getAddressLine2());
        body.put(ADDRESS_LINE_3, addressRequest.getAddressLine3());
        body.put(CITY, addressRequest.getCity());
        body.put(POSTAL_CODE, addressRequest.getPostalCode());

        putDynamicIdIfPresent(body, STATE_PROVINCE_ID, STATE, addressRequest.getStateProvince());
        putDynamicIdIfPresent(body, COUNTRY_ID, COUNTRY, addressRequest.getCountry());

        Long addressTypeId = fineractCodeValueService.getDynamicId(ADDRESS_TYPE, addressRequest.getAddressType());


        try {
            return fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/addresses?type={addressTypeId}", clientId, addressTypeId)
                    .body(body)
                    .retrieve()
                    .body(AddressResponse.class);
        } catch (Exception e) {
            log.error("Failed to create address for client {}: {}", clientId, e.getMessage());
            throw new FineractApiException("Failed to create address", e);
        }
    }

    public AddressResponse updateClientAddress(Long clientId, AddressRequest addressRequest) {
        log.info("Updating address for client: {}", clientId);
        Map<String, Object> body = new HashMap<>();
        body.put("addressId", addressRequest.getAddressId());
        putIfPresent(body, "street", addressRequest.getStreet());
        putIfPresent(body, ADDRESS_LINE_1, addressRequest.getAddressLine1());
        putIfPresent(body, ADDRESS_LINE_2, addressRequest.getAddressLine2());
        putIfPresent(body, ADDRESS_LINE_3, addressRequest.getAddressLine3());
        putIfPresent(body, CITY, addressRequest.getCity());
        putIfPresent(body, POSTAL_CODE, addressRequest.getPostalCode());

        putDynamicIdIfPresent(body, STATE_PROVINCE_ID, STATE, addressRequest.getStateProvince());
        putDynamicIdIfPresent(body, COUNTRY_ID, COUNTRY, addressRequest.getCountry());

        Long addressTypeId = fineractCodeValueService.getDynamicId(ADDRESS_TYPE, addressRequest.getAddressType());

        try {
            return fineractRestClient.put()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/addresses?type={addressTypeId}", clientId, addressTypeId)
                    .body(body)
                    .retrieve()
                    .body(AddressResponse.class);
        } catch (Exception e) {
            log.error("Failed to update address for client {}: {}", clientId, e.getMessage());
            throw new FineractApiException("Failed to update address", e);
        }
    }
}
