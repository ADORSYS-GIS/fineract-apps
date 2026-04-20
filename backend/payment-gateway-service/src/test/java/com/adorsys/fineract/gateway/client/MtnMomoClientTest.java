package com.adorsys.fineract.gateway.client;

import com.adorsys.fineract.gateway.config.MtnMomoConfig;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.service.TokenCacheService;
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
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MtnMomoClientTest {

    @Mock
    private TokenCacheService tokenCacheService;

    private MockWebServer mockWebServer;
    private MtnMomoClient mtnClient;
    private MtnMomoConfig config;

    @BeforeEach
    void setUp() throws IOException {
        mockWebServer = new MockWebServer();
        mockWebServer.start();

        config = new MtnMomoConfig();
        config.setBaseUrl(mockWebServer.url("/").toString());
        config.setCollectionSubscriptionKey("test-collection-key");
        config.setDisbursementSubscriptionKey("test-disbursement-key");
        config.setApiUserId("test-api-user");
        config.setApiKey("test-api-key");
        config.setTargetEnvironment("sandbox");
        config.setCallbackUrl("http://localhost:8082/api/callbacks");
        config.setCurrency("XAF");
        config.setTimeoutSeconds(5);

        WebClient webClient = WebClient.builder()
                .baseUrl(mockWebServer.url("/").toString())
                .build();

        mtnClient = new MtnMomoClient(config, webClient, tokenCacheService);
    }

    @AfterEach
    void tearDown() throws IOException {
        mockWebServer.shutdown();
    }

    @Nested
    @DisplayName("requestToPay (Collection/Deposit)")
    class RequestToPay {

        @Test
        @DisplayName("successful collection returns externalId and sends correct headers")
        void successfulCollection() throws InterruptedException {
            // Stub token endpoint
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.of("cached-token"));

            // Stub requestToPay — MTN returns 202 Accepted with no body
            mockWebServer.enqueue(new MockResponse().setResponseCode(202));

            String externalId = mtnClient.requestToPay("ref-123", BigDecimal.valueOf(5000), "237670000001", "Deposit");

            assertThat(externalId).isNotNull().isNotEmpty();

            // Verify the HTTP request headers
            RecordedRequest request = mockWebServer.takeRequest();
            assertThat(request.getPath()).isEqualTo("/collection/v1_0/requesttopay");
            assertThat(request.getMethod()).isEqualTo("POST");
            assertThat(request.getHeader("Authorization")).isEqualTo("Bearer cached-token");
            assertThat(request.getHeader("X-Reference-Id")).isEqualTo("ref-123");
            assertThat(request.getHeader("X-Target-Environment")).isEqualTo("sandbox");
            assertThat(request.getHeader("Ocp-Apim-Subscription-Key")).isEqualTo("test-collection-key");
            assertThat(request.getHeader("X-Callback-Url")).isEqualTo("http://localhost:8082/api/callbacks/mtn/collection/ref-123");

            // Verify body contains amount and phone
            String body = request.getBody().readUtf8();
            assertThat(body).contains("\"amount\":\"5000\"");
            assertThat(body).contains("\"currency\":\"XAF\"");
            assertThat(body).contains("237670000001");
        }

        @Test
        @DisplayName("API error throws PaymentException")
        void apiErrorThrowsException() {
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.of("cached-token"));

            mockWebServer.enqueue(new MockResponse()
                    .setResponseCode(500)
                    .setBody("{\"error\":\"INTERNAL_PROCESSING_ERROR\"}")
                    .addHeader("Content-Type", "application/json"));

            assertThatThrownBy(() ->
                    mtnClient.requestToPay("ref-123", BigDecimal.valueOf(5000), "237670000001", "Deposit"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Failed to initiate MTN collection");
        }
    }

    @Nested
    @DisplayName("transfer (Disbursement/Withdrawal)")
    class Transfer {

        @Test
        @DisplayName("successful disbursement returns externalId")
        void successfulDisbursement() throws InterruptedException {
            when(tokenCacheService.getToken("mtn:disbursement")).thenReturn(Optional.of("disb-token"));

            mockWebServer.enqueue(new MockResponse().setResponseCode(202));

            String externalId = mtnClient.transfer("ref-456", BigDecimal.valueOf(2000), "237670000002", "Withdrawal");

            assertThat(externalId).isNotNull().isNotEmpty();

            RecordedRequest request = mockWebServer.takeRequest();
            assertThat(request.getPath()).isEqualTo("/disbursement/v1_0/transfer");
            assertThat(request.getHeader("Ocp-Apim-Subscription-Key")).isEqualTo("test-disbursement-key");
            assertThat(request.getHeader("X-Callback-Url")).isEqualTo("http://localhost:8082/api/callbacks/mtn/disbursement/ref-456");
        }

        @Test
        @DisplayName("API error throws PaymentException")
        void apiErrorThrowsException() {
            when(tokenCacheService.getToken("mtn:disbursement")).thenReturn(Optional.of("disb-token"));

            mockWebServer.enqueue(new MockResponse()
                    .setResponseCode(500)
                    .setBody("{\"error\":\"INTERNAL_PROCESSING_ERROR\"}")
                    .addHeader("Content-Type", "application/json"));

            assertThatThrownBy(() ->
                    mtnClient.transfer("ref-456", BigDecimal.valueOf(2000), "237670000002", "Withdrawal"))
                    .isInstanceOf(PaymentException.class)
                    .hasMessageContaining("Failed to initiate MTN disbursement");
        }
    }

    @Nested
    @DisplayName("getCollectionStatus")
    class GetCollectionStatus {

        @Test
        @DisplayName("returns SUCCESSFUL when MTN reports SUCCESSFUL")
        void successfulStatus() {
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.of("token"));

            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"SUCCESSFUL\",\"amount\":\"5000\",\"currency\":\"XAF\"}")
                    .addHeader("Content-Type", "application/json"));

            PaymentStatus status = mtnClient.getCollectionStatus("ref-123");

            assertThat(status).isEqualTo(PaymentStatus.SUCCESSFUL);
        }

        @Test
        @DisplayName("returns FAILED when MTN reports FAILED")
        void failedStatus() {
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.of("token"));

            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"status\":\"FAILED\"}")
                    .addHeader("Content-Type", "application/json"));

            PaymentStatus status = mtnClient.getCollectionStatus("ref-123");

            assertThat(status).isEqualTo(PaymentStatus.FAILED);
        }

        @Test
        @DisplayName("returns PENDING as fallback on error")
        void errorFallbackToPending() {
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.of("token"));

            mockWebServer.enqueue(new MockResponse().setResponseCode(500));

            PaymentStatus status = mtnClient.getCollectionStatus("ref-123");

            assertThat(status).isEqualTo(PaymentStatus.PENDING);
        }
    }

    @Nested
    @DisplayName("Token Caching")
    class TokenCaching {

        @Test
        @DisplayName("uses cached token when available — no HTTP call to token endpoint")
        void cachedTokenSkipsHttpCall() {
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.of("cached-token"));

            // Only enqueue the requestToPay response (no token endpoint call expected)
            mockWebServer.enqueue(new MockResponse().setResponseCode(202));

            mtnClient.requestToPay("ref-1", BigDecimal.valueOf(1000), "237670000001", "Test");

            // Only 1 request to MockWebServer (requestToPay), not 2 (no token call)
            assertThat(mockWebServer.getRequestCount()).isEqualTo(1);
        }

        @Test
        @DisplayName("fetches token from API when not cached, then caches it")
        void fetchesAndCachesToken() {
            when(tokenCacheService.getToken("mtn:collection")).thenReturn(Optional.empty());

            // Token endpoint response
            mockWebServer.enqueue(new MockResponse()
                    .setBody("{\"access_token\":\"new-token\",\"token_type\":\"access_token\",\"expires_in\":3600}")
                    .addHeader("Content-Type", "application/json"));
            // requestToPay response
            mockWebServer.enqueue(new MockResponse().setResponseCode(202));

            mtnClient.requestToPay("ref-1", BigDecimal.valueOf(1000), "237670000001", "Test");

            // 2 requests: token + requestToPay
            assertThat(mockWebServer.getRequestCount()).isEqualTo(2);

            // Verify token was cached with TTL = 3600 - 60 = 3540
            verify(tokenCacheService).putToken("mtn:collection", "new-token", 3540L);
        }
    }
}
