package com.adorsys.fineract.asset.dto;

public record LpDetailResponse(
        Long clientId,
        String clientName,
        Long cashAccountId,
        String cashAccountNo,
        Long spreadAccountId,
        String spreadAccountNo,
        Long taxAccountId,
        String taxAccountNo
) {}
