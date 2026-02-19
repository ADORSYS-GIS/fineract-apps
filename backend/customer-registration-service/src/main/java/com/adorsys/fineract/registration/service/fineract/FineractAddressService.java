package com.adorsys.fineract.registration.service.fineract;

import com.adorsys.fineract.registration.config.FineractProperties;
import com.adorsys.fineract.registration.dto.profile.AddressDTO;
import com.adorsys.fineract.registration.dto.profile.AddressResponseDTO;
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

        putDynamicIdIfPresent(address, "addressTypeId", ADDRESS_TYPE, request.getAddressType());
        putDynamicIdIfPresent(address, "stateProvinceId", STATE, request.getStateProvince());
        putDynamicIdIfPresent(address, "countryId", COUNTRY, request.getCountry());

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
    public AddressResponseDTO createClientAddress(Long clientId, AddressDTO addressDTO) {
        log.info("Creating address for client: {}", clientId);
        Map<String, Object> body = new HashMap<>();
        body.put("street", addressDTO.getStreet());
        body.put("addressLine1", addressDTO.getAddressLine1());
        body.put("addressLine2", addressDTO.getAddressLine2());
        body.put("addressLine3", addressDTO.getAddressLine3());
        body.put("city", addressDTO.getCity());
        body.put("postalCode", addressDTO.getPostalCode());

        putDynamicIdIfPresent(body, "stateProvinceId", STATE, addressDTO.getStateProvince());
        putDynamicIdIfPresent(body, "countryId", COUNTRY, addressDTO.getCountry());

        Long addressTypeId = fineractCodeValueService.getDynamicId(ADDRESS_TYPE, addressDTO.getAddressType());


        try {
            return fineractRestClient.post()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/addresses?type={addressTypeId}", clientId, addressTypeId)
                    .body(body)
                    .retrieve()
                    .body(AddressResponseDTO.class);
        } catch (Exception e) {
            log.error("Failed to create address for client {}: {}", clientId, e.getMessage());
            throw new FineractApiException("Failed to create address", e);
        }
    }

    public AddressResponseDTO updateClientAddress(Long clientId, AddressDTO addressDTO) {
        log.info("Updating address for client: {}", clientId);
        Map<String, Object> body = new HashMap<>();
        body.put("addressId", addressDTO.getAddressId());
        body.put("street", addressDTO.getStreet());

        Long addressTypeId = fineractCodeValueService.getDynamicId(ADDRESS_TYPE, addressDTO.getAddressType());

        try {
            return fineractRestClient.put()
                    .uri("/fineract-provider/api/v1/clients/{clientId}/addresses?type={addressTypeId}", clientId, addressTypeId)
                    .body(body)
                    .retrieve()
                    .body(AddressResponseDTO.class);
        } catch (Exception e) {
            log.error("Failed to update address for client {}: {}", clientId, e.getMessage());
            throw new FineractApiException("Failed to update address", e);
        }
    }
}
