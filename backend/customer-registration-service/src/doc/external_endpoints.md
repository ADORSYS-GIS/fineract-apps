# External Endpoints Called by the Customer Registration Service

This document lists all the external API endpoints that the `customer-registration-service` calls. The service communicates with two main external systems: **Fineract** for core banking operations and **Keycloak** for identity and access management.

## Fineract API Endpoints

The service uses Fineract's REST API to manage clients, accounts, and documents. The base URL for the Fineract API is configured in the service's settings.

### Client Management

*   **`POST /fineract-provider/api/v1/clients`**
    *   **Purpose:** Creates a new client (customer) in Fineract.
    *   **Trigger:** Called during the initial registration process.
    *   **Internal Caller:** `POST /api/registration/register`

*   **`DELETE /fineract-provider/api/v1/clients/{clientId}`**
    *   **Purpose:** Deletes a client from Fineract.
    *   **Trigger:** Used for rolling back a registration if a subsequent step fails.
    *   **Internal Caller:** `POST /api/registration/register` (on failure)

*   **`GET /fineract-provider/api/v1/clients?externalId={externalId}`**
    *   **Purpose:** Retrieves a client's details using the external ID.
    *   **Trigger:** Used to look up a client in Fineract based on the ID stored in Keycloak.
    *   **Internal Caller:** `GET /api/registration/kyc/status`, `GET /api/kyc/staff/submissions/{externalId}`

*   **`POST /fineract-provider/api/v1/clients/{clientId}?command=activate`**
    *   **Purpose:** Activates a client's account.
    *   **Trigger:** Called when a KYC submission is approved.
    *   **Internal Caller:** `POST /api/kyc/staff/submissions/{externalId}/approve`

### Savings Account Management

*   **`POST /fineract-provider/api/v1/savingsaccounts`**
    *   **Purpose:** Creates a new savings account for a client.
    *   **Trigger:** Can be called after a client is created.
    *   **Internal Caller:** Not directly exposed via an endpoint, but used internally.

*   **`GET /fineract-provider/api/v1/savingsaccounts?clientId={clientId}`**
    *   **Purpose:** Retrieves all savings accounts belonging to a client.
    *   **Trigger:** Used to display account information to the user.
    *   **Internal Caller:** `GET /api/accounts/savings`

*   **`GET /fineract-provider/api/v1/savingsaccounts/{accountId}`**
    *   **Purpose:** Retrieves the details of a specific savings account.
    *   **Trigger:** Used when a user wants to view a specific account.
    *   **Internal Caller:** `GET /api/accounts/savings/{accountId}`

*   **`GET /fineract-provider/api/v1/savingsaccounts/{accountId}?associations=transactions`**
    *   **Purpose:** Fetches the transaction history for a savings account.
    *   **Trigger:** Used to display transaction history to the user.
    *   **Internal Caller:** `GET /api/accounts/savings/{accountId}/transactions`

### Document Management (KYC)

*   **`POST /fineract-provider/api/v1/clients/{clientId}/documents`**
    *   **Purpose:** Uploads a document for a client.
    *   **Trigger:** Called when a user uploads a document for KYC verification.
    *   **Internal Caller:** `POST /api/registration/kyc/documents`

*   **`GET /fineract-provider/api/v1/clients/{clientId}/documents`**
    *   **Purpose:** Retrieves all documents associated with a client.
    *   **Trigger:** Used by staff to review KYC submissions.
    *   **Internal Caller:** `GET /api/registration/kyc/status`, `GET /api/kyc/staff/submissions/{externalId}`

*   **`GET /fineract-provider/api/v1/clients/{clientId}/documents/{documentId}`**
    *   **Purpose:** Retrieves a specific document.
    *   **Trigger:** Used by staff to view a specific KYC document.
    *   **Internal Caller:** Not directly exposed, but used within `kycReviewService`.

## Keycloak Admin API Endpoints

The service uses the Keycloak Admin REST API to manage users and groups. The Keycloak Java client library handles the direct HTTP requests.

### User Management

*   **`POST /admin/realms/{realm}/users`**
    *   **Purpose:** Creates a new user in the specified realm.
    *   **Trigger:** Called during the initial registration process.
    *   **Internal Caller:** `POST /api/registration/register`

*   **`GET /admin/realms/{realm}/users`**
    *   **Purpose:** Searches for users based on attributes like email or `externalId`.
    *   **Trigger:** Used to check if a user already exists and to retrieve user details.
    *   **Internal Callers:** `POST /api/registration/register`, `GET /api/registration/status/{externalId}`, `GET /api/registration/kyc/status`, `GET /api/registration/limits`, `GET /api/kyc/staff/stats`, `GET /api/kyc/staff/submissions`

*   **`PUT /admin/realms/{realm}/users/{userId}`**
    *   **Purpose:** Updates a user's attributes.
    *   **Trigger:** Called to update a user's KYC status and tier upon approval.
    *   **Internal Callers:** `POST /api/kyc/staff/submissions/{externalId}/approve`, `POST /api/kyc/staff/submissions/{externalId}/reject`, `POST /api/kyc/staff/submissions/{externalId}/request-info`

*   **`DELETE /admin/realms/{realm}/users/{userId}`**
    *   **Purpose:** Deletes a user.
    *   **Trigger:** Used for rolling back a registration if a subsequent step fails.
    *   **Internal Caller:** `POST /api/registration/register` (on failure)

### Group Management

*   **`GET /admin/realms/{realm}/groups`**
    *   **Purpose:** Searches for a group by its name or path.
    *   **Trigger:** Used to find the "self-service-customers" group.
    *   **Internal Caller:** `POST /api/registration/register`

*   **`PUT /admin/realms/{realm}/users/{userId}/groups/{groupId}`**
    *   **Purpose:** Assigns a user to a specific group.
    *   **Trigger:** Called after a user is created to add them to the correct group.
    *   **Internal Caller:** `POST /api/registration/register`

*   **`GET /admin/realms/{realm}/groups/{groupId}/members`**
    *   **Purpose:** Retrieves the list of members in a group.
    *   **Trigger:** Used for administrative or reporting purposes.
    *   **Internal Caller:** Not directly exposed via an endpoint.