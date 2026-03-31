package com.adorsys.fineract.asset.testutil;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

/**
 * Shared test fixtures for asset service tests.
 */
public final class TestDataFactory {

    public static final String ASSET_ID = "asset-001";
    public static final String EXTERNAL_ID = "keycloak-uuid-123";
    public static final Long USER_ID = 42L;
    public static final Long USER_CASH_ACCOUNT = 100L;
    public static final Long USER_ASSET_ACCOUNT = 200L;
    public static final Long LP_CASH_ACCOUNT = 300L;
    public static final Long LP_ASSET_ACCOUNT = 400L;
    public static final Long LP_SPREAD_ACCOUNT = 500L;
    public static final Long LP_TAX_ACCOUNT = 360L;
    public static final Long FEE_COLLECTION_ACCOUNT = 999L;
    public static final Long CLEARING_ACCOUNT = 901L;
    public static final String IDEMPOTENCY_KEY = "idem-key-1";
    public static final Long LP_CLIENT_ID = 1L;

    private TestDataFactory() {}

    public static Asset activeAsset() {
        return Asset.builder()
                .id(ASSET_ID)
                .symbol("TST")
                .currencyCode("TST")
                .name("Test Asset")
                .category(AssetCategory.STOCKS)
                .status(AssetStatus.ACTIVE)
                .priceMode(PriceMode.MANUAL)
                .issuerPrice(new BigDecimal("100"))
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(BigDecimal.ZERO)
                .tradingFeePercent(new BigDecimal("0.005"))
                .decimalPlaces(0)
                .lpClientId(LP_CLIENT_ID)
                .lpCashAccountId(LP_CASH_ACCOUNT)
                .lpAssetAccountId(LP_ASSET_ACCOUNT)
                .lpSpreadAccountId(LP_SPREAD_ACCOUNT)
                .lpTaxAccountId(360L)
                .tvaEnabled(false)
                .fineractProductId(10)
                .createdAt(Instant.now())
                .build();
    }

    public static Asset pendingAsset() {
        Asset asset = activeAsset();
        asset.setStatus(AssetStatus.PENDING);
        return asset;
    }

    public static Asset haltedAsset() {
        Asset asset = activeAsset();
        asset.setStatus(AssetStatus.HALTED);
        return asset;
    }

    public static AssetPrice assetPrice(String assetId, BigDecimal price) {
        return AssetPrice.builder()
                .assetId(assetId)
                .bidPrice(price)
                .askPrice(price)
                .dayOpen(price)
                .dayHigh(price)
                .dayLow(price)
                .dayClose(price)
                .change24hPercent(BigDecimal.ZERO)
                .updatedAt(Instant.now())
                .build();
    }

    public static UserPosition userPosition(Long userId, String assetId, BigDecimal units) {
        return UserPosition.builder()
                .userId(userId)
                .assetId(assetId)
                .totalUnits(units)
                .avgPurchasePrice(new BigDecimal("100"))
                .totalCostBasis(units.multiply(new BigDecimal("100")))
                .realizedPnl(BigDecimal.ZERO)
                .fineractSavingsAccountId(USER_ASSET_ACCOUNT)
                .lastTradeAt(Instant.now())
                .build();
    }

    public static Order filledOrder(String assetId, TradeSide side) {
        return Order.builder()
                .id(UUID.randomUUID().toString())
                .idempotencyKey(UUID.randomUUID().toString())
                .userId(USER_ID)
                .userExternalId(EXTERNAL_ID)
                .assetId(assetId)
                .side(side)
                .units(new BigDecimal("10"))
                .executionPrice(new BigDecimal("101"))
                .cashAmount(new BigDecimal("1010"))
                .fee(new BigDecimal("5"))
                .spreadAmount(new BigDecimal("10"))
                .buybackPremium(BigDecimal.ZERO)
                .status(OrderStatus.FILLED)
                .createdAt(Instant.now())
                .build();
    }

