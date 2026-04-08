package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.FineractConfig;
import com.adorsys.fineract.gateway.exception.PaymentException;
import okhttp3.mockwebserver.MockResponse;
import okhttp3.mockwebserver.MockWebServer;
import okhttp3.mockwebserver.RecordedRequest;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Base64;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FineractClientTest {

    @Mock
    private FineractTokenProvider tokenProvider;

    private MockWebServer mockWebServer;
    private FineractClient fineractClient;
    private FineractConfig config;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        config = new FineractConfig();
        config.setUrl(mockWebServer.url("/").toString());
        config.setTenant("default");
        config.setAuthType("basic");
        config.setUsername("mifos");
        config.setPassword("password");
        config.setTimeoutSeconds(5);

        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .build();

        fineractClient = new FineractClient(config, tokenProvider, webClient);
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Nested
    @DisplayName("createDeposit")
    class CreateDeposit {

        @Test
        @DisplayName("successful deposit returns transaction ID")
        void successReturnsTransactionId() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"resourceId\":42}")
                    .addHeader("Content-Type", "application/json"));

            Long txnId = fineractClient.createDeposit(123L, BigDecimal.valueOf(5000), 1L, "MTN-receipt-001");

            assertThat(txnId).isEqualTo(42L);
        }

        @Test
        @DisplayName("null paymentTypeId throws PaymentException")
        void nullPaymentTypeIdThrows() {
            assertThatThrownBy(() ->
                    fineractClient.createDeposit(123L, BigDecimal.valueOf(5000), null, "receipt"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("PaymentTypeId is missing");
        }

        @Test
        @DisplayName("4xx API error throws PaymentException")
        void apiErrorThrows() {
            mockWebServer.enqueue(new MockResponse()
                    .setResponseCode(400)
                    .setBody("{\"error\":\"validation.msg.amount\"}")
                    .addHeader("Content-Type", "application/json"));

            assertThatThrownBy(() ->
                    fineractClient.createDeposit(123L, BigDecimal.valueOf(5000), 1L, "receipt"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Fineract API error");
        }
    }

    @Nested
    @DisplayName("createWithdrawal")
    class CreateWithdrawal {

        @Test
        @DisplayName("successful withdrawal returns transaction ID")
        void successReturnsTransactionId() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"resourceId\":99}")
                    .addHeader("Content-Type", "application/json"));

            Long txnId = fineractClient.createWithdrawal(123L, BigDecimal.valueOf(2000), 1L, "MTN-receipt-002");

            assertThat(txnId).isEqualTo(99L);
        }
    }

    @Nested
    @DisplayName("getSavingsAccount")
    class GetSavingsAccount {

        @Test
        @DisplayName("returns account map")
        void returnsAccountMap() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"id\":123,\"clientId\":456,\"accountNo\":\"SA-001\",\"balance\":50000}")
                    .addHeader("Content-Type", "application/json"));

            Map<String, Object> account = fineractClient.getSavingsAccount(123L);

            assertThat(account).containsEntry("id", 123);
            assertThat(account).containsEntry("clientId", 456);
        }
    }

    @Nested
    @DisplayName("getClientByExternalId")
    class GetClientByExternalId {

        @Test
        @DisplayName("returns client when found")
        void returnsClientWhenFound() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"pageItems\":[{\"id\":456,\"externalId\":\"ext-001\",\"displayName\":\"Test User\"}]}")
                    .addHeader("Content-Type", "application/json"));

            Map<String, Object> client = fineractClient.getClientByExternalId("ext-001");

            assertThat(client).containsEntry("id", 456);
            assertThat(client).containsEntry("externalId", "ext-001");
        }

        @Test
        @DisplayName("throws PaymentException when not found")
        void throwsWhenNotFound() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"pageItems\":[]}")
                    .addHeader("Content-Type", "application/json"));

            assertThatThrownBy(() ->
                    fineractClient.getClientByExternalId("unknown-ext"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Client not found");
        }
    }

    @Nested
    @DisplayName("verifyAccountOwnership")
    class VerifyAccountOwnership {

        @Test
        @DisplayName("returns true when clientId matches")
        void trueWhenMatching() {
            // getClientByExternalId response
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"pageItems\":[{\"id\":456}]}")
                    .addHeader("Content-Type", "application/json"));
            // getSavingsAccount response
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"id\":123,\"clientId\":456}")
                    .addHeader("Content-Type", "application/json"));

            boolean result = fineractClient.verifyAccountOwnership("ext-001", 123L);

            assertThat(result).isTrue();
        }

        @Test
        @DisplayName("returns false when clientId does not match")
        void falseWhenMismatch() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"pageItems\":[{\"id\":456}]}")
                    .addHeader("Content-Type", "application/json"));
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"id\":123,\"clientId\":789}")
                    .addHeader("Content-Type", "application/json"));

            boolean result = fineractClient.verifyAccountOwnership("ext-001", 123L);

            assertThat(result).isFalse();
        }

        @Test
        @DisplayName("returns false on exception")
        void falseOnException() {
            mockWebServer.enqueue(new MockResponse().setResponseCode(500));

            boolean result = fineractClient.verifyAccountOwnership("ext-001", 123L);

            assertThat(result).isFalse();
        }
    }

    @Nested
    @DisplayName("Authentication Headers")
    class AuthHeaders {

        @Test
        @DisplayName("uses Basic auth when authType is basic")
        void usesBasicAuth() throws InterruptedException {
            config.setAuthType("basic");

            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"id\":123,\"clientId\":456}")
                    .addHeader("Content-Type", "application/json"));

            fineractClient.getSavingsAccount(123L);

            RecordedRequest request = mockWebServer.takeRequest();
            String expectedBasic = "Basic " + Base64.getEncoder().encodeToString("mifos:password".getBytes());
            assertThat(request.getHeader("Authorization")).isEqualTo(expectedBasic);
        }

        @Test
        @DisplayName("uses OAuth Bearer when authType is oauth")
        void usesOAuthBearer() throws InterruptedException {
            config.setAuthType("oauth");
            when(tokenProvider.getAccessToken()).thenReturn("oauth-test-token");

            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"id\":123,\"clientId\":456}")
                    .addHeader("Content-Type", "application/json"));

            fineractClient.getSavingsAccount(123L);

            RecordedRequest request = mockWebServer.takeRequest();
            assertThat(request.getHeader("Authorization")).isEqualTo("Bearer oauth-test-token");
        }
    }
}
