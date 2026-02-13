package com.adorsys.fineract.registration.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class TokenValidationService {

    public void validateToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Authentication failed");
        }

        Object principal = authentication.getPrincipal();
        if (!(principal instanceof Jwt)) {
            throw new SecurityException("Invalid token type");
        }
    }

    public void authorizeWithRole(String role) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Authentication failed");
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        boolean isAuthorized = authorities.stream()
                .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(role));

        if (!isAuthorized) {
            throw new SecurityException("User does not have the required role: " + role);
        }
    }
}
