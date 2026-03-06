package com.adorsys.fineract.asset.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/** Single row in the principal redemption history for admin view. */
public record RedemptionHistoryResponse(
    Long id,
    Long userId,
    BigDecimal units,
    BigDecimal faceValue,
    BigDecimal cashAmount,
    BigDecimal realizedPnl,
    Long fineractCashTransferId,
    Long fineractAssetTransferId,
    String status,
    String failureReason,
    Instant redeemedAt,
    LocalDate redemptionDate
) {}
