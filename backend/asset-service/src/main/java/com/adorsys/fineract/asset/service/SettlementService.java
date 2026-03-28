package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.entity.Settlement;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Settlement service for LP payouts, tax remittances, trust rebalancing,
 * and fee collection. Implements maker-checker approval.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final FineractClient fineractClient;

    @Transactional
    public Settlement createSettlement(Settlement request) {
        request.setId(UUID.randomUUID().toString());
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());
        settlementRepository.save(request);
        log.info("Settlement created: id={}, type={}, amount={}, by={}",
                request.getId(), request.getSettlementType(), request.getAmount(), request.getCreatedBy());
        return request;
    }

    @Transactional
    public Settlement approveSettlement(String id, String approverUsername) {
        Settlement s = settlementRepository.findById(id)
                .orElseThrow(() -> new AssetException("Settlement not found: " + id));

        if (!"PENDING".equals(s.getStatus())) {
            throw new AssetException("Settlement " + id + " is not PENDING (current: " + s.getStatus() + ")");
        }

        // Maker-checker: approver must differ from creator
        if (approverUsername.equals(s.getCreatedBy())) {
            throw new AssetException("Maker-checker violation: approver cannot be the same as creator");
        }

        s.setStatus("APPROVED");
        s.setApprovedBy(approverUsername);
        s.setApprovedAt(Instant.now());
        settlementRepository.save(s);
        log.info("Settlement approved: id={}, by={}", id, approverUsername);
        return s;
    }

    @Transactional
    public Settlement executeSettlement(String id) {
        Settlement s = settlementRepository.findById(id)
                .orElseThrow(() -> new AssetException("Settlement not found: " + id));

        if (!"APPROVED".equals(s.getStatus())) {
            throw new AssetException("Settlement " + id + " is not APPROVED (current: " + s.getStatus() + ")");
        }

        try {
            // Create Fineract journal entry for the settlement
            String journalEntryId = fineractClient.createJournalEntry(
                    s.getSourceGlCode(), s.getDestinationGlCode(),
                    s.getAmount(), s.getDescription());

            s.setStatus("EXECUTED");
            s.setExecutedAt(Instant.now());
            s.setFineractJournalEntryId(journalEntryId);
            settlementRepository.save(s);
            log.info("Settlement executed: id={}, journalEntryId={}", id, journalEntryId);
        } catch (Exception e) {
            log.error("Settlement execution failed: id={}, error={}", id, e.getMessage());
            throw new AssetException("Settlement execution failed: " + e.getMessage(), e);
        }

        return s;
    }

    @Transactional
    public Settlement rejectSettlement(String id, String reason) {
        Settlement s = settlementRepository.findById(id)
                .orElseThrow(() -> new AssetException("Settlement not found: " + id));

        if (!"PENDING".equals(s.getStatus()) && !"APPROVED".equals(s.getStatus())) {
            throw new AssetException("Settlement " + id + " cannot be rejected (current: " + s.getStatus() + ")");
        }

        s.setStatus("REJECTED");
        s.setRejectedAt(Instant.now());
        s.setRejectionReason(reason);
        settlementRepository.save(s);
        log.info("Settlement rejected: id={}, reason={}", id, reason);
        return s;
    }

    @Transactional(readOnly = true)
    public List<Settlement> getPendingSettlements() {
        return settlementRepository.findByStatus("PENDING");
    }

    @Transactional(readOnly = true)
    public Page<Settlement> getSettlements(List<String> statuses, Pageable pageable) {
        if (statuses == null || statuses.isEmpty()) {
            return settlementRepository.findAll(pageable);
        }
        return settlementRepository.findByStatusIn(statuses, pageable);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSummary() {
        long pending = settlementRepository.countByStatus("PENDING");
        long approved = settlementRepository.countByStatus("APPROVED");
        long total = settlementRepository.count();
        return Map.of(
                "pendingCount", pending,
                "approvedCount", approved,
                "totalCount", total
        );
    }
}
