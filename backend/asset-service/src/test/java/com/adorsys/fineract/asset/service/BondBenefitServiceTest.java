package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.BondBenefitProjection;
import com.adorsys.fineract.asset.entity.Asset;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.activeBondAsset;
import static com.adorsys.fineract.asset.testutil.TestDataFactory.activeAsset;
import static org.junit.jupiter.api.Assertions.*;

class BondBenefitServiceTest {

    private BondBenefitService service;

    @BeforeEach
    void setUp() {
        service = new BondBenefitService();
    }

    // ── Purchase preview tests ──────────────────────────────────────────

    @Test
    void calculateForPurchase_happyPath_returnsAllFields() {
        Asset bond = activeBondAsset();
        // manualPrice=100 (faceValue), interestRate=5.80, couponFreq=6, maturity=+5y, nextCoupon=+6m
        BigDecimal units = new BigDecimal("10");
        BigDecimal investmentCost = new BigDecimal("1050"); // hypothetical cost

        BondBenefitProjection result = service.calculateForPurchase(bond, units, investmentCost);

        assertNotNull(result);
        assertEquals(bond.getManualPrice(), result.faceValue());
        assertEquals(bond.getInterestRate(), result.interestRate());
        assertEquals(bond.getCouponFrequencyMonths(), result.couponFrequencyMonths());
        assertEquals(bond.getMaturityDate(), result.maturityDate());
        assertEquals(bond.getNextCouponDate(), result.nextCouponDate());

        // couponPerPeriod = 10 * 100 * 5.80/100 * 6/12 = 10 * 100 * 0.058 * 0.5 = 29
        assertEquals(new BigDecimal("29"), result.couponPerPeriod());

        // 10 semi-annual payments over 5 years
        assertEquals(10, result.remainingCouponPayments());

        // totalCouponIncome = 29 * 10 = 290
        assertEquals(new BigDecimal("290"), result.totalCouponIncome());

        // principalAtMaturity = 10 * 100 = 1000
        assertEquals(new BigDecimal("1000"), result.principalAtMaturity());

        // investmentCost = 1050 (passed in)
        assertEquals(investmentCost, result.investmentCost());

        // totalProjectedReturn = 290 + 1000 = 1290
        assertEquals(new BigDecimal("1290"), result.totalProjectedReturn());

        // netProjectedProfit = 1290 - 1050 = 240
        assertEquals(new BigDecimal("240"), result.netProjectedProfit());

        // annualizedYieldPercent > 0
        assertNotNull(result.annualizedYieldPercent());
        assertTrue(result.annualizedYieldPercent().compareTo(BigDecimal.ZERO) > 0);

        // daysToMaturity > 0
        assertTrue(result.daysToMaturity() > 0);
    }

    @Test
    void calculateForPurchase_nonBondAsset_returnsNull() {
        Asset stock = activeAsset(); // category = STOCKS
        BigDecimal units = new BigDecimal("10");

        BondBenefitProjection result = service.calculateForPurchase(stock, units, new BigDecimal("1000"));

        assertNull(result);
    }

    @Test
    void calculateForPurchase_maturityInPast_returnsZeroedProjections() {
        Asset bond = activeBondAsset();
        bond.setMaturityDate(LocalDate.now().minusDays(1));
        bond.setNextCouponDate(LocalDate.now().minusMonths(6));
        BigDecimal units = new BigDecimal("10");
        BigDecimal investmentCost = new BigDecimal("1000");

        BondBenefitProjection result = service.calculateForPurchase(bond, units, investmentCost);

        assertNotNull(result);
        assertEquals(0, result.daysToMaturity());
        assertEquals(0, result.remainingCouponPayments());
        assertEquals(BigDecimal.ZERO, result.totalCouponIncome());
        assertEquals(BigDecimal.ZERO, result.annualizedYieldPercent());
    }

    @Test
    void calculateForPurchase_nullNextCouponDate_zeroRemainingPayments() {
        Asset bond = activeBondAsset();
        bond.setNextCouponDate(null); // all coupons already paid
        BigDecimal units = new BigDecimal("10");
        BigDecimal investmentCost = new BigDecimal("1000");

        BondBenefitProjection result = service.calculateForPurchase(bond, units, investmentCost);

        assertNotNull(result);
        assertEquals(0, result.remainingCouponPayments());
        assertEquals(BigDecimal.ZERO, result.totalCouponIncome());
    }

