package com.adorsys.fineract.registration.controller;

import com.adorsys.fineract.registration.config.FineractConfig;
import com.adorsys.fineract.registration.config.KeycloakConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@Tag(name = "Health", description = "Service health check endpoints")
public class HealthController {

    private final Keycloak keycloak;
    private final KeycloakConfig keycloakConfig;
    private final RestClient fineractRestClient;
    private final FineractConfig fineractConfig;

    @GetMapping("/health")
    @Operation(summary = "Basic health check", description = "Returns UP if service is running")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "customer-registration-service");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health/detailed")
    @Operation(summary = "Detailed health check", description = "Checks connectivity to Keycloak and Fineract")
    public ResponseEntity<Map<String, Object>> detailedHealth() {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> components = new HashMap<>();

        // Check Keycloak
        try {
            keycloak.realm(keycloakConfig.getRealm()).toRepresentation();
            components.put("keycloak", Map.of("status", "UP"));
        } catch (Exception e) {
            log.error("Keycloak health check failed: {}", e.getMessage());
            components.put("keycloak", Map.of("status", "DOWN", "error", e.getMessage()));
        }

        // Check Fineract
        try {
            fineractRestClient.get()
                    .uri("/fineract-provider/api/v1/offices/1")
                    .retrieve()
                    .body(Map.class);
            components.put("fineract", Map.of("status", "UP"));
        } catch (Exception e) {
            log.error("Fineract health check failed: {}", e.getMessage());
            components.put("fineract", Map.of("status", "DOWN", "error", e.getMessage()));
        }

        // Determine overall status
        boolean allUp = components.values().stream()
                .allMatch(c -> "UP".equals(((Map<?, ?>) c).get("status")));

        response.put("status", allUp ? "UP" : "DOWN");
        response.put("components", components);

        return allUp ? ResponseEntity.ok(response) : ResponseEntity.status(503).body(response);
    }
}
