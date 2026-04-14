package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.scheduler.BtaPriceAccretionScheduler;
import com.adorsys.fineract.asset.scheduler.IncomeDistributionScheduler;
import com.adorsys.fineract.asset.scheduler.InterestPaymentScheduler;
import com.adorsys.fineract.asset.service.ScheduledPaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * Admin endpoints for managing scheduled coupon and income payments.
 */
@RestController
@RequestMapping("/admin/scheduled-payments")
@RequiredArgsConstructor
@Tag(name = "Admin - Scheduled Payments", description = "Review, confirm, or cancel pending payment schedules")
public class AdminScheduledPaymentController {

    private final ScheduledPaymentService scheduledPaymentService;
    private final InterestPaymentScheduler interestPaymentScheduler;
    private final IncomeDistributionScheduler incomeDistributionScheduler;
    private final BtaPriceAccretionScheduler btaPriceAccretionScheduler;

    @PostMapping("/run-schedulers")
    @Operation(summary = "Run payment schedulers on demand",
            description = "Manually triggers coupon, income distribution, and BTA price accretion schedulers.")
    public ResponseEntity<java.util.Map<String, Object>> runSchedulers() {
        long pendingBefore = scheduledPaymentService.getSummary().pendingCount();
        interestPaymentScheduler.processCouponPayments();
        incomeDistributionScheduler.processDistributions();
        btaPriceAccretionScheduler.accreteBtaPrices();
        long pendingAfter = scheduledPaymentService.getSummary().pendingCount();
        long created = pendingAfter - pendingBefore;
        return ResponseEntity.ok(java.util.Map.of(
                "schedulesCreated", created,
                "totalPending", pendingAfter
        ));
    }

    @GetMapping
    @Operation(summary = "List scheduled payments", description = "Paginated list with optional filters")
    public ResponseEntity<Page<ScheduledPaymentResponse>> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String assetId,
            @RequestParam(required = false) String type,
            @PageableDefault(size = 20, sort = "created_at", direction = Sort.Direction.DESC) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        return ResponseEntity.ok(scheduledPaymentService.listSchedules(status, assetId, type, pageable));
    }

    @GetMapping("/summary")
    @Operation(summary = "Scheduled payment summary", description = "Counts of pending, confirmed this month, total paid this month")
    public ResponseEntity<ScheduledPaymentSummaryResponse> summary() {
        return ResponseEntity.ok(scheduledPaymentService.getSummary());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get schedule detail", description = "Full detail with per-holder breakdown")
    public ResponseEntity<ScheduledPaymentDetailResponse> detail(@PathVariable Long id) {
        return ResponseEntity.ok(scheduledPaymentService.getScheduleDetail(id));
    }

    @PostMapping("/{id}/confirm")
    @Operation(summary = "Confirm and execute payment",
            description = "Executes Fineract transfers for all holders. "
                    + "For INCOME type, optionally pass amountPerUnit to override the rate-based estimate.")
    public ResponseEntity<ScheduledPaymentResponse> confirm(
            @PathVariable Long id,
            @RequestBody(required = false) ConfirmPaymentRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String admin = jwt != null ? jwt.getSubject() : "admin";
        java.math.BigDecimal amountPerUnit = request != null ? request.amountPerUnit() : null;
        return ResponseEntity.ok(scheduledPaymentService.confirmPayment(id, amountPerUnit, admin));
    }

    @GetMapping("/{id}/results")
    @Operation(summary = "Payment execution results",
            description = "Paginated individual payment records (coupon or income) for a confirmed scheduled payment")
    public ResponseEntity<Page<PaymentResultResponse>> results(
            @PathVariable Long id,
            @PageableDefault(size = 20) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("Max page size is 100");
        }
        return ResponseEntity.ok(scheduledPaymentService.getPaymentResults(id, pageable));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a pending payment",
            description = "Marks the schedule as CANCELLED. No Fineract transfers are executed.")
    public ResponseEntity<ScheduledPaymentResponse> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) CancelPaymentRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String admin = jwt != null ? jwt.getSubject() : "admin";
        String reason = request != null ? request.reason() : null;
        return ResponseEntity.ok(scheduledPaymentService.cancelPayment(id, reason, admin));
    }
}
