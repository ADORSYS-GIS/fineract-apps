package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.KycDocumentUploadResponse;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import org.keycloak.representations.idm.UserRepresentation;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class KycDocumentService {

    private final FineractService fineractService;
    private final KeycloakService keycloakService;
    private final RegistrationMetrics registrationMetrics;

    private static final Set<String> VALID_DOCUMENT_TYPES = Set.of("id_front", "id_back", "selfie_with_id");
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    /**
     * Upload a KYC document for a customer.
     *
     * @param externalId   Customer's external ID (from JWT)
     * @param documentType Type of document (id_front, id_back, selfie_with_id)
     * @param file         The uploaded file
     * @return Upload response with document details
     */
    public KycDocumentUploadResponse uploadDocument(String externalId, String documentType, MultipartFile file) {
        log.info("Uploading KYC document type '{}' for external ID: {}", documentType, externalId);

        // Validate document type
        if (!VALID_DOCUMENT_TYPES.contains(documentType)) {
            throw new RegistrationException("Invalid document type: " + documentType +
                    ". Must be one of: " + String.join(", ", VALID_DOCUMENT_TYPES));
        }

        // Validate file
        validateFile(file);

        // Get client ID from external ID
        Map<String, Object> client = fineractService.getClientByExternalId(externalId);
        if (client == null) {
            throw new RegistrationException("Customer not found for external ID: " + externalId);
        }
        Long clientId = ((Number) client.get("id")).longValue();

        // Build document name and description
        String documentName = buildDocumentName(documentType, file.getOriginalFilename());
        String description = buildDocumentDescription(documentType);

        try {
            byte[] fileContent = file.getBytes();

            // Upload to Fineract
            Long documentId = fineractService.uploadDocument(
                    clientId,
                    documentName,
                    description,
                    fileContent,
                    file.getContentType(),
                    file.getOriginalFilename()
            );

            log.info("Successfully uploaded document {} for client {}", documentId, clientId);
            registrationMetrics.incrementKycSubmission(documentType);

            // Check if all KYC documents are uploaded and update status
            checkAndUpdateKycStatus(externalId, clientId);

            return KycDocumentUploadResponse.builder()
                    .documentId(String.valueOf(documentId))
                    .documentType(documentType)
                    .status("uploaded")
                    .uploadedAt(Instant.now())
                    .fileName(file.getOriginalFilename())
                    .mimeType(file.getContentType())
                    .build();

        } catch (IOException e) {
            log.error("Failed to read file content: {}", e.getMessage());
            throw new RegistrationException("Failed to process uploaded file", e);
        }
    }

    /**
     * Check if all required KYC documents are uploaded and update KYC status.
     */
    private void checkAndUpdateKycStatus(String externalId, Long clientId) {
        List<Map<String, Object>> documents = fineractService.getClientDocuments(clientId);

        boolean hasIdFront = false;
        boolean hasIdBack = false;
        boolean hasSelfie = false;

        for (Map<String, Object> doc : documents) {
            String name = (String) doc.get("name");
            if (name != null) {
                if (name.startsWith("KYC_ID_FRONT_")) hasIdFront = true;
                if (name.startsWith("KYC_ID_BACK_")) hasIdBack = true;
                if (name.startsWith("KYC_SELFIE_")) hasSelfie = true;
            }
        }

        if (hasIdFront && hasIdBack && hasSelfie) {
            log.info("All KYC documents uploaded for external ID: {}. Checking if status transition to under_review is needed", externalId);
            try {
                keycloakService.getUserByExternalId(externalId).ifPresent(user -> {
                    // Only transition to under_review if currently pending — avoid overwriting approved/rejected status
                    String currentStatus = getKycStatus(user);
                    if ("pending".equals(currentStatus)) {
                        keycloakService.updateKycStatus(user.getId(), 1, "under_review");
                        log.info("Updated KYC status to under_review for external ID: {}", externalId);
                    } else {
                        log.info("Skipping status update — current status is '{}' for external ID: {}", currentStatus, externalId);
                    }
                });
            } catch (Exception e) {
                log.warn("Failed to update KYC status in Keycloak: {}", e.getMessage());
            }
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new RegistrationException("No file provided");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RegistrationException("File size exceeds maximum allowed (10MB)");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            throw new RegistrationException("Invalid file type. Allowed types: JPEG, PNG, WebP");
        }
    }

    private String buildDocumentName(String documentType, String originalFilename) {
        String prefix = switch (documentType) {
            case "id_front" -> "KYC_ID_FRONT_";
            case "id_back" -> "KYC_ID_BACK_";
            case "selfie_with_id" -> "KYC_SELFIE_";
            default -> "KYC_DOC_";
        };
        return prefix + UUID.randomUUID();
    }

    private String getKycStatus(UserRepresentation user) {
        if (user.getAttributes() == null) return "pending";
        List<String> values = user.getAttributes().get("kyc_status");
        return (values != null && !values.isEmpty()) ? values.get(0) : "pending";
    }

    private String buildDocumentDescription(String documentType) {
        return switch (documentType) {
            case "id_front" -> "KYC Document - ID Card Front";
            case "id_back" -> "KYC Document - ID Card Back";
            case "selfie_with_id" -> "KYC Document - Selfie with ID";
            default -> "KYC Document";
        };
    }
}
