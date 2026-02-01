package com.adorsys.fineract.gateway.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * WebClient configuration for making HTTP calls to payment providers and Fineract.
 */
@Configuration
public class WebClientConfig {

    @Bean
    public WebClient.Builder webClientBuilder() {
        HttpClient httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
            .responseTimeout(Duration.ofSeconds(30))
            .doOnConnected(conn -> conn
                .addHandlerLast(new ReadTimeoutHandler(30, TimeUnit.SECONDS))
                .addHandlerLast(new WriteTimeoutHandler(30, TimeUnit.SECONDS))
            );

        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(httpClient));
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
