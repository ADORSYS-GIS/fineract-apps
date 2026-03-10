package com.adorsys.fineract.gateway.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class PhoneNumberUtilsTest {

    @Test
    @DisplayName("should return null for null input")
    void nullInput_returnsNull() {
        assertThat(PhoneNumberUtils.normalizePhoneNumber(null)).isNull();
    }

    @Test
    @DisplayName("should strip spaces, dashes, and plus signs")
    void withSpecialChars_stripsAndNormalizes() {
        assertThat(PhoneNumberUtils.normalizePhoneNumber("+237 612-345-678"))
                .isEqualTo("237612345678");
    }

    @Test
    @DisplayName("should add country code when missing")
    void withoutCountryCode_addsPrefix() {
        assertThat(PhoneNumberUtils.normalizePhoneNumber("612345678"))
                .isEqualTo("237612345678");
    }

    @Test
    @DisplayName("should replace leading zero with country code")
    void withLeadingZero_replacesWithPrefix() {
        assertThat(PhoneNumberUtils.normalizePhoneNumber("0612345678"))
                .isEqualTo("237612345678");
    }

    @Test
    @DisplayName("should leave already normalized number unchanged")
    void alreadyNormalized_unchanged() {
        assertThat(PhoneNumberUtils.normalizePhoneNumber("237612345678"))
                .isEqualTo("237612345678");
    }
}
