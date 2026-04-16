package com.adorsys.fineract.gateway.repository;

import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {

    /**
     * Find transaction by provider's reference ID (used in callbacks)
     */
    Optional<PaymentTransaction> findByProviderReference(String providerReference);

    /**
     * Find transaction by provider reference with pessimistic write lock (SELECT FOR UPDATE).
     * Prevents concurrent callback processing of the same transaction.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM PaymentTransaction t WHERE t.providerReference = :ref")
    Optional<PaymentTransaction> findByProviderReferenceForUpdate(@Param("ref") String ref);

    /**
     * Find transaction by internal transactionId with pessimistic write lock (SELECT FOR UPDATE).
     * Used by Orange (orderId = our transactionId) and CinetPay (transaction_id = our transactionId)
     * callback handlers. MTN uses providerReference instead (findByProviderReferenceForUpdate).
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM PaymentTransaction t WHERE t.transactionId = :id")
    Optional<PaymentTransaction> findByIdForUpdate(@Param("id") String id);

    /**
     * Find transactions for a customer within a date range (for daily limits)
     */
    List<PaymentTransaction> findByExternalIdAndCreatedAtBetween(
        String externalId, Instant start, Instant end);

    /**
     * Find transaction by client-provided idempotency key (for dedup on retries).
     */
    Optional<PaymentTransaction> findByIdempotencyKey(String idempotencyKey);

    /**
     * Check if transaction exists (for idempotency)
     */
    boolean existsByTransactionId(String transactionId);

    /**
     * Find pending transactions older than specified time (for cleanup/retry)
     */
    @Query("SELECT t FROM PaymentTransaction t WHERE t.status = 'PENDING' AND t.createdAt < :cutoff")
    List<PaymentTransaction> findStalePendingTransactions(Instant cutoff);

    /**
     * Find PROCESSING transactions older than specified time that haven't yet exhausted retries.
     */
    @Query("SELECT t FROM PaymentTransaction t WHERE t.status = 'PROCESSING' AND t.createdAt < :cutoff AND t.staleResolutionRetryCount < :maxRetries")
    List<PaymentTransaction> findStaleProcessingTransactions(Instant cutoff, int maxRetries);

    /**
     * Count successful transactions for a customer within a date range (for daily limits).
     */
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM PaymentTransaction t " +
           "WHERE t.externalId = :externalId AND t.type = :type " +
           "AND t.status IN ('PENDING', 'PROCESSING', 'SUCCESSFUL') " +
           "AND t.createdAt BETWEEN :start AND :end")
    java.math.BigDecimal sumAmountByExternalIdAndTypeInPeriod(
        @Param("externalId") String externalId,
        @Param("type") com.adorsys.fineract.gateway.dto.PaymentResponse.TransactionType type,
        @Param("start") Instant start,
        @Param("end") Instant end);

    /**
     * Insert a transaction only if the ID doesn't already exist.
     * Returns 1 if inserted, 0 if the key was already taken (idempotency conflict).
     */
    @Transactional
    @Modifying
    @Query(value = "INSERT INTO payment_transactions " +
           "(transaction_id, idempotency_key, external_id, account_id, provider, type, amount, currency, status, created_at, version) " +
           "SELECT :txnId, :idempotencyKey, :externalId, :accountId, :provider, :type, :amount, :currency, :status, NOW(), 0 " +
           "WHERE NOT EXISTS (SELECT 1 FROM payment_transactions WHERE idempotency_key = :idempotencyKey)", nativeQuery = true)
    int insertIfAbsent(@Param("txnId") String txnId,
                       @Param("idempotencyKey") String idempotencyKey,
                       @Param("externalId") String externalId,
                       @Param("accountId") Long accountId,
                       @Param("provider") String provider,
                       @Param("type") String type,
                       @Param("amount") java.math.BigDecimal amount,
                       @Param("currency") String currency,
                       @Param("status") String status);

    /**
     * Update status atomically (for callback handling)
     */
    @Modifying
    @Query("UPDATE PaymentTransaction t SET t.status = :newStatus, t.updatedAt = :now, " +
           "t.fineractTransactionId = :fineractTxnId WHERE t.transactionId = :txnId AND t.status = :expectedStatus")
    int updateStatusIfExpected(String txnId, PaymentStatus expectedStatus,
                                PaymentStatus newStatus, Instant now, Long fineractTxnId);
}
