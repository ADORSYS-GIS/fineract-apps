package com.adorsys.fineract.asset.util;

import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilsTest {

    /**
     * Helper to build a minimal Jwt instance with the given subject and optional claims.
     */
    private Jwt buildJwt(String subject, Map<String, Object> claims) {
        Jwt.Builder builder = Jwt.withTokenValue("mock-token")
                .header("alg", "RS256")
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600));

        if (subject != null) {
            builder.subject(subject);
        }

        if (claims != null) {
            claims.forEach(builder::claim);
        }

        return builder.build();
    }

    // -------------------------------------------------------------------------
    // extractExternalId tests
    // -------------------------------------------------------------------------

    @Test
    void extractExternalId_validSubject_returnsIt() {
        // Arrange
        Jwt jwt = buildJwt("user-uuid-abc-123", null);

        // Act
        String externalId = JwtUtils.extractExternalId(jwt);

        // Assert
        assertEquals("user-uuid-abc-123", externalId);
    }

    @Test
    void extractExternalId_nullSubject_throwsIllegalState() {
        // Arrange: JWT with no subject
        Jwt jwt = buildJwt(null, Map.of("fineract_client_id", 42L));

        // Act & Assert
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> JwtUtils.extractExternalId(jwt));
        assertTrue(ex.getMessage().contains("missing the 'sub' claim"));
    }

    // -------------------------------------------------------------------------
    // extractUserId tests
    // -------------------------------------------------------------------------

    @Test
    void extractUserId_validClaim_returnsLong() {
        // Arrange
        Jwt jwt = buildJwt("some-subject", Map.of("fineract_client_id", 42L));

        // Act
        Long userId = JwtUtils.extractUserId(jwt);

        // Assert
        assertEquals(42L, userId);
    }

    @Test
    void extractUserId_integerClaim_returnsLong() {
        // Arrange: claim value is an Integer, not a Long
        Jwt jwt = buildJwt("some-subject", Map.of("fineract_client_id", 99));

        // Act
        Long userId = JwtUtils.extractUserId(jwt);

        // Assert
        assertEquals(99L, userId);
    }

    @Test
    void extractUserId_missingClaim_throwsIllegalState() {
        // Arrange: JWT without fineract_client_id
        Jwt jwt = buildJwt("some-subject", Map.of());

        // Act & Assert
        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> JwtUtils.extractUserId(jwt));
        assertTrue(ex.getMessage().contains("fineract_client_id"));
    }
}
