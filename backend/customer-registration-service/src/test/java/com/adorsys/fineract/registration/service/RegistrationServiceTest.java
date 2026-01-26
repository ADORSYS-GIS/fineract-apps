// package com.adorsys.fineract.registration.service;

// import com.adorsys.fineract.registration.dto.*;
// import com.adorsys.fineract.registration.exception.RegistrationException;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Nested;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.keycloak.representations.idm.UserRepresentation;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;

// import java.math.BigDecimal;
// import java.time.LocalDate;
// import java.util.List;
// import java.util.Map;
// import java.util.Optional;

// import static org.assertj.core.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.*;
// import static org.mockito.Mockito.*;

// @ExtendWith(MockitoExtension.class)
// class RegistrationServiceTest {

//     @Mock
//     private KeycloakService keycloakService;

//     @Mock
//     private FineractService fineractService;

//     @Mock
//     private LimitsService limitsService;

//     @InjectMocks
//     private RegistrationService registrationService;

//     private RegistrationRequest validRequest;

//     @BeforeEach
//     void setUp() {
//         validRequest = RegistrationRequest.builder()
//                 .firstName("John")
//                 .lastName("Doe")
//                 .email("john.doe@example.com")
//                 .phone("+237612345678")
//                 .dateOfBirth(LocalDate.parse("1990-01-15"))
//                 .build();
//     }

//     @Nested
//     @DisplayName("register() tests")
//     class RegisterTests {

//         @Test
//         @DisplayName("should successfully register a new customer")
//         void shouldRegisterSuccessfully() {
//             // Given
//             Long fineractClientId = 123L;
//             String keycloakUserId = "kc-user-123";
//             Long savingsAccountId = 456L;

//             when(fineractService.createClient(any(RegistrationRequest.class), anyString()))
//                     .thenReturn(fineractClientId);
//             when(fineractService.createSavingsAccount(fineractClientId))
//                     .thenReturn(savingsAccountId);
//             when(keycloakService.createUser(any(RegistrationRequest.class), anyString()))
//                     .thenReturn(keycloakUserId);

//             // When
//             RegistrationResponse response = registrationService.register(validRequest);

//             // Then
//             assertThat(response).isNotNull();
//             assertThat(response.getExternalId()).isNotNull();
//             assertThat(response.getExternalId()).matches("[a-f0-9-]{36}"); // UUID format
//             assertThat(response.getStatus()).isEqualTo("pending_verification");

//             verify(fineractService).createClient(eq(validRequest), anyString());
//             verify(fineractService).createSavingsAccount(fineractClientId);
//             verify(keycloakService).createUser(eq(validRequest), anyString());
//         }

//         @Test
//         @DisplayName("should continue if savings account creation fails")
//         void shouldContinueIfSavingsAccountFails() {
//             // Given
//             Long fineractClientId = 123L;
//             String keycloakUserId = "kc-user-123";

//             when(fineractService.createClient(any(RegistrationRequest.class), anyString()))
//                     .thenReturn(fineractClientId);
//             when(fineractService.createSavingsAccount(fineractClientId))
//                     .thenThrow(new RuntimeException("Savings creation failed"));
//             when(keycloakService.createUser(any(RegistrationRequest.class), anyString()))
//                     .thenReturn(keycloakUserId);

//             // When
//             RegistrationResponse response = registrationService.register(validRequest);

//             // Then
//             assertThat(response).isNotNull();
//             assertThat(response.getStatus()).isEqualTo("pending_verification");
//         }

//         @Test
//         @DisplayName("should rollback on Fineract client creation failure")
//         void shouldRollbackOnFineractFailure() {
//             // Given
//             when(fineractService.createClient(any(RegistrationRequest.class), anyString()))
//                     .thenThrow(new RegistrationException("Fineract error"));

//             // When/Then
//             assertThatThrownBy(() -> registrationService.register(validRequest))
//                     .isInstanceOf(RegistrationException.class)
//                     .hasMessageContaining("Fineract error");

