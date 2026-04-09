package com.adorsys.fineract.asset.dto;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Day count convention used for accrued interest calculations on bond assets. The convention
 * determines two things: the day count numerator (how many days are counted between two dates)
 * and the denominator basis (360 or 365). Together they control the fraction of the annual
 * interest rate that accrues over any given period.
 *
 * <p>In the CEMAC sovereign debt market:</p>
 * <ul>
 *   <li>{@code ACT_360} is standard for BTA (T-Bill / DISCOUNT) instruments.</li>
 *   <li>{@code ACT_365} is standard for OTA (T-Bond / COUPON) instruments.</li>
 *   <li>{@code THIRTY_360} is provided for compatibility with some European corporate bonds.</li>
 * </ul>
 *
 * <p>The convention is stored per-asset and used whenever an accrued interest or coupon
 * amount is computed via the {@link #daysBetween(LocalDate, LocalDate)} helper.</p>
 */
public enum DayCountConvention {
    /**
     * Actual/360: the day count numerator is the actual number of calendar days between
     * two dates; the denominator is always 360. Standard for BTA (T-Bills) in CEMAC.
     * Results in slightly higher accrued interest per day compared to ACT_365.
     */
    ACT_360(360),
    /**
     * Actual/365: the day count numerator is the actual number of calendar days between
     * two dates; the denominator is always 365. Standard for OTA (T-Bonds) in CEMAC.
     */
    ACT_365(365),
    /**
     * 30/360: each month is treated as exactly 30 days (days are capped at 30);
     * the denominator is 360. Used in some European corporate and municipal bond markets.
     * Simplifies calculations by eliminating variation caused by month-length differences.
     */
    THIRTY_360(360);

    private final int basis;

    DayCountConvention(int basis) {
        this.basis = basis;
    }

    /**
     * Returns the denominator used in interest calculations for this convention (360 or 365).
     * Divide the day count numerator by this value to obtain the accrual fraction of a year.
     */
    public int getBasis() {
        return basis;
    }

    /**
     * Computes the day count numerator between {@code start} (inclusive) and {@code end} (exclusive)
     * according to this convention's rules.
     *
     * <ul>
     *   <li>For {@code ACT_360} and {@code ACT_365}: returns the actual calendar day count.</li>
     *   <li>For {@code THIRTY_360}: days in both months are capped at 30, then the result is
     *       {@code (Y2 - Y1) × 360 + (M2 - M1) × 30 + (D2 - D1)}.</li>
     * </ul>
     */
    public long daysBetween(LocalDate start, LocalDate end) {
        if (this == THIRTY_360) {
            int d1 = Math.min(start.getDayOfMonth(), 30);
            int d2 = Math.min(end.getDayOfMonth(), 30);
            return (long)(end.getYear() - start.getYear()) * 360
                    + (long)(end.getMonthValue() - start.getMonthValue()) * 30
                    + (d2 - d1);
        }
        return ChronoUnit.DAYS.between(start, end);
    }
}
