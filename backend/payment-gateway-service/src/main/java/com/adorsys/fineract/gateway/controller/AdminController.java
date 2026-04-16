package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
import com.adorsys.fineract.gateway.service.ReversalService;
import com.adorsys.fineract.gateway.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
    private final ReversalService reversalService;

    @GetMapping("/reversals/dlq")
    @Operation(summary = "List reversal failures",
               description = "Returns unresolved DLQ entries by default. Pass ?all=true to include resolved entries (audit trail).")
    public ResponseEntity<List<ReversalDeadLetter>> listReversals(
            @RequestParam(defaultValue = "false") boolean all) {
        List<ReversalDeadLetter> entries = all
            ? deadLetterRepository.findAllByOrderByCreatedAtDesc()
            : deadLetterRepository.findByResolvedFalseOrderByCreatedAtAsc();
        return ResponseEntity.ok(entries);
    }

    @PostMapping("/reversals/dlq/{id}/retry")
    @Operation(summary = "Retry a failed reversal",
               description = "Re-attempts the Fineract compensating deposit for a DLQ entry. " +
                             "Marks resolved on success; increments retryCount on failure.")
    public ResponseEntity<ReversalDeadLetter> retryDeadLetter(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return deadLetterRepository.findById(id)
            .map(entry -> {
                if (entry.isResolved()) {
                    return ResponseEntity.badRequest().<ReversalDeadLetter>build();
                }

                entry.setRetryCount(entry.getRetryCount() + 1);
                boolean success = reversalService.retryFromDeadLetter(entry);

                if (success) {
                    entry.setResolved(true);
                    entry.setResolvedAt(Instant.now());
                    entry.setResolvedBy(JwtUtils.extractExternalId(jwt));
                    entry.setNotes("Resolved via admin retry");
                    log.info("DLQ entry {} resolved via admin retry by {}", id, entry.getResolvedBy());
                } else {
                    log.warn("Admin retry failed for DLQ entry {}, retryCount now {}", id, entry.getRetryCount());
                }

                deadLetterRepository.save(entry);
                return success
                    ? ResponseEntity.ok(entry)
                    : ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(entry);
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/reversals/dlq/{id}")
    @Operation(summary = "Manually resolve a reversal dead-letter entry",
               description = "Mark a failed reversal as resolved after manual intervention (e.g. ops processed it out-of-band).")
    public ResponseEntity<ReversalDeadLetter> resolveDeadLetter(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {

        return deadLetterRepository.findById(id)
            .map(entry -> {
                entry.setResolved(true);
                entry.setResolvedAt(Instant.now());
                // Prefer body-supplied display name, fall back to JWT sub
                String resolvedBy = body.getOrDefault("resolvedBy", JwtUtils.extractExternalId(jwt));
                entry.setResolvedBy(resolvedBy);
                entry.setNotes(body.get("notes"));
                deadLetterRepository.save(entry);
                log.info("DLQ entry {} manually resolved by {}", id, resolvedBy);
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
