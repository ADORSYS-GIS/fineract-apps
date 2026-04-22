package com.adorsys.fineract.gateway.repository;

import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReversalDeadLetterRepository extends JpaRepository<ReversalDeadLetter, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM ReversalDeadLetter d WHERE d.id = :id")
    Optional<ReversalDeadLetter> findByIdForUpdate(Long id);

    List<ReversalDeadLetter> findByResolvedFalseOrderByCreatedAtAsc();

    Page<ReversalDeadLetter> findAllByOrderByCreatedAtDesc(Pageable pageable);

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
