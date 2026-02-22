package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.AssetCategory;
import com.adorsys.fineract.asset.dto.IncomeCalendarResponse;
import com.adorsys.fineract.asset.dto.IncomeCalendarResponse.IncomeEvent;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.AssetPrice;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetPriceRepository;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncomeCalendarServiceTest {

    private static final Long USER_ID = 42L;

    @Mock private UserPositionRepository userPositionRepository;
    @Mock private AssetRepository assetRepository;
    @Mock private AssetPriceRepository assetPriceRepository;

    @InjectMocks private IncomeCalendarService service;

    @Test
    void getCalendar_noPositions_returnsEmpty() {
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of());

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        assertThat(response.events()).isEmpty();
        assertThat(response.monthlyTotals()).isEmpty();
        assertThat(response.totalExpectedIncome()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(response.totalByIncomeType()).isEmpty();
    }

    @Test
    void getCalendar_zeroUnitsPosition_excluded() {
        UserPosition pos = UserPosition.builder()
                .userId(USER_ID).assetId("a1").totalUnits(BigDecimal.ZERO)
                .avgPurchasePrice(BigDecimal.ZERO).totalCostBasis(BigDecimal.ZERO)
                .realizedPnl(BigDecimal.ZERO).lastTradeAt(Instant.now()).build();
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        assertThat(response.events()).isEmpty();
    }

    @Test
    void getCalendar_bondPosition_projectsCouponEvents() {
        UserPosition pos = position("bond-1", "10");
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));

        Asset bond = Asset.builder()
                .id("bond-1").symbol("BND").name("Test Bond").category(AssetCategory.BONDS)
                .manualPrice(new BigDecimal("10000")).interestRate(new BigDecimal("6.00"))
                .couponFrequencyMonths(6)
                .nextCouponDate(LocalDate.now().plusMonths(3))
                .maturityDate(LocalDate.now().plusYears(2))
                .build();
        when(assetRepository.findById("bond-1")).thenReturn(Optional.of(bond));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        List<IncomeEvent> coupons = response.events().stream()
                .filter(e -> "COUPON".equals(e.incomeType())).toList();
        // 12-month horizon: first coupon at +3m, second at +9m = 2 coupons
        assertThat(coupons).hasSize(2);
        // Formula: 10 * 10000 * (6/100) * (6/12) = 3000
        assertThat(coupons.get(0).expectedAmount()).isEqualByComparingTo("3000");
        assertThat(coupons.get(0).symbol()).isEqualTo("BND");
        assertThat(coupons.get(0).incomeType()).isEqualTo("COUPON");
    }

    @Test
    void getCalendar_bondWithMaturityInHorizon_includesPrincipalRedemption() {
        UserPosition pos = position("bond-2", "5");
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));

        Asset bond = Asset.builder()
                .id("bond-2").symbol("BN2").name("Maturing Bond").category(AssetCategory.BONDS)
                .manualPrice(new BigDecimal("10000")).interestRate(new BigDecimal("5.00"))
                .couponFrequencyMonths(6)
                .nextCouponDate(LocalDate.now().plusMonths(3))
                .maturityDate(LocalDate.now().plusMonths(6))
                .build();
        when(assetRepository.findById("bond-2")).thenReturn(Optional.of(bond));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        List<IncomeEvent> redemptions = response.events().stream()
                .filter(e -> "PRINCIPAL_REDEMPTION".equals(e.incomeType())).toList();
        assertThat(redemptions).hasSize(1);
        // 5 * 10000 = 50000
        assertThat(redemptions.get(0).expectedAmount()).isEqualByComparingTo("50000");
    }

    @Test
    void getCalendar_incomeAsset_projectsDistributions() {
        UserPosition pos = position("rent-1", "20");
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));

        Asset asset = Asset.builder()
                .id("rent-1").symbol("RNT").name("Rent Asset").category(AssetCategory.REAL_ESTATE)
                .incomeType("RENT").incomeRate(new BigDecimal("4.00"))
                .distributionFrequencyMonths(3)
                .nextDistributionDate(LocalDate.now().plusMonths(2))
                .build();
        when(assetRepository.findById("rent-1")).thenReturn(Optional.of(asset));

        AssetPrice price = AssetPrice.builder()
                .assetId("rent-1").currentPrice(new BigDecimal("5000"))
                .dayOpen(BigDecimal.ZERO).dayHigh(BigDecimal.ZERO).dayLow(BigDecimal.ZERO)
                .dayClose(BigDecimal.ZERO).change24hPercent(BigDecimal.ZERO).updatedAt(Instant.now())
                .build();
        when(assetPriceRepository.findById("rent-1")).thenReturn(Optional.of(price));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        List<IncomeEvent> rents = response.events().stream()
                .filter(e -> "RENT".equals(e.incomeType())).toList();
        // 12-month horizon from +2m: events at +2m, +5m, +8m, +11m = ~4
        assertThat(rents).hasSizeGreaterThanOrEqualTo(3);
        // Formula: 20 * 5000 * (4/100) * (3/12) = 1000
        assertThat(rents.get(0).expectedAmount()).isEqualByComparingTo("1000");
    }

    @Test
    void getCalendar_assetWithNoIncomeFields_producesNoEvents() {
        UserPosition pos = position("stock-1", "10");
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));

        Asset stock = Asset.builder()
                .id("stock-1").symbol("STK").name("Stock").category(AssetCategory.STOCKS)
                .build();
        when(assetRepository.findById("stock-1")).thenReturn(Optional.of(stock));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        assertThat(response.events()).isEmpty();
    }

    @Test
    void getCalendar_aggregatesMonthlyTotals() {
        UserPosition pos = position("bond-3", "10");
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(pos));

        Asset bond = Asset.builder()
                .id("bond-3").symbol("BN3").name("Bond 3").category(AssetCategory.BONDS)
                .manualPrice(new BigDecimal("10000")).interestRate(new BigDecimal("6.00"))
                .couponFrequencyMonths(6)
                .nextCouponDate(LocalDate.now().plusMonths(3))
                .maturityDate(LocalDate.now().plusYears(2))
                .build();
        when(assetRepository.findById("bond-3")).thenReturn(Optional.of(bond));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        assertThat(response.monthlyTotals()).isNotEmpty();
        response.monthlyTotals().forEach(agg -> {
            assertThat(agg.totalAmount()).isPositive();
            assertThat(agg.eventCount()).isPositive();
        });
    }

    @Test
    void getCalendar_aggregatesTotalByIncomeType() {
        UserPosition bondPos = position("bond-4", "5");
        UserPosition rentPos = position("rent-2", "10");
        when(userPositionRepository.findByUserId(USER_ID)).thenReturn(List.of(bondPos, rentPos));

        Asset bond = Asset.builder()
                .id("bond-4").symbol("BN4").name("Bond 4").category(AssetCategory.BONDS)
                .manualPrice(new BigDecimal("10000")).interestRate(new BigDecimal("5.00"))
                .couponFrequencyMonths(6)
                .nextCouponDate(LocalDate.now().plusMonths(3))
                .maturityDate(LocalDate.now().plusYears(2))
                .build();
        when(assetRepository.findById("bond-4")).thenReturn(Optional.of(bond));

        Asset rental = Asset.builder()
                .id("rent-2").symbol("RN2").name("Rental 2").category(AssetCategory.REAL_ESTATE)
                .incomeType("RENT").incomeRate(new BigDecimal("4.00"))
                .distributionFrequencyMonths(3)
                .nextDistributionDate(LocalDate.now().plusMonths(2))
                .build();
        when(assetRepository.findById("rent-2")).thenReturn(Optional.of(rental));

        AssetPrice price = AssetPrice.builder()
                .assetId("rent-2").currentPrice(new BigDecimal("5000"))
                .dayOpen(BigDecimal.ZERO).dayHigh(BigDecimal.ZERO).dayLow(BigDecimal.ZERO)
                .dayClose(BigDecimal.ZERO).change24hPercent(BigDecimal.ZERO).updatedAt(Instant.now())
                .build();
        when(assetPriceRepository.findById("rent-2")).thenReturn(Optional.of(price));

        IncomeCalendarResponse response = service.getCalendar(USER_ID, 12);

        assertThat(response.totalByIncomeType()).containsKeys("COUPON", "RENT");
        assertThat(response.totalByIncomeType().get("COUPON")).isPositive();
        assertThat(response.totalByIncomeType().get("RENT")).isPositive();
        assertThat(response.totalExpectedIncome()).isPositive();
    }

    private UserPosition position(String assetId, String units) {
        return UserPosition.builder()
                .userId(USER_ID).assetId(assetId).totalUnits(new BigDecimal(units))
                .avgPurchasePrice(BigDecimal.ZERO).totalCostBasis(BigDecimal.ZERO)
                .realizedPnl(BigDecimal.ZERO).lastTradeAt(Instant.now()).build();
    }
}
