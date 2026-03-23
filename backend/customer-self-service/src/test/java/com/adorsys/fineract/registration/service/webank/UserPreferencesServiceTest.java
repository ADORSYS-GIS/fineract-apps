package com.adorsys.fineract.registration.service.webank;

import com.adorsys.fineract.registration.entity.UserPreference;
import com.adorsys.fineract.registration.repository.UserPreferenceRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserPreferencesService Tests")
class UserPreferencesServiceTest {

    @Mock
    private UserPreferenceRepository repo;

    @InjectMocks
    private UserPreferencesService service;

    // -----------------------------------------------------------------------
    // getPreference
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("getPreference")
    class GetPreference {

        @Test
        @DisplayName("should return preference value when found")
        void getPreference_Found() {
            UserPreference pref = new UserPreference();
            pref.setUserId("user-42");
            pref.setPrefKey("merchant_payment_anonymous");
            pref.setPrefValue("true");

            when(repo.findByUserIdAndPrefKey("user-42", "merchant_payment_anonymous"))
                    .thenReturn(Optional.of(pref));

            Optional<String> result = service.getPreference("user-42", "merchant_payment_anonymous");

            assertTrue(result.isPresent());
            assertEquals("true", result.get());
        }

        @Test
        @DisplayName("should return empty when preference not found")
        void getPreference_NotFound() {
            when(repo.findByUserIdAndPrefKey("user-42", "nonexistent"))
                    .thenReturn(Optional.empty());

            Optional<String> result = service.getPreference("user-42", "nonexistent");

            assertFalse(result.isPresent());
        }
    }

    // -----------------------------------------------------------------------
    // setPreference
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("setPreference")
    class SetPreference {

        @Test
        @DisplayName("should create new preference when not exists")
        void setPreference_Create() {
            when(repo.findByUserIdAndPrefKey("user-42", "language"))
                    .thenReturn(Optional.empty());
            when(repo.save(any(UserPreference.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            service.setPreference("user-42", "language", "fr");

            ArgumentCaptor<UserPreference> captor = ArgumentCaptor.forClass(UserPreference.class);
            verify(repo).save(captor.capture());

            UserPreference saved = captor.getValue();
            assertEquals("user-42", saved.getUserId());
            assertEquals("language", saved.getPrefKey());
            assertEquals("fr", saved.getPrefValue());
        }

        @Test
        @DisplayName("should update existing preference (upsert)")
        void setPreference_Update() {
            UserPreference existing = new UserPreference();
            existing.setUserId("user-42");
            existing.setPrefKey("merchant_payment_anonymous");
            existing.setPrefValue("false");

            when(repo.findByUserIdAndPrefKey("user-42", "merchant_payment_anonymous"))
                    .thenReturn(Optional.of(existing));
            when(repo.save(any(UserPreference.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            service.setPreference("user-42", "merchant_payment_anonymous", "true");

            ArgumentCaptor<UserPreference> captor = ArgumentCaptor.forClass(UserPreference.class);
            verify(repo).save(captor.capture());

            UserPreference saved = captor.getValue();
            assertEquals("true", saved.getPrefValue());
            // Verify it's the same object (updated, not created new)
            assertSame(existing, saved);
        }

        @Test
        @DisplayName("should persist correctly with special characters in value")
        void setPreference_SpecialChars() {
            when(repo.findByUserIdAndPrefKey("user-42", "display_name"))
                    .thenReturn(Optional.empty());
            when(repo.save(any(UserPreference.class)))
                    .thenAnswer(invocation -> invocation.getArgument(0));

            service.setPreference("user-42", "display_name", "Épicerie Générale");

            ArgumentCaptor<UserPreference> captor = ArgumentCaptor.forClass(UserPreference.class);
            verify(repo).save(captor.capture());

            assertEquals("Épicerie Générale", captor.getValue().getPrefValue());
        }
    }

    // -----------------------------------------------------------------------
    // getAllPreferences
    // -----------------------------------------------------------------------

    @Nested
    @DisplayName("getAllPreferences")
    class GetAllPreferences {

        @Test
        @DisplayName("should return all preferences as key-value map")
        void getAllPreferences_MultiplePrefs() {
            UserPreference pref1 = new UserPreference();
            pref1.setPrefKey("language");
            pref1.setPrefValue("fr");

            UserPreference pref2 = new UserPreference();
            pref2.setPrefKey("merchant_payment_anonymous");
            pref2.setPrefValue("true");

            UserPreference pref3 = new UserPreference();
            pref3.setPrefKey("notifications_enabled");
            pref3.setPrefValue("false");

            when(repo.findByUserId("user-42"))
                    .thenReturn(List.of(pref1, pref2, pref3));

            Map<String, String> result = service.getAllPreferences("user-42");

            assertEquals(3, result.size());
            assertEquals("fr", result.get("language"));
            assertEquals("true", result.get("merchant_payment_anonymous"));
            assertEquals("false", result.get("notifications_enabled"));
        }

        @Test
        @DisplayName("should return empty map when no preferences exist")
        void getAllPreferences_Empty() {
            when(repo.findByUserId("new-user"))
                    .thenReturn(List.of());

            Map<String, String> result = service.getAllPreferences("new-user");

            assertNotNull(result);
            assertTrue(result.isEmpty());
        }

        @Test
        @DisplayName("should return single preference")
        void getAllPreferences_SinglePref() {
            UserPreference pref = new UserPreference();
            pref.setPrefKey("theme");
            pref.setPrefValue("dark");

            when(repo.findByUserId("user-42"))
                    .thenReturn(List.of(pref));

            Map<String, String> result = service.getAllPreferences("user-42");

            assertEquals(1, result.size());
            assertEquals("dark", result.get("theme"));
        }
    }
}
