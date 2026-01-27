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
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import javax.net.ssl.SSLContext;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.stream.Collectors;

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
            log.debug("Request headers: {}", request.getHeaders());
            if (body.length > 0) {
                log.debug("Request body: {}", new String(body, StandardCharsets.UTF_8));
            }

            var response = execution.execute(request, body);

            log.info("Received response from Fineract: {}", response.getStatusCode());
            log.debug("Response headers: {}", response.getHeaders());
            var responseBody = new BufferedReader(new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))
                    .lines()
                    .collect(Collectors.joining("\n"));
            if (!responseBody.isEmpty()) {
                log.debug("Response body: {}", responseBody);
            }

            return response;
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
}
