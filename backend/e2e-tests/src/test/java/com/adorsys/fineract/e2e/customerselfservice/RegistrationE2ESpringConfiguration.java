package com.adorsys.fineract.e2e.customerselfservice;
import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.config.TestcontainersConfig;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceTransactionManagerAutoConfiguration;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/**
 * E2E Cucumber/Spring integration configuration for the customer-registration-service suite.
 *
 * <p>Boots the real registration service in the test JVM with:
 * <ul>
 *   <li>Real Fineract (Testcontainers) — for client CRUD and account queries</li>
 *   <li>Real Keycloak (Testcontainers) — for user management, KYC attribute storage</li>
 *   <li>JWT validated against an embedded JWKS endpoint (JwtTokenFactory)</li>
 * </ul>
 */
@CucumberContextConfiguration
@SpringBootTest(
        classes = com.adorsys.fineract.registration.RegistrationApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@EnableAutoConfiguration(exclude = {
        DataSourceAutoConfiguration.class,
        DataSourceTransactionManagerAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class,
        FlywayAutoConfiguration.class
})
@ActiveProfiles("e2e")
@Import(RegistrationE2ESpringConfiguration.E2EBeans.class)
public class RegistrationE2ESpringConfiguration {

    static {
        // Start Keycloak (lazy — only starts once)
        TestcontainersConfig.ensureKeycloakStarted();

        // Initialize Fineract with GL accounts, clients, etc.
        FineractInitializer.initialize(
                new FineractTestClient(TestcontainersConfig.getFineractBaseUrl()));
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        // JWT: point at the embedded JWKS server started by JwtTokenFactory
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                JwtTokenFactory::getJwksUri);
        registry.add("spring.security.oauth2.resourceserver.jwt.issuer-uri",
                () -> "e2e-test-issuer");

        // Keycloak Admin Client configuration — use password grant with master admin
        registry.add("keycloak.url", TestcontainersConfig::getKeycloakBaseUrl);
        registry.add("keycloak.realm", () -> "fineract");
        registry.add("keycloak.admin-realm", () -> "master");
        registry.add("keycloak.client-id", () -> "admin-cli");
        registry.add("keycloak.client-secret", () -> "");
        registry.add("keycloak.self-service-group", () -> "/self-service-customers");
        registry.add("keycloak.grant-type", () -> "password");
        registry.add("keycloak.admin-username", () -> "admin");
        registry.add("keycloak.admin-password", () -> "admin");

        // Fineract (basic auth, pointing at the container)
        registry.add("fineract.url", TestcontainersConfig::getFineractBaseUrl);
        registry.add("fineract.auth.type", () -> "basic");
        registry.add("fineract.username", () -> "mifos");
        registry.add("fineract.password", () -> "password");
        registry.add("fineract.tenant", () -> "default");
        registry.add("fineract.verifySsl", () -> "false");
        registry.add("fineract.default-office-id", () -> "1");
        registry.add("fineract.default-savings-product-id",
                () -> String.valueOf(FineractInitializer.getXafSavingsProductId()));
        registry.add("fineract.default-gender-id", () -> "2");

        // Redis (pointing at the container)
        registry.add("spring.data.redis.host", TestcontainersConfig.REDIS::getHost);
        registry.add("spring.data.redis.port", () -> TestcontainersConfig.REDIS.getMappedPort(6379).toString());
        registry.add("spring.data.redis.password", () -> "");

        // CORS (allow all for tests)
        registry.add("app.cors.allowed-origins", () -> "http://localhost:3000");

    }

    @TestConfiguration
    @ComponentScan({"com.adorsys.fineract.e2e.customerselfservice.steps", "com.adorsys.fineract.e2e.support", "com.adorsys.fineract.e2e.client"})
    static class E2EBeans {

        @Bean
        public FineractTestClient fineractTestClient() {
            return new FineractTestClient(TestcontainersConfig.getFineractBaseUrl());
        }

    }
}
