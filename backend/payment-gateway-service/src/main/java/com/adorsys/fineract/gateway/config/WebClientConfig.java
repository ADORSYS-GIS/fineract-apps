package com.adorsys.fineract.gateway.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import javax.net.ssl.SSLException;
import org.slf4j.MDC;
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
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() throws SSLException {
        SslContext sslContext = SslContextBuilder
            .forClient()
            .trustManager(InsecureTrustManagerFactory.INSTANCE)
            .build();

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
    public WebClient mtnWebClient(WebClient.Builder builder, MtnMomoConfig config) {
        return builder
            .baseUrl(config.getBaseUrl())
            .build();
    }

    @Bean("orangeWebClient")
    public WebClient orangeWebClient(WebClient.Builder builder, OrangeMoneyConfig config) {
        return builder
            .baseUrl(config.getBaseUrl())
            .build();
    }

    @Bean("fineractWebClient")
    public WebClient fineractWebClient(WebClient.Builder builder, FineractConfig config) {
        return builder
            .baseUrl(config.getUrl())
            .defaultHeader("Fineract-Platform-TenantId", config.getTenant())
            .build();
    }

    @Bean("cinetpayWebClient")
    public WebClient cinetpayWebClient(WebClient.Builder builder, CinetPayConfig config) {
        return builder
            .baseUrl(config.getBaseUrl())
            .build();
    }
}
