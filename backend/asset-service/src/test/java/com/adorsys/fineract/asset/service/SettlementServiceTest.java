package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchJournalEntryOp;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.config.AdminSecurityCheck;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.config.ResolvedTaxAccounts;
import com.adorsys.fineract.asset.dto.RebalanceProposalResponse;
import com.adorsys.fineract.asset.entity.Settlement;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.AssetRepository;
import com.adorsys.fineract.asset.repository.SettlementRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SettlementServiceTest {

    @Mock private SettlementRepository settlementRepository;
    @Mock private FineractClient fineractClient;
    @Mock private ResolvedGlAccounts resolvedGlAccounts;
    @Mock private ResolvedTaxAccounts resolvedTaxAccounts;
    @Mock private AdminSecurityCheck adminSecurity;
    @Mock private AssetServiceConfig assetServiceConfig;
    @Mock private AssetRepository assetRepository;

    @InjectMocks
    private SettlementService settlementService;

    @Captor private ArgumentCaptor<Settlement> settlementCaptor;
    @Captor private ArgumentCaptor<List<BatchOperation>> batchOpsCaptor;

    // -------------------------------------------------------------------------
    // Create settlement
    // -------------------------------------------------------------------------

    @Test
    void createSettlement_setsStatusPendingAndGeneratesId() {
        Settlement request = Settlement.builder()
                .settlementType("LP_PAYOUT")
                .amount(new BigDecimal("10000"))
                .lpClientId(1L)
                .createdBy("admin1")
                .sourceGlCode("4011")
                .destinationGlCode("5011")
                .build();

        when(settlementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Settlement result = settlementService.createSettlement(request);

        assertNotNull(result.getId(), "ID should be generated");
        assertEquals("PENDING", result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertEquals("LP_PAYOUT", result.getSettlementType());
    }

    // -------------------------------------------------------------------------
    // Approve settlement — maker-checker
    // -------------------------------------------------------------------------

    @Test
    void approveSettlement_differentApprover_succeeds() {
        Settlement pending = Settlement.builder()
                .id("settle-001")
                .status("PENDING")
                .createdBy("admin1")
                .build();

        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(pending));
        when(settlementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Settlement result = settlementService.approveSettlement("settle-001", "admin2");

        assertEquals("APPROVED", result.getStatus());
        assertEquals("admin2", result.getApprovedBy());
        assertNotNull(result.getApprovedAt());
    }

    @Test
    void approveSettlement_sameAsCreator_throwsMakerCheckerViolation() {
        Settlement pending = Settlement.builder()
                .id("settle-001")
                .status("PENDING")
                .createdBy("admin1")
                .build();

        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(pending));

        AssetException ex = assertThrows(AssetException.class,
                () -> settlementService.approveSettlement("settle-001", "admin1"));

        assertTrue(ex.getMessage().contains("Maker-checker violation"));
    }

    @Test
    void approveSettlement_notPending_throws() {
        Settlement executed = Settlement.builder()
                .id("settle-001")
                .status("EXECUTED")
                .build();

        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(executed));

        AssetException ex = assertThrows(AssetException.class,
                () -> settlementService.approveSettlement("settle-001", "admin2"));

        assertTrue(ex.getMessage().contains("not PENDING"));
    }

    // -------------------------------------------------------------------------
    // Execute settlement — batch API
    // -------------------------------------------------------------------------

    @Test
    void executeSettlement_approved_createsJournalEntryViaBatch() {
        Settlement approved = Settlement.builder()
                .id("settle-001")
                .status("APPROVED")
                .settlementType("LP_PAYOUT")
                .sourceGlCode("4011")
                .destinationGlCode("5011")
                .amount(new BigDecimal("5000"))
                .description("LP payout test")
                .build();

        when(settlementRepository.transitionToExecuting("settle-001")).thenReturn(1);
        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(approved));
        when(fineractClient.lookupGlAccounts()).thenReturn(Map.of("4011", 10L, "5011", 20L));
        when(fineractClient.executeAtomicBatch(anyList())).thenReturn(
                List.of(Map.of("requestId", "batch-1")));
        when(settlementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Settlement result = settlementService.executeSettlement("settle-001");

        assertEquals("EXECUTED", result.getStatus());
        assertNotNull(result.getExecutedAt());
        assertEquals("batch-1", result.getFineractJournalEntryId());

        verify(fineractClient).executeAtomicBatch(anyList());
    }

    @Test
    void executeSettlement_notApproved_throws() {
        // transitionToExecuting returns 0 (settlement is not APPROVED); the service then
        // fetches the current status to include it in the error message.
        Settlement pending = Settlement.builder()
                .id("settle-001")
                .status("PENDING")
                .build();

        when(settlementRepository.transitionToExecuting("settle-001")).thenReturn(0);
        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(pending));

        AssetException ex = assertThrows(AssetException.class,
                () -> settlementService.executeSettlement("settle-001"));

        assertTrue(ex.getMessage().contains("not APPROVED"));
        // Fineract must never be called when the settlement is not APPROVED
        verify(fineractClient, never()).executeAtomicBatch(anyList());
    }

    @Test
    void executeSettlement_trustRebalance_swapsDebitCreditLegs() {
        // TRUST_REBALANCE moves cash from a source 5xxx asset account to a destination 5xxx account.
        // For asset accounts: debit = increase, credit = decrease.
        // Correct direction: debit destination (cash arriving), credit source (cash leaving).
        Settlement rebalance = Settlement.builder()
                .id("settle-002")
                .status("APPROVED")
                .settlementType("TRUST_REBALANCE")
                .sourceGlCode("5101")       // MTN MoMo trust (cash leaving)
                .destinationGlCode("5201")  // UBA bank trust (cash arriving)
                .amount(new BigDecimal("1000000"))
                .build();

        when(settlementRepository.transitionToExecuting("settle-002")).thenReturn(1);
        when(settlementRepository.findById("settle-002")).thenReturn(Optional.of(rebalance));
        when(fineractClient.lookupGlAccounts()).thenReturn(
                Map.of("5101", 101L, "5201", 201L));
        when(fineractClient.executeAtomicBatch(batchOpsCaptor.capture())).thenReturn(
                List.of(Map.of("requestId", "batch-rebalance")));
        when(settlementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        settlementService.executeSettlement("settle-002");

        List<BatchOperation> ops = batchOpsCaptor.getValue();
        assertEquals(1, ops.size());
        BatchJournalEntryOp op = (BatchJournalEntryOp) ops.get(0);
        // Debit = destination (UBA, cash arriving), Credit = source (MTN, cash leaving)
        assertEquals(201L, op.debitGlAccountId(),  "debit must be destination GL (UBA, cash arriving)");
        assertEquals(101L, op.creditGlAccountId(), "credit must be source GL (MTN, cash leaving)");
    }

    @Test
    void executeSettlement_concurrentExecution_secondCallThrowsBeforeFineract() {
        // Two callers race on the same APPROVED settlement.
        // The first call wins the transitionToExecuting (returns 1); the second gets 0 and must
        // throw before executeAtomicBatch is ever called.
        Settlement approved = Settlement.builder()
                .id("settle-003")
                .status("EXECUTING")  // already being executed by the first thread
                .build();

        when(settlementRepository.transitionToExecuting("settle-003")).thenReturn(0);
        when(settlementRepository.findById("settle-003")).thenReturn(Optional.of(approved));

        AssetException ex = assertThrows(AssetException.class,
                () -> settlementService.executeSettlement("settle-003"));

        assertTrue(ex.getMessage().contains("settle-003"));
        verify(fineractClient, never()).executeAtomicBatch(anyList());
        verify(fineractClient, never()).lookupGlAccounts();
    }

    // -------------------------------------------------------------------------
    // Reject settlement
    // -------------------------------------------------------------------------

    @Test
    void rejectSettlement_pending_succeeds() {
        Settlement pending = Settlement.builder()
                .id("settle-001")
                .status("PENDING")
                .build();

        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(pending));
        when(settlementRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Settlement result = settlementService.rejectSettlement("settle-001", "Not needed");

        assertEquals("REJECTED", result.getStatus());
        assertEquals("Not needed", result.getRejectionReason());
        assertNotNull(result.getRejectedAt());
    }

    @Test
    void rejectSettlement_alreadyExecuted_throws() {
        Settlement executed = Settlement.builder()
                .id("settle-001")
                .status("EXECUTED")
                .build();

        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(executed));

        AssetException ex = assertThrows(AssetException.class,
                () -> settlementService.rejectSettlement("settle-001", "reason"));

        assertTrue(ex.getMessage().contains("cannot be rejected"));
    }

    // -------------------------------------------------------------------------
    // Summary
    // -------------------------------------------------------------------------

    @Test
    void getSummary_returnsCorrectCounts() {
        when(settlementRepository.countByStatus("PENDING")).thenReturn(3L);
        when(settlementRepository.countByStatus("APPROVED")).thenReturn(1L);
        when(settlementRepository.count()).thenReturn(10L);

        var summary = settlementService.getSummary();

        assertEquals(3L, summary.get("pendingCount"));
        assertEquals(1L, summary.get("approvedCount"));
        assertEquals(10L, summary.get("totalCount"));
    }

    // -------------------------------------------------------------------------
    // Rebalance proposal — per-LP payout attribution
    // -------------------------------------------------------------------------

    @Test
    @SuppressWarnings("unchecked")
    void proposeRebalance_multipleLPs_emitsOnePayoutEntryPerLp() {
        // Two LPs with non-zero LSAV balances must each appear as a separate LP_PAYOUT
        // proposal so that wire instructions can be attributed per liquidity partner.
        var asset1a = new com.adorsys.fineract.asset.entity.Asset();
        asset1a.setLpClientId(1L);
        asset1a.setLpClientName("LP Alpha");
        asset1a.setLpCashAccountId(100L);

        var asset2a = new com.adorsys.fineract.asset.entity.Asset();
        asset2a.setLpClientId(2L);
        asset2a.setLpClientName("LP Beta");
        asset2a.setLpCashAccountId(200L);

        when(assetRepository.findAll()).thenReturn(List.of(asset1a, asset2a));
        // LP 1: LSAV balance = 500,000
        when(fineractClient.getAccountBalance(100L)).thenReturn(new BigDecimal("500000"));
        // LP 2: LSAV balance = 300,000
        when(fineractClient.getAccountBalance(200L)).thenReturn(new BigDecimal("300000"));

        // Stub GL and config so the rest of proposeRebalance runs without error
        var rebalanceCfg = mock(AssetServiceConfig.Rebalance.class);
        when(rebalanceCfg.getDefaultReservePercent()).thenReturn(new BigDecimal("0.10"));
        when(rebalanceCfg.getMinTransferAmount()).thenReturn(new BigDecimal("10000"));
        when(assetServiceConfig.getRebalance()).thenReturn(rebalanceCfg);
        when(assetServiceConfig.getSettlementCurrency()).thenReturn("XAF");

        var glCfg = mock(AssetServiceConfig.GlAccounts.class);
        when(glCfg.getMtnMoMo()).thenReturn("5101");
        when(glCfg.getOrangeMoney()).thenReturn("5102");
        when(glCfg.getUbaBank()).thenReturn("5201");
        when(glCfg.getTaxPayableFundSource()).thenReturn("5301");
        when(assetServiceConfig.getGlAccounts()).thenReturn(glCfg);

        // Trust account GL balances: all resolvedGlAccounts IDs are null so safeGlBalance
        // short-circuits without calling getJournalEntries — no additional stub needed.
        // Tax savings accounts — zero balances
        when(resolvedTaxAccounts.getRegistrationDutyAccountId()).thenReturn(null);
        when(resolvedTaxAccounts.getIrcmAccountId()).thenReturn(null);
        when(resolvedTaxAccounts.getCapitalGainsAccountId()).thenReturn(null);
        when(resolvedTaxAccounts.getTvaAccountId()).thenReturn(null);
        when(resolvedGlAccounts.getLpTaxWithholdingId()).thenReturn(null);
        when(resolvedGlAccounts.getPlatformFeePayableId()).thenReturn(null);
        when(resolvedGlAccounts.getMtnMoMoId()).thenReturn(null);
        when(resolvedGlAccounts.getOrangeMoneyId()).thenReturn(null);
        when(resolvedGlAccounts.getUbaBankId()).thenReturn(null);
        when(resolvedGlAccounts.getTaxPayableFundSourceId()).thenReturn(null);

        RebalanceProposalResponse response = settlementService.proposeRebalance(null);

        List<RebalanceProposalResponse.ProposedTransfer> lpPayouts = response.transfers().stream()
                .filter(t -> "LP_PAYOUT".equals(t.settlementType()))
                .toList();

        // Expect exactly two LP_PAYOUT entries — one for each LP — not one aggregate
        assertEquals(2, lpPayouts.size(),
                "Should emit one LP_PAYOUT per LP, not one aggregate; got: " + lpPayouts);

        boolean hasAlpha = lpPayouts.stream().anyMatch(t -> t.sourceName().contains("LP Alpha"));
        boolean hasBeta  = lpPayouts.stream().anyMatch(t -> t.sourceName().contains("LP Beta"));
        assertTrue(hasAlpha, "LP Alpha payout missing from proposal");
        assertTrue(hasBeta,  "LP Beta payout missing from proposal");
    }
}
