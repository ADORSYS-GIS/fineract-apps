package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.PurchaseLot;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.TradingException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.PurchaseLotRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LockupServiceTest {

    @Mock private UserPositionRepository userPositionRepository;
    @Mock private PurchaseLotRepository purchaseLotRepository;
    @Mock private AssetMetrics assetMetrics;

    @InjectMocks
    private LockupService lockupService;

    private static final Long USER_ID = 42L;
    private static final String ASSET_ID = "asset-001";

    // -------------------------------------------------------------------------
    // Per-lot lockup tests
    // -------------------------------------------------------------------------

    @Test
    void validateLockup_noLockupDays_passes() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(null).build();

        assertDoesNotThrow(
                () -> lockupService.validateLockup(asset, USER_ID, new BigDecimal("10")));
    }

    @Test
    void validateLockup_zeroLockupDays_passes() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(0).build();

        assertDoesNotThrow(
                () -> lockupService.validateLockup(asset, USER_ID, new BigDecimal("10")));
    }

    @Test
    void validateLockup_perLotEnoughUnlockedUnits_passes() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(30).build();

        // 15 unlocked units available
        when(purchaseLotRepository.sumUnlockedUnits(eq(USER_ID), eq(ASSET_ID), any(Instant.class)))
                .thenReturn(new BigDecimal("15"));

        // Lots exist
        PurchaseLot lot = PurchaseLot.builder()
                .userId(USER_ID).assetId(ASSET_ID)
                .units(new BigDecimal("20")).remainingUnits(new BigDecimal("15"))
                .purchasedAt(Instant.now().minus(60, ChronoUnit.DAYS))
                .build();
        when(purchaseLotRepository.findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
                eq(USER_ID), eq(ASSET_ID), any(BigDecimal.class)))
                .thenReturn(List.of(lot));

        assertDoesNotThrow(
                () -> lockupService.validateLockup(asset, USER_ID, new BigDecimal("10")));
    }

    @Test
    void validateLockup_perLotNotEnoughUnlockedUnits_throws() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(30).build();

        // Only 5 unlocked units
        when(purchaseLotRepository.sumUnlockedUnits(eq(USER_ID), eq(ASSET_ID), any(Instant.class)))
                .thenReturn(new BigDecimal("5"));

        PurchaseLot lot = PurchaseLot.builder()
                .userId(USER_ID).assetId(ASSET_ID)
                .units(new BigDecimal("20")).remainingUnits(new BigDecimal("20"))
                .purchasedAt(Instant.now().minus(10, ChronoUnit.DAYS))
                .build();
        when(purchaseLotRepository.findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
                eq(USER_ID), eq(ASSET_ID), any(BigDecimal.class)))
                .thenReturn(List.of(lot));

        TradingException ex = assertThrows(TradingException.class,
                () -> lockupService.validateLockup(asset, USER_ID, new BigDecimal("10")));
        assertEquals("LOCKUP_PERIOD_ACTIVE", ex.getErrorCode());
        assertTrue(ex.getMessage().contains("Only 5 units are unlocked"));
    }

    // -------------------------------------------------------------------------
    // Legacy fallback tests (no lots)
    // -------------------------------------------------------------------------

    @Test
    void validateLockup_noLots_fallsBackToGlobalLockup_locked() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(30).build();

        // No lots exist
        when(purchaseLotRepository.sumUnlockedUnits(eq(USER_ID), eq(ASSET_ID), any(Instant.class)))
                .thenReturn(BigDecimal.ZERO);
        when(purchaseLotRepository.findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
                eq(USER_ID), eq(ASSET_ID), any(BigDecimal.class)))
                .thenReturn(Collections.emptyList());

        // Position exists with recent purchase
        UserPosition pos = UserPosition.builder()
                .userId(USER_ID).assetId(ASSET_ID)
                .totalUnits(new BigDecimal("10"))
                .firstPurchaseDate(Instant.now().minus(5, ChronoUnit.DAYS))
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(pos));

        TradingException ex = assertThrows(TradingException.class,
                () -> lockupService.validateLockup(asset, USER_ID, new BigDecimal("10")));
        assertEquals("LOCKUP_PERIOD_ACTIVE", ex.getErrorCode());
    }

    @Test
    void validateLockup_noLots_fallsBackToGlobalLockup_unlocked() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(30).build();

        // No lots exist
        when(purchaseLotRepository.sumUnlockedUnits(eq(USER_ID), eq(ASSET_ID), any(Instant.class)))
                .thenReturn(BigDecimal.ZERO);
        when(purchaseLotRepository.findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
                eq(USER_ID), eq(ASSET_ID), any(BigDecimal.class)))
                .thenReturn(Collections.emptyList());

        // Position exists with old purchase (beyond lockup)
        UserPosition pos = UserPosition.builder()
                .userId(USER_ID).assetId(ASSET_ID)
                .totalUnits(new BigDecimal("10"))
                .firstPurchaseDate(Instant.now().minus(60, ChronoUnit.DAYS))
                .build();
        when(userPositionRepository.findByUserIdAndAssetId(USER_ID, ASSET_ID))
                .thenReturn(Optional.of(pos));

        assertDoesNotThrow(
                () -> lockupService.validateLockup(asset, USER_ID, new BigDecimal("10")));
    }

    // -------------------------------------------------------------------------
    // getUnlockedUnits tests
    // -------------------------------------------------------------------------

    @Test
    void getUnlockedUnits_withLots_returnsUnlockedCount() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(30).build();

        when(purchaseLotRepository.sumUnlockedUnits(eq(USER_ID), eq(ASSET_ID), any(Instant.class)))
                .thenReturn(new BigDecimal("25"));

        PurchaseLot lot = PurchaseLot.builder()
                .userId(USER_ID).assetId(ASSET_ID).remainingUnits(new BigDecimal("25")).build();
        when(purchaseLotRepository.findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
                eq(USER_ID), eq(ASSET_ID), any(BigDecimal.class)))
                .thenReturn(List.of(lot));

        BigDecimal result = lockupService.getUnlockedUnits(asset, USER_ID);
        assertNotNull(result);
        assertEquals(0, new BigDecimal("25").compareTo(result));
    }

    @Test
    void getUnlockedUnits_noLots_returnsNull() {
        Asset asset = Asset.builder().id(ASSET_ID).lockupDays(30).build();

        when(purchaseLotRepository.sumUnlockedUnits(eq(USER_ID), eq(ASSET_ID), any(Instant.class)))
                .thenReturn(BigDecimal.ZERO);
        when(purchaseLotRepository.findByUserIdAndAssetIdAndRemainingUnitsGreaterThanOrderByPurchasedAtAsc(
                eq(USER_ID), eq(ASSET_ID), any(BigDecimal.class)))
                .thenReturn(Collections.emptyList());

        BigDecimal result = lockupService.getUnlockedUnits(asset, USER_ID);
        assertNull(result);
    }
}
