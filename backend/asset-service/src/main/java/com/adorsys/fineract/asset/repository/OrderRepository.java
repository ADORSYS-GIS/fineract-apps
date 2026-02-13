package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    Optional<Order> findByIdempotencyKey(String idempotencyKey);

    @EntityGraph(attributePaths = "asset")
    Page<Order> findByUserId(Long userId, Pageable pageable);

    @EntityGraph(attributePaths = "asset")
    Page<Order> findByUserIdAndAssetId(Long userId, String assetId, Pageable pageable);

    List<Order> findByStatusAndCreatedAtBefore(OrderStatus status, Instant before);

    @EntityGraph(attributePaths = "asset")
    Page<Order> findByStatusIn(List<OrderStatus> statuses, Pageable pageable);

    long countByStatus(OrderStatus status);
}
