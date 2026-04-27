package com.adorsys.fineract.gateway.filter;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Guards all /api/callbacks/** endpoints with two optional, per-provider controls:
 * 1. Callback secret (X-Callback-Secret header)
 * 2. IP whitelist
 *
 * Decision rules (applied in order):
 * - No guards configured for this provider → drop callback (200 OK), rely on scheduler.
 * - Secret configured but header missing/wrong → drop callback (200 OK), rely on scheduler.
 * - IP list configured but client IP not in list → drop callback (200 OK), rely on scheduler.
 * - All configured guards pass → forward to controller for processing.
 *
 * The stale-transaction scheduler is always the safety net; callbacks are an optimisation
 * that is opt-in by configuring at least one guard per provider.
 *
 * IP extraction: prefers X-Real-IP (set by nginx Ingress, not overridable by clients through
 * the Ingress) over remoteAddr. Only meaningful when deployed behind a trusted nginx proxy that
 * strips client-supplied X-Real-IP and sets its own.
 */
@Slf4j
@Component
@Order(1)
public class CallbackGuardFilter extends OncePerRequestFilter {

    static final String SECRET_HEADER = "X-Callback-Secret";
    private static final String REAL_IP_HEADER = "X-Real-IP";

    private final PaymentMetrics paymentMetrics;

    private final String mtnSecret;
    private final String orangeSecret;
    private final String cinetpaySecret;
    private final String nokashSecret;

    private final Set<String> mtnIps;
    private final Set<String> orangeIps;
    private final Set<String> cinetpayIps;
    private final Set<String> nokashIps;

    public CallbackGuardFilter(
            PaymentMetrics paymentMetrics,
            @Value("${mtn.momo.callback-secret:}") String mtnSecret,
            @Value("${orange.money.callback-secret:}") String orangeSecret,
            @Value("${cinetpay.callback-secret:}") String cinetpaySecret,
            @Value("${nokash.callback-secret:}") String nokashSecret,
            @Value("${app.callbacks.ip-whitelist.mtn:}") String mtnIpList,
            @Value("${app.callbacks.ip-whitelist.orange:}") String orangeIpList,
            @Value("${app.callbacks.ip-whitelist.cinetpay:}") String cinetpayIpList,
            @Value("${app.callbacks.ip-whitelist.nokash:}") String nokashIpList) {
        this.paymentMetrics = paymentMetrics;
        this.mtnSecret = mtnSecret;
        this.orangeSecret = orangeSecret;
        this.cinetpaySecret = cinetpaySecret;
        this.nokashSecret = nokashSecret;
        this.mtnIps = parseIpList(mtnIpList);
        this.orangeIps = parseIpList(orangeIpList);
        this.cinetpayIps = parseIpList(cinetpayIpList);
        this.nokashIps = parseIpList(nokashIpList);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Trailing slash required to avoid matching /api/callbacks-admin or similar paths.
        return !request.getRequestURI().startsWith("/api/callbacks/");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path = request.getRequestURI();
        String configuredSecret = getSecretForPath(path);
        Set<String> allowedIps = getIpsForPath(path);
        PaymentProvider provider = getProviderForPath(path);

        boolean secretConfigured = StringUtils.hasText(configuredSecret);
        boolean ipConfigured = !allowedIps.isEmpty();

        if (!secretConfigured && !ipConfigured) {
            if (provider == null) {
                // Path is under /api/callbacks/ but matches no known provider.
                log.warn("Callback received for unrecognised path={} — dropping", path);
            } else {
                log.info("No guards configured for callback path={} — dropping, relying on scheduler", path);
                paymentMetrics.incrementCallbackRejected(provider, "no_guards_configured");
            }
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        if (secretConfigured) {
            String incoming = request.getHeader(SECRET_HEADER);
            if (!secretsEqual(configuredSecret, incoming)) {
                log.warn("Callback dropped: secret mismatch for path={}", path);
                if (provider != null) {
                    paymentMetrics.incrementCallbackRejected(provider, "invalid_secret");
                }
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }

        if (ipConfigured) {
            String clientIp = extractClientIp(request);
            if (!allowedIps.contains(clientIp)) {
                log.warn("Callback dropped: IP {} not whitelisted for path={}", clientIp, path);
                if (provider != null) {
                    paymentMetrics.incrementCallbackRejected(provider, "ip_not_whitelisted");
                }
                response.setStatus(HttpServletResponse.SC_OK);
                return;
            }
        }

        chain.doFilter(request, response);
    }

    /**
     * Constant-time secret comparison to prevent timing oracle attacks.
     * MessageDigest.isEqual compares all bytes without short-circuiting on first mismatch.
     */
    private static boolean secretsEqual(String configured, String incoming) {
        byte[] a = configured.getBytes(StandardCharsets.UTF_8);
        byte[] b = (incoming != null ? incoming : "").getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(a, b);
    }

    /**
     * Extracts the client IP. Prefers X-Real-IP (set by nginx Ingress and not overridable
     * by clients through the Ingress) over remoteAddr (which Spring rewrites from
     * X-Forwarded-For when forward-headers-strategy=framework is active).
     */
    private static String extractClientIp(HttpServletRequest request) {
        String realIp = request.getHeader(REAL_IP_HEADER);
        return (StringUtils.hasText(realIp)) ? realIp.trim() : request.getRemoteAddr();
    }

    private String getSecretForPath(String path) {
        if (path.contains("/mtn/"))      return mtnSecret;
        if (path.contains("/orange/"))   return orangeSecret;
        if (path.contains("/cinetpay/")) return cinetpaySecret;
        if (path.contains("/nokash/"))   return nokashSecret;
        return null;
    }

    private Set<String> getIpsForPath(String path) {
        if (path.contains("/mtn/"))      return mtnIps;
        if (path.contains("/orange/"))   return orangeIps;
        if (path.contains("/cinetpay/")) return cinetpayIps;
        if (path.contains("/nokash/"))   return nokashIps;
        return Collections.emptySet();
    }

    private PaymentProvider getProviderForPath(String path) {
        if (path.contains("/mtn/"))      return PaymentProvider.MTN_MOMO;
        if (path.contains("/orange/"))   return PaymentProvider.ORANGE_MONEY;
        if (path.contains("/cinetpay/")) return PaymentProvider.CINETPAY;
        if (path.contains("/nokash/"))   return PaymentProvider.NOKASH;
        return null;
    }

    private static Set<String> parseIpList(String ipList) {
        if (!StringUtils.hasText(ipList)) return Collections.emptySet();
        return Stream.of(ipList.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toUnmodifiableSet());
    }
}
