package com.adorsys.fineract.gateway.scheduler;

import com.adorsys.fineract.gateway.client.FineractClient;
import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
import com.adorsys.fineract.gateway.service.ReversalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Periodically retries failed reversals from the dead-letter queue.
 *
 * Failed withdrawal reversals land in reversal_dead_letters when ReversalService
 * exhausts its 3 retry attempts. This scheduler picks them up and retries
 * the compensating Fineract deposit at a slower cadence (every 15 min by default).
 *
 * After max retries are exhausted, the entry is left for manual admin resolution
 * via the AdminController DLQ endpoints.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.dlq-retry.enabled", havingValue = "true", matchIfMissing = true)
public class ReversalDlqRetryScheduler {

    private final ReversalDeadLetterRepository deadLetterRepository;
    private final FineractClient fineractClient;
    private final ReversalService reversalService;
    private final PaymentMetrics paymentMetrics;

    @Value("${app.dlq-retry.max-retries:5}")
    private int maxRetries;

    @Value("${app.dlq-retry.min-age-seconds:300}")
    private long minAgeSeconds;

    @Scheduled(fixedDelayString = "${app.dlq-retry.interval-ms:900000}")
    public void retryFailedReversals() {
        Instant cutoff = Instant.now().minus(minAgeSeconds, ChronoUnit.SECONDS);

        List<ReversalDeadLetter> entries = deadLetterRepository
            .findByResolvedFalseAndRetryCountLessThanAndCreatedAtBeforeOrderByCreatedAtAsc(
                maxRetries, cutoff);

        if (entries.isEmpty()) {
            return;
        }

        log.info("DLQ retry: found {} entries eligible for retry", entries.size());

        for (ReversalDeadLetter entry : entries) {
            retryEntry(entry);
        }
    }

    private void retryEntry(ReversalDeadLetter entry) {
        log.info("DLQ retry attempt {} for txnId={}, accountId={}, amount={}",
            entry.getRetryCount() + 1, entry.getTransactionId(),
            entry.getAccountId(), entry.getAmount());

        try {
            Long paymentTypeId = reversalService.getPaymentTypeId(entry.getProvider());

            fineractClient.createDeposit(
                entry.getAccountId(),
                entry.getAmount(),
                paymentTypeId,
                "REVERSAL-" + entry.getTransactionId()
            );

            // Success — mark as resolved
            entry.setResolved(true);
            entry.setResolvedBy("dlq-auto-retry");
            entry.setResolvedAt(Instant.now());
            entry.setNotes("Automated DLQ retry succeeded on attempt " + (entry.getRetryCount() + 1));
            entry.setRetryCount(entry.getRetryCount() + 1);
            deadLetterRepository.save(entry);

            paymentMetrics.incrementReversalSuccess();
            log.info("DLQ retry succeeded for txnId={}", entry.getTransactionId());

        } catch (Exception e) {
            entry.setRetryCount(entry.getRetryCount() + 1);
            entry.setFailureReason(truncate(e.getMessage(), 500));
            deadLetterRepository.save(entry);

            if (entry.getRetryCount() >= maxRetries) {
                log.error("CRITICAL: DLQ retry exhausted ({}/{}) for txnId={}. Manual intervention required. " +
                    "accountId={}, amount={}, error={}",
                    entry.getRetryCount(), maxRetries, entry.getTransactionId(),
                    entry.getAccountId(), entry.getAmount(), e.getMessage());
                paymentMetrics.incrementReversalFailure();
            } else {
                log.warn("DLQ retry failed ({}/{}) for txnId={}: {}. Will retry later.",
                    entry.getRetryCount(), maxRetries, entry.getTransactionId(), e.getMessage());
            }
        }
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
