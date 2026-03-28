package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.entity.Settlement;
import com.adorsys.fineract.asset.exception.AssetException;
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

    @InjectMocks
    private SettlementService settlementService;

    @Captor private ArgumentCaptor<Settlement> settlementCaptor;

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
                .sourceGlCode("4011")
                .destinationGlCode("5011")
                .amount(new BigDecimal("5000"))
                .description("LP payout test")
                .build();

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
        Settlement pending = Settlement.builder()
                .id("settle-001")
                .status("PENDING")
                .build();

        when(settlementRepository.findById("settle-001")).thenReturn(Optional.of(pending));

        AssetException ex = assertThrows(AssetException.class,
                () -> settlementService.executeSettlement("settle-001"));

        assertTrue(ex.getMessage().contains("not APPROVED"));
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
}
