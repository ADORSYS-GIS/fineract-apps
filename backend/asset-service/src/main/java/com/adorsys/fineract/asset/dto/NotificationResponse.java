package com.adorsys.fineract.asset.dto;

import java.time.Instant;

public record NotificationResponse(
        Long id,
        String eventType,
        String title,
        String body,
        String referenceId,
        String referenceType,
        boolean read,
        Instant createdAt
) {}
