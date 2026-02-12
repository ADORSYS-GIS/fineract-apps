package com.adorsys.fineract.gateway.repository;

import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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
     * Find transactions for a customer within a date range (for daily limits)
     */
    List<PaymentTransaction> findByExternalIdAndCreatedAtBetween(
        String externalId, Instant start, Instant end);

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
     * Update status atomically (for callback handling)
     */
    @Modifying
    @Query("UPDATE PaymentTransaction t SET t.status = :newStatus, t.updatedAt = :now, " +
           "t.fineractTransactionId = :fineractTxnId WHERE t.transactionId = :txnId AND t.status = :expectedStatus")
    int updateStatusIfExpected(String txnId, PaymentStatus expectedStatus,
                                PaymentStatus newStatus, Instant now, Long fineractTxnId);
}
