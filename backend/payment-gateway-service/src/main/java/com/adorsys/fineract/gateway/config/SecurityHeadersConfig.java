package com.adorsys.fineract.gateway.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Security headers configuration to protect against common web vulnerabilities.
 */
@Configuration
public class SecurityHeadersConfig {

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityHeadersFilter securityHeadersFilter() {
        return new SecurityHeadersFilter();
    }

    public static class SecurityHeadersFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain) throws ServletException, IOException {

            // Prevent MIME type sniffing
            response.setHeader("X-Content-Type-Options", "nosniff");

            // Prevent clickjacking
            response.setHeader("X-Frame-Options", "DENY");

            // XSS protection (legacy, but still useful for older browsers)
            response.setHeader("X-XSS-Protection", "1; mode=block");

            // Strict Transport Security (HTTPS only)
            response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

            // Referrer policy
            response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

            // Content Security Policy
            response.setHeader("Content-Security-Policy",
                    "default-src 'self'; " +
                    "script-src 'self'; " +
                    "style-src 'self' 'unsafe-inline'; " +
                    "img-src 'self' data:; " +
                    "font-src 'self'; " +
                    "connect-src 'self'; " +
                    "frame-ancestors 'none'");

            // Permissions policy
            response.setHeader("Permissions-Policy",
                    "geolocation=(), " +
                    "microphone=(), " +
                    "camera=(), " +
                    "payment=(), " +
                    "usb=()");

            // Cache control for API responses (no caching of sensitive data)
            if (request.getRequestURI().startsWith("/api/")) {
                response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
                response.setHeader("Pragma", "no-cache");
                response.setHeader("Expires", "0");
            }

            filterChain.doFilter(request, response);
        }
    }
}
