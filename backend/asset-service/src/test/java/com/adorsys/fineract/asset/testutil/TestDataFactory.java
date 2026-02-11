package com.adorsys.fineract.asset.testutil;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
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
    public static final Long TREASURY_CASH_ACCOUNT = 300L;
    public static final Long TREASURY_ASSET_ACCOUNT = 400L;
    public static final Long FEE_COLLECTION_ACCOUNT = 999L;
    public static final String IDEMPOTENCY_KEY = "idem-key-1";
    public static final Long TREASURY_CLIENT_ID = 1L;

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
                .manualPrice(new BigDecimal("100"))
                .totalSupply(new BigDecimal("1000"))
                .circulatingSupply(BigDecimal.ZERO)
                .spreadPercent(new BigDecimal("0.01"))
                .tradingFeePercent(new BigDecimal("0.005"))
                .decimalPlaces(0)
                .treasuryClientId(TREASURY_CLIENT_ID)
                .treasuryCashAccountId(TREASURY_CASH_ACCOUNT)
                .treasuryAssetAccountId(TREASURY_ASSET_ACCOUNT)
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
                .currentPrice(price)
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
                .xafAmount(new BigDecimal("1010"))
                .fee(new BigDecimal("5"))
                .spreadAmount(new BigDecimal("10"))
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
                new BigDecimal("1000"),
                0,
                new BigDecimal("0.005"),
                new BigDecimal("0.01"),
                null,
                TREASURY_CLIENT_ID,
                null, null, null, null, null, null, null
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
                new BigDecimal("500"),
                0,
                new BigDecimal("0.005"),
                new BigDecimal("0.01"),
                null,
                TREASURY_CLIENT_ID,
                "Etat du Sénégal",
                "SN0000038741",
                LocalDate.now().plusYears(5),
                new BigDecimal("5.80"),
                6,
                LocalDate.now().plusMonths(6),
                LocalDate.now().plusYears(1)
        );
    }

    public static Asset activeBondAsset() {
        Asset bond = activeAsset();
        bond.setCategory(AssetCategory.BONDS);
        bond.setIssuer("Etat du Sénégal");
        bond.setIsinCode("SN0000038741");
        bond.setMaturityDate(LocalDate.now().plusYears(5));
        bond.setInterestRate(new BigDecimal("5.80"));
        bond.setCouponFrequencyMonths(6);
        bond.setNextCouponDate(LocalDate.now().plusMonths(6));
        bond.setValidityDate(LocalDate.now().plusYears(1));
        return bond;
    }
}
