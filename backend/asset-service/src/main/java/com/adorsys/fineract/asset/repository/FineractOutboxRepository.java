package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.FineractOutboxEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FineractOutboxRepository extends JpaRepository<FineractOutboxEntry, UUID> {

    Optional<FineractOutboxEntry> findByIdempotencyKey(String idempotencyKey);

    /**
     * Fetch DISPATCHED entries that are ready for DB finalization retry.
     * Uses FOR UPDATE SKIP LOCKED to prevent two replicas from processing the same entry.
     *
     * @param cutoff only entries older than this timestamp (avoids racing with the request thread)
     * @param limit  batch size per processor run
     */
    @Query(value = """
            SELECT * FROM fineract_outbox
            WHERE status = 'DISPATCHED'
              AND created_at < :cutoff
              AND retry_count < max_retries
            ORDER BY created_at ASC
            LIMIT :limit
            FOR UPDATE SKIP LOCKED
            """, nativeQuery = true)
    List<FineractOutboxEntry> findDispatchedForProcessing(
            @Param("cutoff") Instant cutoff,
            @Param("limit") int limit);

    @Query(value = "SELECT COUNT(*) FROM fineract_outbox WHERE status = 'PENDING' AND created_at < :cutoff",
            nativeQuery = true)
    long countStuckPending(@Param("cutoff") Instant cutoff);
}
