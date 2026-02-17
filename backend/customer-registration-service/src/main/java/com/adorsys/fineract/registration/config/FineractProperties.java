package com.adorsys.fineract.registration.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "fineract")
@Getter
@Setter
@Validated
public class FineractProperties {

    @NotBlank
    private String url;

    @NotBlank
    private String tenant;

    @NotNull
    private Auth auth;

    @NotNull
    private Defaults defaults;

    private boolean verifySsl;

    private Map<String, Integer> codes;

    @Data
    public static class Auth {
        @NotBlank
        private String type;
        private String tokenUrl;
        private String clientId;
        private String clientSecret;
        private String grantType;
        private String oauthUsername;
        private String oauthPassword;
        private String username;
        private String password;
    }

    @Data
    public static class Defaults {
        private int officeId;
        private int savingsProductId;
        private int genderId;
        private int legalFormId;
        @NotBlank
        private String locale;
        @NotBlank
        private String dateFormat;
        private String postalCode;
    }
}
