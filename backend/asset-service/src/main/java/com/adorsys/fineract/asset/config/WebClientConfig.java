package com.adorsys.fineract.asset.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.ssl.SslContext;
import io.netty.handler.ssl.SslContextBuilder;
import io.netty.handler.ssl.util.InsecureTrustManagerFactory;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import javax.net.ssl.SSLException;
import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * WebClient configuration for HTTP calls to Fineract.
 */
@Slf4j
@Configuration
public class WebClientConfig {

    @Value("${app.fineract.ssl-verify:true}")
    private boolean sslVerify;

    @Bean
    public WebClient.Builder webClientBuilder() throws SSLException {
        HttpClient httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
            .responseTimeout(Duration.ofSeconds(30))
            .doOnConnected(conn -> conn
                .addHandlerLast(new ReadTimeoutHandler(30, TimeUnit.SECONDS))
                .addHandlerLast(new WriteTimeoutHandler(30, TimeUnit.SECONDS))
            );

        if (!sslVerify) {
            log.warn("SSL verification DISABLED for Fineract WebClient — do not use in production");
            SslContext sslContext = SslContextBuilder
                .forClient()
                .trustManager(InsecureTrustManagerFactory.INSTANCE)
                .build();
            httpClient = httpClient.secure(t -> t.sslContext(sslContext));
        }

        return WebClient.builder()
            .clientConnector(new ReactorClientHttpConnector(httpClient));
    }

    @Bean("fineractWebClient")
    public WebClient fineractWebClient(WebClient.Builder builder, FineractConfig config) {
        return builder
            .baseUrl(config.getUrl())
            .defaultHeader("Fineract-Platform-TenantId", config.getTenant())
            .build();
    }
}
