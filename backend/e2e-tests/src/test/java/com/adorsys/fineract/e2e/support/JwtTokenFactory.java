package com.adorsys.fineract.e2e.support;

import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.sun.net.httpserver.HttpServer;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Generates signed JWT tokens for E2E testing.
 *
 * <p>Starts an embedded HTTP server that serves a JWKS (JSON Web Key Set)
 * endpoint. The {@code spring.security.oauth2.resourceserver.jwt.jwk-set-uri}
 * property is pointed at this endpoint so the production
 * {@link com.adorsys.fineract.asset.config.SecurityConfig} validates
 * test tokens without any bean overriding.
 */
public class JwtTokenFactory {

    private static final String KEY_ID = "e2e-test-key";
    private static final KeyPair KEY_PAIR;
    private static final JWSSigner SIGNER;
    private static final int JWKS_PORT;

    static {
        try {
            // 1. Generate RSA key pair
            KeyPairGenerator gen = KeyPairGenerator.getInstance("RSA");
            gen.initialize(2048);
            KEY_PAIR = gen.generateKeyPair();
            SIGNER = new RSASSASigner((RSAPrivateKey) KEY_PAIR.getPrivate());

            // 2. Build JWKS JSON
            RSAKey jwk = new RSAKey.Builder((RSAPublicKey) KEY_PAIR.getPublic())
                    .keyID(KEY_ID)
                    .algorithm(JWSAlgorithm.RS256)
                    .build();
            String jwksJson = "{\"keys\":[" + jwk.toJSONString() + "]}";
            byte[] jwksBytes = jwksJson.getBytes(StandardCharsets.UTF_8);

            // 3. Start embedded HTTP server on a random port
            HttpServer server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            server.createContext("/.well-known/jwks.json", exchange -> {
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(200, jwksBytes.length);
                exchange.getResponseBody().write(jwksBytes);
                exchange.getResponseBody().close();
            });
            server.setExecutor(null); // default executor
            server.start();
            JWKS_PORT = server.getAddress().getPort();
        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to initialise E2E JWT infrastructure", e);
        }
    }

    /**
     * URI of the embedded JWKS endpoint.
     * Use this as the {@code jwk-set-uri} for Spring Security.
     */
    public static String getJwksUri() {
        return "http://127.0.0.1:" + JWKS_PORT + "/.well-known/jwks.json";
    }

    /**
     * Generate a signed JWT with the given claims.
     *
     * @param subject          Keycloak user UUID (used as externalId in Fineract)
     * @param fineractClientId Fineract client ID for the user
     * @param roles            Keycloak realm roles (e.g., "ASSET_MANAGER")
     * @return signed JWT string
     */
    public static String generateToken(String subject, Long fineractClientId, List<String> roles) {
        try {
            Instant now = Instant.now();
            JWTClaimsSet claims = new JWTClaimsSet.Builder()
                    .subject(subject)
                    .issuer("e2e-test-issuer")
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(now.plusSeconds(3600)))
                    .claim("fineract_client_id", fineractClientId)
                    .claim("realm_access", Map.of("roles", roles))
                    .build();

            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                    .keyID(KEY_ID)
                    .build();
            SignedJWT signedJWT = new SignedJWT(header, claims);
            signedJWT.sign(SIGNER);
            return signedJWT.serialize();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate E2E test JWT", e);
        }
    }
}
