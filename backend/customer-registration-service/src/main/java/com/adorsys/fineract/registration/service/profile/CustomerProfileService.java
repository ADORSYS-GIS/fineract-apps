package com.adorsys.fineract.registration.service.profile;

import com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import lombok.RequiredArgsConstructor;
import com.adorsys.fineract.registration.service.FineractService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomerProfileService {
    private final FineractService fineractService;

    public void updateProfile(ProfileUpdateRequest request, Jwt jwt) {
        // Extract fineract_client_id from JWT
        String fineractClientId = jwt.getClaimAsString("fineract_client_id");
        if (fineractClientId == null) {
            String fineractExternalId = jwt.getClaimAsString("fineract_external_id");
            if(fineractExternalId == null) {
                throw new IllegalArgumentException("fineract_client_id and fineract_external_id claims are missing from JWT");
            }
            Map<String, Object> client = fineractService.getClientByExternalId(fineractExternalId);
            if(client == null) {
                throw new IllegalArgumentException("Client not found with external id " + fineractExternalId);
            }
            fineractClientId = String.valueOf(client.get("id"));
        }


        // Call Fineract to update the client
        fineractService.updateClient(Long.valueOf(fineractClientId), request);
    }
}
