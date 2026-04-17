package com.adorsys.fineract.gateway.controller;

import com.adorsys.fineract.gateway.entity.ReversalDeadLetter;
import com.adorsys.fineract.gateway.repository.ReversalDeadLetterRepository;
import com.adorsys.fineract.gateway.service.ReversalService;
import com.adorsys.fineract.gateway.service.ReversalService.AdminRetryResult;
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
                             "Marks resolved on success; increments retryCount on failure (422). " +
                             "Returns 400 if already resolved, 409 if max retries exceeded.")
    public ResponseEntity<ReversalDeadLetter> retryDeadLetter(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        // Extract identity before any side effects — if JWT has no sub this fails fast with 403
        String adminSub = JwtUtils.extractExternalId(jwt);

        AdminRetryResult result = reversalService.retryDeadLetterEntry(id, adminSub);

        return switch (result) {
            case NOT_FOUND -> ResponseEntity.notFound().build();
            case ALREADY_RESOLVED -> ResponseEntity.badRequest().build();
            case MAX_RETRIES_EXCEEDED -> ResponseEntity.status(HttpStatus.CONFLICT).build();
            case RESOLVED -> deadLetterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().build());
            case FAILED -> deadLetterRepository.findById(id)
                .map(e -> ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(e))
                .orElse(ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build());
        };
    }

    @PatchMapping("/reversals/dlq/{id}")
    @Operation(summary = "Manually resolve a reversal dead-letter entry",
               description = "Mark a failed reversal as resolved after manual intervention (e.g. ops processed it out-of-band). " +
                             "Include 'notes' in the body to set them; omit the key to leave existing notes unchanged.")
    public ResponseEntity<ReversalDeadLetter> resolveDeadLetter(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal Jwt jwt) {

        // Extract identity before DB work
        String adminSub = JwtUtils.extractExternalId(jwt);

        return deadLetterRepository.findById(id)
            .map(entry -> {
                entry.setResolved(true);
                entry.setResolvedAt(Instant.now());
                entry.setResolvedBy(adminSub);
                // Only update notes when the key is explicitly present — omitting it preserves existing notes
                if (body.containsKey("notes")) {
                    entry.setNotes(body.get("notes"));
                }
                deadLetterRepository.save(entry);
                log.info("DLQ entry {} manually resolved by {}", id, adminSub);
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
