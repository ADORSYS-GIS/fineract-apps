package com.adorsys.fineract.gateway.service;

import com.adorsys.fineract.gateway.dto.PaymentResponse;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.exception.PaymentException;
import com.adorsys.fineract.gateway.metrics.PaymentMetrics;
import com.adorsys.fineract.gateway.repository.PaymentTransactionRepository;
import jakarta.persistence.EntityManager;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

/**
 * Atomically reserves a transaction and enforces daily limits using a PostgreSQL advisory lock.
 * Extracted to a separate service so @Transactional works correctly via Spring AOP proxy
 * (avoids self-invocation bypass in PaymentService).
 *
 * The advisory lock serializes concurrent requests from the same user, preventing
 * two requests from both passing the daily limit check before either inserts.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionReservationService {

    private final PaymentTransactionRepository transactionRepository;
    private final PaymentMetrics paymentMetrics;
    private final EntityManager entityManager;

    private boolean supportsAdvisoryLocks = false;

    @PostConstruct
    void detectDatabaseType() {
        try {
            String dialect = entityManager.getEntityManagerFactory()
                .getProperties().getOrDefault("hibernate.dialect", "").toString();
            supportsAdvisoryLocks = dialect.toLowerCase().contains("postgres");
            if (!supportsAdvisoryLocks) {
                log.info("Non-PostgreSQL database detected ({}). Advisory locks disabled.", dialect);
            }
        } catch (Exception e) {
            log.debug("Could not detect database type: {}", e.getMessage());
        }
    }

    /**
     * Reserve a transaction and enforce the daily limit atomically.
     *
     * @return 1 if inserted, 0 if the idempotency key already existed
     */
    @Transactional
    public int reserveWithLimitCheck(String transactionId, String idempotencyKey, String externalId,
                                      Long accountId, String provider, String type,
                                      BigDecimal amount, String currency, BigDecimal maxDaily) {
        // Acquire advisory lock on externalId — serializes concurrent requests from this user.
        // Only works on PostgreSQL; gracefully skipped for other databases (e.g., H2 in tests).
        acquireAdvisoryLockIfPostgres(externalId);

        // Check daily limit (now safe from races because of the advisory lock)
        PaymentResponse.TransactionType txnType = PaymentResponse.TransactionType.valueOf(type);
        Instant dayStart = LocalDate.now(ZoneOffset.UTC).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant dayEnd = dayStart.plusSeconds(86400);

        BigDecimal todayTotal = transactionRepository.sumAmountByExternalIdAndTypeInPeriod(
            externalId, txnType, dayStart, dayEnd);

        if (todayTotal.add(amount).compareTo(maxDaily) > 0) {
            paymentMetrics.incrementDailyLimitExceeded();
            throw new PaymentException(
                String.format("Daily %s limit exceeded. Today's total: %s XAF, requested: %s XAF, max: %s XAF",
                    type.toLowerCase(), todayTotal, amount, maxDaily),
                "DAILY_LIMIT_EXCEEDED");
        }

        // Insert the transaction record
        return transactionRepository.insertIfAbsent(
            transactionId, idempotencyKey, externalId, accountId,
            provider, type, amount, currency, PaymentStatus.PENDING.name()
        );
    }

    private void acquireAdvisoryLockIfPostgres(String externalId) {
        if (!supportsAdvisoryLocks) {
            return;
        }
        // Use two-argument form: (namespace, hash) to reduce 32-bit collision risk
        entityManager.createNativeQuery("SELECT pg_advisory_xact_lock(1, hashtext(:externalId))")
            .setParameter("externalId", externalId)
            .getSingleResult();
    }
}
