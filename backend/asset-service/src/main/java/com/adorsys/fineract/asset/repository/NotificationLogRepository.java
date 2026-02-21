package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.NotificationLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, Long> {

    Page<NotificationLog> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUserIdAndReadFalse(Long userId);

    @Modifying
    @Query(value = "UPDATE notification_log SET is_read = true, read_at = NOW() WHERE user_id = :userId AND is_read = false", nativeQuery = true)
    int markAllReadByUserId(Long userId);

    Page<NotificationLog> findByUserIdIsNullOrderByCreatedAtDesc(Pageable pageable);

    long countByUserIdIsNullAndReadFalse();
}
