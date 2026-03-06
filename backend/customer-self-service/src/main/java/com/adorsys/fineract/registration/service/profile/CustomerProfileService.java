package com.adorsys.fineract.registration.service.profile;

import com.adorsys.fineract.registration.dto.profile.AddressRequest;
import com.adorsys.fineract.registration.dto.profile.AddressListResponse;
import com.adorsys.fineract.registration.dto.profile.AddressDetailsResponse;
import com.adorsys.fineract.registration.dto.profile.AddressResponse;
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
        List<AddressDetailsResponse> addresses = fineractAddresses.stream()
                .map(this::mapToAddressDetailsResponse)
                .toList();

        AddressListResponse response = new AddressListResponse();
        response.setAddresses(addresses);
        return response;
    }

    private AddressDetailsResponse mapToAddressDetailsResponse(Map<String, Object> fineractAddress) {
        AddressDetailsResponse address = new AddressDetailsResponse();
        address.setAddressId(((Number) fineractAddress.get("addressId")).longValue());
        address.setAddressType((String) fineractAddress.get("addressType"));
        address.setAddressLine1((String) fineractAddress.get("addressLine1"));
        address.setAddressLine2((String) fineractAddress.get("addressLine2"));
        address.setAddressLine3((String) fineractAddress.get("addressLine3"));
        address.setCity((String) fineractAddress.get("city"));
        address.setStateProvince((String) fineractAddress.get("stateName"));
        address.setCountry((String) fineractAddress.get("countryName"));
        address.setPostalCode((String) fineractAddress.get("postalCode"));
        return address;
    }

    public AddressResponse createClientAddress(Jwt jwt, AddressRequest addressRequest) {
        Long clientId = getClientIdFromJwt(jwt);
        return fineractService.createClientAddress(clientId, addressRequest);
    }

    public AddressResponse updateClientAddress(Jwt jwt, AddressRequest addressRequest) {
        Long clientId = getClientIdFromJwt(jwt);
        return fineractService.updateClientAddress(clientId, addressRequest);
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
