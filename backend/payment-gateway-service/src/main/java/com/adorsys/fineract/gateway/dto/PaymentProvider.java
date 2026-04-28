package com.adorsys.fineract.gateway.dto;

/**
 * Supported payment providers.
 */
public enum PaymentProvider {
    // Corresponds to Fineract payment type position 2 in asset-demo-config.yml
    MTN_MOMO("mtn_transfer", "MTN Mobile Money"),

    // Corresponds to Fineract payment type position 3 in asset-demo-config.yml
    ORANGE_MONEY("orange_transfer", "Orange Money"),

    CINETPAY("cinetpay", "CinetPay (Gateway)"),

    // Corresponds to Fineract payment type position 4 in asset-demo-config.yml
    NOKASH("nokash", "Nokash"),

    UBA_BANK("uba_bank_transfer", "UBA Bank Transfer"),
    AFRILAND_BANK("afriland_bank_transfer", "Afriland Bank Transfer");

    private final String code;
    private final String displayName;

    PaymentProvider(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static PaymentProvider fromCode(String code) {
        for (PaymentProvider provider : values()) {
            if (provider.code.equalsIgnoreCase(code)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("Unknown payment provider: " + code);
    }
}
