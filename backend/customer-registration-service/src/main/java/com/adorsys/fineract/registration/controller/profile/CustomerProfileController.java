package com.adorsys.fineract.registration.controller.profile;

import com.adorsys.fineract.registration.dto.profile.AddressListResponse;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateRequest;
import com.adorsys.fineract.registration.dto.profile.ProfileUpdateResponse;
import com.adorsys.fineract.registration.service.profile.CustomerProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearer-jwt")
public class CustomerProfileController {
    private final CustomerProfileService customerProfileService;

    @PatchMapping
    @Operation(summary = "Update customer profile", description = "Partially updates the customer's profile information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Profile updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<ProfileUpdateResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        ProfileUpdateResponse response = customerProfileService.updateProfile(request, jwt);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/clients/{clientId}/addresses")
    @Operation(summary = "Get client addresses", description = "Retrieves a list of addresses for a given client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Addresses retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public ResponseEntity<AddressListResponse> getClientAddresses(
            @PathVariable Long clientId) {
        AddressListResponse addresses = customerProfileService.getAddressesByClientId(clientId);
        return ResponseEntity.ok(addresses);
    }
}
