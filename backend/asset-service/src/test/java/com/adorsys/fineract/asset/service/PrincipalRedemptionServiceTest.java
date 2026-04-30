package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.dto.AssetStatus;
import com.adorsys.fineract.asset.dto.RedemptionTriggerResponse;
import com.adorsys.fineract.asset.entity.Asset;
import com.adorsys.fineract.asset.entity.UserPosition;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.entity.FineractOutboxEntry;
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
import java.util.UUID;

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
    @Mock FineractOutboxService outboxService;

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
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(List.of());
        when(portfolioService.updatePositionAfterSell(any(), any(), any(), any(), any(), any()))
                .thenReturn(new BigDecimal("100000"));
        when(principalRedemptionRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        FineractOutboxEntry mockEntry = mock(FineractOutboxEntry.class);
        when(mockEntry.getId()).thenReturn(UUID.fromString("00000000-0000-0000-0000-000000000001"));
        when(outboxService.writePendingEntry(any(), any(), any(), any(), any())).thenReturn(mockEntry);

        service.redeemBond(ASSET_ID);

        // Verify IRCM recorded: gain = 100,000 × 0.165 = 16,500
        verify(taxService).recordTaxTransaction(
                isNull(), isNull(), eq(USER_ID), eq(ASSET_ID),
                eq("IRCM"), any(), eq(new BigDecimal("0.165")),
                eq(new BigDecimal("16500")), isNull());
    }

    // -------------------------------------------------------------------------
    // finalizeRedemptionFromOutbox legacy-payload path (F4).
    // The most critical untested code path: handles at-least-once recovery for
    // financial transfers when the original transaction was DISPATCHED but the
    // DB finalisation hadn't completed before a crash. Pre-c3bacfe2 payloads
    // are missing the new ircmRateApplied key.
    // -------------------------------------------------------------------------

    @Test
    void finalizeRedemptionFromOutbox_legacyPayloadWithoutIrcmRate_fallsBackToTaxServiceAndPersists() {
        // Arrange: legacy-shaped payload — has ircmAmount and grossCashAmount but no
        // ircmRateApplied (the field hadn't been added to buildRedemptionPayload yet).
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("bondId", ASSET_ID);
        payload.put("userId", USER_ID);
        payload.put("units", "1");
        payload.put("faceValue", "1000000");
        payload.put("cashAmount", "983500");
        payload.put("ircmAmount", "16500");
        payload.put("grossCashAmount", "1000000");
        payload.put("avgPurchasePrice", "900000");
        // intentionally NO "ircmRateApplied" key

        FineractOutboxEntry entry = new FineractOutboxEntry();
        entry.setId(UUID.randomUUID());

        Asset bond = maturedBond();

        when(outboxService.parsePayload(entry)).thenReturn(payload);
        when(principalRedemptionRepository.findByAssetId(ASSET_ID))
                .thenReturn(java.util.Collections.emptyList());
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(taxService.getEffectiveIrcmRate(bond)).thenReturn(new BigDecimal("0.165"));
        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID), any(), any(), any(), any()))
                .thenReturn(new BigDecimal("100000"));

        // Act
        service.finalizeRedemptionFromOutbox(entry);

        // Assert: the fallback queried TaxService for the rate at retry time, and
        // the recorded tax-transaction uses that rate. Persisted record carries
        // it through (verified by the saved row's status==SUCCESS).
        verify(taxService).getEffectiveIrcmRate(bond);
        verify(taxService).recordTaxTransaction(
                isNull(), isNull(), eq(USER_ID), eq(ASSET_ID),
                eq("IRCM"), any(), eq(new BigDecimal("0.165")),
                eq(new BigDecimal("16500")), isNull());
        verify(principalRedemptionRepository).save(argThat(rec ->
                rec != null
                && "SUCCESS".equals(rec.getStatus())
                && rec.getIrcmWithheld().compareTo(new BigDecimal("16500")) == 0
                && rec.getIrcmRateApplied() != null
                && rec.getIrcmRateApplied().compareTo(new BigDecimal("0.165")) == 0
        ));
        verify(outboxService).markConfirmed(entry.getId());
    }

    @Test
    void finalizeRedemptionFromOutbox_modernPayloadCarriesIrcmRate_doesNotQueryTaxService() {
        // Arrange: payload written post-c3bacfe2 carries ircmRateApplied so the
        // service does NOT need to fall back to TaxService.
        java.util.Map<String, Object> payload = new java.util.HashMap<>();
        payload.put("bondId", ASSET_ID);
        payload.put("userId", USER_ID);
        payload.put("units", "1");
        payload.put("faceValue", "1000000");
        payload.put("cashAmount", "983500");
        payload.put("ircmAmount", "16500");
        payload.put("grossCashAmount", "1000000");
        payload.put("avgPurchasePrice", "900000");
        payload.put("ircmRateApplied", "0.165");

        FineractOutboxEntry entry = new FineractOutboxEntry();
        entry.setId(UUID.randomUUID());

        Asset bond = maturedBond();

        when(outboxService.parsePayload(entry)).thenReturn(payload);
        when(principalRedemptionRepository.findByAssetId(ASSET_ID))
                .thenReturn(java.util.Collections.emptyList());
        when(assetRepository.findById(ASSET_ID)).thenReturn(Optional.of(bond));
        when(portfolioService.updatePositionAfterSell(eq(USER_ID), eq(ASSET_ID), any(), any(), any(), any()))
                .thenReturn(new BigDecimal("100000"));

        // Act
        service.finalizeRedemptionFromOutbox(entry);

        // Assert: the rate from the payload is used; TaxService is NOT consulted.
        verify(taxService, never()).getEffectiveIrcmRate(any());
        verify(taxService).recordTaxTransaction(
                isNull(), isNull(), eq(USER_ID), eq(ASSET_ID),
                eq("IRCM"), any(), eq(new BigDecimal("0.165")),
                eq(new BigDecimal("16500")), isNull());
    }
}
