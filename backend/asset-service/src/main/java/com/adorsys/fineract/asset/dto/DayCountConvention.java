package com.adorsys.fineract.asset.dto;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/** Day count convention for interest accrual calculations. */
public enum DayCountConvention {
    /** Actual days / 360. Standard for BTA (T-Bills) in CEMAC. */
    ACT_360(360),
    /** Actual days / 365. Standard for OTA (T-Bonds) in CEMAC. */
    ACT_365(365),
    /** 30 days per month / 360. Used in some European bond markets. */
    THIRTY_360(360);

    private final int basis;

    DayCountConvention(int basis) {
        this.basis = basis;
    }

    /** Returns the denominator used in interest calculations (360 or 365). */
    public int getBasis() {
        return basis;
    }

    /**
     * Compute the day count numerator between two dates using this convention.
     * For ACT_360 and ACT_365: actual calendar days.
     * For THIRTY_360: (Y2-Y1)*360 + (M2-M1)*30 + (D2-D1) with days capped at 30.
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
