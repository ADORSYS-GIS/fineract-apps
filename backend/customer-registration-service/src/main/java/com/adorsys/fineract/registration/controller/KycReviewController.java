package com.adorsys.fineract.registration.controller;

import com.adorsys.fineract.registration.dto.*;
import com.adorsys.fineract.registration.service.KycReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for KYC review operations by staff.
 */
@Slf4j
@RestController
@RequestMapping("/api/kyc/staff")
@RequiredArgsConstructor
@Tag(name = "KYC Review", description = "Staff KYC review operations")
@SecurityRequirement(name = "bearer-jwt")
@PreAuthorize("hasAnyRole('kyc-reviewer', 'admin')")
public class KycReviewController {

    private final KycReviewService kycReviewService;

    /**
     * Get KYC review statistics.
     */
    @GetMapping("/stats")
    @Operation(summary = "Get KYC stats", description = "Get statistics for KYC reviews")
    public ResponseEntity<KycStatsResponse> getStats() {
        log.info("Getting KYC review statistics");
        KycStatsResponse stats = kycReviewService.getStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get list of KYC submissions for review.
     */
    @GetMapping("/submissions")
    @Operation(summary = "List submissions", description = "Get list of KYC submissions")
    public ResponseEntity<KycSubmissionsResponse> getSubmissions(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int limit) {

        log.info("Getting KYC submissions: status={}, search={}, page={}, limit={}",
            status, search, page, limit);

        KycSubmissionsResponse response = kycReviewService.getSubmissions(status, search, page, limit);
        return ResponseEntity.ok(response);
    }

    /**
     * Get a single KYC submission.
     */
    @GetMapping("/submissions/{externalId}")
    @Operation(summary = "Get submission", description = "Get a single KYC submission by external ID")
    public ResponseEntity<KycSubmissionDetailResponse> getSubmission(
            @PathVariable String externalId) {

        log.info("Getting KYC submission: externalId={}", externalId);
        KycSubmissionDetailResponse submission = kycReviewService.getSubmission(externalId);
        return ResponseEntity.ok(submission);
    }

    /**
     * Approve a KYC submission.
     */
    @PostMapping("/submissions/{externalId}/approve")
    @Operation(summary = "Approve KYC", description = "Approve a customer's KYC submission")
    public ResponseEntity<Void> approveKyc(
            @PathVariable String externalId,
            @Valid @RequestBody KycApprovalRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String reviewerId = jwt.getSubject();
        String reviewerName = jwt.getClaimAsString("preferred_username");

        log.info("Approving KYC: externalId={}, newTier={}, reviewer={}",
            externalId, request.getNewTier(), reviewerName);

        kycReviewService.approveKyc(externalId, request, reviewerId, reviewerName);
        return ResponseEntity.ok().build();
    }

    /**
     * Reject a KYC submission.
     */
    @PostMapping("/submissions/{externalId}/reject")
    @Operation(summary = "Reject KYC", description = "Reject a customer's KYC submission")
    public ResponseEntity<Void> rejectKyc(
            @PathVariable String externalId,
            @Valid @RequestBody KycRejectionRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String reviewerId = jwt.getSubject();
        String reviewerName = jwt.getClaimAsString("preferred_username");

        log.info("Rejecting KYC: externalId={}, reason={}, reviewer={}",
            externalId, request.getReason(), reviewerName);

        kycReviewService.rejectKyc(externalId, request, reviewerId, reviewerName);
        return ResponseEntity.ok().build();
    }

    /**
     * Request more information from customer.
     */
    @PostMapping("/submissions/{externalId}/request-info")
    @Operation(summary = "Request more info", description = "Request additional information from customer")
    public ResponseEntity<Void> requestMoreInfo(
            @PathVariable String externalId,
            @Valid @RequestBody KycRequestInfoRequest request,
            @AuthenticationPrincipal Jwt jwt) {

        String reviewerId = jwt.getSubject();
        log.info("Requesting more info: externalId={}", externalId);

        kycReviewService.requestMoreInfo(externalId, request, reviewerId);
        return ResponseEntity.ok().build();
    }
}
