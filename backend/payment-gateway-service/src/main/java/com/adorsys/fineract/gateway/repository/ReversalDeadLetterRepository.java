package com.adorsys.fineract.gateway.repository;

import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ReversalDeadLetterRepository extends JpaRepository<ReversalDeadLetter, Long> {

    List<ReversalDeadLetter> findByResolvedFalseOrderByCreatedAtAsc();

    long countByResolvedFalse();

    /**
     * Find unresolved DLQ entries eligible for auto-retry:
     * - Not yet resolved
     * - Retry count below the max threshold
     * - Old enough to not conflict with the original @Retryable attempts
     */
    List<ReversalDeadLetter> findByResolvedFalseAndRetryCountLessThanAndCreatedAtBeforeOrderByCreatedAtAsc(
        int maxRetries, Instant cutoff);

    List<ReversalDeadLetter> findAllByOrderByCreatedAtDesc();
}
