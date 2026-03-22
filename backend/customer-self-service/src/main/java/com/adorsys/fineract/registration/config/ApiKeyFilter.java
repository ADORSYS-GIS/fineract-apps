package com.adorsys.fineract.registration.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * @deprecated BFF now sends per-user Keycloak JWT tokens instead of API keys.
 * The /customers/** endpoints are protected by standard JWT auth in SecurityConfig.
 * This filter is no longer registered as a Spring component.
 */
@Slf4j
@Deprecated
public class ApiKeyFilter extends OncePerRequestFilter {

    private final WebankProperties properties;

    public ApiKeyFilter(WebankProperties properties) {
        this.properties = properties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        if (request.getRequestURI().startsWith("/customers")) {
            String key = request.getHeader("X-CS-Api-Key");
            if (key != null && key.equals(properties.apiKey())) {
                var auth = new UsernamePasswordAuthenticationToken(
                    "bff-service", null,
                    List.of(new SimpleGrantedAuthority("ROLE_BFF_SERVICE"),
                            new SimpleGrantedAuthority("ROLE_KYC_MANAGER"))
                );
                SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("API key auth successful for /customers path");
            } else if (key != null) {
                log.warn("Invalid API key received for /customers path");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"UNAUTHORIZED\",\"message\":\"Invalid API key\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}
