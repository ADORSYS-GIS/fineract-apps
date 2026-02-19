package com.adorsys.fineract.gateway.util;

import com.adorsys.fineract.gateway.dto.PaymentProvider;

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

    /**
     * Detect the mobile money provider based on Cameroon phone number prefix.
     *
     * MTN Cameroon prefixes: 67x, 650-654, 680-689
     * Orange Cameroon prefixes: 69x, 655-659
     *
     * @param phoneNumber Phone number (any format accepted, will be normalized)
     * @return The detected provider, or null if unrecognizable
     */
    public static PaymentProvider detectProvider(String phoneNumber) {
        String normalized = normalizePhoneNumber(phoneNumber);
        if (normalized == null || normalized.length() < 6) {
            return null;
        }

        // Strip 237 prefix to get the subscriber number
        String subscriber = normalized.startsWith("237") ? normalized.substring(3) : normalized;
        if (subscriber.length() < 3) {
            return null;
        }

        String prefix2 = subscriber.substring(0, 2);
        String prefix3 = subscriber.substring(0, 3);
        int prefix3Int;
        try {
            prefix3Int = Integer.parseInt(prefix3);
        } catch (NumberFormatException e) {
            return null;
        }

        // MTN: 67x, 650-654, 680-689
        if ("67".equals(prefix2)) {
            return PaymentProvider.MTN_MOMO;
        }
        if (prefix3Int >= 650 && prefix3Int <= 654) {
            return PaymentProvider.MTN_MOMO;
        }
        if (prefix3Int >= 680 && prefix3Int <= 689) {
            return PaymentProvider.MTN_MOMO;
        }

        // Orange: 69x, 655-659
        if ("69".equals(prefix2)) {
            return PaymentProvider.ORANGE_MONEY;
        }
        if (prefix3Int >= 655 && prefix3Int <= 659) {
            return PaymentProvider.ORANGE_MONEY;
        }

        return null;
    }
}
