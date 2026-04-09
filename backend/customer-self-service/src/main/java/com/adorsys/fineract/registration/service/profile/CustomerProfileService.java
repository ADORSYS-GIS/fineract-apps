package com.adorsys.fineract.registration.service.profile;

import com.adorsys.fineract.registration.dto.profile.AddressRequest;
import com.adorsys.fineract.registration.dto.profile.AddressListResponse;
import com.adorsys.fineract.registration.dto.profile.AddressDetailsResponse;
import com.adorsys.fineract.registration.dto.profile.AddressResponse;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateResponse;
import com.adorsys.fineract.registration.service.FineractService;
import com.adorsys.fineract.registration.util.JwtUtils;
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
        // Fast path: fineract_client_id is set after KYC approval
        Long clientId = JwtUtils.extractClientId(jwt);
        if (clientId != null) {
            return clientId;
        }

        // Fallback: resolve via sub claim (Keycloak UUID = Fineract externalId).
        // fineract_external_id is also a user attribute set only after KYC, so it
        // fails exactly when fineract_client_id fails — sub is always present.
        String externalId = JwtUtils.extractExternalId(jwt);
        Map<String, Object> client = fineractService.getClientByExternalId(externalId);
        if (client == null || client.isEmpty()) {
            throw new IllegalArgumentException("Client not found with externalId " + externalId);
        }
        return ((Number) client.get("id")).longValue();
    }
}
