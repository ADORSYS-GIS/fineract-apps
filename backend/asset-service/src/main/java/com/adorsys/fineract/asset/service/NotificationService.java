package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.entity.NotificationLog;
import com.adorsys.fineract.asset.entity.NotificationPreferences;
import com.adorsys.fineract.asset.event.*;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.NotificationLogRepository;
import com.adorsys.fineract.asset.repository.NotificationPreferencesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.Instant;

/**
 * Handles domain events and creates persistent notifications for users.
 * Uses @TransactionalEventListener for events published inside transactions
 * (e.g., trades) and @EventListener for scheduler-originated events.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationLogRepository notificationLogRepository;
    private final NotificationPreferencesRepository preferencesRepository;
    private final AssetMetrics assetMetrics;

    // ── Event handlers ──

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onTradeExecuted(TradeExecutedEvent event) {
        if (!isEnabled(event.userId(), "tradeExecuted")) return;

        String title = event.side() + " " + event.assetSymbol() + " executed";
        String body = String.format("%s %s units of %s at %s. Total: %s XAF.",
                event.side(), event.units().toPlainString(), event.assetSymbol(),
                event.executionPrice().toPlainString(), event.cashAmount().toPlainString());

        createNotification(event.userId(), "TRADE_EXECUTED", title, body,
                event.orderId(), "ORDER");
    }

    @Async
    @EventListener
    public void onCouponPaid(CouponPaidEvent event) {
        if (!isEnabled(event.userId(), "couponPaid")) return;

        String title = "Coupon received: " + event.assetSymbol();
        String body = String.format("You received %s XAF coupon payment for %s (rate: %s%%, date: %s).",
                event.cashAmount().toPlainString(), event.assetSymbol(),
                event.annualRate().toPlainString(), event.couponDate());

        createNotification(event.userId(), "COUPON_PAID", title, body,
                event.assetId(), "ASSET");
    }

    @Async
    @EventListener
    public void onRedemptionCompleted(RedemptionCompletedEvent event) {
        if (!isEnabled(event.userId(), "redemptionCompleted")) return;

        String title = "Bond redeemed: " + event.assetSymbol();
        String body = String.format("Your %s units of %s have been redeemed for %s XAF.",
                event.units().toPlainString(), event.assetSymbol(),
                event.cashAmount().toPlainString());

        createNotification(event.userId(), "REDEMPTION_COMPLETED", title, body,
                event.assetId(), "ASSET");
    }

    @Async
    @EventListener
    public void onAssetStatusChanged(AssetStatusChangedEvent event) {
        if (event.userId() != null) {
            if (!isEnabled(event.userId(), "assetStatusChanged")) return;
            String title = event.assetSymbol() + " status changed";
            String body = String.format("Asset %s changed from %s to %s.",
                    event.assetSymbol(), event.oldStatus(), event.newStatus());
            createNotification(event.userId(), "ASSET_STATUS_CHANGED", title, body,
                    event.assetId(), "ASSET");
        }
    }

    @Async
    @EventListener
    public void onOrderStuck(OrderStuckEvent event) {
        if (!isEnabled(event.userId(), "orderStuck")) return;

        String title = "Order stuck: " + event.assetSymbol();
        String body = String.format("Your order %s for %s is stuck in %s status. It may need manual resolution.",
                event.orderId(), event.assetSymbol(), event.orderStatus());

        createNotification(event.userId(), "ORDER_STUCK", title, body,
                event.orderId(), "ORDER");
    }

    @Async
    @EventListener
    public void onIncomePaid(IncomePaidEvent event) {
        if (!isEnabled(event.userId(), "incomePaid")) return;

        String title = event.incomeType() + " received: " + event.assetSymbol();
        String body = String.format("You received %s XAF %s payment for %s (date: %s).",
                event.cashAmount().toPlainString(), event.incomeType().toLowerCase(),
                event.assetSymbol(), event.distributionDate());

        createNotification(event.userId(), "INCOME_PAID", title, body,
                event.assetId(), "ASSET");
    }

    @Async
    @EventListener
    public void onTreasuryShortfall(TreasuryShortfallEvent event) {
        // Treasury shortfall is admin-targeted, userId may be null
        String title = "Treasury shortfall: " + event.assetSymbol();
        String body = String.format(
                "Treasury balance (%s XAF) is insufficient for upcoming payment of %s XAF on %s. Shortfall: %s XAF.",
                event.treasuryBalance().toPlainString(), event.obligationAmount().toPlainString(),
                event.paymentDueDate(), event.shortfall().toPlainString());

        if (event.userId() != null) {
            if (!isEnabled(event.userId(), "treasuryShortfall")) return;
            createNotification(event.userId(), "TREASURY_SHORTFALL", title, body,
                    event.assetId(), "ASSET");
        } else {
            // For broadcast, just log — controller can be used to query
            log.warn("Treasury shortfall detected for {}: shortfall={} XAF",
                    event.assetSymbol(), event.shortfall().toPlainString());
        }
    }

    @Async
    @EventListener
    public void onDelistingAnnounced(DelistingAnnouncedEvent event) {
        if (event.userId() != null) {
            if (!isEnabled(event.userId(), "delistingAnnounced")) return;
            String title = "Delisting announced: " + event.assetSymbol();
            String body = String.format(
                    "Asset %s will be delisted on %s. Only SELL orders are accepted. " +
                            "Remaining positions will be redeemed at %s XAF per unit.",
                    event.assetSymbol(), event.delistingDate(),
                    event.redemptionPrice() != null ? event.redemptionPrice().toPlainString() : "last traded price");
            createNotification(event.userId(), "DELISTING_ANNOUNCED", title, body,
                    event.assetId(), "ASSET");
        }
    }

    // ── Query methods ──

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getNotifications(Long userId, Pageable pageable) {
        return notificationLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationLogRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(Long notificationId, Long userId) {
        NotificationLog notif = notificationLogRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));
        if (!notif.getUserId().equals(userId)) {
            throw new RuntimeException("Notification not found: " + notificationId);
        }
        if (!notif.isRead()) {
            notif.setRead(true);
            notif.setReadAt(Instant.now());
            notificationLogRepository.save(notif);
        }
    }

    @Transactional
    public int markAllRead(Long userId) {
        return notificationLogRepository.markAllReadByUserId(userId);
    }

    @Transactional(readOnly = true)
    public NotificationPreferencesResponse getPreferences(Long userId) {
        NotificationPreferences prefs = preferencesRepository.findByUserId(userId)
                .orElse(NotificationPreferences.builder().userId(userId).build());
        return new NotificationPreferencesResponse(
                prefs.isTradeExecuted(), prefs.isCouponPaid(),
                prefs.isRedemptionCompleted(), prefs.isAssetStatusChanged(),
                prefs.isOrderStuck(), prefs.isIncomePaid(),
                prefs.isTreasuryShortfall(), prefs.isDelistingAnnounced());
    }

    @Transactional
    public NotificationPreferencesResponse updatePreferences(Long userId, UpdateNotificationPreferencesRequest request) {
        NotificationPreferences prefs = preferencesRepository.findByUserId(userId)
                .orElse(NotificationPreferences.builder().userId(userId).build());

        if (request.tradeExecuted() != null) prefs.setTradeExecuted(request.tradeExecuted());
        if (request.couponPaid() != null) prefs.setCouponPaid(request.couponPaid());
        if (request.redemptionCompleted() != null) prefs.setRedemptionCompleted(request.redemptionCompleted());
        if (request.assetStatusChanged() != null) prefs.setAssetStatusChanged(request.assetStatusChanged());
        if (request.orderStuck() != null) prefs.setOrderStuck(request.orderStuck());
        if (request.incomePaid() != null) prefs.setIncomePaid(request.incomePaid());
        if (request.treasuryShortfall() != null) prefs.setTreasuryShortfall(request.treasuryShortfall());
        if (request.delistingAnnounced() != null) prefs.setDelistingAnnounced(request.delistingAnnounced());

        preferencesRepository.save(prefs);
        assetMetrics.recordNotificationPreferencesUpdated();

        return new NotificationPreferencesResponse(
                prefs.isTradeExecuted(), prefs.isCouponPaid(),
                prefs.isRedemptionCompleted(), prefs.isAssetStatusChanged(),
                prefs.isOrderStuck(), prefs.isIncomePaid(),
                prefs.isTreasuryShortfall(), prefs.isDelistingAnnounced());
    }

    // ── Internal ──

    private void createNotification(Long userId, String eventType, String title, String body,
                                     String referenceId, String referenceType) {
        try {
            NotificationLog notif = NotificationLog.builder()
                    .userId(userId)
                    .eventType(eventType)
                    .title(title)
                    .body(body)
                    .referenceId(referenceId)
                    .referenceType(referenceType)
                    .build();
            notificationLogRepository.save(notif);
            assetMetrics.recordNotificationSent(eventType);
            log.debug("Notification created: userId={}, type={}, title={}", userId, eventType, title);
        } catch (Exception e) {
            log.error("Failed to create notification: userId={}, type={}, error={}",
                    userId, eventType, e.getMessage());
        }
    }

    private boolean isEnabled(Long userId, String preferenceField) {
        try {
            NotificationPreferences prefs = preferencesRepository.findByUserId(userId).orElse(null);
            if (prefs == null) return true; // default: all enabled

            return switch (preferenceField) {
                case "tradeExecuted" -> prefs.isTradeExecuted();
                case "couponPaid" -> prefs.isCouponPaid();
                case "redemptionCompleted" -> prefs.isRedemptionCompleted();
                case "assetStatusChanged" -> prefs.isAssetStatusChanged();
                case "orderStuck" -> prefs.isOrderStuck();
                case "incomePaid" -> prefs.isIncomePaid();
                case "treasuryShortfall" -> prefs.isTreasuryShortfall();
                case "delistingAnnounced" -> prefs.isDelistingAnnounced();
                default -> true;
            };
        } catch (Exception e) {
            log.warn("Failed to check notification preferences for user {}: {}", userId, e.getMessage());
            return true;
        }
    }

    private NotificationResponse toResponse(NotificationLog n) {
        return new NotificationResponse(
                n.getId(), n.getEventType(), n.getTitle(), n.getBody(),
                n.getReferenceId(), n.getReferenceType(), n.isRead(), n.getCreatedAt());
    }
}