//             verify(keycloakService, never()).createUser(any(), any());
//             verify(keycloakService, never()).deleteUser(any());
//             verify(fineractService, never()).deleteClient(any());
//         }

//         @Test
//         @DisplayName("should rollback on Keycloak user creation failure")
//         void shouldRollbackOnKeycloakFailure() {
//             // Given
//             Long fineractClientId = 123L;

//             when(fineractService.createClient(any(RegistrationRequest.class), anyString()))
//                     .thenReturn(fineractClientId);
//             when(fineractService.createSavingsAccount(fineractClientId))
//                     .thenReturn(456L);
//             when(keycloakService.createUser(any(RegistrationRequest.class), anyString()))
//                     .thenThrow(new RegistrationException("Keycloak error"));

//             // When/Then
//             assertThatThrownBy(() -> registrationService.register(validRequest))
//                     .isInstanceOf(RegistrationException.class)
//                     .hasMessageContaining("Keycloak error");

//             verify(fineractService).deleteClient(fineractClientId);
//         }

//         @Test
//         @DisplayName("should wrap unexpected exceptions")
//         void shouldWrapUnexpectedExceptions() {
//             // Given
//             when(fineractService.createClient(any(RegistrationRequest.class), anyString()))
//                     .thenThrow(new RuntimeException("Unexpected error"));

//             // When/Then
//             assertThatThrownBy(() -> registrationService.register(validRequest))
//                     .isInstanceOf(RegistrationException.class)
//                     .hasMessageContaining("unexpected error");
//         }
//     }

//     @Nested
//     @DisplayName("getStatus() tests")
//     class GetStatusTests {

//         @Test
//         @DisplayName("should return completed status when all verifications done")
//         void shouldReturnCompletedStatus() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = createUserWithAttributes(Map.of(
//                     "kyc_tier", List.of("2"),
//                     "kyc_status", List.of("approved")
//             ));
//             user.setId("user-123");

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));
//             when(keycloakService.isEmailVerified("user-123")).thenReturn(true);
//             when(keycloakService.isWebAuthnRegistered("user-123")).thenReturn(true);

//             // When
//             RegistrationStatusResponse status = registrationService.getStatus(externalId);

//             // Then
//             assertThat(status.getRegistrationStatus()).isEqualTo("completed");
//             assertThat(status.isEmailVerified()).isTrue();
//             assertThat(status.isWebAuthnRegistered()).isTrue();
//             assertThat(status.getKycTier()).isEqualTo(2);
//             assertThat(status.getKycStatus()).isEqualTo("approved");
//         }

//         @Test
//         @DisplayName("should return pending_email_verification when email not verified")
//         void shouldReturnPendingEmailVerification() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = createUserWithAttributes(Map.of());
//             user.setId("user-123");

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));
//             when(keycloakService.isEmailVerified("user-123")).thenReturn(false);

//             // When
//             RegistrationStatusResponse status = registrationService.getStatus(externalId);

//             // Then
//             assertThat(status.getRegistrationStatus()).isEqualTo("pending_email_verification");
//             assertThat(status.isEmailVerified()).isFalse();
//         }

//         @Test
//         @DisplayName("should return pending_webauthn_registration when WebAuthn not registered")
//         void shouldReturnPendingWebAuthnRegistration() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = createUserWithAttributes(Map.of());
//             user.setId("user-123");

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));
//             when(keycloakService.isEmailVerified("user-123")).thenReturn(true);
//             when(keycloakService.isWebAuthnRegistered("user-123")).thenReturn(false);

//             // When
//             RegistrationStatusResponse status = registrationService.getStatus(externalId);

//             // Then
//             assertThat(status.getRegistrationStatus()).isEqualTo("pending_webauthn_registration");
//             assertThat(status.isWebAuthnRegistered()).isFalse();
//         }

//         @Test
//         @DisplayName("should throw exception when user not found")
//         void shouldThrowWhenUserNotFound() {
//             // Given
//             String externalId = "non-existent";
//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.empty());

