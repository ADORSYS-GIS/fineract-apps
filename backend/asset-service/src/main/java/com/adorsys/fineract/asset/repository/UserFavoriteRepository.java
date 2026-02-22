package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {

    List<UserFavorite> findByUserId(Long userId);

    Optional<UserFavorite> findByUserIdAndAssetId(Long userId, String assetId);

    void deleteByUserIdAndAssetId(Long userId, String assetId);

    boolean existsByUserIdAndAssetId(Long userId, String assetId);
}
