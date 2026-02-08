package com.adorsys.fineract.asset.dto;

/**
 * Market status with schedule and countdown.
 */
public record MarketStatusResponse(
    boolean isOpen,
    String schedule,
    long secondsUntilClose,
    long secondsUntilOpen
) {}
