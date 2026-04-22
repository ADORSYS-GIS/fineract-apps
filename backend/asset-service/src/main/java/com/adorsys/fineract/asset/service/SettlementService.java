package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractClient.BatchJournalEntryOp;
import com.adorsys.fineract.asset.client.FineractClient.BatchOperation;
import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import com.adorsys.fineract.asset.config.ResolvedTaxAccounts;
import com.adorsys.fineract.asset.dto.ExecuteRebalanceRequest;
import com.adorsys.fineract.asset.dto.RebalanceProposalResponse;
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
    private final ResolvedTaxAccounts resolvedTaxAccounts;
    private final AssetServiceConfig assetServiceConfig;
    private final com.adorsys.fineract.asset.repository.AssetRepository assetRepository;

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
        // Atomic guard: transition APPROVED → EXECUTING before touching Fineract so that
        // two concurrent callers cannot both post a journal entry for the same settlement.
        // The UPDATE is conditional on status='APPROVED', so only the first caller wins;
        // the second gets 0 rows and throws before any external side effect is sent.
        int updated = settlementRepository.transitionToExecuting(id);
        if (updated == 0) {
            Settlement current = settlementRepository.findById(id)
                    .orElseThrow(() -> new AssetException("Settlement not found: " + id));
            throw new AssetException("Settlement " + id + " is not APPROVED (current: "
                    + current.getStatus() + "); concurrent execution may already be in progress");
        }

        Settlement s = settlementRepository.findById(id)
                .orElseThrow(() -> new AssetException("Settlement not found after lock: " + id));

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
     *
     * <p>Accounting direction conventions (BatchJournalEntryOp: first arg = debit, second = credit):
     * <ul>
     *   <li>LP_PAYOUT: debit 4011/4012 (liability, reduces balance owed to LP) → credit 5011 (UBA trust, cash out)</li>
     *   <li>TAX_REMITTANCE: debit 4013/4301 (tax payable liability) → credit 5031 (Afriland, cash out)</li>
     *   <li>TRUST_REBALANCE: source is a 5xxx asset account (cash leaving); destination is a 5xxx asset account
     *       (cash arriving). Asset accounts: debit = increase, credit = decrease — so the legs are swapped
     *       relative to the source→destination label: debit destination (increases it), credit source (decreases it).</li>
     *   <li>FEE_COLLECTION and others: debit source, credit destination (source is a liability/payable).</li>
     * </ul>
     */
    private List<BatchOperation> buildSettlementOps(Settlement s, Map<String, Long> glCodeToId) {
        String desc = s.getDescription() != null ? s.getDescription() : "Settlement: " + s.getSettlementType();
        List<BatchOperation> ops = new ArrayList<>();

        switch (s.getSettlementType()) {
            case "LP_PAYOUT" -> {
                // LP payout: debit sourceGlCode (4011 LSAV / 4012 LSPD — liability reduced)
                //            credit 5011 UBA trust (cash leaves UBA to LP's external account)
                Long ubaTrustGl = resolveGl(glCodeToId, "5011");
                String sourceCode = s.getSourceGlCode() != null ? s.getSourceGlCode() : "4011";
                Long sourceGl = resolveGl(glCodeToId, sourceCode);
                ops.add(new BatchJournalEntryOp(sourceGl, ubaTrustGl, s.getAmount(), "XAF", desc));
            }
            case "TAX_REMITTANCE" -> {
                // Tax remittance: debit tax payable (liability reduced), credit Afriland (cash out)
                Long taxPayable = resolveGl(glCodeToId, s.getSourceGlCode() != null ? s.getSourceGlCode() : "4301");
                Long afrilandTax = resolveGl(glCodeToId, "5031");
                ops.add(new BatchJournalEntryOp(taxPayable, afrilandTax, s.getAmount(), "XAF", desc));
            }
            case "TRUST_REBALANCE" -> {
                // Trust rebalance moves cash between two asset (5xxx) accounts.
                // Asset accounts: debit = increase, credit = decrease.
                // Money flows FROM source TO destination, so:
                //   debit destination (increases destination balance)
                //   credit source     (decreases source balance)
                Long debitGlId  = resolveGl(glCodeToId, s.getDestinationGlCode());
                Long creditGlId = resolveGl(glCodeToId, s.getSourceGlCode());
                ops.add(new BatchJournalEntryOp(debitGlId, creditGlId, s.getAmount(), "XAF", desc));
            }
            default -> {
                // FEE_COLLECTION and any future types: source is a liability/payable, destination receives.
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
                    try { lsav = lsav.add(fineractClient.getAccountBalance(asset.getLpCashAccountId())); } catch (Exception e) { log.warn("Failed to fetch balance for account: {}", e.getMessage()); }
                }
                if (asset.getLpSpreadAccountId() != null) {
                    try { lspd = lspd.add(fineractClient.getAccountBalance(asset.getLpSpreadAccountId())); } catch (Exception e) { log.warn("Failed to fetch balance for account: {}", e.getMessage()); }
                }
                if (asset.getLpTaxAccountId() != null) {
                    try { ltax = ltax.add(fineractClient.getAccountBalance(asset.getLpTaxAccountId())); } catch (Exception e) { log.warn("Failed to fetch balance for account: {}", e.getMessage()); }
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

    /**
     * Get trust account balances (MoMo, Orange, UBA, Afriland, Tax).
     * These are the physical cash accounts — helps admin decide how to rebalance.
     */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getTrustBalances() {
        String currency = assetServiceConfig.getSettlementCurrency();
        List<Map<String, Object>> accounts = new ArrayList<>();

        addGlBalance(accounts, "MTN Mobile Money", assetServiceConfig.getGlAccounts().getMtnMoMo(),
                resolvedGlAccounts.getMtnMoMoId(), currency);
        addGlBalance(accounts, "Orange Money", assetServiceConfig.getGlAccounts().getOrangeMoney(),
                resolvedGlAccounts.getOrangeMoneyId(), currency);
        addGlBalance(accounts, "UBA Bank", assetServiceConfig.getGlAccounts().getUbaBank(),
                resolvedGlAccounts.getUbaBankId(), currency);
        addGlBalance(accounts, "Afriland Bank", assetServiceConfig.getGlAccounts().getAfrilandBank(),
                resolvedGlAccounts.getAfrilandBankId(), currency);
        addGlBalance(accounts, "Afriland Tax", assetServiceConfig.getGlAccounts().getTaxPayableFundSource(),
                resolvedGlAccounts.getTaxPayableFundSourceId(), currency);

        return accounts;
    }

    private void addGlBalance(List<Map<String, Object>> accounts, String name, String glCode,
                                Long glId, String currency) {
        if (glId == null) return;
        try {
            BigDecimal balance = fetchGlBalance(glId, currency);
            accounts.add(Map.of(
                    "name", name,
                    "glCode", glCode,
                    "balance", balance
            ));
        } catch (Exception e) {
            log.warn("Failed to fetch trust balance for GL {} ({}): {}", glCode, name, e.getMessage());
        }
    }

    private BigDecimal fetchGlBalance(Long glId, String currency) {
        var entries = fineractClient.getJournalEntries(glId, currency, null, null);
        BigDecimal debits = BigDecimal.ZERO;
        BigDecimal credits = BigDecimal.ZERO;
        for (var entry : entries) {
            BigDecimal amount = entry.get("amount") instanceof Number n
                    ? BigDecimal.valueOf(n.doubleValue()) : BigDecimal.ZERO;
            Object entryType = entry.get("entryType");
            String typeValue = "";
            if (entryType instanceof Map<?, ?> etMap) {
                Object val = etMap.get("value");
                if (val != null) typeValue = val.toString();
            }
            if ("DEBIT".equalsIgnoreCase(typeValue)) debits = debits.add(amount);
            else if ("CREDIT".equalsIgnoreCase(typeValue)) credits = credits.add(amount);
        }
        return debits.subtract(credits);
    }

    private BigDecimal safeGlBalance(Long glId, String currency) {
        try {
            return glId != null ? fetchGlBalance(glId, currency) : BigDecimal.ZERO;
        } catch (Exception e) {
            log.warn("Failed to fetch GL balance for id {}: {}", glId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    private BigDecimal safeSavingsBalance(Long savingsAccountId) {
        try {
            return savingsAccountId != null ? fineractClient.getAccountBalance(savingsAccountId) : BigDecimal.ZERO;
        } catch (Exception e) {
            log.warn("Failed to fetch savings balance for account {}: {}", savingsAccountId, e.getMessage());
            return BigDecimal.ZERO;
        }
    }

    // ── Rebalance Proposal ──

    @Transactional(readOnly = true)
    public RebalanceProposalResponse proposeRebalance(BigDecimal reservePercent) {
        if (reservePercent == null) {
            reservePercent = assetServiceConfig.getRebalance().getDefaultReservePercent();
        }
        reservePercent = reservePercent.max(BigDecimal.ZERO).min(new BigDecimal("0.99"));
        String currency = assetServiceConfig.getSettlementCurrency();

        // 1. LP demand — kept per-LP so that the resulting settlements can be attributed
        //    to a specific liquidity partner for reconciliation and wire instructions.
        List<Map<String, Object>> lpBalances = getLpBalances();
        BigDecimal totalLsav = lpBalances.stream()
                .map(lp -> (BigDecimal) lp.get("lsavBalance"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalLspd = lpBalances.stream()
                .map(lp -> (BigDecimal) lp.get("lspdBalance"))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalLpOwed = totalLsav.add(totalLspd);

        // 2. Tax & fee demand
        //    LP tax withholding (GL 4013) — tax withheld from LPs per-asset
        BigDecimal lpTaxOwed = safeGlBalance(resolvedGlAccounts.getLpTaxWithholdingId(), currency).abs();
        //    DGI tax (global tax savings accounts) — registration duty, IRCM, capital gains, TVA
        BigDecimal dgiTaxOwed = safeSavingsBalance(resolvedTaxAccounts.getRegistrationDutyAccountId())
                .add(safeSavingsBalance(resolvedTaxAccounts.getIrcmAccountId()))
                .add(safeSavingsBalance(resolvedTaxAccounts.getCapitalGainsAccountId()))
                .add(safeSavingsBalance(resolvedTaxAccounts.getTvaAccountId()));
        BigDecimal taxOwed = lpTaxOwed.add(dgiTaxOwed);
        BigDecimal feesOwed = safeGlBalance(resolvedGlAccounts.getPlatformFeePayableId(), currency).abs();

        // 3. Current bank balances
        BigDecimal ubaBalance = safeGlBalance(resolvedGlAccounts.getUbaBankId(), currency);
        BigDecimal afrilandBalance = safeGlBalance(resolvedGlAccounts.getTaxPayableFundSourceId(), currency);

        // 4. Gap analysis
        BigDecimal totalOutflow = totalLpOwed.add(feesOwed).add(taxOwed);
        BigDecimal needInUba = totalLpOwed.add(feesOwed).subtract(ubaBalance).max(BigDecimal.ZERO);
        BigDecimal needInAfriland = taxOwed.subtract(afrilandBalance).max(BigDecimal.ZERO);
        BigDecimal totalNeeded = needInUba.add(needInAfriland);

        // 5. Mobile money sources
        BigDecimal momoBalance = safeGlBalance(resolvedGlAccounts.getMtnMoMoId(), currency);
        BigDecimal orangeBalance = safeGlBalance(resolvedGlAccounts.getOrangeMoneyId(), currency);
        BigDecimal momoAvail = momoBalance.subtract(momoBalance.multiply(reservePercent)).max(BigDecimal.ZERO);
        BigDecimal orangeAvail = orangeBalance.subtract(orangeBalance.multiply(reservePercent)).max(BigDecimal.ZERO);
        BigDecimal totalAvail = momoAvail.add(orangeAvail);

        boolean feasible = totalAvail.compareTo(totalNeeded) >= 0;
        BigDecimal shortfall = feasible ? BigDecimal.ZERO : totalNeeded.subtract(totalAvail);

        // 6. Build transfers (rebalances + payouts)
        List<RebalanceProposalResponse.ProposedTransfer> transfers = buildProposedTransfers(
                needInUba, needInAfriland, momoAvail, orangeAvail, totalAvail,
                lpBalances, lpTaxOwed, dgiTaxOwed, feesOwed);

        return new RebalanceProposalResponse(
                totalLpOwed, taxOwed, feesOwed, totalOutflow,
                ubaBalance, afrilandBalance,
                needInUba, needInAfriland,
                momoBalance, orangeBalance, momoAvail, orangeAvail, totalAvail,
                reservePercent, feasible, shortfall, transfers);
    }

    private List<RebalanceProposalResponse.ProposedTransfer> buildProposedTransfers(
            BigDecimal needInUba, BigDecimal needInAfriland,
            BigDecimal momoAvail, BigDecimal orangeAvail, BigDecimal totalAvail,
            List<Map<String, Object>> lpBalances,
            BigDecimal lpTaxOwed, BigDecimal dgiTaxOwed, BigDecimal feesOwed) {

        List<RebalanceProposalResponse.ProposedTransfer> result = new ArrayList<>();
        BigDecimal minTransfer = assetServiceConfig.getRebalance().getMinTransferAmount();

        String momoGl = assetServiceConfig.getGlAccounts().getMtnMoMo();
        String orangeGl = assetServiceConfig.getGlAccounts().getOrangeMoney();
        String ubaGl = assetServiceConfig.getGlAccounts().getUbaBank();
        String afriGl = assetServiceConfig.getGlAccounts().getTaxPayableFundSource();

        // Step 1: Trust Rebalance transfers (MoMo/Orange → UBA/Afriland)
        BigDecimal totalNeeded = needInUba.add(needInAfriland);
        if (totalNeeded.compareTo(BigDecimal.ZERO) > 0 && totalAvail.compareTo(BigDecimal.ZERO) > 0) {
            String[] sources = {momoGl, orangeGl};
            String[] sourceNames = {"MTN Mobile Money", "Orange Money"};
            BigDecimal[] avails = {momoAvail, orangeAvail};
            String[] dests = {ubaGl, afriGl};
            String[] destNames = {"UBA Bank", "Afriland Tax"};
            BigDecimal[] needs = {needInUba, needInAfriland};

            for (int s = 0; s < sources.length; s++) {
                if (avails[s].compareTo(BigDecimal.ZERO) <= 0) continue;
                BigDecimal sourceProportion = avails[s].divide(totalAvail, 10, java.math.RoundingMode.HALF_UP);

                for (int d = 0; d < dests.length; d++) {
                    if (needs[d].compareTo(BigDecimal.ZERO) <= 0) continue;
                    BigDecimal amount = needs[d].multiply(sourceProportion)
                            .setScale(0, java.math.RoundingMode.HALF_UP);
                    if (amount.compareTo(minTransfer) >= 0) {
                        result.add(new RebalanceProposalResponse.ProposedTransfer(
                                1, "TRUST_REBALANCE", sources[s], sourceNames[s],
                                dests[d], destNames[d], amount,
                                "Rebalance: " + sourceNames[s] + " → " + destNames[d],
                                "Transfer from " + sourceNames[s] + " portal to " + destNames[d]));
                    }
                }
            }
        }

        // Step 2: LP Payout — one entry per LP per account type so that each settlement can be
        // attributed to a specific liquidity partner for reconciliation and wire instructions.
        for (var lp : lpBalances) {
            Long lpClientId = (Long) lp.get("lpClientId");
            String lpName = (String) lp.get("lpClientName");
            BigDecimal lsav = (BigDecimal) lp.get("lsavBalance");
            BigDecimal lspd = (BigDecimal) lp.get("lspdBalance");

            if (lsav.compareTo(minTransfer) >= 0) {
                result.add(new RebalanceProposalResponse.ProposedTransfer(
                        2, "LP_PAYOUT", "4011", "LP Settlement Control (" + lpName + ")",
                        ubaGl, "UBA Bank", lsav,
                        "LP Payout: clear LP settlement balance for " + lpName,
                        "Wire " + lsav.toPlainString() + " XAF from UBA to LP " + lpClientId + " (" + lpName + ")"));
            }
            if (lspd.compareTo(minTransfer) >= 0) {
                result.add(new RebalanceProposalResponse.ProposedTransfer(
                        2, "LP_PAYOUT", "4012", "LP Spread Payable (" + lpName + ")",
                        ubaGl, "UBA Bank", lspd,
                        "LP Payout: clear LP spread balance for " + lpName,
                        "Wire " + lspd.toPlainString() + " XAF from UBA to LP " + lpClientId + " (" + lpName + ")"));
            }
        }

        // Step 3: Tax Remittance — separate entries for LP tax (4013) and DGI tax (4301)
        if (lpTaxOwed.compareTo(minTransfer) >= 0) {
            result.add(new RebalanceProposalResponse.ProposedTransfer(
                    3, "TAX_REMITTANCE", "4013", "LP Tax Withholding",
                    afriGl, "Afriland Tax", lpTaxOwed,
                    "Tax Remittance: clear LP tax withholding",
                    "Wire " + lpTaxOwed.toPlainString() + " XAF from Afriland to DGI tax authority"));
        }
        if (dgiTaxOwed.compareTo(minTransfer) >= 0) {
            result.add(new RebalanceProposalResponse.ProposedTransfer(
                    3, "TAX_REMITTANCE", "4301", "Tax Payable - Registration Duty",
                    afriGl, "Afriland Tax", dgiTaxOwed,
                    "Tax Remittance: clear DGI tax collection",
                    "Wire " + dgiTaxOwed.toPlainString() + " XAF from Afriland to DGI tax authority"));
        }

        // Step 4: Fee Collection (collect platform fees via UBA)
        if (feesOwed.compareTo(minTransfer) >= 0) {
            result.add(new RebalanceProposalResponse.ProposedTransfer(
                    2, "FEE_COLLECTION", "4201", "Platform Fee Payable",
                    ubaGl, "UBA Bank", feesOwed,
                    "Fee Collection: collect platform fees",
                    "Transfer platform fees to UBA (internal)"));
        }

        return result;
    }

    @Transactional
    public List<Settlement> executeRebalanceProposal(ExecuteRebalanceRequest request, String createdBy) {
        List<Settlement> created = new ArrayList<>();
        for (var transfer : request.transfers()) {
            Settlement s = Settlement.builder()
                    .settlementType(transfer.settlementType())
                    .amount(transfer.amount())
                    .sourceGlCode(transfer.sourceGlCode())
                    .destinationGlCode(transfer.destinationGlCode())
                    .description(transfer.description())
                    .createdBy(createdBy)
                    .build();
            created.add(createSettlement(s));
        }
        log.info("Rebalance proposal executed: {} settlements created by {}", created.size(), createdBy);
        return created;
    }

}
