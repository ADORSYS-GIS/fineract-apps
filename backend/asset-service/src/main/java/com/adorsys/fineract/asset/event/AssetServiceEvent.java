package com.adorsys.fineract.asset.event;

/**
 * Sealed base interface for all domain events published within the asset service.
 * Each event carries the data needed to create a user notification.
 */
public sealed interface AssetServiceEvent permits
        TradeExecutedEvent, CouponPaidEvent, RedemptionCompletedEvent,
        AssetStatusChangedEvent, OrderStuckEvent, TreasuryShortfallEvent,
        IncomePaidEvent, DelistingAnnouncedEvent, AdminAlertEvent {
}
