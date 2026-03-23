package com.adorsys.fineract.registration.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

@ConfigurationProperties(prefix = "keycloak")
public record KeycloakProperties(
    @DefaultValue("http://localhost:8080") String url,
    @DefaultValue("fineract") String realm,
    @DefaultValue("master") String adminRealm,
    String clientId,
    String clientSecret
) {}
