package com.adorsys.fineract.registration.service;

import com.adorsys.fineract.registration.dto.LimitsResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

class LimitsServiceTest {

    private final LimitsService limitsService = new LimitsService();

    @Test
    @DisplayName("should return tier 1 limits")
    void shouldReturnTier1Limits() {
        // When
        LimitsResponse limits = limitsService.getLimits(1);

        // Then
        assertThat(limits.getTier()).isEqualTo(1);
        assertThat(limits.getTierName()).isEqualTo("Basic");
        assertThat(limits.getLimits().getDailyDeposit()).isEqualByComparingTo(BigDecimal.valueOf(50000));
        assertThat(limits.getLimits().getDailyWithdrawal()).isEqualByComparingTo(BigDecimal.valueOf(25000));
        assertThat(limits.getLimits().getMonthlyDeposit()).isEqualByComparingTo(BigDecimal.valueOf(200000));
        assertThat(limits.getLimits().getMonthlyWithdrawal()).isEqualByComparingTo(BigDecimal.valueOf(100000));
    }

    @Test
    @DisplayName("should return tier 2 limits")
    void shouldReturnTier2Limits() {
        // When
        LimitsResponse limits = limitsService.getLimits(2);

        // Then
        assertThat(limits.getTier()).isEqualTo(2);
        assertThat(limits.getTierName()).isEqualTo("Standard");
        assertThat(limits.getLimits().getDailyDeposit()).isEqualByComparingTo(BigDecimal.valueOf(500000));
        assertThat(limits.getLimits().getDailyWithdrawal()).isEqualByComparingTo(BigDecimal.valueOf(200000));
    }

    @Test
    @DisplayName("should return tier 3 limits")
    void shouldReturnTier3Limits() {
        // When
        LimitsResponse limits = limitsService.getLimits(3);

        // Then
        assertThat(limits.getTier()).isEqualTo(3);
        assertThat(limits.getTierName()).isEqualTo("Premium");
        assertThat(limits.getLimits().getDailyDeposit()).isEqualByComparingTo(BigDecimal.valueOf(2000000));
        assertThat(limits.getLimits().getDailyWithdrawal()).isEqualByComparingTo(BigDecimal.valueOf(1000000));
    }

    @ParameterizedTest
    @ValueSource(ints = {0, -1, 4, 100})
    @DisplayName("should return tier 1 limits for invalid tier numbers")
    void shouldReturnTier1ForInvalidTiers(int invalidTier) {
        // When
        LimitsResponse limits = limitsService.getLimits(invalidTier);

        // Then
        assertThat(limits.getTier()).isEqualTo(1);
        assertThat(limits.getTierName()).isEqualTo("Basic");
    }

    @Test
    @DisplayName("should include currency in response")
    void shouldIncludeCurrency() {
        // When
        LimitsResponse limits = limitsService.getLimits(1);

        // Then
        assertThat(limits.getCurrency()).isEqualTo("XAF");
    }
}
