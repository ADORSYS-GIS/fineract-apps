package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Snapshot of the current market pricing for a bond asset, computed at query time.
 *
 * <p>For DISCOUNT (BTA) bonds, accrued interest is always zero — the investor's return
 * is realised entirely as the spread between purchase price and face value at maturity.
 * For COUPON (OTA) bonds, accrued interest is calculated using ACT/365 from the last
 * coupon date to today using {@link AccruedInterestCalculator}.</p>
 *
 * <p>Null for non-bond assets.</p>
 */
@Schema(description = "Current market pricing snapshot for bond assets. Null for non-bond assets.")
public record CurrentMarketData(
        /**
         * LP bid price per unit (sell-side clean price), in XAF.
         * This is what sellers receive before adding accrued interest.
         */
        @Schema(description = "LP bid price per unit (clean price, sell-side), in XAF.")
        BigDecimal cleanPrice,

        /**
         * Accrued coupon interest per unit since the last coupon date, in XAF.
         * Computed using ACT/365 day count for OTA bonds. Zero for BTA (DISCOUNT) bonds.
         */
        @Schema(description = "Accrued coupon interest per unit (ACT/365 for OTA, 0 for BTA), in XAF.")
        BigDecimal accruedInterest,

        /**
         * Dirty price per unit = cleanPrice + accruedInterest, in XAF.
         * Equals cleanPrice for BTA bonds where accrued interest is zero.
         */
        @Schema(description = "Dirty price = cleanPrice + accruedInterest, in XAF.")
        BigDecimal dirtyPrice,

        /**
         * Effective annual yield based on the current ask price.
         * For COUPON bonds: (couponAmountPerUnit × periodsPerYear) / askPrice × 100.
         * For DISCOUNT bonds: derived from the discount-to-face-value spread over residual days.
         */
        @Schema(description = "Current yield: effective annual return based on ask price.")
        BigDecimal currentYield,

        /**
         * The date on which these market data values were computed (today's date).
         */
        @Schema(description = "Date on which this market data snapshot was computed.")
        LocalDate asOf
) {}
