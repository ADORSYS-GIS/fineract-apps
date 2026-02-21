package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record IncomeTriggerResponse(
    String assetId,
    String symbol,
    String incomeType,
    LocalDate distributionDate,
    int holdersPaid,
    int holdersFailed,
    BigDecimal totalAmountPaid,
    LocalDate nextDistributionDate
) {}
