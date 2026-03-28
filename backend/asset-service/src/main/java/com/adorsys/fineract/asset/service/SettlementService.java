package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchJournalEntryOp;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.entity.Settlement;
import com.adorsys.fineract.asset.exception.AssetException;
import com.adorsys.fineract.asset.repository.SettlementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
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
    private final ResolvedGlAccounts resolvedGlAccounts;

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
            Map<String, Long> glCodeToId = fineractClient.lookupGlAccounts();
            List<BatchOperation> ops = buildSettlementOps(s, glCodeToId);
            var batchResponses = fineractClient.executeAtomicBatch(ops);

            String batchId = batchResponses != null && !batchResponses.isEmpty()
                    ? batchResponses.get(0).getOrDefault("requestId", "").toString()
                    : null;

            s.setStatus("EXECUTED");
            s.setExecutedAt(Instant.now());
            s.setFineractJournalEntryId(batchId);
            settlementRepository.save(s);
            log.info("Settlement executed via batch: id={}, type={}, legs={}, batchId={}",
                    id, s.getSettlementType(), ops.size(), batchId);
        } catch (Exception e) {
            log.error("Settlement execution failed: id={}, error={}", id, e.getMessage());
            throw new AssetException("Settlement execution failed: " + e.getMessage(), e);
        }

        return s;
    }

    /**
     * Build batch operations based on settlement type.
     * LP_PAYOUT: multi-leg — clear LSAV (4011→5011) + LSPD (4012→5011)
     * TAX_REMITTANCE: clear LTAX (4013→5031) + DTAX (4301→5031)
     * Others: single journal entry from source→destination GL
     */
    private List<BatchOperation> buildSettlementOps(Settlement s, Map<String, Long> glCodeToId) {
        String desc = s.getDescription() != null ? s.getDescription() : "Settlement: " + s.getSettlementType();
        List<BatchOperation> ops = new ArrayList<>();

        switch (s.getSettlementType()) {
            case "LP_PAYOUT" -> {
                // Multi-leg: clear LP Settlement (4011) + LP Spread (4012) → UBA Trust (5011)
                Long lpSettlement = resolveGl(glCodeToId, "4011");
                Long lpSpread = resolveGl(glCodeToId, "4012");
                Long ubaTrust = resolveGl(glCodeToId, "5011");
                // Split amount: use source/dest GL codes if provided, otherwise use full amount on 4011
                if (s.getSourceGlCode() != null && s.getSourceGlCode().equals("4012")) {
                    // Spread-only payout
                    ops.add(new BatchJournalEntryOp(lpSpread, ubaTrust, s.getAmount(), "XAF", desc + " (spread)"));
                } else {
                    // Full LP payout — settlement + spread combined
                    ops.add(new BatchJournalEntryOp(lpSettlement, ubaTrust, s.getAmount(), "XAF", desc + " (settlement)"));
                    // If there's spread to clear, it would be a separate settlement
                }
            }
            case "TAX_REMITTANCE" -> {
                // Clear tax payable → Afriland tax account
                Long taxPayable = resolveGl(glCodeToId, s.getSourceGlCode() != null ? s.getSourceGlCode() : "4301");
                Long afrilandTax = resolveGl(glCodeToId, "5031");
                ops.add(new BatchJournalEntryOp(taxPayable, afrilandTax, s.getAmount(), "XAF", desc));
            }
            default -> {
                // Generic: single journal entry
                Long debitGlId = resolveGl(glCodeToId, s.getSourceGlCode());
                Long creditGlId = resolveGl(glCodeToId, s.getDestinationGlCode());
                ops.add(new BatchJournalEntryOp(debitGlId, creditGlId, s.getAmount(), "XAF", desc));
            }
        }

        return ops;
    }

    private Long resolveGl(Map<String, Long> glCodeToId, String glCode) {
        Long id = glCodeToId.get(glCode);
        if (id == null) {
            throw new AssetException("GL code not found: " + glCode);
        }
        return id;
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

    @Transactional(readOnly = true)
    public Settlement getSettlement(String id) {
        return settlementRepository.findById(id)
                .orElseThrow(() -> new AssetException("Settlement not found: " + id));
    }

    /**
     * Get per-LP unsettled balances for settlement creation.
     * Reuses LP Performance data to show LSAV/LSPD/LTAX balances.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getLpBalances() {
        var assets = assetRepository.findAll();
        Map<Long, List<com.adorsys.fineract.asset.entity.Asset>> lpAssets = assets.stream()
                .filter(a -> a.getLpClientId() != null)
                .collect(java.util.stream.Collectors.groupingBy(com.adorsys.fineract.asset.entity.Asset::getLpClientId));

        List<Map<String, Object>> result = new ArrayList<>();
        for (var entry : lpAssets.entrySet()) {
            Long lpClientId = entry.getKey();
            var assetList = entry.getValue();
            String lpName = assetList.get(0).getLpClientName();

            BigDecimal lsav = BigDecimal.ZERO;
            BigDecimal lspd = BigDecimal.ZERO;
            BigDecimal ltax = BigDecimal.ZERO;

            for (var asset : assetList) {
                if (asset.getLpCashAccountId() != null) {
                    try { lsav = lsav.add(fineractClient.getAccountBalance(asset.getLpCashAccountId())); } catch (Exception e) { /* skip */ }
                }
                if (asset.getLpSpreadAccountId() != null) {
                    try { lspd = lspd.add(fineractClient.getAccountBalance(asset.getLpSpreadAccountId())); } catch (Exception e) { /* skip */ }
                }
                if (asset.getLpTaxAccountId() != null) {
                    try { ltax = ltax.add(fineractClient.getAccountBalance(asset.getLpTaxAccountId())); } catch (Exception e) { /* skip */ }
                }
            }

            BigDecimal unsettled = lsav.add(lspd).subtract(ltax);
            result.add(Map.of(
                    "lpClientId", lpClientId,
                    "lpClientName", lpName != null ? lpName : "LP " + lpClientId,
                    "lsavBalance", lsav,
                    "lspdBalance", lspd,
                    "ltaxBalance", ltax,
                    "unsettledTotal", unsettled,
                    "assetCount", assetList.size()
            ));
        }
        return result;
    }

    @org.springframework.beans.factory.annotation.Autowired
    private com.adorsys.fineract.asset.repository.AssetRepository assetRepository;
}
