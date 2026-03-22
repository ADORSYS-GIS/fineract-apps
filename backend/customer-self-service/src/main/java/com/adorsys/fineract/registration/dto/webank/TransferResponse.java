package com.adorsys.fineract.registration.dto.webank;

public record TransferResponse(
    String transferId,
    String fromTransactionId,
    String toTransactionId,
    String feeTransactionId,
    long amount,
    long fee
) {}
