# Keycloak Custom User Attributes

This document outlines the custom user attributes that the Customer Registration Service sets on a user's profile in Keycloak.

These attributes are used to store information about the user's registration, KYC status, and Fineract-related identifiers.

## Core Attributes

### `fineract_external_id`
*   **Purpose:** A unique UUID that links the Keycloak user to their corresponding "Client" entity in Fineract. This is the primary identifier used across services.
*   **When Set:** During the initial user registration.
*   **Keycloak Configuration:** This attribute **must** be configured as "Searchable" in the Keycloak realm's "User Profile" settings for the service to function correctly.

### `fineract_client_id`
*   **Purpose:** The numerical ID of the "Client" entity in Fineract.
*   **When Set:** This is typically set during registration along with the `fineract_external_id`. It's often included in JWT tokens as a custom claim for easy access by other services.

### `phone`
*   **Purpose:** Stores the user's phone number provided during registration.
*   **When Set:** During the initial user registration.

## KYC (Know Your Customer) Attributes

### `kyc_status`
*   **Purpose:** Tracks the user's current KYC verification status.
*   **When Set:** Set to `pending` on initial registration. It is updated by a staff member during the KYC review process.
*   **Possible Values:**
    *   `pending`: The user has registered but not yet submitted documents or is awaiting review.
    *   `approved`: A staff member has reviewed and approved the user's documents.
    *   `rejected`: A staff member has rejected the user's documents.
    *   `more_info_required`: A staff member has requested additional information from the user.

### `kyc_tier`
*   **Purpose:** Defines the user's transaction limits and access to certain features. A higher tier corresponds to a higher level of trust and higher limits.
*   **When Set:** Set to `1` on initial registration. It is updated by a staff member upon successful KYC approval.
*   **Possible Values:** `1`, `2`, `3`. The tier is determined by the staff member based on the quality of the KYC documents.

## KYC Review Process Attributes

These attributes are set when a staff member takes action on a KYC submission.

### `kyc_reviewed_at`
*   **Purpose:** An ISO 8601 timestamp recording when the KYC review was completed.
*   **When Set:** When a submission is approved or rejected.

### `kyc_reviewed_by`
*   **Purpose:** Stores the name or username of the staff member who performed the review.
*   **When Set:** When a submission is approved or rejected.

### `kyc_review_notes`
*   **Purpose:** Contains any notes the staff member added during the approval process.
*   **When Set:** Optionally set during KYC approval.

### `kyc_rejection_reason`
*   **Purpose:** Stores the reason why a KYC submission was rejected.
*   **When Set:** When a submission is rejected.

### `kyc_info_request`
*   **Purpose:** Contains the message sent to the user requesting more information.
*   **When Set:** When a staff member requests more information.

### `kyc_info_requested_at`
*   **Purpose:** An ISO 8601 timestamp for when the request for more information was made.
*   **When Set:** When a staff member requests more information.
