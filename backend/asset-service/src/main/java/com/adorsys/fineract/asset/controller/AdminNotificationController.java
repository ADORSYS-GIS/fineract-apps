package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.NotificationResponse;
import com.adorsys.fineract.asset.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Admin endpoints for viewing broadcast notifications (stuck orders, critical reconciliation alerts).
 */
@RestController
@RequestMapping("/api/admin/notifications")
@RequiredArgsConstructor
@Tag(name = "Admin - Notifications", description = "View admin broadcast notifications")
public class AdminNotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "List admin notifications", description = "Paginated list of admin broadcast notifications (userId IS NULL)")
    public Page<NotificationResponse> getAdminNotifications(
            @PageableDefault(size = 20) Pageable pageable) {
        return notificationService.getAdminNotifications(pageable);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Unread admin notification count")
    public Map<String, Long> getUnreadCount() {
        return Map.of("unreadCount", notificationService.getAdminUnreadCount());
    }
}
