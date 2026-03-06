package com.adorsys.fineract.asset.dto;

public record NotificationPreferencesResponse(
        boolean tradeExecuted,
        boolean couponPaid,
        boolean redemptionCompleted,
        boolean assetStatusChanged,
        boolean orderStuck,
        boolean incomePaid,
        boolean treasuryShortfall,
        boolean delistingAnnounced
) {}
