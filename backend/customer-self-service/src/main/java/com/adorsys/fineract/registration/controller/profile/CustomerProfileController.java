package com.adorsys.fineract.registration.controller.profile;

import com.adorsys.fineract.registration.dto.profile.AddressRequest;
import com.adorsys.fineract.registration.dto.profile.AddressListResponse;
import com.adorsys.fineract.registration.dto.profile.AddressResponse;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Validated
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
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public ResponseEntity<ProfileUpdateResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        ProfileUpdateResponse response = customerProfileService.updateProfile(request, jwt);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/addresses")
    @Operation(summary = "Get client addresses", description = "Retrieves a list of addresses for the authenticated client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Addresses retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden"),
            @ApiResponse(responseCode = "404", description = "Client not found")
    })
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public ResponseEntity<AddressListResponse> getClientAddresses(
            @AuthenticationPrincipal Jwt jwt) {
        AddressListResponse addresses = customerProfileService.getAddressesByClientId(jwt);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/addresses")
    @Operation(summary = "Create client address", description = "Creates a new address for the authenticated client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public ResponseEntity<AddressResponse> createClientAddress(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddressRequest addressRequest) {
        AddressResponse response = customerProfileService.createClientAddress(jwt, addressRequest);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/addresses")
    @Operation(summary = "Update client address", description = "Updates an existing address for the authenticated client.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Address updated successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")
    public ResponseEntity<AddressResponse> updateClientAddress(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody AddressRequest addressRequest) {
        AddressResponse response = customerProfileService.updateClientAddress(jwt, addressRequest);
        return ResponseEntity.ok(response);
    }
}
