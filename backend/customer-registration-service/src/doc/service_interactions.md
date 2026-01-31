# Service Interaction Documentation

This document explains which external services (Fineract, Keycloak) are contacted by each API endpoint in the `customer-registration-service`.

## 1. `POST /api/registration/register`

-   **Interacts with**: Both **Fineract** and **Keycloak**.

-   **Flow**:
    1.  The `RegistrationController` receives the request and calls `RegistrationService.register()`.
    2.  `RegistrationService` first calls `FineractService.createClient()`.
    3.  `FineractService` makes an API call to the Fineract server to create a new client. This client is initially inactive, pending KYC.
    4.  `RegistrationService` then calls `KeycloakService.createUser()`.
    5.  `KeycloakService` makes an API call to the Keycloak server to create a new user.
    6.  If either of these steps fails, a rollback is attempted to delete the user or client that was created.

-   **Reason**:
    This is the main registration endpoint. Its purpose is to create a customer in both the core banking platform (**Fineract**) and the identity management system (**Keycloak**). A unique `externalId` is used to link the two records.

## 2. `GET /api/registration/status/{externalId}`

-   **Interacts with**: **Keycloak only**.

-   **Flow**:
    1.  The `RegistrationController` receives the request and calls `RegistrationService.getStatus()`.
    2.  `RegistrationService` calls `KeycloakService.getUserByExternalId()` to find the user in Keycloak.
    3.  It then checks properties of the Keycloak user, such as whether their email is verified and if they have set up multi-factor authentication.

-   **Reason**:
    The "registration status" is defined by the user's progress in setting up their account for login. These are identity-related concerns that are managed by **Keycloak**. Fineract is not involved in this part of the process.

## 3. `POST /api/registration/kyc/documents`

-   **Interacts with**: Both **Fineract** and **Keycloak**.

-   **Flow**:
    1.  The `KycDocumentController` receives the request and calls `KycDocumentService.uploadDocument()`.
    2.  `KycDocumentService` first calls `FineractService.getClientByExternalId()` to get the Fineract client ID.
    3.  It then calls `FineractService.uploadDocument()` to upload the file to Fineract.
    4.  After the upload, it calls `FineractService.getClientDocuments()` to check if all necessary KYC documents have now been uploaded.
    5.  If all documents are present, it calls `KeycloakService.updateKycStatus()` to change the `kyc_status` attribute on the Keycloak user to `under_review`.

-   **Reason**:
    KYC documents are related to the customer's banking profile, so they are stored in **Fineract**. However, the overall KYC status of a user is important for authorization (e.g., what a user is allowed to do). This status is stored in **Keycloak** as a user attribute, so Keycloak is updated when the document submission is complete.

## 4. `GET /api/registration/kyc/status`

-   **Interacts with**: **Keycloak only** (with a note).

-   **Flow**:
    1.  The `RegistrationController` receives the request and calls `RegistrationService.getKycStatus()`.
    2.  `RegistrationService` calls `KeycloakService.getUserByExternalId()` to find the user in Keycloak.
    3.  It then reads the `kyc_status` and `kyc_tier` attributes from the Keycloak user.

-   **Note**: The code contains a `TODO` comment to also fetch document details from Fineract, but this is not currently implemented.

-   **Reason**:
    This endpoint is designed to provide a summary of the user's KYC status. The primary source for the *status itself* (`pending`, `under_review`, `approved`) is the user's profile in **Keycloak**.

## 5. `GET /api/registration/limits`

-   **Interacts with**: **Keycloak only**.

-   **Flow**:
    1.  The `RegistrationController` receives the request and calls `RegistrationService.getLimits()`.
    2.  `RegistrationService` calls `KeycloakService.getUserByExternalId()` to find the user in Keycloak.
    3.  It reads the `kyc_tier` attribute from the Keycloak user.
    4.  The transaction limits are then determined based on this tier (this is internal logic, no further external calls are made).

-   **Reason**:
    Transaction limits are directly tied to a user's KYC verification level (tier). Since the KYC tier is stored as an attribute on the user in **Keycloak**, the service only needs to consult Keycloak to determine the applicable limits.
