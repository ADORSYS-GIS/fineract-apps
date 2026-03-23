package com.adorsys.fineract.registration.controller.webank;

import com.adorsys.fineract.registration.service.webank.UserPreferencesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

/**
 * User preferences endpoints.
 * Called by BFF via X-CS-Api-Key authentication.
 * Stores per-user settings (e.g., merchant_payment_anonymous) in CS database
 * instead of Keycloak user attributes.
 */
@Slf4j
@RestController
@RequestMapping("/customers/{customerId}/preferences")
@Tag(name = "User Preferences", description = "Per-user preference management")
public class UserPreferencesController {

    private final UserPreferencesService preferencesService;

    public UserPreferencesController(UserPreferencesService preferencesService) {
        this.preferencesService = preferencesService;
    }

    @GetMapping("/{key}")
    @Operation(summary = "Get specific preference value")
    public ResponseEntity<Map<String, String>> getPreference(
            @PathVariable String customerId,
            @PathVariable String key) {

        log.debug("GET /customers/{}/preferences/{}", customerId, key);

        Optional<String> value = preferencesService.getPreference(customerId, key);
        if (value.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(Map.of("key", key, "value", value.get()));
    }

    @PutMapping("/{key}")
    @Operation(summary = "Set preference value (upsert)")
    public ResponseEntity<Map<String, String>> setPreference(
            @PathVariable String customerId,
            @PathVariable String key,
            @RequestBody Map<String, String> body) {

        String value = body.get("value");
        if (value == null || value.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "value is required"));
        }

        log.debug("PUT /customers/{}/preferences/{}", customerId, key);
        preferencesService.setPreference(customerId, key, value);

        return ResponseEntity.ok(Map.of("key", key, "value", value));
    }

    @GetMapping
    @Operation(summary = "Get all preferences for user")
    public ResponseEntity<Map<String, String>> getAllPreferences(@PathVariable String customerId) {

        log.debug("GET /customers/{}/preferences", customerId);

        Map<String, String> prefs = preferencesService.getAllPreferences(customerId);
        return ResponseEntity.ok(prefs);
    }
}
