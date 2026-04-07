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
    // extractClientId tests
    // -------------------------------------------------------------------------

    @Test
    void extractClientId_validLongClaim_returnsLong() {
        // Arrange
        Jwt jwt = buildJwt("some-subject", Map.of("fineract_client_id", 42L));

        // Act
        Long clientId = JwtUtils.extractClientId(jwt);

        // Assert
        assertEquals(42L, clientId);
    }

    @Test
    void extractClientId_integerClaim_returnsLong() {
        // Arrange: claim value is an Integer, not a Long
        Jwt jwt = buildJwt("some-subject", Map.of("fineract_client_id", 99));

        // Act
        Long clientId = JwtUtils.extractClientId(jwt);

        // Assert
        assertEquals(99L, clientId);
    }

    @Test
    void extractClientId_missingClaim_returnsNull() {
        // Arrange: JWT without fineract_client_id — caller must fall back to externalId lookup
        Jwt jwt = buildJwt("some-subject", Map.of());

        // Act
        Long clientId = JwtUtils.extractClientId(jwt);

        // Assert
        assertNull(clientId);
    }
}
