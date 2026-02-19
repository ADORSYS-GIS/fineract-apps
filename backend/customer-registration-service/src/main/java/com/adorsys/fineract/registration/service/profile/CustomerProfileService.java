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
        // Extract fineract_client_id from JWT
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


        // Call Fineract to update the client
        return fineractService.updateClient(Long.valueOf(fineractClientId), request);
    }

    public AddressListResponse getAddressesByClientId(Long clientId) {
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

    public AddressResponseDTO createClientAddress(Long clientId, Long addressTypeId, AddressDTO addressDTO) {
        return fineractService.createClientAddress(clientId, addressTypeId, addressDTO);
    }

    public AddressResponseDTO updateClientAddress(Long clientId, Long addressTypeId, AddressDTO addressDTO) {
        return fineractService.updateClientAddress(clientId, addressTypeId, addressDTO);
    }
}