    @Test
    void calculateForPurchase_zeroInterestRate_zeroCoupon() {
        Asset bond = activeBondAsset();
        bond.setInterestRate(BigDecimal.ZERO);
        BigDecimal units = new BigDecimal("10");
        BigDecimal investmentCost = new BigDecimal("1000");

        BondBenefitProjection result = service.calculateForPurchase(bond, units, investmentCost);

        assertNotNull(result);
        assertEquals(0, result.couponPerPeriod().compareTo(BigDecimal.ZERO));
        assertEquals(0, result.totalCouponIncome().compareTo(BigDecimal.ZERO));
        // principalAtMaturity still valid
        assertEquals(new BigDecimal("1000"), result.principalAtMaturity());
    }

    @Test
    void calculateForPurchase_missingFaceValue_returnsNull() {
        Asset bond = activeBondAsset();
        bond.setManualPrice(null);
        BigDecimal units = new BigDecimal("10");

        BondBenefitProjection result = service.calculateForPurchase(bond, units, new BigDecimal("1000"));

        assertNull(result);
    }

    @Test
    void calculateForPurchase_missingCouponFrequency_returnsNull() {
        Asset bond = activeBondAsset();
        bond.setCouponFrequencyMonths(null);
        BigDecimal units = new BigDecimal("10");

        BondBenefitProjection result = service.calculateForPurchase(bond, units, new BigDecimal("1000"));

        assertNull(result);
    }

    // ── Holding view tests ──────────────────────────────────────────────

    @Test
    void calculateForHolding_happyPath_returnsProjectionsWithNullCostFields() {
        Asset bond = activeBondAsset();
        BigDecimal units = new BigDecimal("10");
        BigDecimal currentPrice = new BigDecimal("105");

        BondBenefitProjection result = service.calculateForHolding(bond, units, currentPrice);

        assertNotNull(result);
        assertEquals(new BigDecimal("29"), result.couponPerPeriod());
        assertEquals(10, result.remainingCouponPayments());
        assertEquals(new BigDecimal("290"), result.totalCouponIncome());
        assertEquals(new BigDecimal("1000"), result.principalAtMaturity());
        assertEquals(new BigDecimal("1290"), result.totalProjectedReturn());

        // Cost-related fields should be null for holdings
        assertNull(result.investmentCost());
        assertNull(result.netProjectedProfit());
        assertNull(result.annualizedYieldPercent());
    }

    @Test
    void calculateForHolding_nonBondAsset_returnsNull() {
        Asset stock = activeAsset();
        BigDecimal units = new BigDecimal("10");

        BondBenefitProjection result = service.calculateForHolding(stock, units, new BigDecimal("100"));

        assertNull(result);
    }

    // ── Coupon counting tests ───────────────────────────────────────────

    @Test
    void countRemainingCoupons_exactFiveYearsSemiAnnual_returnsTen() {
        LocalDate next = LocalDate.of(2026, 7, 1);
        LocalDate maturity = LocalDate.of(2031, 1, 1);

        int count = service.countRemainingCoupons(next, maturity, 6);

        assertEquals(10, count);
    }

    @Test
    void countRemainingCoupons_quarterly_returnsCorrectCount() {
        LocalDate next = LocalDate.of(2026, 4, 1);
        LocalDate maturity = LocalDate.of(2027, 4, 1);

        int count = service.countRemainingCoupons(next, maturity, 3);

        // 2026-04, 2026-07, 2026-10, 2027-01, 2027-04 = 5 payments
        assertEquals(5, count);
    }

    @Test
    void countRemainingCoupons_annual_returnsFive() {
        LocalDate next = LocalDate.of(2027, 1, 1);
        LocalDate maturity = LocalDate.of(2031, 1, 1);

        int count = service.countRemainingCoupons(next, maturity, 12);

        // 2027, 2028, 2029, 2030, 2031 = 5
        assertEquals(5, count);
    }

    @Test
    void countRemainingCoupons_nullDates_returnsZero() {
        assertEquals(0, service.countRemainingCoupons(null, LocalDate.now().plusYears(1), 6));
        assertEquals(0, service.countRemainingCoupons(LocalDate.now(), null, 6));
        assertEquals(0, service.countRemainingCoupons(null, null, 6));
    }

    @Test
    void countRemainingCoupons_nextCouponAfterMaturity_returnsZero() {
        LocalDate next = LocalDate.of(2031, 7, 1);
        LocalDate maturity = LocalDate.of(2031, 1, 1);

        int count = service.countRemainingCoupons(next, maturity, 6);

        assertEquals(0, count);
    }
}
