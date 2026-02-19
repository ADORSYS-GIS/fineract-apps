package com.adorsys.fineract.e2e.support;

import org.testcontainers.containers.wait.strategy.AbstractWaitStrategy;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.X509Certificate;
import java.time.Duration;
import javax.net.ssl.SSLContext;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

/**
 * Custom Testcontainers wait strategy for Apache Fineract.
 * Polls the HTTPS health endpoint with SSL verification disabled
 * (Fineract uses a self-signed certificate).
 */
public class FineractWaitStrategy extends AbstractWaitStrategy {

    private static final Duration POLL_INTERVAL = Duration.ofSeconds(5);

    @Override
    protected void waitUntilReady() {
        var host = waitStrategyTarget.getHost();
        var port = waitStrategyTarget.getMappedPort(8443);
        var healthUrl = "https://" + host + ":" + port
                + "/fineract-provider/actuator/health";

        HttpClient client = createInsecureHttpClient();

        var deadline = System.currentTimeMillis() + startupTimeout.toMillis();
        while (System.currentTimeMillis() < deadline) {
            try {
                var request = HttpRequest.newBuilder()
                        .uri(URI.create(healthUrl))
                        .timeout(Duration.ofSeconds(5))
                        .GET()
                        .build();
                var response = client.send(request,
                        HttpResponse.BodyHandlers.ofString());
                if (response.statusCode() == 200
                        && response.body().contains("UP")) {
                    return;
                }
            } catch (IOException | InterruptedException e) {
                // Fineract not ready yet
            }
            try {
                Thread.sleep(POLL_INTERVAL.toMillis());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new RuntimeException("Interrupted waiting for Fineract", e);
            }
        }
        throw new RuntimeException(
                "Fineract did not become healthy at " + healthUrl
                + " within " + startupTimeout);
    }

    private static HttpClient createInsecureHttpClient() {
        try {
            TrustManager[] trustAll = {new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() { return new X509Certificate[0]; }
                public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                public void checkServerTrusted(X509Certificate[] certs, String authType) {}
            }};
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, trustAll, new java.security.SecureRandom());
            return HttpClient.newBuilder()
                    .sslContext(sslContext)
                    .connectTimeout(Duration.ofSeconds(5))
                    .build();
        } catch (NoSuchAlgorithmException | KeyManagementException e) {
            throw new RuntimeException("Failed to create insecure HTTP client", e);
        }
    }
}
