package com.adorsys.fineract.registration.repository;

import com.adorsys.fineract.registration.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, UUID> {

    Optional<UserPreference> findByUserIdAndPrefKey(String userId, String prefKey);

    List<UserPreference> findByUserId(String userId);
}
