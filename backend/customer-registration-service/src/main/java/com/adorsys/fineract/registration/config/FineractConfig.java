package com.adorsys.fineract.registration.config;

import com.adorsys.fineract.registration.client.FineractTokenProvider;
import com.adorsys.fineract.registration.exception.FineractConfigurationException;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManagerBuilder;
import org.apache.hc.client5.http.ssl.NoopHostnameVerifier;
import org.apache.hc.client5.http.ssl.SSLConnectionSocketFactory;
import org.apache.hc.core5.ssl.SSLContexts;
import org.apache.hc.core5.ssl.TrustStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.RestClient;

import javax.net.ssl.SSLContext;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Slf4j
@Configuration
public class FineractConfig {

    private final FineractProperties fineractProperties;

    public FineractConfig(FineractProperties fineractProperties) {
        this.fineractProperties = fineractProperties;
    }

    public boolean isOAuthEnabled() {
        return "oauth".equalsIgnoreCase(fineractProperties.getAuthType());
    }

    @Bean
    public RestClient fineractRestClient(FineractTokenProvider tokenProvider) {
        RestClient.Builder builder = RestClient.builder();

        log.info("Fineract authentication type configured: {}", fineractProperties.getAuthType());
        log.info("Fineract OAuth grant type configured: {}", fineractProperties.getGrantType());
        log.info("Fineract SSL verification is set to: {}", fineractProperties.isVerifySsl());

        if (!fineractProperties.isVerifySsl()) {
            builder.requestFactory(getUnsafeRequestFactoryApache());
        }

        builder.baseUrl(fineractProperties.getUrl())
                .defaultHeader("Fineract-Platform-TenantId", fineractProperties.getTenant())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .requestInterceptor(loggingInterceptor());

        if (isOAuthEnabled()) {
            builder.requestInterceptor(oauthInterceptor(tokenProvider));
        } else {
            String credentials = fineractProperties.getUsername() + ":" + fineractProperties.getPassword();
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
            log.debug("Request headers: {}", request.getHeaders());
            if (body.length > 0) {
                log.debug("Request body: {}", new String(body, StandardCharsets.UTF_8));
            }

            ClientHttpResponse response = execution.execute(request, body);

            log.info("Received response from Fineract: {}", response.getStatusCode());
            log.debug("Response headers: {}", response.getHeaders());

            byte[] responseBodyBytes = StreamUtils.copyToByteArray(response.getBody());
            if (responseBodyBytes.length > 0) {
                log.debug("Response body: {}", new String(responseBodyBytes, StandardCharsets.UTF_8));
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
            throw new FineractConfigurationException("Failed to create unsafe SSL context", e);
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
                throw new FineractConfigurationException("Failed to get status code", e);
            }
        }

        @Override
        public int getRawStatusCode() {
            try {
                return response.getRawStatusCode();
            } catch (java.io.IOException e) {
                throw new FineractConfigurationException("Failed to get raw status code", e);
            }
        }

        @Override
        public String getStatusText() {
            try {
                return response.getStatusText();
            } catch (java.io.IOException e) {
                throw new FineractConfigurationException("Failed to get status text", e);
            }
        }
    }
}
