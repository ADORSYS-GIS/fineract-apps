package com.adorsys.fineract.gateway.util;

/**
 * Shared phone number normalization utility for Cameroon format (237XXXXXXXXX).
 */
public final class PhoneNumberUtils {

    private PhoneNumberUtils() {
    }

    /**
     * Normalize phone number to Cameroon format: 237XXXXXXXXX.
     * Strips spaces, dashes, plus signs and ensures 237 country code prefix.
     */
    public static String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null) {
            return null;
        }

        String normalized = phoneNumber.replaceAll("[\\s\\-+]", "");

        if (!normalized.startsWith("237")) {
            if (normalized.startsWith("0")) {
                normalized = "237" + normalized.substring(1);
            } else {
                normalized = "237" + normalized;
            }
        }

        return normalized;
    }
}
