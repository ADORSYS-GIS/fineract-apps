package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.util.List;

public record LpShortfallResponse(
        Long lpClientId,
        String lpClientName,
        BigDecimal cashBalance,
        BigDecimal totalObligation,
        BigDecimal totalShortfall,
        List<LpShortfallEntry> assets
) {}
