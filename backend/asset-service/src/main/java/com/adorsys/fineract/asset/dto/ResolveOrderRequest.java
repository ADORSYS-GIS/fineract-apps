package com.adorsys.fineract.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Request body for {@code POST /api/admin/orders/{orderId}/resolve}.
 *
 * <p>Used by an admin to manually close a stuck or disputed order with a free-text
 * resolution note. This action is irreversible and marks the order as manually resolved,
 * bypassing normal settlement flow. The {@code resolution} text is stored in the order's
 * audit log for compliance purposes.</p>
 */
public record ResolveOrderRequest(
    /**
     * Free-text explanation of how and why the order was resolved manually.
     * Must not be blank. Maximum 500 characters.
     * Examples: "Timeout — funds returned to user", "Duplicate detected — voided".
     */
    @NotBlank @Size(max = 500) String resolution
) {}
