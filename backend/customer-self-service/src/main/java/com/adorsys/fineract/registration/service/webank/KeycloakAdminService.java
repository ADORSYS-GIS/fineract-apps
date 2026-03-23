package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.config.KeycloakProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Lightweight Keycloak Admin API client for updating user attributes.
 * Uses client_credentials grant to obtain an admin access token,
 * then calls the Keycloak Admin REST API.
 */
@Slf4j
@Service
public class KeycloakAdminService {

    private final KeycloakProperties props;
    private final RestClient restClient;

    public KeycloakAdminService(KeycloakProperties props) {
        this.props = props;
        this.restClient = RestClient.builder().build();
    }

    /**
     * Updates a user's attributes in Keycloak.
     *
     * @param userId     the Keycloak user ID
     * @param attributes map of attribute name to list of values
     */
    public void updateUserAttributes(String userId, Map<String, List<String>> attributes) {
        String token = obtainAdminToken();
        if (token == null) {
            log.error("Cannot update Keycloak user attributes: failed to obtain admin token");
            return;
        }

        String url = String.format("%s/admin/realms/%s/users/%s",
                props.url(), props.realm(), userId);

        Map<String, Object> body = Map.of("attributes", attributes);

        try {
            restClient.put()
                    .uri(url)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Updated Keycloak attributes for user {}: {}", userId, attributes.keySet());
        } catch (Exception e) {
            log.error("Failed to update Keycloak attributes for user {}: {}", userId, e.getMessage(), e);
        }
    }

    private String obtainAdminToken() {
        if (props.clientId() == null || props.clientSecret() == null) {
            log.warn("Keycloak client credentials not configured; skipping admin token acquisition");
            return null;
        }

        String tokenUrl = String.format("%s/realms/%s/protocol/openid-connect/token",
                props.url(), props.adminRealm());

        MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
        formData.add("grant_type", "client_credentials");
        formData.add("client_id", props.clientId());
        formData.add("client_secret", props.clientSecret());

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restClient.post()
                    .uri(tokenUrl)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(formData)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.containsKey("access_token")) {
                return (String) response.get("access_token");
            }
            log.error("Keycloak token response missing access_token");
            return null;
        } catch (Exception e) {
            log.error("Failed to obtain Keycloak admin token: {}", e.getMessage(), e);
            return null;
        }
    }
}
