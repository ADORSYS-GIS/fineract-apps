# Customer Registration Service: Architecture Overview

This document provides a high-level overview of the `customer-registration-service` architecture, its components, and their interactions.

## Core Components

The service is built on a microservices architecture pattern and is primarily composed of the following services. Each service has a distinct responsibility, following the Single Responsibility Principle.

*   **Registration Controller (`RegistrationController.java`):** This is the public-facing entry point for all API requests related to registration. It handles HTTP requests, validates the input, and delegates the business logic to the `RegistrationService`.

*   **Registration Service (`RegistrationService.java`):** This is the central orchestrator of the registration process. It manages the entire workflow, including generating the unique `externalId`, calling the Fineract and Keycloak services, and handling rollbacks in case of failure.

*   **Fineract Service (`FineractService.java`):** This service is responsible for all communication with the Fineract core banking system. Its primary role during registration is to create a new "Client" in Fineract, tagging it with the generated `externalId`.

*   **Keycloak Service (`KeycloakService.java`):** This service handles all interactions with Keycloak. It is responsible for creating a new User, assigning the `fineract_external_id` attribute to link the user to the Fineract client, and managing user groups and attributes.

*   **KYC & Limits Services:**
    *   `KycDocumentService.java`: Manages the uploading and processing of KYC documents.
    *   `KycReviewService.java`: Handles the business logic for KYC review, approval, and rejection.
    *   `LimitsService.java`: Determines the user's transaction limits based on their verified KYC tier.

## Registration Flow Diagram

The following Mermaid diagram illustrates the sequence of events during a successful new customer registration.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client (Frontend/Postman)
    participant CRS as Customer Registration Service
    participant FS as Fineract Service
    participant KS as Keycloak Service
    participant Fineract
    participant Keycloak

    C->>+CRS: POST /api/registration/register (UserDetails)
    Note over CRS: 1. Validate request payload
    CRS->>CRS: 2. Generate unique externalId (UUID)
    CRS->>+FS: 3. createClient(UserDetails, externalId)
    FS->>+Fineract: POST /clients
    Fineract-->>-FS: 200 OK (Fineract Client ID)
    FS-->>-CRS: Fineract Client ID
    CRS->>+KS: 4. createUser(UserDetails, externalId)
    KS->>+Keycloak: POST /users (with fineract_external_id attribute)
    Keycloak-->>-KS: 201 Created (Keycloak User ID)
    KS-->>-CRS: Keycloak User ID
    Note over CRS: 5. Registration successful
    CRS-->>-C: 200 OK ({"externalId": UUID})
```

## Status Check Flow

Once a user is registered, other services can check their status using the `externalId`. This flow relies on the searchable attribute we configured in Keycloak.

```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant CRS as Customer Registration Service
    participant KS as Keycloak Service
    participant Keycloak

    C->>+CRS: GET /api/registration/status/{externalId} (JWT)
    CRS->>+KS: getUserByExternalId(externalId)
    KS->>+Keycloak: Search for user where attribute fineract_external_id == {externalId}
    Keycloak-->>-KS: User Representation
    KS-->>-CRS: User Object
    Note over CRS: Check user's verification status, KYC tier, etc. from attributes.
    CRS-->>-C: 200 OK (RegistrationStatusResponse)
```
