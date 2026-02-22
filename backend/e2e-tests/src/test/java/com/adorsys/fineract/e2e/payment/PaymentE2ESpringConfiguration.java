package com.adorsys.fineract.e2e.payment;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.config.TestcontainersConfig;
import com.adorsys.fineract.e2e.payment.support.WireMockProviderStubs;
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
 * E2E Cucumber/Spring configuration for the payment-gateway-service suite.
 *
 * <p>Boots the real payment-gateway-service in the test JVM with:
 * <ul>
 *   <li>Real PostgreSQL (Testcontainers) — Flyway migrations run</li>
 *   <li>Real Redis (Testcontainers)</li>
 *   <li>Real Fineract (Testcontainers) — for balance verification</li>
 *   <li>WireMock — simulates MTN MoMo, Orange Money, CinetPay provider APIs</li>
 *   <li>JWT validated against an embedded JWKS endpoint</li>
 * </ul>
 */
@CucumberContextConfiguration
@SpringBootTest(
        classes = com.adorsys.fineract.gateway.PaymentGatewayApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles("e2e")
@Import(PaymentE2ESpringConfiguration.PaymentE2EBeans.class)
public class PaymentE2ESpringConfiguration {

    static {
        // Ensure Testcontainers + Fineract initialization completes before Spring boots
        FineractInitializer.initialize(
                new FineractTestClient(TestcontainersConfig.getFineractBaseUrl()));
    }

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        String wireMockUrl = WireMockProviderStubs.getBaseUrl();

        // Payment gateway database
        registry.add("spring.datasource.url",
                TestcontainersConfig.PAYMENT_GATEWAY_POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username",
                TestcontainersConfig.PAYMENT_GATEWAY_POSTGRES::getUsername);
        registry.add("spring.datasource.password",
                TestcontainersConfig.PAYMENT_GATEWAY_POSTGRES::getPassword);
        registry.add("spring.datasource.driver-class-name",
                () -> "org.postgresql.Driver");

        // Flyway
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");

        // Redis
        registry.add("spring.data.redis.host",
                TestcontainersConfig.REDIS::getHost);
        registry.add("spring.data.redis.port",
                () -> TestcontainersConfig.REDIS.getMappedPort(6379));
        registry.add("spring.data.redis.password", () -> "");

        // Fineract (basic auth)
        registry.add("fineract.url", TestcontainersConfig::getFineractBaseUrl);
        registry.add("fineract.auth-type", () -> "basic");
        registry.add("fineract.username", () -> "mifos");
        registry.add("fineract.password", () -> "password");
        registry.add("fineract.tenant", () -> "default");
        registry.add("fineract.timeout-seconds", () -> "30");
        registry.add("fineract.default-savings-product-id",
                () -> String.valueOf(FineractInitializer.getXafSavingsProductId()));

        // SSL verification disabled (Fineract uses self-signed cert)
        registry.add("app.ssl.insecure", () -> "true");

        // JWT
        registry.add("spring.security.oauth2.resourceserver.jwt.jwk-set-uri",
                JwtTokenFactory::getJwksUri);

        // MTN MoMo → WireMock
        registry.add("mtn.momo.base-url", () -> wireMockUrl);
        registry.add("mtn.momo.collection-subscription-key", () -> "test-collection-key");
        registry.add("mtn.momo.disbursement-subscription-key", () -> "test-disbursement-key");
        registry.add("mtn.momo.api-user-id", () -> "test-api-user");
        registry.add("mtn.momo.api-key", () -> "test-api-key");
        registry.add("mtn.momo.target-environment", () -> "sandbox");
        registry.add("mtn.momo.callback-url", () -> "http://localhost/api/callbacks");
        registry.add("mtn.momo.currency", () -> "XAF");
        registry.add("mtn.momo.timeout-seconds", () -> "10");
        registry.add("mtn.momo.fineract-payment-type-id",
                () -> String.valueOf(FineractInitializer.getPaymentTypeMtnId()));
        registry.add("mtn.momo.gl-account-code", () -> "47");

        // Orange Money → WireMock
        registry.add("orange.money.base-url", () -> wireMockUrl);
        registry.add("orange.money.token-url", () -> wireMockUrl + "/oauth/v3/token");
        registry.add("orange.money.client-id", () -> "test-orange-client");
        registry.add("orange.money.client-secret", () -> "test-orange-secret");
        registry.add("orange.money.merchant-code", () -> "test-merchant");
        registry.add("orange.money.callback-url", () -> "http://localhost/api/callbacks");
        registry.add("orange.money.return-url", () -> "http://localhost:3000/return");
        registry.add("orange.money.cancel-url", () -> "http://localhost:3000/cancel");
        registry.add("orange.money.currency", () -> "XAF");
        registry.add("orange.money.timeout-seconds", () -> "10");
        registry.add("orange.money.fineract-payment-type-id",
                () -> String.valueOf(FineractInitializer.getPaymentTypeOrangeId()));
        registry.add("orange.money.gl-account-code", () -> "47");

        // CinetPay → WireMock
        registry.add("cinetpay.base-url", () -> wireMockUrl);
        registry.add("cinetpay.transfer-url", () -> wireMockUrl);
        registry.add("cinetpay.api-key", () -> "test-cinetpay-api-key");
        registry.add("cinetpay.site-id", () -> "123456");
        registry.add("cinetpay.api-password", () -> "test-cinetpay-password");
        registry.add("cinetpay.transfer-password", () -> "test-transfer-password");
        registry.add("cinetpay.secret-key", () -> "test-cinetpay-secret");
        registry.add("cinetpay.currency", () -> "XAF");
        registry.add("cinetpay.timeout-seconds", () -> "10");

        // CinetPay callback/return/cancel URLs are computed from these base URLs
        registry.add("payment.gateway.base-url", () -> "http://localhost");
        registry.add("self-service.app.base-url", () -> "http://localhost:3000");

        // Disable schedulers and rate limiting for tests
        registry.add("app.cleanup.enabled", () -> "false");
        registry.add("app.rate-limit.enabled", () -> "false");
        registry.add("app.callbacks.ip-whitelist.enabled", () -> "false");
        registry.add("app.stepup.enabled", () -> "false");

        // Testable daily limits (100,000 XAF)
        registry.add("app.limits.daily-deposit-max", () -> "100000");
        registry.add("app.limits.daily-withdrawal-max", () -> "100000");
    }

    @TestConfiguration
    @ComponentScan({"com.adorsys.fineract.e2e.payment", "com.adorsys.fineract.e2e.support", "com.adorsys.fineract.e2e.client"})
    static class PaymentE2EBeans {

        @Bean
        public FineractTestClient fineractTestClient() {
            return new FineractTestClient(TestcontainersConfig.getFineractBaseUrl());
        }
    }
}
