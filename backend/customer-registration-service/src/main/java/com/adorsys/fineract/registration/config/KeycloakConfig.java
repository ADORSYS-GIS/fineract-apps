package com.adorsys.fineract.registration.config;

import lombok.Getter;
import lombok.Setter;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@ConfigurationProperties(prefix = "keycloak")
@Getter
@Setter
public class KeycloakConfig {

    private String url;
    private String realm;
    private String adminRealm = "master";
    private String clientId;
    private String clientSecret;
    private String selfServiceGroup = "/self-service-customers";

    private String grantType = OAuth2Constants.CLIENT_CREDENTIALS;
    private String adminUsername;
    private String adminPassword;

    @Bean
    public Keycloak keycloakAdminClient() {
        log.info("Configuring Keycloak admin client with grant type: {}", grantType);
        KeycloakBuilder builder = KeycloakBuilder.builder()
                .serverUrl(url)
                .realm(adminRealm)
                .grantType(grantType)
                .clientId(clientId)
                .clientSecret(clientSecret);

        if (OAuth2Constants.PASSWORD.equals(grantType)) {
            if (adminUsername == null || adminPassword == null) {
                throw new IllegalStateException("keycloak.admin-username and keycloak.admin-password are required for password grant type");
            }
            builder.username(adminUsername).password(adminPassword);
        }

        return builder.build();
    }
}
