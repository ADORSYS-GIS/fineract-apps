package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.IncomeCalendarResponse;
import com.adorsys.fineract.asset.dto.PortfolioHistoryResponse;
import com.adorsys.fineract.asset.dto.PortfolioSummaryResponse;
import com.adorsys.fineract.asset.dto.PositionResponse;
import com.adorsys.fineract.asset.service.IncomeCalendarService;
import com.adorsys.fineract.asset.service.PortfolioService;
import com.adorsys.fineract.asset.util.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

/**
 * Authenticated endpoints for portfolio positions and Profit&Loss.
 */
@RestController
@RequestMapping("/api/portfolio")
@RequiredArgsConstructor
@Tag(name = "Portfolio", description = "User positions and Profit&Loss")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final IncomeCalendarService incomeCalendarService;

    @GetMapping
    @Operation(summary = "Get full portfolio", description = "All positions with P&L summary")
    public ResponseEntity<PortfolioSummaryResponse> getPortfolio(@AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(portfolioService.getPortfolio(userId));
    }

    @GetMapping("/positions/{assetId}")
    @Operation(summary = "Single position detail")
    public ResponseEntity<PositionResponse> getPosition(@PathVariable String assetId,
                                                         @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(portfolioService.getPosition(userId, assetId));
    }

    @GetMapping("/history")
    @Operation(summary = "Portfolio value history", description = "Time series for charting. Period: 1M, 3M, 6M, 1Y")
    public ResponseEntity<PortfolioHistoryResponse> getPortfolioHistory(
            @RequestParam(defaultValue = "1M") String period,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        return ResponseEntity.ok(portfolioService.getPortfolioHistory(userId, period));
    }

    @GetMapping("/income-calendar")
    @Operation(summary = "Income calendar",
            description = "Projected income timeline across all held assets. Shows coupon, dividend, rent, and other income events.")
    public ResponseEntity<IncomeCalendarResponse> getIncomeCalendar(
            @RequestParam(defaultValue = "12") int months,
            @AuthenticationPrincipal Jwt jwt) {
        Long userId = JwtUtils.extractUserId(jwt);
        if (months < 1 || months > 36) {
            throw new IllegalArgumentException("Months must be between 1 and 36");
        }
        return ResponseEntity.ok(incomeCalendarService.getCalendar(userId, months));
    }
}
