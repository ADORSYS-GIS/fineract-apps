package com.adorsys.fineract.asset.controller;

import com.adorsys.fineract.asset.dto.NotificationResponse;
import com.adorsys.fineract.asset.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminNotificationController.class)
@AutoConfigureMockMvc(addFilters = false)
class AdminNotificationControllerTest {

    @Autowired private MockMvc mockMvc;

    @MockBean private NotificationService notificationService;

    @Test
    void listNotifications_returns200WithPage() throws Exception {
        NotificationResponse notif = new NotificationResponse(
                1L, "LP_SHORTFALL", "LP cash shortfall",
                "Asset TST has insufficient LP cash balance",
                "asset-001", "ASSET", false, Instant.now());
        when(notificationService.getAdminNotifications(any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(notif)));

        mockMvc.perform(get("/api/admin/notifications")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content[0].id").value(1))
                .andExpect(jsonPath("$.content[0].eventType").value("LP_SHORTFALL"))
                .andExpect(jsonPath("$.content[0].read").value(false))
                .andExpect(jsonPath("$.totalElements").value(1));

        verify(notificationService).getAdminNotifications(any(Pageable.class));
    }

    @Test
    void getUnreadCount_returns200WithCount() throws Exception {
        when(notificationService.getAdminUnreadCount()).thenReturn(7L);

        mockMvc.perform(get("/api/admin/notifications/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(7));
    }

    @Test
    void markRead_returns200() throws Exception {
        doNothing().when(notificationService).markAdminRead(1L);

        mockMvc.perform(post("/api/admin/notifications/1/read"))
                .andExpect(status().isOk());

        verify(notificationService).markAdminRead(1L);
    }

    @Test
    void markRead_notFound_returns500() throws Exception {
        doThrow(new RuntimeException("Notification not found: 99"))
                .when(notificationService).markAdminRead(99L);

        mockMvc.perform(post("/api/admin/notifications/99/read"))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void markAllRead_returns200WithCount() throws Exception {
        when(notificationService.markAllAdminRead()).thenReturn(5);

        mockMvc.perform(post("/api/admin/notifications/read-all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.marked").value(5));

        verify(notificationService).markAllAdminRead();
    }
}
