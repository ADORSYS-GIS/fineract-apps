package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.registration.RegistrationRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class FineractAddressService {

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
}
