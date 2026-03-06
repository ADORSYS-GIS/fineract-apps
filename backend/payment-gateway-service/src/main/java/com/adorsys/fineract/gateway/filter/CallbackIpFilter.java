package com.adorsys.fineract.gateway.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * IP whitelist filter for callback endpoints.
 * Restricts callback access to known payment provider IP addresses.
 * Disabled by default (for dev/test); enable via app.callbacks.ip-whitelist.enabled=true.
 */
@Slf4j
@Component
public class CallbackIpFilter extends OncePerRequestFilter {

    private final boolean enabled;
    private final Set<String> mtnIps;
    private final Set<String> orangeIps;
    private final Set<String> cinetpayIps;

    public CallbackIpFilter(
            @Value("${app.callbacks.ip-whitelist.enabled:false}") boolean enabled,
            @Value("${app.callbacks.ip-whitelist.mtn:}") String mtnIpList,
            @Value("${app.callbacks.ip-whitelist.orange:}") String orangeIpList,
            @Value("${app.callbacks.ip-whitelist.cinetpay:}") String cinetpayIpList) {
        this.enabled = enabled;
        this.mtnIps = parseIpList(mtnIpList);
        this.orangeIps = parseIpList(orangeIpList);
        this.cinetpayIps = parseIpList(cinetpayIpList);

        if (enabled) {
            log.info("Callback IP whitelist enabled: mtn={} IPs, orange={} IPs, cinetpay={} IPs",
                mtnIps.size(), orangeIps.size(), cinetpayIps.size());
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !enabled || !request.getRequestURI().startsWith("/api/callbacks");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String clientIp = getIpAddress(request);
        String path = request.getRequestURI();

        Set<String> allowedIps = getWhitelistForPath(path);

        if (allowedIps.isEmpty() || allowedIps.contains(clientIp)) {
            filterChain.doFilter(request, response);
        } else {
            log.warn("Callback IP rejected: ip={}, path={}", clientIp, path);
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        }
    }

    private Set<String> getWhitelistForPath(String path) {
        if (path.contains("/mtn/")) return mtnIps;
        if (path.contains("/orange/")) return orangeIps;
        if (path.contains("/cinetpay/")) return cinetpayIps;
        // Unknown provider path — allow (signature validation is the second line of defense)
        return Collections.emptySet();
    }

    private String getIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }

    private static Set<String> parseIpList(String ipList) {
        if (!StringUtils.hasText(ipList)) {
            return Collections.emptySet();
        }
        return Stream.of(ipList.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .collect(Collectors.toUnmodifiableSet());
    }
}
