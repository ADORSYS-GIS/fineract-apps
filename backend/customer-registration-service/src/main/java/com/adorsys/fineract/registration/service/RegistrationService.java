package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.*;
import com.adorsys.fineract.registration.exception.RegistrationException;
import com.adorsys.fineract.registration.metrics.RegistrationMetrics;
import io.micrometer.core.instrument.Timer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final KeycloakService keycloakService;
    private final FineractService fineractService;
    private final LimitsService limitsService;
    private final RegistrationMetrics registrationMetrics;

    /**
     * Register a new self-service customer.
     * Creates accounts in both Fineract and Keycloak with rollback on failure.
     *
     * @param request Registration request data
     * @return Registration response with external ID
     */
    public RegistrationResponse register(RegistrationRequest request) {
        log.info("Starting registration for email: {}", request.getEmail());

        // Record registration request
        registrationMetrics.incrementRegistrationRequests();
        Timer.Sample timerSample = registrationMetrics.startTimer();

        // Generate unique external ID (UUID) - this links Fineract and Keycloak
        String externalId = UUID.randomUUID().toString();
        log.info("Generated external ID: {}", externalId);

        Long fineractClientId = null;
        String keycloakUserId = null;

        try {
            // Step 1: Create Fineract client
            fineractClientId = fineractService.createClient(request, externalId);
            log.info("Created Fineract client: {}", fineractClientId);

            // Step 1b: Store address if provided
            if (request.getAddress() != null) {
                fineractService.createClientAddress(fineractClientId, request.getAddress());
            }

            // Step 2: Create Keycloak user
            keycloakUserId = keycloakService.createUser(request, externalId);
            log.info("Created Keycloak user: {}", keycloakUserId);

            // Step 3: Store fineract_client_id in Keycloak for fast ownership verification
            try {
                keycloakService.updateUserAttributes(keycloakUserId, Map.of(
                        "fineract_client_id", List.of(String.valueOf(fineractClientId))
                ));
                log.info("Stored fineract_client_id {} in Keycloak user {}", fineractClientId, keycloakUserId);
            } catch (Exception e) {
                // Log but don't fail - fallback lookup via fineract_external_id will work
                log.warn("Failed to store fineract_client_id in Keycloak for user {}: {}. " +
                         "Ownership verification will use fallback lookup.", keycloakUserId, e.getMessage());
            }

            // Step 4: Programmatically send the verification email
            keycloakService.sendVerificationEmail(keycloakUserId);

            log.info("Registration completed successfully for externalId: {}", externalId);

            // Record success metrics
            registrationMetrics.incrementRegistrationSuccess();
            registrationMetrics.stopRegistrationTimer(timerSample);

            return RegistrationResponse.success(externalId);

        } catch (RegistrationException e) {
            // Known error - rollback and rethrow
            log.error("Registration failed: {}", e.getMessage());
            registrationMetrics.incrementRegistrationFailure(e.getErrorCode() != null ? e.getErrorCode() : "unknown");
            rollback(fineractClientId, keycloakUserId);
            throw e;

        } catch (Exception e) {
            // Unexpected error - rollback and wrap
            log.error("Unexpected error during registration: {}", e.getMessage(), e);
            registrationMetrics.incrementRegistrationFailure("unexpected_error");
            rollback(fineractClientId, keycloakUserId);
            throw new RegistrationException("Registration failed due to an unexpected error", e);
        }
    }

    /**
     * Get registration status for a customer.
     *
     * @param externalId Customer's external ID (UUID)
     * @return Registration status
     */
    public RegistrationStatusResponse getStatus(String externalId) {
        log.info("Getting registration status for externalId: {}", externalId);

        // Find Keycloak user by external ID attribute
        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Registration not found", "externalId");
        }

        UserRepresentation user = userOpt.get();
        String userId = user.getId();

        // Get attributes
        Map<String, List<String>> attributes = user.getAttributes();
        int kycTier = getAttributeAsInt(attributes, "kyc_tier", 1);
        String kycStatus = getAttributeAsString(attributes, "kyc_status", "pending");

        // Check verification status
        log.info("Verifying email status for userId: {}", userId);
        boolean emailVerified = keycloakService.isEmailVerified(userId);
        log.info("Verifying WebAuthn status for userId: {}", userId);
        boolean webAuthnRegistered = keycloakService.isWebAuthnRegistered(userId);

        // Determine overall status
        String registrationStatus;
        if (!emailVerified) {
            registrationStatus = "pending_email_verification";
        } else if (!webAuthnRegistered) {
            registrationStatus = "pending_webauthn_registration";
        } else {
            registrationStatus = "completed";
        }

        return RegistrationStatusResponse.builder()
                .externalId(externalId)
                .registrationStatus(registrationStatus)
                .emailVerified(emailVerified)
                .webAuthnRegistered(webAuthnRegistered)
                .kycTier(kycTier)
                .kycStatus(kycStatus)
                .build();
    }

    /**
     * Get KYC status for a customer.
     *
     * @param externalId Customer's external ID
     * @return KYC status with document information
     */
    public KycStatusResponse getKycStatus(String externalId) {
        log.info("Getting KYC status for externalId: {}", externalId);

        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Customer not found", "externalId");
        }

        UserRepresentation user = userOpt.get();
        Map<String, List<String>> attributes = user.getAttributes();

        int kycTier = getAttributeAsInt(attributes, "kyc_tier", 1);
        String kycStatus = getAttributeAsString(attributes, "kyc_status", "pending");

        // Define required documents
        List<String> requiredDocuments = List.of("id_front", "id_back", "selfie_with_id");

        // Get actual document status from Fineract
        List<Map<String, Object>> clientDocuments = List.of();
        Map<String, Object> client = fineractService.getClientByExternalId(externalId);
        if (client != null && client.containsKey("id")) {
            Long clientId = ((Number) client.get("id")).longValue();
            clientDocuments = fineractService.getClientDocuments(clientId);
        }

        List<KycStatusResponse.DocumentStatus> documents = clientDocuments.stream()
                .map(doc -> KycStatusResponse.DocumentStatus.builder()
                        .documentType(String.valueOf(doc.getOrDefault("name", "")))
                        .status("uploaded")
                        .build())
                .toList();

        // Determine missing documents by checking name prefixes
        Set<String> uploadedTypes = new java.util.HashSet<>();
        for (Map<String, Object> doc : clientDocuments) {
            String name = String.valueOf(doc.getOrDefault("name", ""));
            if (name.startsWith("KYC_ID_FRONT_")) uploadedTypes.add("id_front");
            if (name.startsWith("KYC_ID_BACK_")) uploadedTypes.add("id_back");
            if (name.startsWith("KYC_SELFIE_")) uploadedTypes.add("selfie_with_id");
        }
        List<String> missingDocuments = requiredDocuments.stream()
                .filter(d -> !uploadedTypes.contains(d))
                .toList();

        // Include info request message when status is more_info_required
        String infoRequestMessage = null;
        if ("more_info_required".equals(kycStatus)) {
            infoRequestMessage = getAttributeAsString(attributes, "kyc_info_request", null);
        }

        return KycStatusResponse.builder()
                .kycTier(kycTier)
                .kycStatus(kycStatus)
                .infoRequestMessage(infoRequestMessage)
                .documents(documents)
                .requiredDocuments(requiredDocuments)
                .missingDocuments(missingDocuments)
                .build();
    }

    /**
     * Get transaction limits for a customer.
     *
     * @param externalId Customer's external ID
     * @return Transaction limits based on KYC tier
     */
    public LimitsResponse getLimits(String externalId) {
        log.info("Getting limits for externalId: {}", externalId);

        Optional<UserRepresentation> userOpt = keycloakService.getUserByExternalId(externalId);

        if (userOpt.isEmpty()) {
            throw new RegistrationException("NOT_FOUND", "Customer not found", "externalId");
        }

        UserRepresentation user = userOpt.get();
        Map<String, List<String>> attributes = user.getAttributes();
        int kycTier = getAttributeAsInt(attributes, "kyc_tier", 1);

        return limitsService.getLimits(kycTier);
    }

    /**
     * Rollback any created resources on failure.
     * Logs at ERROR level if rollback itself fails so orphaned resources can be identified.
     */
    private void rollback(Long fineractClientId, String keycloakUserId) {
        log.info("Rolling back registration...");

        if (keycloakUserId != null) {
            try {
                keycloakService.deleteUser(keycloakUserId);
            } catch (Exception e) {
                log.error("ROLLBACK FAILURE: Failed to delete Keycloak user {}. Orphaned resource requires manual cleanup.", keycloakUserId, e);
                registrationMetrics.incrementRollbackFailure("keycloak");
            }
        }

        if (fineractClientId != null) {
            try {
                fineractService.deleteClient(fineractClientId);
            } catch (Exception e) {
                log.error("ROLLBACK FAILURE: Failed to delete Fineract client {}. Orphaned resource requires manual cleanup.", fineractClientId, e);
                registrationMetrics.incrementRollbackFailure("fineract");
            }
        }

        log.info("Rollback completed");
    }

    private int getAttributeAsInt(Map<String, List<String>> attributes, String key, int defaultValue) {
        if (attributes == null || !attributes.containsKey(key)) {
            return defaultValue;
        }
        List<String> values = attributes.get(key);
        if (values == null || values.isEmpty()) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(values.get(0));
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private String getAttributeAsString(Map<String, List<String>> attributes, String key, String defaultValue) {
        if (attributes == null || !attributes.containsKey(key)) {
            return defaultValue;
        }
        List<String> values = attributes.get(key);
        if (values == null || values.isEmpty()) {
            return defaultValue;
        }
        return values.get(0);
    }
}