//             // When/Then
//             assertThatThrownBy(() -> registrationService.getStatus(externalId))
//                     .isInstanceOf(RegistrationException.class)
//                     .hasMessageContaining("not found");
//         }

//         @Test
//         @DisplayName("should use default values when attributes missing")
//         void shouldUseDefaultsWhenAttributesMissing() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = new UserRepresentation();
//             user.setId("user-123");
//             user.setAttributes(null);

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));
//             when(keycloakService.isEmailVerified("user-123")).thenReturn(true);
//             when(keycloakService.isWebAuthnRegistered("user-123")).thenReturn(true);

//             // When
//             RegistrationStatusResponse status = registrationService.getStatus(externalId);

//             // Then
//             assertThat(status.getKycTier()).isEqualTo(1); // default
//             assertThat(status.getKycStatus()).isEqualTo("pending"); // default
//         }
//     }

//     @Nested
//     @DisplayName("getKycStatus() tests")
//     class GetKycStatusTests {

//         @Test
//         @DisplayName("should return KYC status with required documents")
//         void shouldReturnKycStatus() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = createUserWithAttributes(Map.of(
//                     "kyc_tier", List.of("1"),
//                     "kyc_status", List.of("pending")
//             ));

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));

//             // When
//             KycStatusResponse kycStatus = registrationService.getKycStatus(externalId);

//             // Then
//             assertThat(kycStatus.getKycTier()).isEqualTo(1);
//             assertThat(kycStatus.getKycStatus()).isEqualTo("pending");
//             assertThat(kycStatus.getRequiredDocuments())
//                     .containsExactly("ID_FRONT", "ID_BACK", "PROOF_OF_ADDRESS", "SELFIE_WITH_ID");
//         }

//         @Test
//         @DisplayName("should throw exception when customer not found")
//         void shouldThrowWhenCustomerNotFound() {
//             // Given
//             String externalId = "non-existent";
//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.empty());

//             // When/Then
//             assertThatThrownBy(() -> registrationService.getKycStatus(externalId))
//                     .isInstanceOf(RegistrationException.class)
//                     .hasMessageContaining("not found");
//         }
//     }

//     @Nested
//     @DisplayName("getLimits() tests")
//     class GetLimitsTests {

//         @Test
//         @DisplayName("should return limits for KYC tier")
//         void shouldReturnLimitsForTier() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = createUserWithAttributes(Map.of(
//                     "kyc_tier", List.of("2")
//             ));

//             LimitsResponse expectedLimits = LimitsResponse.builder()
//                     .kycTier(2)
//                     .limits(LimitsResponse.LimitsDto.builder()
//                             .dailyDepositLimit(BigDecimal.valueOf(500000))
//                             .dailyWithdrawalLimit(BigDecimal.valueOf(200000))
//                             .build())
//                     .build();

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));
//             when(limitsService.getLimits(2)).thenReturn(expectedLimits);

//             // When
//             LimitsResponse limits = registrationService.getLimits(externalId);

//             // Then
//             assertThat(limits.getKycTier()).isEqualTo(2);
//             verify(limitsService).getLimits(2);
//         }

//         @Test
//         @DisplayName("should use default tier 1 when attribute missing")
//         void shouldUseDefaultTier() {
//             // Given
//             String externalId = "ext-123";
//             UserRepresentation user = new UserRepresentation();
//             user.setAttributes(null);

//             LimitsResponse expectedLimits = LimitsResponse.builder()
//                     .kycTier(1)
//                     .build();

//             when(keycloakService.getUserByExternalId(externalId)).thenReturn(Optional.of(user));
//             when(limitsService.getLimits(1)).thenReturn(expectedLimits);

//             // When
//             registrationService.getLimits(externalId);

//             // Then
//             verify(limitsService).getLimits(1);
//         }
//     }

//     private UserRepresentation createUserWithAttributes(Map<String, List<String>> attributes) {
//         UserRepresentation user = new UserRepresentation();
//         user.setAttributes(attributes);
//         return user;
//     }
// }
