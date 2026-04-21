package com.adorsys.fineract.asset.scheduler;

import com.adorsys.fineract.asset.entity.FineractOutboxEntry;
import com.adorsys.fineract.asset.repository.FineractOutboxRepository;
import com.adorsys.fineract.asset.service.DelistingService;
import com.adorsys.fineract.asset.service.FineractOutboxService;
import com.adorsys.fineract.asset.service.PrincipalRedemptionService;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import com.adorsys.fineract.asset.service.TradingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

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
 * between outbox write and Fineract call) and require admin attention.</p>
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

    @Scheduled(fixedDelay = 10_000)
    @SchedulerLock(name = "fineract-outbox-processor", lockAtMostFor = "PT55S", lockAtLeastFor = "PT5S")
    @Transactional
    public void processPendingEntries() {
        Instant cutoff = Instant.now().minusSeconds(30);
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
            default ->
                    log.warn("Unknown outbox event type: {}", entry.getEventType());
        }
    }
}
