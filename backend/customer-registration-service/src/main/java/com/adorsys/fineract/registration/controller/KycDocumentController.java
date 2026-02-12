package com.adorsys.fineract.registration.controller;

import com.adorsys.fineract.registration.dto.KycDocumentUploadResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.service.KycDocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/registration/kyc")
@RequiredArgsConstructor
@Tag(name = "KYC Documents", description = "KYC document upload APIs for customer verification")
public class KycDocumentController {

    private final KycDocumentService kycDocumentService;

    @PostMapping(value = "/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload KYC document",
            description = "Upload a document for KYC verification. Requires authentication. " +
                    "Document types: id_front (ID card front), id_back (ID card back), selfie_with_id (selfie holding ID)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Document uploaded successfully",
                    content = @Content(schema = @Schema(implementation = KycDocumentUploadResponse.class))),
            @ApiResponse(responseCode = "400", description = "Invalid document type, file type, or file size"),
            @ApiResponse(responseCode = "401", description = "Unauthorized - valid JWT token required"),
            @ApiResponse(responseCode = "404", description = "Customer not found"),
            @ApiResponse(responseCode = "500", description = "Upload failed")
    })
    public ResponseEntity<KycDocumentUploadResponse> uploadDocument(
            @AuthenticationPrincipal Jwt jwt,
            @Parameter(description = "Customer external ID (for local testing)", required = false)
            @RequestHeader(value = "X-External-Id", required = false) String externalIdHeader,
            @Parameter(description = "Document type: id_front, id_back, or selfie_with_id", required = true)
            @RequestParam("documentType") String documentType,
            @Parameter(description = "Document image file (JPEG, PNG, WebP, max 10MB)", required = true)
            @RequestParam("file") MultipartFile file) {

        // Extract external ID from header or JWT token
        String externalId = (externalIdHeader != null && !externalIdHeader.isBlank())
                ? externalIdHeader
                : extractExternalId(jwt);

        log.info("Received KYC document upload request: type={}, file={}, externalId={}",
                documentType, file.getOriginalFilename(), externalId);

        KycDocumentUploadResponse response = kycDocumentService.uploadDocument(externalId, documentType, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Extract the Fineract external ID from the JWT token.
     * The external ID is stored as a custom claim 'fineract_external_id' in Keycloak.
     */
    private String extractExternalId(Jwt jwt) {
        if (jwt == null) {
            throw new RegistrationException("Authentication required");
        }

        // Try to get external ID from custom claim
        String externalId = jwt.getClaimAsString("fineract_external_id");

        // Fallback to 'sub' (subject) if custom claim not present
        if (externalId == null || externalId.isBlank()) {
            externalId = jwt.getSubject();
        }

        if (externalId == null || externalId.isBlank()) {
            throw new RegistrationException("External ID not found in token");
        }

        return externalId;
    }
}
