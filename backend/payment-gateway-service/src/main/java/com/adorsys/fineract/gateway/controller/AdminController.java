package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Admin", description = "Administrative endpoints for operations team")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final ReversalDeadLetterRepository deadLetterRepository;

    @GetMapping("/reversals/dlq")
    @Operation(summary = "List unresolved reversal failures",
               description = "Returns all reversal dead-letter entries that have not been resolved")
    public ResponseEntity<List<ReversalDeadLetter>> listUnresolvedReversals() {
        return ResponseEntity.ok(deadLetterRepository.findByResolvedFalseOrderByCreatedAtAsc());
    }

    @PatchMapping("/reversals/dlq/{id}")
    @Operation(summary = "Resolve a reversal dead-letter entry",
               description = "Mark a failed reversal as resolved after manual intervention")
    public ResponseEntity<ReversalDeadLetter> resolveDeadLetter(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        return deadLetterRepository.findById(id)
            .map(entry -> {
                entry.setResolved(true);
                entry.setResolvedBy(body.getOrDefault("resolvedBy", "admin"));
                entry.setResolvedAt(Instant.now());
                entry.setNotes(body.get("notes"));
                deadLetterRepository.save(entry);
                log.info("Reversal DLQ entry {} resolved by {}", id, entry.getResolvedBy());
                return ResponseEntity.ok(entry);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/reversals/dlq/count")
    @Operation(summary = "Count unresolved reversal failures")
    public ResponseEntity<Map<String, Long>> countUnresolved() {
        return ResponseEntity.ok(Map.of("count", deadLetterRepository.countByResolvedFalse()));
    }
}
