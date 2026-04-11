package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.RedemptionTriggerResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.PrincipalRedemptionRepository;
import com.adorsys.fineract.asset.repository.ScheduledPaymentRepository;
import com.adorsys.fineract.asset.repository.UserPositionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PrincipalRedemptionServiceTest {

    @Mock AssetRepository assetRepository;
    @Mock UserPositionRepository userPositionRepository;
    @Mock PrincipalRedemptionRepository principalRedemptionRepository;
    @Mock ScheduledPaymentRepository scheduledPaymentRepository;
    @Mock FineractClient fineractClient;
    @Mock AssetServiceConfig assetServiceConfig;
    @Mock PortfolioService portfolioService;
    @Mock TaxService taxService;
    @Mock AssetMetrics assetMetrics;

    @InjectMocks
    PrincipalRedemptionService service;

    private Asset maturedBond() {
        Asset bond = activeDiscountBondAsset();
        bond.setStatus(AssetStatus.MATURED);
        bond.setFaceValue(new BigDecimal("1000000"));
        bond.setIssuerPrice(new BigDecimal("900000"));
        bond.setLpCashAccountId(LP_CASH_ACCOUNT);
        bond.setLpAssetAccountId(LP_ASSET_ACCOUNT);
        bond.setMaturityDate(LocalDate.now().minusDays(1));
        return bond;
    }

    @Test
    void redeemBond_bondNotFound_throws() {
        when(assetRepository.findById("unknown")).thenReturn(Optional.empty());

        assertThrows(AssetException.class, () -> service.redeemBond("unknown"));
    }

    @Test
    void redeemBond_notMatured_throws() {
        Asset bond = activeDiscountBondAsset();
        bond.setStatus(AssetStatus.ACTIVE);
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));

        assertThrows(AssetException.class, () -> service.redeemBond(ASSET_ID));
    }

    @Test
    void redeemBond_pendingCouponBlocks_throws() {
        Asset bond = maturedBond();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(scheduledPaymentRepository.existsByAssetIdAndPaymentTypeAndStatus(
                ASSET_ID, "COUPON", "PENDING")).thenReturn(true);

        AssetException ex = assertThrows(AssetException.class, () -> service.redeemBond(ASSET_ID));
        assertTrue(ex.getMessage().contains("PENDING coupon"));
    }

    @Test
    void redeemBond_noHolders_marksRedeemedImmediately() {
        Asset bond = maturedBond();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(scheduledPaymentRepository.existsByAssetIdAndPaymentTypeAndStatus(any(), any(), any()))
                .thenReturn(false);
        when(userPositionRepository.findHoldersByAssetId(ASSET_ID, BigDecimal.ZERO))
                .thenReturn(List.of());

        RedemptionTriggerResponse response = service.redeemBond(ASSET_ID);

        assertEquals(0, response.holdersRedeemed());
        assertEquals(AssetStatus.REDEEMED.name(), response.bondStatus());
        verify(assetRepository).updateStatus(ASSET_ID, AssetStatus.REDEEMED);
    }

    @Test
    void redeemBond_insufficientLpBalance_throws() {
        Asset bond = maturedBond();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(scheduledPaymentRepository.existsByAssetIdAndPaymentTypeAndStatus(any(), any(), any()))
                .thenReturn(false);

        // 10 units × face 1,000,000 = 10,000,000 obligation
        UserPosition holder = userPosition(USER_ID, ASSET_ID, BigDecimal.TEN);
        when(userPositionRepository.findHoldersByAssetId(ASSET_ID, BigDecimal.ZERO))
                .thenReturn(List.of(holder));
        when(principalRedemptionRepository.findByAssetId(ASSET_ID)).thenReturn(List.of());
        // LP only has 5,000,000
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT))
                .thenReturn(new BigDecimal("5000000"));

        assertThrows(AssetException.class, () -> service.redeemBond(ASSET_ID));
    }

    @Test
    void redeemBond_discountBond_ircmWithheldOnCapitalGain() {
        // face = 1,000,000, avgPurchasePrice = 900,000 → gain = 100,000 per unit
        // IRCM rate = 16.5% → ircm = 16,500
        Asset bond = maturedBond();
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(scheduledPaymentRepository.existsByAssetIdAndPaymentTypeAndStatus(any(), any(), any()))
                .thenReturn(false);

        UserPosition holder = userPosition(USER_ID, ASSET_ID, BigDecimal.ONE);
        holder.setAvgPurchasePrice(new BigDecimal("900000"));
        holder.setFineractSavingsAccountId(USER_ASSET_ACCOUNT);

        when(userPositionRepository.findHoldersByAssetId(ASSET_ID, BigDecimal.ZERO))
                .thenReturn(List.of(holder));
        when(principalRedemptionRepository.findByAssetId(ASSET_ID)).thenReturn(List.of());
        when(fineractClient.getAccountBalance(LP_CASH_ACCOUNT))
                .thenReturn(new BigDecimal("10000000"));
        when(taxService.getEffectiveIrcmRate(bond)).thenReturn(new BigDecimal("0.165"));
        when(taxService.getIrcmAccountId()).thenReturn(99L);
        when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");
        when(fineractClient.findClientSavingsAccountByCurrency(USER_ID, "XAF"))
                .thenReturn(USER_CASH_ACCOUNT);
        when(fineractClient.createAccountTransfer(any(), any(), any(), any()))
                .thenReturn(100L);
        when(portfolioService.updatePositionAfterSell(any(), any(), any(), any()))
                .thenReturn(new BigDecimal("100000"));
        when(principalRedemptionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        service.redeemBond(ASSET_ID);

        // Verify IRCM recorded: gain = 100,000 × 0.165 = 16,500
        verify(taxService).recordTaxTransaction(
                isNull(), isNull(), eq(USER_ID), eq(ASSET_ID),
                eq("IRCM"), any(), eq(new BigDecimal("0.165")),
                eq(new BigDecimal("16500")), isNull());
    }
}
