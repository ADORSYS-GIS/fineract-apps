package com.adorsys.fineract.registration.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "fineract")
public class FineractProperties {

    private String url;
    private String tenant;
    private String authType;
    private String tokenUrl;
    private String clientId;
    private String clientSecret;
    private String grantType;
    private String oauthUsername;
    private String oauthPassword;
    private String username;
    private String password;
    private int defaultOfficeId;
    private int defaultSavingsProductId;
    private int defaultGenderId;
    private boolean verifySsl;
    private int defaultLegalFormId;
    private String defaultLocale;
    private String defaultDateFormat;
    private String defaultPostalCode;
    private Map<String, Integer> codes;

    // Getters and Setters

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTenant() {
        return tenant;
    }

    public void setTenant(String tenant) {
        this.tenant = tenant;
    }

    public String getAuthType() {
        return authType;
    }

    public void setAuthType(String authType) {
        this.authType = authType;
    }

    public String getTokenUrl() {
        return tokenUrl;
    }

    public void setTokenUrl(String tokenUrl) {
        this.tokenUrl = tokenUrl;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getGrantType() {
        return grantType;
    }

    public void setGrantType(String grantType) {
        this.grantType = grantType;
    }

    public String getOauthUsername() {
        return oauthUsername;
    }

    public void setOauthUsername(String oauthUsername) {
        this.oauthUsername = oauthUsername;
    }

    public String getOauthPassword() {
        return oauthPassword;
    }

    public void setOauthPassword(String oauthPassword) {
        this.oauthPassword = oauthPassword;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getDefaultOfficeId() {
        return defaultOfficeId;
    }

    public void setDefaultOfficeId(int defaultOfficeId) {
        this.defaultOfficeId = defaultOfficeId;
    }

    public int getDefaultSavingsProductId() {
        return defaultSavingsProductId;
    }

    public void setDefaultSavingsProductId(int defaultSavingsProductId) {
        this.defaultSavingsProductId = defaultSavingsProductId;
    }

    public int getDefaultGenderId() {
        return defaultGenderId;
    }

    public void setDefaultGenderId(int defaultGenderId) {
        this.defaultGenderId = defaultGenderId;
    }

    public boolean isVerifySsl() {
        return verifySsl;
    }

    public void setVerifySsl(boolean verifySsl) {
        this.verifySsl = verifySsl;
    }

    public int getDefaultLegalFormId() {
        return defaultLegalFormId;
    }

    public void setDefaultLegalFormId(int defaultLegalFormId) {
        this.defaultLegalFormId = defaultLegalFormId;
    }

    public String getDefaultLocale() {
        return defaultLocale;
    }

    public void setDefaultLocale(String defaultLocale) {
        this.defaultLocale = defaultLocale;
    }

    public String getDefaultDateFormat() {
        return defaultDateFormat;
    }

    public void setDefaultDateFormat(String defaultDateFormat) {
        this.defaultDateFormat = defaultDateFormat;
    }

    public String getDefaultPostalCode() {
        return defaultPostalCode;
    }

    public void setDefaultPostalCode(String defaultPostalCode) {
        this.defaultPostalCode = defaultPostalCode;
    }

    public Map<String, Integer> getCodes() {
        return codes;
    }

    public void setCodes(Map<String, Integer> codes) {
        this.codes = codes;
    }
}
