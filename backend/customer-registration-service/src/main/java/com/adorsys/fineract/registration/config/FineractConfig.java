package com.adorsys.fineract.registration.config;

import com.adorsys.fineract.registration.client.FineractTokenProvider;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.hc.core5.ssl.TrustStrategy;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestClient;

import jakarta.annotation.PostConstruct;

import javax.net.ssl.SSLContext;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Configuration
@ConfigurationProperties(prefix = "fineract")
@Getter
@Setter
public class FineractConfig {

    private String url;
    private String tenant = "default";
    private String authType;
    private String tokenUrl;
    private String clientId;
    private String clientSecret;
    private String grantType;
    private String oauthUsername;
    private String oauthPassword;
    private String username;
    private String password;
    private boolean verifySsl = true;
    private Long defaultOfficeId = 1L;
    private Long defaultSavingsProductId = 1L;
    private Long defaultGenderId = 1L;

    public boolean isOAuthEnabled() {
        return "oauth".equalsIgnoreCase(authType);
    }

    @PostConstruct
    void warnIfSslDisabled() {
        if (!verifySsl) {
            log.warn("SSL verification is DISABLED for Fineract connections. This should ONLY be used in development environments.");
        }
    }

    @Bean
    public RestClient fineractRestClient(FineractTokenProvider tokenProvider) {
        RestClient.Builder builder = RestClient.builder();

        log.info("Fineract authentication type configured: {}", authType);
        log.info("Fineract OAuth grant type configured: {}", grantType);
        log.info("Fineract SSL verification is set to: {}", verifySsl);

        if (!verifySsl) {
            builder.requestFactory(getUnsafeRequestFactoryApache());
        }

        builder.baseUrl(url)
                .defaultHeader("Fineract-Platform-TenantId", tenant)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .requestInterceptor(loggingInterceptor());

        if (isOAuthEnabled()) {
            builder.requestInterceptor(oauthInterceptor(tokenProvider));
        } else {
            String credentials = username + ":" + password;
            String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
            builder.defaultHeader(HttpHeaders.AUTHORIZATION, "Basic " + encodedCredentials);
        }

        return builder.build();
    }

    private ClientHttpRequestInterceptor oauthInterceptor(FineractTokenProvider tokenProvider) {
        return (request, body, execution) -> {
            request.getHeaders().set(HttpHeaders.AUTHORIZATION, "Bearer " + tokenProvider.getAccessToken());
            return execution.execute(request, body);
        };
    }

    private ClientHttpRequestInterceptor loggingInterceptor() {
        return (request, body, execution) -> {
            log.info("Sending request to Fineract: {} {}", request.getMethod(), request.getURI());
            if (body.length > 0) {
                String bodyStr = new String(body, StandardCharsets.UTF_8);
                log.debug("Request body: {}", bodyStr.length() > 500 ? bodyStr.substring(0, 500) + "...[truncated]" : bodyStr);
            }

            ClientHttpResponse response = execution.execute(request, body);

            log.info("Received response from Fineract: {}", response.getStatusCode());

            byte[] responseBodyBytes = StreamUtils.copyToByteArray(response.getBody());
            if (responseBodyBytes.length > 0) {
                String responseStr = new String(responseBodyBytes, StandardCharsets.UTF_8);
                log.debug("Response body: {}", responseStr.length() > 500 ? responseStr.substring(0, 500) + "...[truncated]" : responseStr);
            }

            return new BufferingClientHttpResponseWrapper(response, responseBodyBytes);
        };
    }

    private HttpComponentsClientHttpRequestFactory getUnsafeRequestFactoryApache() {
        try {
            TrustStrategy acceptingTrustStrategy = (cert, authType) -> true;
            SSLContext sslContext = SSLContexts.custom().loadTrustMaterial(null, acceptingTrustStrategy).build();
            SSLConnectionSocketFactory sslsf = new SSLConnectionSocketFactory(sslContext, NoopHostnameVerifier.INSTANCE);
            CloseableHttpClient httpClient = HttpClients.custom()
                    .setConnectionManager(PoolingHttpClientConnectionManagerBuilder.create().setSSLSocketFactory(sslsf).build())
                    .build();
            return new HttpComponentsClientHttpRequestFactory(httpClient);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create unsafe SSL context", e);
        }
    }

    private static class BufferingClientHttpResponseWrapper implements ClientHttpResponse {
        private final ClientHttpResponse response;
        private final byte[] body;

        public BufferingClientHttpResponseWrapper(ClientHttpResponse response, byte[] body) {
            this.response = response;
            this.body = body;
        }

        @Override
        public HttpHeaders getHeaders() {
            return response.getHeaders();
        }

        @Override
        public InputStream getBody() {
            return new ByteArrayInputStream(body);
        }

        @Override
        public void close() {
            response.close();
        }

        @Override
        public org.springframework.http.HttpStatusCode getStatusCode() {
            try {
                return response.getStatusCode();
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public int getRawStatusCode() {
            try {
                return response.getRawStatusCode();
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }
        }

        @Override
        public String getStatusText() {
            try {
                return response.getStatusText();
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }
        }
    }
}
