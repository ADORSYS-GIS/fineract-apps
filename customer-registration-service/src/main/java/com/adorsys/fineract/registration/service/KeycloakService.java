package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.config.KeycloakConfig;
import com.adorsys.fineract.registration.dto.RegistrationRequest;
import com.adorsys.fineract.registration.exception.RegistrationException;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.GroupRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak;
    private final KeycloakConfig keycloakConfig;

    /**
     * Create a new Keycloak user for self-service customer.
     *
     * @param request    Registration request data
     * @param externalId UUID linking to Fineract client
     * @return Keycloak user ID
     */
    public String createUser(RegistrationRequest request, String externalId) {
        log.info("Creating Keycloak user for email: {}", request.getEmail());

        RealmResource realmResource = keycloak.realm(keycloakConfig.getRealm());
        UsersResource usersResource = realmResource.users();

        // Check if user already exists
        List<UserRepresentation> existingUsers = usersResource.searchByEmail(request.getEmail(), true);
        if (!existingUsers.isEmpty()) {
            throw new RegistrationException("EMAIL_ALREADY_EXISTS", "Email is already registered", "email");
        }

        // Build user representation
        UserRepresentation user = new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.getEmail());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmailVerified(false);

        // Set custom attributes
        user.setAttributes(Map.of(
                "fineract_external_id", List.of(externalId),
                "kyc_tier", List.of("1"),
                "kyc_status", List.of("pending"),
                "phone", List.of(request.getPhone())
        ));

        // Set required actions
        user.setRequiredActions(List.of(
                "VERIFY_EMAIL",
                "webauthn-register-passwordless"
        ));

        // Create user
        try (Response response = usersResource.create(user)) {
            if (response.getStatus() == 201) {
                String userId = extractUserIdFromLocation(response);
                log.info("Created Keycloak user with ID: {}", userId);

                // Add user to self-service-customers group
                assignToGroup(userId);

                return userId;
            } else if (response.getStatus() == 409) {
                throw new RegistrationException("EMAIL_ALREADY_EXISTS", "Email is already registered", "email");
            } else {
                String error = response.readEntity(String.class);
                log.error("Failed to create Keycloak user: {} - {}", response.getStatus(), error);
                throw new RegistrationException("Failed to create user account: " + error);
            }
        }
    }

    /**
     * Delete a Keycloak user (for rollback).
     */
    public void deleteUser(String userId) {
        log.info("Deleting Keycloak user: {}", userId);
        try {
            keycloak.realm(keycloakConfig.getRealm())
                    .users()
                    .delete(userId);
            log.info("Deleted Keycloak user: {}", userId);
        } catch (Exception e) {
            log.error("Failed to delete Keycloak user {}: {}", userId, e.getMessage());
        }
    }

    /**
     * Get user by external ID (fineract_external_id attribute).
     */
    public Optional<UserRepresentation> getUserByExternalId(String externalId) {
        List<UserRepresentation> users = keycloak.realm(keycloakConfig.getRealm())
                .users()
                .searchByAttributes("fineract_external_id:" + externalId);

        return users.isEmpty() ? Optional.empty() : Optional.of(users.get(0));
    }

    /**
     * Update user's KYC tier and status.
     */
    public void updateKycStatus(String userId, int tier, String status) {
        log.info("Updating KYC status for user {}: tier={}, status={}", userId, tier, status);

        UserResource userResource = keycloak.realm(keycloakConfig.getRealm())
                .users()
                .get(userId);

        UserRepresentation user = userResource.toRepresentation();

        Map<String, List<String>> attributes = user.getAttributes();
        attributes.put("kyc_tier", List.of(String.valueOf(tier)));
        attributes.put("kyc_status", List.of(status));

        user.setAttributes(attributes);
        userResource.update(user);

        log.info("Updated KYC status for user {}", userId);
    }

    /**
     * Check if user has completed email verification.
     */
    public boolean isEmailVerified(String userId) {
        UserRepresentation user = keycloak.realm(keycloakConfig.getRealm())
                .users()
                .get(userId)
                .toRepresentation();

        return user.isEmailVerified();
    }

    /**
     * Check if user has registered WebAuthn.
     */
    public boolean isWebAuthnRegistered(String userId) {
        UserRepresentation user = keycloak.realm(keycloakConfig.getRealm())
                .users()
                .get(userId)
                .toRepresentation();

        List<String> requiredActions = user.getRequiredActions();
        return requiredActions == null ||
                !requiredActions.contains("webauthn-register-passwordless");
    }

    private void assignToGroup(String userId) {
        String groupPath = keycloakConfig.getSelfServiceGroup();
        log.info("Assigning user {} to group {}", userId, groupPath);

        RealmResource realmResource = keycloak.realm(keycloakConfig.getRealm());

        // Find the group by path
        List<GroupRepresentation> groups = realmResource.groups()
                .groups(groupPath.substring(1), 0, 1, false);

        if (groups.isEmpty()) {
            log.warn("Group {} not found, skipping group assignment", groupPath);
            return;
        }

        String groupId = groups.get(0).getId();
        realmResource.users().get(userId).joinGroup(groupId);
        log.info("Assigned user {} to group {}", userId, groupPath);
    }

    private String extractUserIdFromLocation(Response response) {
        String location = response.getHeaderString("Location");
        if (location != null) {
            return location.substring(location.lastIndexOf('/') + 1);
        }
        throw new RegistrationException("Failed to extract user ID from response");
    }
}
