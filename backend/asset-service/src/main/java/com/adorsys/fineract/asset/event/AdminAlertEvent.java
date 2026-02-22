package com.adorsys.fineract.asset.event;

/**
 * Admin-targeted alert event. Creates broadcast notifications (userId=null)
 * visible to all admin users via the admin notifications endpoint.
 */
public record AdminAlertEvent(
        String alertType,
        String title,
        String body,
        String referenceId,
        String referenceType
) implements AssetServiceEvent {
}