    public static CreateAssetRequest createAssetRequest() {
        return new CreateAssetRequest(
                "Test Asset",
                "TST",
                "TST",
                "A test asset",
                null,
                AssetCategory.STOCKS,
                new BigDecimal("100"),
                null, // faceValue (defaults to issuerPrice for non-bonds)
                new BigDecimal("1000"),
                0,
                new BigDecimal("0.005"),
                new BigDecimal("110"),
                new BigDecimal("95"),
                LP_CLIENT_ID,
                null, null, null, null, // exposure limits (maxPositionPercent, maxOrderSize, dailyTradeLimitXaf, lockupDays)
                null, null, // min order size/cash
                null, null, null, // bondType, dayCountConvention, issuerCountry
                null, null, null, null, null, null, // issuerName, isinCode, maturityDate, interestRate, couponFrequencyMonths, nextCouponDate
                null, null, null, null, // income fields
                null, null, null, null, null, null, null, null, null, // tax fields
                false, null // tvaEnabled, tvaRate
        );
    }

    public static CreateAssetRequest createBondAssetRequest() {
        return new CreateAssetRequest(
                "Senegal Bond 2030",
                "SN8",
                "SN8",
                "Government bond",
                null,
                AssetCategory.BONDS,
                new BigDecimal("10000"),
                null, // faceValue (defaults to issuerPrice for COUPON bonds)
                new BigDecimal("500"),
                0,
                new BigDecimal("0.005"),
                new BigDecimal("11000"),
                new BigDecimal("9500"),
                LP_CLIENT_ID,
                null, null, null, null, // exposure limits
                null, null, // min order size/cash
                BondType.COUPON, DayCountConvention.ACT_365, "SENEGAL", // bondType, dayCountConvention, issuerCountry
                "Etat du Sénégal",
                "SN0000038741",
                LocalDate.now().plusYears(5),
                new BigDecimal("5.80"),
                6,
                LocalDate.now().plusMonths(6),
                null, null, null, null, // income fields
                null, null, null, null, null, null, null, null, true, // tax: govt bond
                false, null // tvaEnabled, tvaRate
        );
    }

    public static ScheduledPayment scheduledPayment(String assetId, String paymentType) {
        return ScheduledPayment.builder()
                .id(1L)
                .assetId(assetId)
                .paymentType(paymentType)
                .scheduleDate(LocalDate.now())
                .status("PENDING")
                .estimatedRate(new BigDecimal("5.80"))
                .estimatedAmountPerUnit(new BigDecimal("290"))
                .estimatedTotal(new BigDecimal("2900"))
                .holderCount(1)
                .build();
    }

    public static InterestPayment interestPayment(String assetId, Long userId) {
        return InterestPayment.builder()
                .id(1L)
                .assetId(assetId)
                .userId(userId)
                .units(new BigDecimal("10"))
                .faceValue(new BigDecimal("10000"))
                .annualRate(new BigDecimal("5.80"))
                .periodMonths(6)
                .cashAmount(new BigDecimal("2900"))
                .fineractTransferId(1L)
                .status("SUCCESS")
                .couponDate(LocalDate.now())
                .build();
    }

    public static IncomeDistribution incomeDistribution(String assetId, Long userId) {
        return IncomeDistribution.builder()
                .id(1L)
                .assetId(assetId)
                .userId(userId)
                .incomeType("DIVIDEND")
                .units(new BigDecimal("10"))
                .rateApplied(new BigDecimal("8.00"))
                .cashAmount(new BigDecimal("800"))
                .fineractTransferId(1L)
                .status("SUCCESS")
                .distributionDate(LocalDate.now())
                .paidAt(Instant.now())
                .build();
    }

    public static NotificationLog adminNotification() {
        return NotificationLog.builder()
                .id(1L)
                .userId(null)
                .eventType("LP_SHORTFALL")
                .title("LP cash shortfall")
                .body("Asset TST has insufficient LP cash balance")
                .referenceId(ASSET_ID)
                .referenceType("ASSET")
                .read(false)
                .createdAt(Instant.now())
                .build();
    }

