package com.adorsys.fineract.registration.service.profile;

import com.adorsys.fineract.registration.dto.profile.AddressDTO;
import com.adorsys.fineract.registration.dto.profile.AddressListResponse;
import com.adorsys.fineract.registration.dto.profile.AddressResponse;
import com.adorsys.fineract.registration.dto.profile.AddressResponseDTO;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateResponse;
import com.adorsys.fineract.registration.service.FineractService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {
    private final FineractService fineractService;

    public ProfileUpdateResponse updateProfile(ProfileUpdateRequest request, Jwt jwt) {
        Long clientId = getClientIdFromJwt(jwt);
        return fineractService.updateClient(clientId, request);
    }

    public AddressListResponse getAddressesByClientId(Jwt jwt) {
        Long clientId = getClientIdFromJwt(jwt);
        List<Map<String, Object>> fineractAddresses = fineractService.getClientAddresses(clientId);
        List<AddressResponse> addresses = fineractAddresses.stream()
                .map(this::mapToAddressResponse)
                .toList();

        AddressListResponse response = new AddressListResponse();
        response.setAddresses(addresses);
        return response;
    }

    private AddressResponse mapToAddressResponse(Map<String, Object> fineractAddress) {
        AddressResponse address = new AddressResponse();
        address.setAddressType((String) fineractAddress.get("addressType"));
        // Fineract uses 'street' for addressLine1 in its GET address response
        address.setAddressLine1((String) fineractAddress.get("street"));
        address.setAddressLine2((String) fineractAddress.get("addressLine2"));
        address.setAddressLine3((String) fineractAddress.get("addressLine3"));
        address.setCity((String) fineractAddress.get("city"));
        address.setStateProvince((String) fineractAddress.get("stateName"));
        address.setCountry((String) fineractAddress.get("countryName"));
        address.setPostalCode((String) fineractAddress.get("postalCode"));
        return address;
    }

    public AddressResponseDTO createClientAddress(Jwt jwt, AddressDTO addressDTO) {
        Long clientId = getClientIdFromJwt(jwt);
        return fineractService.createClientAddress(clientId, addressDTO);
    }

    public AddressResponseDTO updateClientAddress(Jwt jwt, AddressDTO addressDTO) {
        Long clientId = getClientIdFromJwt(jwt);
        return fineractService.updateClientAddress(clientId, addressDTO);
    }

    private Long getClientIdFromJwt(Jwt jwt) {
        String fineractClientId = jwt.getClaimAsString("fineract_client_id");
        if (fineractClientId == null) {
            String fineractExternalId = jwt.getClaimAsString("fineract_external_id");
            if (fineractExternalId == null) {
                throw new IllegalArgumentException("fineract_client_id and fineract_external_id claims are missing from JWT");
            }
            Map<String, Object> client = fineractService.getClientByExternalId(fineractExternalId);
            if (client == null || client.isEmpty()) {
                throw new IllegalArgumentException("Client not found with external id " + fineractExternalId);
            }
            fineractClientId = String.valueOf(client.get("id"));
        }
        return Long.valueOf(fineractClientId);
    }
}
