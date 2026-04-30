package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LpShortfallEntry(
        String assetId,
        String assetSymbol,
        String assetName,
        BigDecimal obligationAmount,
        LocalDate paymentDueDate
) {}
