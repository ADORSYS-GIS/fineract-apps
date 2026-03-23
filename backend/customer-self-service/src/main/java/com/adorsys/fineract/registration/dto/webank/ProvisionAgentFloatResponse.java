package com.adorsys.fineract.registration.dto.webank;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProvisionAgentFloatResponse(
    UUID id,
    Long fineractTxnId,
    Long amount,
    String receiptRef,
    OffsetDateTime executedAt
) {}
