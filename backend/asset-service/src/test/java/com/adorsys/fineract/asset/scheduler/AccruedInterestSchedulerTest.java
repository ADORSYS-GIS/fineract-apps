package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccruedInterestSchedulerTest {

    @Mock private AssetRepository assetRepository;
    @Mock private UserPositionRepository userPositionRepository;

    @InjectMocks
    private AccruedInterestScheduler accruedInterestScheduler;

    @Captor private ArgumentCaptor<UserPosition> positionCaptor;

    @Test
    void accrueBond_calculatesCorrectDailyAccrual() {
        // Bond: issuerPrice=10000, interestRate=5%
        Asset bond = Asset.builder()
                .id("bond-001")
                .issuerPrice(new BigDecimal("10000"))
                .interestRate(new BigDecimal("5"))
                .build();

        // User holds 100 units, accrued so far = 0
        UserPosition pos = UserPosition.builder()
                .userId(42L)
                .assetId("bond-001")
                .totalUnits(new BigDecimal("100"))
                .accruedInterest(BigDecimal.ZERO)
                .build();
        when(userPositionRepository.findByAssetId("bond-001")).thenReturn(List.of(pos));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        int updated = accruedInterestScheduler.accrueBond(bond);

        assertEquals(1, updated);
        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();

        // Expected: 100 * 10000 * 5 / 100 / 365 = 1369.86... rounded to 1370
        BigDecimal expected = new BigDecimal("100")
                .multiply(new BigDecimal("10000"))
                .multiply(new BigDecimal("5"))
                .divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP)
                .divide(new BigDecimal("365"), 0, RoundingMode.HALF_UP);

        assertEquals(0, expected.compareTo(saved.getAccruedInterest()));
    }

    @Test
    void accrueBond_addsToExistingAccruedInterest() {
        Asset bond = Asset.builder()
                .id("bond-001")
                .issuerPrice(new BigDecimal("10000"))
                .interestRate(new BigDecimal("5"))
                .build();

        // Pre-existing accrued interest of 5000
        UserPosition pos = UserPosition.builder()
                .userId(42L)
                .assetId("bond-001")
                .totalUnits(new BigDecimal("100"))
                .accruedInterest(new BigDecimal("5000"))
                .build();
        when(userPositionRepository.findByAssetId("bond-001")).thenReturn(List.of(pos));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        accruedInterestScheduler.accrueBond(bond);

        verify(userPositionRepository).save(positionCaptor.capture());
        UserPosition saved = positionCaptor.getValue();

        // Should be > 5000 (previous + daily accrual)
        assertTrue(saved.getAccruedInterest().compareTo(new BigDecimal("5000")) > 0);
    }

    @Test
    void accrueBond_zeroUnits_skipped() {
        Asset bond = Asset.builder()
                .id("bond-001")
                .issuerPrice(new BigDecimal("10000"))
                .interestRate(new BigDecimal("5"))
                .build();

        UserPosition pos = UserPosition.builder()
                .userId(42L)
                .assetId("bond-001")
                .totalUnits(BigDecimal.ZERO) // Sold all
                .accruedInterest(BigDecimal.ZERO)
                .build();
        when(userPositionRepository.findByAssetId("bond-001")).thenReturn(List.of(pos));

        int updated = accruedInterestScheduler.accrueBond(bond);

        assertEquals(0, updated);
        verify(userPositionRepository, never()).save(any());
    }

    @Test
    void accrueDaily_noBonds_doesNothing() {
        when(assetRepository.findActiveBondsWithInterestRate()).thenReturn(List.of());

        accruedInterestScheduler.accrueDaily();

        verify(userPositionRepository, never()).findByAssetId(any());
    }

    @Test
    void resetAccruedInterest_resetsAllHolders() {
        UserPosition pos1 = UserPosition.builder()
                .userId(1L).assetId("bond-001").accruedInterest(new BigDecimal("5000")).build();
        UserPosition pos2 = UserPosition.builder()
                .userId(2L).assetId("bond-001").accruedInterest(new BigDecimal("3000")).build();

        when(userPositionRepository.findByAssetId("bond-001")).thenReturn(List.of(pos1, pos2));
        when(userPositionRepository.save(any(UserPosition.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        accruedInterestScheduler.resetAccruedInterest("bond-001");

        verify(userPositionRepository, times(2)).save(positionCaptor.capture());
        List<UserPosition> saved = positionCaptor.getAllValues();
        for (UserPosition p : saved) {
            assertEquals(0, BigDecimal.ZERO.compareTo(p.getAccruedInterest()));
        }
    }
}
