package com.adorsys.fineract.registration.dto.webank;

public record TxnResponse(String transactionId, long amount, long newBalance) {}
