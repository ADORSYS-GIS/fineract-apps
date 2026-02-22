package com.adorsys.fineract.gateway.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import javax.net.ssl.SSLException;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * WebClient configuration for making HTTP calls to payment providers and Fineract.
 */
@Slf4j
@Configuration
public class WebClientConfig {

    @Value("${app.ssl.insecure:false}")
    private boolean insecureSsl;

    @Bean
    public WebClient.Builder webClientBuilder() throws SSLException {
        SslContextBuilder sslBuilder = SslContextBuilder.forClient();
        if (insecureSsl) {
            log.warn("INSECURE SSL ENABLED: TLS certificate validation is disabled. " +
                "Do NOT use this in production!");
            sslBuilder.trustManager(InsecureTrustManagerFactory.INSTANCE);
        }
        SslContext sslContext = sslBuilder.build();

        HttpClient httpClient = HttpClient.create()
            .secure(t -> t.sslContext(sslContext))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
            .responseTimeout(Duration.ofSeconds(30))
            .doOnConnected(conn -> conn
                .addHandlerLast(new ReadTimeoutHandler(30, TimeUnit.SECONDS))
                .addHandlerLast(new WriteTimeoutHandler(30, TimeUnit.SECONDS))
            );

        return WebClient.builder()
            .filter(correlationIdFilter())
            .clientConnector(new ReactorClientHttpConnector(httpClient));
    }

    private ExchangeFilterFunction correlationIdFilter() {
        return ExchangeFilterFunction.ofRequestProcessor(request -> {
            String correlationId = MDC.get("correlationId");
            if (correlationId != null) {
                return Mono.just(ClientRequest.from(request)
                    .header("X-Correlation-ID", correlationId)
                    .build());
            }
            return Mono.just(request);
        });
    }

    @Bean("mtnWebClient")
    public WebClient mtnWebClient(WebClient.Builder builder, MtnMomoConfig config) throws SSLException {
        return buildProviderWebClient(builder, config.getBaseUrl(), config.getTimeoutSeconds());
    }

    @Bean("orangeWebClient")
    public WebClient orangeWebClient(WebClient.Builder builder, OrangeMoneyConfig config) throws SSLException {
        return buildProviderWebClient(builder, config.getBaseUrl(), config.getTimeoutSeconds());
    }

    @Bean("fineractWebClient")
    public WebClient fineractWebClient(WebClient.Builder builder, FineractConfig config) throws SSLException {
        return buildProviderWebClient(builder, config.getUrl(), config.getTimeoutSeconds())
            .mutate()
            .defaultHeader("Fineract-Platform-TenantId", config.getTenant())
            .build();
    }

    @Bean("cinetpayWebClient")
    public WebClient cinetpayWebClient(WebClient.Builder builder, CinetPayConfig config) throws SSLException {
        return buildProviderWebClient(builder, config.getBaseUrl(), config.getTimeoutSeconds());
    }

    private WebClient buildProviderWebClient(WebClient.Builder builder, String baseUrl, int timeoutSeconds) throws SSLException {
        SslContextBuilder sslBuilder = SslContextBuilder.forClient();
        if (insecureSsl) {
            sslBuilder.trustManager(InsecureTrustManagerFactory.INSTANCE);
        }
        SslContext sslContext = sslBuilder.build();

        HttpClient httpClient = HttpClient.create()
            .secure(t -> t.sslContext(sslContext))
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
            .responseTimeout(Duration.ofSeconds(timeoutSeconds))
            .doOnConnected(conn -> conn
                .addHandlerLast(new ReadTimeoutHandler(timeoutSeconds, TimeUnit.SECONDS))
                .addHandlerLast(new WriteTimeoutHandler(timeoutSeconds, TimeUnit.SECONDS))
            );

        return WebClient.builder()
            .filter(correlationIdFilter())
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .baseUrl(baseUrl)
            .build();
    }
}
