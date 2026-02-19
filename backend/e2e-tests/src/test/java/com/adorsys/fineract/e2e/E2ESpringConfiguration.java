package com.adorsys.fineract.e2e;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.config.TestcontainersConfig;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/**
 * E2E Cucumber/Spring integration configuration.
 *
 * <p>Boots the real asset-service in the test JVM with:
 * <ul>
 *   <li>Real PostgreSQL (Testcontainers) — Flyway migrations run</li>
 *   <li>Real Redis (Testcontainers)</li>
 *   <li>Real Fineract (Testcontainers) — no MockBeans</li>
 *   <li>Admin endpoints open (permit-all-admin=true)</li>
 *   <li>JWT validated against an embedded JWKS endpoint (no Keycloak needed)</li>
 * </ul>
 *
 * <p>Before Spring context starts, {@link FineractInitializer} creates the
 * GL accounts, payment types, and clients that {@code GlAccountResolver}
 * needs at startup.
 */
@CucumberContextConfiguration
@SpringBootTest(
        classes = com.adorsys.fineract.asset.AssetServiceApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles("e2e")
@Import(E2ESpringConfiguration.E2EBeans.class)
public class E2ESpringConfiguration {

    // Force Testcontainers to start and Fineract to be initialized
    // BEFORE Spring context boots (static initializer in TestcontainersConfig)
    static {
        // TestcontainersConfig.FINERACT is started in its static block
        // Now initialize Fineract with GL accounts, clients, etc.
        FineractInitializer.initialize(
                new FineractTestClient(TestcontainersConfig.getFineractBaseUrl()));
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // Asset service database
        registry.add("spring.datasource.url",
                TestcontainersConfig.ASSET_SERVICE_POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username",
                TestcontainersConfig.ASSET_SERVICE_POSTGRES::getUsername);
        registry.add("spring.datasource.password",
                TestcontainersConfig.ASSET_SERVICE_POSTGRES::getPassword);
        registry.add("spring.datasource.driver-class-name",
                () -> "org.postgresql.Driver");

        // Flyway enabled with real PostgreSQL
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");

        // Redis
        registry.add("spring.data.redis.host",
                TestcontainersConfig.REDIS::getHost);
        registry.add("spring.data.redis.port",
                () -> TestcontainersConfig.REDIS.getMappedPort(6379));
        registry.add("spring.data.redis.password", () -> "");

        // Fineract (basic auth, pointing at the container)
        registry.add("fineract.url",
                TestcontainersConfig::getFineractBaseUrl);
        registry.add("fineract.auth-type", () -> "basic");
        registry.add("fineract.username", () -> "mifos");
        registry.add("fineract.password", () -> "password");
        registry.add("fineract.tenant", () -> "default");
        registry.add("fineract.timeout-seconds", () -> "30");

        // SSL verification disabled (Fineract uses self-signed cert)
        registry.add("app.fineract.ssl-verify", () -> "false");

        // Admin endpoints open (no JWT needed for admin)
        registry.add("app.security.permit-all-admin", () -> "true");

        // JWT: point at the embedded JWKS server started by JwtTokenFactory.
        // This lets the production SecurityConfig's JwtDecoder validate our
        // test tokens without any bean overriding.
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                JwtTokenFactory::getJwksUri);

        // Market hours: always open for tests
        registry.add("asset-service.market-hours.open", () -> "00:00");
        registry.add("asset-service.market-hours.close", () -> "23:59");
        registry.add("asset-service.market-hours.timezone", () -> "UTC");
        registry.add("asset-service.market-hours.weekend-trading-enabled",
                () -> "true");
    }

    @TestConfiguration
    @ComponentScan("com.adorsys.fineract.e2e")
    static class E2EBeans {

        @Bean
        public FineractTestClient fineractTestClient() {
            return new FineractTestClient(TestcontainersConfig.getFineractBaseUrl());
        }
    }
}
