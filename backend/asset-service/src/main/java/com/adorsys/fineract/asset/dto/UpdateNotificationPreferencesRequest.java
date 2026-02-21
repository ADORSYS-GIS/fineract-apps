package com.adorsys.fineract.asset.dto;

public record UpdateNotificationPreferencesRequest(
        Boolean tradeExecuted,
        Boolean couponPaid,
        Boolean redemptionCompleted,
        Boolean assetStatusChanged,
        Boolean orderStuck,
        Boolean incomePaid,
        Boolean treasuryShortfall,
        Boolean delistingAnnounced
) {}
