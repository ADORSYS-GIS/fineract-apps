package com.adorsys.fineract.asset.dto;

import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class CreateAssetRequestTest {

    private static CreateAssetRequest couponBondRequest(
            LocalDate issueDate, LocalDate nextCouponDate, LocalDate maturityDate) {
        return new CreateAssetRequest(
                "Test Bond", "TST", null, null, null,
                AssetCategory.BONDS,
                new BigDecimal("10000"), null,
                new BigDecimal("500"), 0,
                new BigDecimal("0.005"), null,
                new BigDecimal("11000"), new BigDecimal("9500"),
                1L,
                null, null, null, null, null, null,
                BondType.COUPON, DayCountConvention.ACT_365, null,
                "Test Issuer", null,
                maturityDate, issueDate,
                new BigDecimal("5.80"), 6, nextCouponDate,
                null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                false, null
        );
    }

    private static CreateAssetRequest discountBondRequest(
            LocalDate issueDate, LocalDate maturityDate) {
        return new CreateAssetRequest(
                "Test Bond", "TST", null, null, null,
                AssetCategory.BONDS,
                new BigDecimal("9500"), new BigDecimal("10000"),
                new BigDecimal("500"), 0,
                new BigDecimal("0.005"), null,
                new BigDecimal("11000"), new BigDecimal("9500"),
                1L,
                null, null, null, null, null, null,
                BondType.DISCOUNT, DayCountConvention.ACT_360, null,
                "Test Issuer", null,
                maturityDate, issueDate,
                null, null, null,
                null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                false, null
        );
    }

    // ── isNextCouponDateAfterIssueDate ──

    @Test
    void shouldPass_whenNextCouponIsAfterIssueDate() {
        LocalDate issue = LocalDate.now();
        LocalDate next = issue.plusMonths(6);

        var req = couponBondRequest(issue, next, next.plusYears(5));

        assertTrue(req.isNextCouponDateAfterIssueDate());
    }

    @Test
    void shouldFail_whenNextCouponEqualsIssueDate() {
        LocalDate date = LocalDate.now().plusMonths(6);

        var req = couponBondRequest(date, date, date.plusYears(5));

        assertFalse(req.isNextCouponDateAfterIssueDate());
    }

    @Test
    void shouldFail_whenNextCouponBeforeIssueDate() {
        LocalDate issue = LocalDate.now().plusMonths(6);
        LocalDate next = LocalDate.now();

        var req = couponBondRequest(issue, next, issue.plusYears(5));

        assertFalse(req.isNextCouponDateAfterIssueDate());
    }

    @Test
    void shouldPass_whenIssueDateIsNull_forNextCouponCheck() {
        var req = couponBondRequest(null, LocalDate.now().plusMonths(6), LocalDate.now().plusYears(5));

        assertTrue(req.isNextCouponDateAfterIssueDate());
    }

    @Test
    void shouldPass_whenNextCouponDateIsNull_forNextCouponCheck() {
        var req = couponBondRequest(LocalDate.now(), null, LocalDate.now().plusYears(5));

        assertTrue(req.isNextCouponDateAfterIssueDate());
    }

    @Test
    void shouldPass_forDiscountBond_regardlessOfDates_forNextCouponCheck() {
        LocalDate issue = LocalDate.now().plusMonths(6);

        var req = discountBondRequest(issue, issue.plusYears(1));

        assertTrue(req.isNextCouponDateAfterIssueDate());
    }

    // ── isMaturityDateAfterIssueDate ──

    @Test
    void shouldPass_whenMaturityIsAfterIssueDate() {
        LocalDate issue = LocalDate.now();

        var req = couponBondRequest(issue, issue.plusMonths(6), issue.plusYears(5));

        assertTrue(req.isMaturityDateAfterIssueDate());
    }

    @Test
    void shouldFail_whenMaturityEqualsIssueDate() {
        LocalDate date = LocalDate.now();

        var req = couponBondRequest(date, date.plusMonths(6), date);

        assertFalse(req.isMaturityDateAfterIssueDate());
    }

    @Test
    void shouldFail_whenMaturityBeforeIssueDate() {
        LocalDate issue = LocalDate.now().plusYears(1);
        LocalDate maturity = LocalDate.now();

        var req = couponBondRequest(issue, issue.plusMonths(6), maturity);

        assertFalse(req.isMaturityDateAfterIssueDate());
    }

    @Test
    void shouldPass_whenIssueDateIsNull_forMaturityCheck() {
        var req = couponBondRequest(null, LocalDate.now().plusMonths(6), LocalDate.now().plusYears(5));

        assertTrue(req.isMaturityDateAfterIssueDate());
    }

    @Test
    void shouldPass_whenMaturityDateIsNull_forMaturityCheck() {
        var req = couponBondRequest(LocalDate.now(), LocalDate.now().plusMonths(6), null);

        assertTrue(req.isMaturityDateAfterIssueDate());
    }

    @Test
    void shouldFail_forDiscountBond_whenMaturityEqualsIssueDate() {
        LocalDate date = LocalDate.now();

        var req = discountBondRequest(date, date);

        assertFalse(req.isMaturityDateAfterIssueDate());
    }

    // ── isMaturityDateAfterNextCouponDate ──

    @Test
    void shouldPass_whenMaturityIsAfterNextCouponDate() {
        LocalDate next = LocalDate.now().plusMonths(6);

        var req = couponBondRequest(null, next, next.plusYears(5));

        assertTrue(req.isMaturityDateAfterNextCouponDate());
    }

    @Test
    void shouldFail_whenMaturityEqualsNextCouponDate() {
        LocalDate date = LocalDate.now().plusMonths(6);

        var req = couponBondRequest(null, date, date);

        assertFalse(req.isMaturityDateAfterNextCouponDate());
    }

    @Test
    void shouldFail_whenMaturityBeforeNextCouponDate() {
        LocalDate next = LocalDate.now().plusYears(2);
        LocalDate maturity = LocalDate.now().plusYears(1);

        var req = couponBondRequest(null, next, maturity);

        assertFalse(req.isMaturityDateAfterNextCouponDate());
    }

    @Test
    void shouldPass_whenNextCouponDateIsNull_forMaturityVsCouponCheck() {
        var req = couponBondRequest(null, null, LocalDate.now().plusYears(5));

        assertTrue(req.isMaturityDateAfterNextCouponDate());
    }

    @Test
    void shouldPass_whenMaturityDateIsNull_forMaturityVsCouponCheck() {
        var req = couponBondRequest(null, LocalDate.now().plusMonths(6), null);

        assertTrue(req.isMaturityDateAfterNextCouponDate());
    }

    @Test
    void shouldPass_forDiscountBond_regardlessOfDates_forMaturityVsCouponCheck() {
        LocalDate maturity = LocalDate.now().plusMonths(1);

        var req = discountBondRequest(null, maturity);

        assertTrue(req.isMaturityDateAfterNextCouponDate());
    }
}