    public static NotificationLog userNotification(Long userId) {
        return NotificationLog.builder()
                .id(2L)
                .userId(userId)
                .eventType("TRADE_EXECUTED")
                .title("Trade executed")
                .body("Bought 10 units of TST at 100 XAF")
                .referenceId(UUID.randomUUID().toString())
                .referenceType("ORDER")
                .read(false)
                .createdAt(Instant.now())
                .build();
    }

    public static PurchaseLot purchaseLot(Long userId, String assetId, BigDecimal units, BigDecimal price) {
        return PurchaseLot.builder()
                .userId(userId)
                .assetId(assetId)
                .units(units)
                .remainingUnits(units)
                .purchasePrice(price)
                .purchasedAt(Instant.now())
                .build();
    }

    public static PurchaseLot purchaseLotWithLockup(Long userId, String assetId, BigDecimal units,
                                                     BigDecimal price, int lockupDays) {
        return PurchaseLot.builder()
                .userId(userId)
                .assetId(assetId)
                .units(units)
                .remainingUnits(units)
                .purchasePrice(price)
                .purchasedAt(Instant.now())
                .lockupExpiresAt(Instant.now().plus(lockupDays, ChronoUnit.DAYS))
                .build();
    }

    public static Order quotedOrder(String assetId, TradeSide side) {
        Instant now = Instant.now();
        return Order.builder()
                .id(UUID.randomUUID().toString())
                .idempotencyKey(UUID.randomUUID().toString())
                .userId(USER_ID)
                .userExternalId(EXTERNAL_ID)
                .assetId(assetId)
                .side(side)
                .units(new BigDecimal("10"))
                .executionPrice(new BigDecimal("101"))
                .cashAmount(new BigDecimal("1015"))
                .fee(new BigDecimal("5"))
                .spreadAmount(new BigDecimal("10"))
                .buybackPremium(BigDecimal.ZERO)
                .status(OrderStatus.QUOTED)
                .quotedAt(now)
                .quoteExpiresAt(now.plusSeconds(30))
                .quotedAskPrice(new BigDecimal("101"))
                .quotedBidPrice(new BigDecimal("95"))
                .createdAt(now)
                .build();
    }

    public static Order expiredQuotedOrder(String assetId, TradeSide side) {
        Order order = quotedOrder(assetId, side);
        order.setQuotedAt(Instant.now().minusSeconds(60));
        order.setQuoteExpiresAt(Instant.now().minusSeconds(30));
        return order;
    }

    public static Asset activeBondAsset() {
        Asset bond = activeAsset();
        bond.setCategory(AssetCategory.BONDS);
        bond.setBondType(BondType.COUPON);
        bond.setDayCountConvention(DayCountConvention.ACT_365);
        bond.setIssuerCountry("SENEGAL");
        bond.setIssuerName("Etat du Sénégal");
        bond.setIsinCode("SN0000038741");
        bond.setMaturityDate(LocalDate.now().plusYears(5));
        bond.setInterestRate(new BigDecimal("5.80"));
        bond.setCouponFrequencyMonths(6);
        bond.setNextCouponDate(LocalDate.now().plusMonths(6));
        return bond;
    }

    public static Asset activeDiscountBondAsset() {
        Asset bond = activeAsset();
        bond.setCategory(AssetCategory.BONDS);
        bond.setBondType(BondType.DISCOUNT);
        bond.setDayCountConvention(DayCountConvention.ACT_360);
        bond.setIssuerCountry("CAMEROUN");
        bond.setIssuerName("Republique du Cameroun");
        bond.setIsinCode("CM1300001193");
        bond.setIssuerPrice(new BigDecimal("1000000"));
        bond.setMaturityDate(LocalDate.now().plusWeeks(52));
        // No coupon fields for discount bonds
        return bond;
    }
}
