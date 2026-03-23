package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.entity.UserPreference;
import com.adorsys.fineract.registration.repository.UserPreferenceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Manages per-user preferences stored in the CS database.
 * Replaces Keycloak user attributes for non-identity preferences
 * (e.g., merchant_payment_anonymous).
 */
@Slf4j
@Service
public class UserPreferencesService {

    private final UserPreferenceRepository repo;

    public UserPreferencesService(UserPreferenceRepository repo) {
        this.repo = repo;
    }

    /**
     * Get a single preference value for a user.
     * @return the preference value, or empty if not set
     */
    public Optional<String> getPreference(String userId, String key) {
        return repo.findByUserIdAndPrefKey(userId, key)
                .map(UserPreference::getPrefValue);
    }

    /**
     * Set (upsert) a preference value for a user.
     */
    public void setPreference(String userId, String key, String value) {
        UserPreference pref = repo.findByUserIdAndPrefKey(userId, key)
                .orElseGet(() -> {
                    UserPreference p = new UserPreference();
                    p.setUserId(userId);
                    p.setPrefKey(key);
                    return p;
                });
        pref.setPrefValue(value);
        repo.save(pref);
        log.debug("Preference set: user={}, key={}", userId, key);
    }

    /**
     * Get all preferences for a user as a key-value map.
     */
    public Map<String, String> getAllPreferences(String userId) {
        List<UserPreference> prefs = repo.findByUserId(userId);
        return prefs.stream()
                .collect(Collectors.toMap(UserPreference::getPrefKey, UserPreference::getPrefValue));
    }
}
