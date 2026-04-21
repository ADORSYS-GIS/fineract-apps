package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.entity.FineractOutboxEntry;
import com.adorsys.fineract.asset.repository.FineractOutboxRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

/**
 * Manages lifecycle state of {@link FineractOutboxEntry} records.
 *
 * <p>Methods that must commit before the caller's transaction completes use
 * {@code REQUIRES_NEW}. {@code markConfirmed} uses default REQUIRED so it
 * commits atomically with the caller's DB finalization writes.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class FineractOutboxService {

    private final FineractOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    /**
     * Write a PENDING outbox entry in its own committed transaction.
     * Called before the Fineract batch call so the entry is durable regardless of
     * what happens to the outer transaction.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public FineractOutboxEntry writePendingEntry(
            String eventType, String referenceType, String referenceId,
            String idempotencyKey, Map<String, Object> payload) {

        // Idempotency: return existing entry if key already present
        return outboxRepository.findByIdempotencyKey(idempotencyKey)
                .orElseGet(() -> {
                    FineractOutboxEntry entry = FineractOutboxEntry.builder()
                            .eventType(eventType)
                            .referenceType(referenceType)
                            .referenceId(referenceId)
                            .idempotencyKey(idempotencyKey)
                            .status("PENDING")
                            .payload(toJson(payload))
                            .build();
                    return outboxRepository.save(entry);
                });
    }

    /**
     * Mark an entry as DISPATCHED (Fineract succeeded) in its own committed transaction.
     * Must commit before the outer transaction, so that even if the outer TX rolls back,
     * the processor can still find this entry and retry the DB finalization.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markDispatched(UUID id, Map<String, Object> fineractResponse) {
        outboxRepository.findById(id).ifPresent(entry -> {
            entry.setStatus("DISPATCHED");
            entry.setFineractResponse(toJson(fineractResponse));
            entry.setDispatchedAt(Instant.now());
            outboxRepository.save(entry);
        });
    }

    /**
     * Mark an entry as CONFIRMED. Participates in the caller's transaction so that
     * the status update commits atomically with all DB finalization writes.
     */
    @Transactional
    public void markConfirmed(UUID id) {
        outboxRepository.findById(id).ifPresent(entry -> {
            entry.setStatus("CONFIRMED");
            entry.setConfirmedAt(Instant.now());
            outboxRepository.save(entry);
        });
    }

    /**
     * Mark an entry as ABORTED (Fineract call itself failed). No DB finalization needed.
     * Uses REQUIRES_NEW to commit independently of the outer transaction.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markAborted(UUID id, String reason) {
        outboxRepository.findById(id).ifPresent(entry -> {
            entry.setStatus("ABORTED");
            entry.setLastError(truncate(reason, 1000));
            outboxRepository.save(entry);
        });
    }

    /**
     * Increment retry count and mark FAILED if max_retries exceeded.
     * Uses REQUIRES_NEW so the failure is recorded even if the retry transaction rolled back.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void markFailed(UUID id, String error) {
        outboxRepository.findById(id).ifPresent(entry -> {
            entry.setRetryCount(entry.getRetryCount() + 1);
            entry.setLastError(truncate(error, 1000));
            if (entry.getRetryCount() >= entry.getMaxRetries()) {
                entry.setStatus("FAILED");
                log.error("Outbox entry {} exhausted retries (event={}): {}",
                        id, entry.getEventType(), error);
            }
            outboxRepository.save(entry);
        });
    }

    public Map<String, Object> parsePayload(FineractOutboxEntry entry) {
        return fromJson(entry.getPayload());
    }

    public Map<String, Object> parseFineractResponse(FineractOutboxEntry entry) {
        if (entry.getFineractResponse() == null) return Map.of();
        return fromJson(entry.getFineractResponse());
    }

    private String toJson(Map<String, Object> map) {
        try {
            return objectMapper.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Failed to serialize outbox payload", e);
        }
    }

    private Map<String, Object> fromJson(String json) {
        try {
            return objectMapper.readValue(json, new TypeReference<>() {});
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Failed to deserialize outbox payload", e);
        }
    }

    private static String truncate(String s, int maxLen) {
        return s != null && s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
