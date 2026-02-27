package com.adorsys.fineract.asset.service;

import com.adorsys.fineract.asset.dto.NotificationResponse;
import com.adorsys.fineract.asset.entity.NotificationLog;
import com.adorsys.fineract.asset.metrics.AssetMetrics;
import com.adorsys.fineract.asset.repository.NotificationLogRepository;
import com.adorsys.fineract.asset.repository.NotificationPreferencesRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static com.adorsys.fineract.asset.testutil.TestDataFactory.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock private NotificationLogRepository notificationLogRepository;
    @Mock private NotificationPreferencesRepository preferencesRepository;
    @Mock private AssetMetrics assetMetrics;

    @InjectMocks private NotificationService service;

    @Test
    void getAdminNotifications_returnsMappedPage() {
        NotificationLog notif = adminNotification();
        Pageable pageable = PageRequest.of(0, 20);
        when(notificationLogRepository.findByUserIdIsNullOrderByCreatedAtDesc(pageable))
                .thenReturn(new PageImpl<>(List.of(notif)));

        Page<NotificationResponse> result = service.getAdminNotifications(pageable);

        assertThat(result.getContent()).hasSize(1);
        NotificationResponse dto = result.getContent().get(0);
        assertThat(dto.id()).isEqualTo(notif.getId());
        assertThat(dto.eventType()).isEqualTo("TREASURY_SHORTFALL");
        assertThat(dto.title()).isEqualTo("Treasury shortfall");
        assertThat(dto.read()).isFalse();
    }

    @Test
    void getAdminUnreadCount_returnsRepositoryCount() {
        when(notificationLogRepository.countByUserIdIsNullAndReadFalse()).thenReturn(5L);

        long count = service.getAdminUnreadCount();

        assertThat(count).isEqualTo(5L);
    }

    @Test
    void markAdminRead_happyPath_setsReadAndTimestamp() {
        NotificationLog notif = adminNotification();
        when(notificationLogRepository.findById(1L)).thenReturn(Optional.of(notif));

        service.markAdminRead(1L);

        assertThat(notif.isRead()).isTrue();
        assertThat(notif.getReadAt()).isNotNull();
        verify(notificationLogRepository).save(notif);
    }

    @Test
    void markAdminRead_notFound_throws() {
        when(notificationLogRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.markAdminRead(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Notification not found");
    }

    @Test
    void markAdminRead_userNotification_throws() {
        NotificationLog notif = userNotification(USER_ID);
        when(notificationLogRepository.findById(1L)).thenReturn(Optional.of(notif));

        assertThatThrownBy(() -> service.markAdminRead(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Notification not found");

        verify(notificationLogRepository, never()).save(any());
    }

    @Test
    void markAdminRead_alreadyRead_noOp() {
        NotificationLog notif = adminNotification();
        notif.setRead(true);
        when(notificationLogRepository.findById(1L)).thenReturn(Optional.of(notif));

        service.markAdminRead(1L);

        verify(notificationLogRepository, never()).save(any());
    }

    @Test
    void markAllAdminRead_delegatesToRepository() {
        when(notificationLogRepository.markAllReadByUserIdIsNull()).thenReturn(3);

        int count = service.markAllAdminRead();

        assertThat(count).isEqualTo(3);
        verify(notificationLogRepository).markAllReadByUserIdIsNull();
    }
}
