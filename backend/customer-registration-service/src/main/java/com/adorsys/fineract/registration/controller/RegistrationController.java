package com.adorsys.fineract.registration.controller;

import com.adorsys.fineract.registration.dto.*;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.RegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/registration")
@RequiredArgsConstructor
@Tag(name = "Registration", description = "Customer registration and status APIs")
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new customer",
            description = "Creates accounts in Fineract and Keycloak for self-service customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = RegistrationResponse.class))),
            @ApiResponse(responseCode = "400", description = "Validation error or email already exists"),
            @ApiResponse(responseCode = "500", description = "Registration failed")
    })
    public ResponseEntity<RegistrationResponse> register(
            @Valid @RequestBody RegistrationRequest request) {
        log.info("Received registration request for email: {}", request.getEmail());
        RegistrationResponse response = registrationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/status/{externalId}")
    @Operation(summary = "Get registration status",
            description = "Check registration completion status for a customer")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status retrieved",
                    content = @Content(schema = @Schema(implementation = RegistrationStatusResponse.class))),
            @ApiResponse(responseCode = "404", description = "Customer not found")
    })
    public ResponseEntity<RegistrationStatusResponse> getStatus(
            @Parameter(description = "Customer external ID (UUID)")
            @PathVariable String externalId) {
        log.info("Received status request for externalId: {}", externalId);
        RegistrationStatusResponse response = registrationService.getStatus(externalId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/kyc/status")
    @Operation(summary = "Get KYC status",
            description = "Get KYC verification status and document information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "KYC status retrieved",
                    content = @Content(schema = @Schema(implementation = KycStatusResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Customer not found")
    })
    public ResponseEntity<KycStatusResponse> getKycStatus(
            @AuthenticationPrincipal Jwt jwt) {
        String externalId = extractExternalId(jwt);
        log.info("Received KYC status request for externalId: {}", externalId);
        KycStatusResponse response = registrationService.getKycStatus(externalId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/limits")
    @Operation(summary = "Get transaction limits",
            description = "Get transaction limits based on customer's KYC tier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Limits retrieved",
                    content = @Content(schema = @Schema(implementation = LimitsResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Customer not found")
    })
    public ResponseEntity<LimitsResponse> getLimits(
            @AuthenticationPrincipal Jwt jwt) {
        String externalId = extractExternalId(jwt);
        log.info("Received limits request for externalId: {}", externalId);
        LimitsResponse response = registrationService.getLimits(externalId);
        return ResponseEntity.ok(response);
    }

    /**
     * Extract the Fineract external ID from the JWT token.
     */
    private String extractExternalId(Jwt jwt) {
        if (jwt == null) {
            throw new RegistrationException("Authentication required");
        }
        String externalId = jwt.getClaimAsString("fineract_external_id");
        if (externalId == null || externalId.isBlank()) {
            externalId = jwt.getSubject();
        }
        if (externalId == null || externalId.isBlank()) {
            throw new RegistrationException("External ID not found in token");
        }
        return externalId;
    }
}
