package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

public record RebalanceProposalResponse(
    BigDecimal totalLpOwed,
    BigDecimal totalTaxOwed,
    BigDecimal totalFeesOwed,
    BigDecimal totalOutflowNeeded,
    BigDecimal ubaCurrentBalance,
    BigDecimal afrilandCurrentBalance,
    BigDecimal needInUba,
    BigDecimal needInAfriland,
    BigDecimal momoBalance,
    BigDecimal orangeBalance,
    BigDecimal momoAvailable,
    BigDecimal orangeAvailable,
    BigDecimal totalMobileAvailable,
    BigDecimal reservePercent,
    boolean feasible,
    BigDecimal shortfall,
    List<ProposedTransfer> transfers
) {
    public record ProposedTransfer(
        int phase,
        String settlementType,
        String sourceGlCode,
        String sourceName,
        String destinationGlCode,
        String destinationName,
        BigDecimal amount,
        String description,
        String adminAction
    ) {}
}
