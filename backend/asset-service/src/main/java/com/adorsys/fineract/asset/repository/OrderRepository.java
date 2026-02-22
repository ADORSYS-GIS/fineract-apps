package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.dto.OrderStatus;
import com.adorsys.fineract.asset.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = "SELECT * FROM orders o WHERE "
         + "(CAST(:status AS varchar) IS NULL OR o.status = CAST(:status AS varchar)) AND "
         + "(CAST(:assetId AS varchar) IS NULL OR o.asset_id = CAST(:assetId AS varchar)) AND "
         + "(CAST(:search AS varchar) IS NULL OR o.user_external_id LIKE '%' || CAST(:search AS varchar) || '%') AND "
         + "(CAST(:fromDate AS timestamptz) IS NULL OR o.created_at >= CAST(:fromDate AS timestamptz)) AND "
         + "(CAST(:toDate AS timestamptz) IS NULL OR o.created_at <= CAST(:toDate AS timestamptz))",
         countQuery = "SELECT count(*) FROM orders o WHERE "
         + "(CAST(:status AS varchar) IS NULL OR o.status = CAST(:status AS varchar)) AND "
         + "(CAST(:assetId AS varchar) IS NULL OR o.asset_id = CAST(:assetId AS varchar)) AND "
         + "(CAST(:search AS varchar) IS NULL OR o.user_external_id LIKE '%' || CAST(:search AS varchar) || '%') AND "
         + "(CAST(:fromDate AS timestamptz) IS NULL OR o.created_at >= CAST(:fromDate AS timestamptz)) AND "
         + "(CAST(:toDate AS timestamptz) IS NULL OR o.created_at <= CAST(:toDate AS timestamptz))",
         nativeQuery = true)
    Page<Order> findFiltered(@Param("status") String status,
                             @Param("assetId") String assetId,
                             @Param("search") String search,
                             @Param("fromDate") Instant fromDate,
                             @Param("toDate") Instant toDate,
                             Pageable pageable);

    @Query("SELECT DISTINCT o.assetId, a.symbol, a.name FROM Order o JOIN o.asset a "
         + "WHERE o.status IN :statuses ORDER BY a.symbol")
    List<Object[]> findDistinctAssetOptionsByStatusIn(@Param("statuses") List<OrderStatus> statuses);

    @EntityGraph(attributePaths = "asset")
    Optional<Order> findWithAssetById(String id);
}
