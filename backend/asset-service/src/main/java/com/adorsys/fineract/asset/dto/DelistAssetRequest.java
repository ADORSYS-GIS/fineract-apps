package com.adorsys.fineract.asset.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DelistAssetRequest(
        @Schema(description = "Date on which forced buyback will occur. Defaults to 30 days from now if null.")
        LocalDate delistingDate,
        @Schema(description = "Price per unit for forced buyback. Uses last traded price if null.", nullable = true)
        BigDecimal redemptionPrice
) {}
