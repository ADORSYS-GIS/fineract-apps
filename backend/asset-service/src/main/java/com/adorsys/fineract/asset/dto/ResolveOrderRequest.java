package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for manually resolving an order.
 */
public record ResolveOrderRequest(
    @NotBlank @Size(max = 500) String resolution
) {}
