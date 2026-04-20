package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.*;
import com.adorsys.fineract.asset.service.NotificationService;
import com.adorsys.fineract.asset.util.UserIdentityResolver;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST endpoints for user notifications and preferences.
 */
@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "User notifications and preferences")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserIdentityResolver userIdentityResolver;

    @GetMapping
    @Operation(summary = "List notifications", description = "Paginated list of user notifications, most recent first")
    public Page<NotificationResponse> getNotifications(
            @AuthenticationPrincipal Jwt jwt,
            Pageable pageable) {
        return notificationService.getNotifications(userIdentityResolver.resolveUserId(jwt), pageable);
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get unread count", description = "Number of unread notifications for the current user")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("count", notificationService.getUnreadCount(userIdentityResolver.resolveUserId(jwt)));
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "Mark notification as read")
    public ResponseEntity<Void> markRead(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        notificationService.markRead(id, userIdentityResolver.resolveUserId(jwt));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/read-all")
    @Operation(summary = "Mark all as read", description = "Mark all unread notifications as read for the current user")
    public Map<String, Integer> markAllRead(@AuthenticationPrincipal Jwt jwt) {
        return Map.of("marked", notificationService.markAllRead(userIdentityResolver.resolveUserId(jwt)));
    }

    @GetMapping("/preferences")
    @Operation(summary = "Get notification preferences", description = "Per-event-type notification toggle settings")
    public NotificationPreferencesResponse getPreferences(@AuthenticationPrincipal Jwt jwt) {
        return notificationService.getPreferences(userIdentityResolver.resolveUserId(jwt));
    }

    @PutMapping("/preferences")
    @Operation(summary = "Update notification preferences", description = "Toggle notification types on/off")
    public NotificationPreferencesResponse updatePreferences(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody UpdateNotificationPreferencesRequest request) {
        return notificationService.updatePreferences(userIdentityResolver.resolveUserId(jwt), request);
    }
}
