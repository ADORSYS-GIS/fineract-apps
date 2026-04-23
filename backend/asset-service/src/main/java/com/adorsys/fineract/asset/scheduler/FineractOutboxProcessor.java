package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.FineractOutboxEntry;
import com.adorsys.fineract.asset.repository.FineractOutboxRepository;
import com.adorsys.fineract.asset.service.DelistingService;
import com.adorsys.fineract.asset.service.FineractOutboxService;
import com.adorsys.fineract.asset.service.PrincipalRedemptionService;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import com.adorsys.fineract.asset.service.SettlementService;
import com.adorsys.fineract.asset.service.TradingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Retries DB finalization for outbox entries whose Fineract call succeeded (DISPATCHED)
 * but whose post-Fineract DB writes were not committed (outer transaction rolled back).
 *
 * <p>Only processes DISPATCHED entries — entries where Fineract was confirmed but
 * the DB finalization (portfolio update, trade log, supply adjustment, etc.) failed.
 * Does NOT re-call Fineract to avoid double transfers.</p>
 *
 * <p>PENDING entries older than 5 minutes indicate a stuck execution (service crash
 * between outbox write and Fineract call). These require manual review — the Fineract
 * call was never made, so no money moved. The processor alerts via log.error and a metric.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FineractOutboxProcessor {

    private final FineractOutboxRepository outboxRepository;
    private final FineractOutboxService outboxService;
    private final TradingService tradingService;
    private final ScheduledPaymentService scheduledPaymentService;
    private final PrincipalRedemptionService principalRedemptionService;
    private final DelistingService delistingService;
    private final SettlementService settlementService;

    /**
     * Retries DB finalization for DISPATCHED entries (Fineract succeeded, DB write failed).
     *
     * <p>No outer {@code @Transactional}: each {@code finalizeXxxFromOutbox} call is independently
     * transactional, and {@code markFailed} uses REQUIRES_NEW. An outer transaction would bundle
     * all 50 entries into one unit-of-work and hold FOR UPDATE locks during HTTP calls.</p>
     *
     * <p>ShedLock ensures single-pod execution, so FOR UPDATE SKIP LOCKED is belt-and-suspenders.
     * Idempotency guards + optimistic locking on entity @Version fields handle any theoretical
     * duplicate if ShedLock ever misses.</p>
     */
    @Scheduled(fixedDelay = 10_000)
    @SchedulerLock(name = "fineract-outbox-processor", lockAtMostFor = "PT55S", lockAtLeastFor = "PT5S")
    public void processPendingEntries() {
        Instant now = Instant.now();

        // Alert on stuck PENDING entries: Fineract was never called, no money moved, needs triage.
        long stuckPending = outboxRepository.countStuckPending(now.minusSeconds(300));
        if (stuckPending > 0) {
            log.error("Outbox: {} PENDING entr{} older than 5 min — possible crash before Fineract call. Manual review required.",
                    stuckPending, stuckPending == 1 ? "y" : "ies");
        }

        Instant cutoff = now.minusSeconds(30);
        List<FineractOutboxEntry> entries = outboxRepository.findDispatchedForProcessing(cutoff, 50);

        if (!entries.isEmpty()) {
            log.info("Outbox processor: found {} DISPATCHED entries to finalize", entries.size());
        }

        for (FineractOutboxEntry entry : entries) {
            try {
                dispatch(entry);
            } catch (Exception e) {
                log.error("Outbox finalization failed for entry {} (event={}): {}",
                        entry.getId(), entry.getEventType(), e.getMessage(), e);
                outboxService.markFailed(entry.getId(), e.getMessage());
                // If retries exhausted, immediately escalate rather than waiting 30 min for stale cleanup
                outboxRepository.findById(entry.getId())
                        .filter(u -> "FAILED".equals(u.getStatus()))
                        .ifPresent(failed -> {
                            if ("ORDER".equals(failed.getReferenceType())) {
                                tradingService.escalateOrderToNeedsReconciliation(
                                        failed.getReferenceId(),
                                        "Outbox finalization exhausted " + failed.getMaxRetries() + " retries: " + e.getMessage());
                            } else {
                                log.error("Non-trade outbox entry {} (event={}, refType={}, ref={}) exhausted all retries — manual reconciliation required.",
                                        failed.getId(), failed.getEventType(), failed.getReferenceType(), failed.getReferenceId());
                            }
                        });
            }
        }
    }

    private void dispatch(FineractOutboxEntry entry) {
        log.info("Retrying outbox finalization: id={}, event={}, reference={}",
                entry.getId(), entry.getEventType(), entry.getReferenceId());
        switch (entry.getEventType()) {
            case "TRADE_BUY", "TRADE_SELL" ->
                    tradingService.finalizeTradeFromOutbox(entry);
            case "COUPON_PAYMENT" ->
                    scheduledPaymentService.finalizeCouponFromOutbox(entry);
            case "INCOME_DISTRIBUTION" ->
                    scheduledPaymentService.finalizeIncomeFromOutbox(entry);
            case "PRINCIPAL_REDEMPTION" ->
                    principalRedemptionService.finalizeRedemptionFromOutbox(entry);
            case "FORCED_BUYBACK" ->
                    delistingService.finalizeBuybackFromOutbox(entry);
            case "SETTLEMENT_EXECUTION" ->
                    settlementService.finalizeSettlementFromOutbox(entry);
            default ->
                    log.warn("Unknown outbox event type: {}", entry.getEventType());
        }
    }
}
