package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.NokashConfig;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class NokashClientTest {


    private MockWebServer mockWebServer;
    private NokashClient nokashClient;
    private NokashConfig config;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        config = new NokashConfig();
        config.setBaseUrl(mockWebServer.url("/").toString());
        config.setISpaceKey("test-i-space-key");
        config.setAppSpaceKey("test-app-space-key");
        config.setCallbackUrl("http://localhost:8082/api/callbacks/nokash");
        config.setCountry("CM");
        config.setTimeoutSeconds(5);
        config.setSenderFirstName("Azamra");
        config.setSenderLastName("Platform");

        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .build();

        nokashClient = new NokashClient(config, webClient);
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Nested
    @DisplayName("initiatePayin")
    class InitiatePayin {

        @Test
        @DisplayName("successful payin returns reference")
        void successfulPayin() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"REQUEST_OK\",\"data\":{\"id\":\"test-reference\"}}")
                    .addHeader("Content-Type", "application/json"));

            String reference = nokashClient.initiatePayin("order-123", BigDecimal.valueOf(5000), "237670000001", "MTN_MOMO");

            assertThat(reference).isEqualTo("test-reference");
        }

        @Test
        @DisplayName("API error throws PaymentException")
        void apiErrorThrowsException() {
            mockWebServer.enqueue(new MockResponse()
                    .setResponseCode(500)
                    .setBody("{\"error\":\"Internal Server Error\"}")
                    .addHeader("Content-Type", "application/json"));

            assertThatThrownBy(() ->
                    nokashClient.initiatePayin("order-123", BigDecimal.valueOf(5000), "237670000001", "MTN_MOMO"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Failed to initiate NOKASH payin");
        }
    }

    @Nested
    @DisplayName("initiatePayout")
    class InitiatePayout {

        @Test
        @DisplayName("successful payout returns reference")
        void successfulPayout() throws InterruptedException {
            String mockResponseBody = "{" +
                "\"status\":\"REQUEST_OK\"," +
                "\"message\":\"Payout initiated\"," +
                "\"data\":{" +
                "\"id\":\"test-payout-id\"," +
                "\"status\":\"PENDING\"," +
                "\"amount\":2000," +
                "\"orderId\":\"order-456\"," +
                "\"phone\":\"237670000002\"" +
                "}" +
            "}";
            mockWebServer.enqueue(new MockResponse()
                    .setBody(mockResponseBody)
                    .addHeader("Content-Type", "application/json"));

            String reference = nokashClient.initiatePayout("temp-auth-key", "order-456", BigDecimal.valueOf(2000), "237670000002", "MTN_MOMO");

            assertThat(reference).isEqualTo("test-payout-id");

            RecordedRequest request = mockWebServer.takeRequest();
            assertThat(request.getPath()).isEqualTo("/lapas-on-trans/trans/api-payout-request/407");
            assertThat(request.getHeader("auth-code")).isEqualTo("temp-auth-key");
            String requestBody = request.getBody().readUtf8();
            assertThat(requestBody).contains("\"payment_method\":\"MTN_MOMO\"");
            assertThat(requestBody).contains("other_info");
            assertThat(requestBody).contains("remittance_data");
        }
    }

    @Nested
    @DisplayName("getTransactionStatus")
    class GetTransactionStatus {

        @Test
        @DisplayName("returns SUCCESSFUL when NOKASH reports SUCCESS")
        void successfulStatus() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"REQUEST_OK\",\"data\":{\"status\":\"SUCCESS\"}}")
                    .addHeader("Content-Type", "application/json"));

            PaymentStatus status = nokashClient.getTransactionStatus("order-123");

            assertThat(status).isEqualTo(PaymentStatus.SUCCESSFUL);
        }

        @Test
        @DisplayName("returns FAILED when NOKASH reports FAILED")
        void failedStatus() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"REQUEST_OK\",\"data\":{\"status\":\"FAILED\"}}")
                    .addHeader("Content-Type", "application/json"));

            PaymentStatus status = nokashClient.getTransactionStatus("order-123");

            assertThat(status).isEqualTo(PaymentStatus.FAILED);
        }

        @Test
        @DisplayName("returns PENDING on error")
        void errorReturnsPending() {
            mockWebServer.enqueue(new MockResponse().setResponseCode(500));

            PaymentStatus status = nokashClient.getTransactionStatus("order-123");

            assertThat(status).isEqualTo(PaymentStatus.PENDING);
        }
    }

    @Nested
    @DisplayName("getTemporaryAuthKey")
    class GetTemporaryAuthKey {

        @Test
        @DisplayName("successful auth returns temporary key")
        void successfulAuth() throws InterruptedException {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"LOGIN_SUCCESS\",\"data\":\"temp-auth-key\"}")
                    .addHeader("Content-Type", "application/json"));

            String tempAuthKey = nokashClient.getTemporaryAuthKey();

            assertThat(tempAuthKey).isEqualTo("temp-auth-key");

            RecordedRequest request = mockWebServer.takeRequest();
            assertThat(request.getPath()).isEqualTo("/lapas-on-trans/trans/auth?i_space_key=test-i-space-key&app_space_key=test-app-space-key");
        }

        @Test
        @DisplayName("failed auth throws PaymentException")
        void failedAuth() {
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"LOGIN_FAILED\",\"message\":\"Invalid credentials\"}")
                    .addHeader("Content-Type", "application/json"));

            assertThatThrownBy(() -> nokashClient.getTemporaryAuthKey())
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Failed to get temporary auth key from NOKASH: Invalid credentials");
        }
    }
}
