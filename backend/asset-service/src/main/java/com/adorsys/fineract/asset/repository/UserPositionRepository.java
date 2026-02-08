package com.adorsys.fineract.asset.repository;

import com.adorsys.fineract.asset.entity.UserPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPositionRepository extends JpaRepository<UserPosition, Long> {

    List<UserPosition> findByUserId(Long userId);

    Optional<UserPosition> findByUserIdAndAssetId(Long userId, String assetId);
}
