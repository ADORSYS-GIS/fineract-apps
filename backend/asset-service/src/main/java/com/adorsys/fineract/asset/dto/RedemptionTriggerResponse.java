package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Response from POST /api/admin/assets/{id}/redeem.
 * Summarizes the redemption run for all holders of a matured bond.
 */
public record RedemptionTriggerResponse(
    String assetId,
    String symbol,
    LocalDate redemptionDate,
    int totalHolders,
    int holdersRedeemed,
    int holdersFailed,
    BigDecimal totalPrincipalPaid,
    BigDecimal totalPrincipalFailed,
    String bondStatus,
    List<HolderRedemptionDetail> details
) {
    public record HolderRedemptionDetail(
        Long userId,
        BigDecimal units,
        BigDecimal cashAmount,
        String status,
        String failureReason
    ) {}
}
