# Customer Registration Service: Technical Documentation

## 1. Overview

The Customer Registration Service is a microservice responsible for orchestrating the creation of new customers in a robust, two-stage process. It exposes API endpoints that first create a "Client" entity and a savings account in the Fineract core banking platform, and then separately handle the funding and activation of that account.

## 2. API Endpoints

### `POST /api/registration/register`
This endpoint initiates the first stage of a new customer registration: creating the client and a savings account in a pending state.

### `POST /api/registration/approve-and-deposit`
This endpoint initiates the second stage: approving, activating, and (optionally) making an initial deposit into the newly created savings account.

## 3. Security Model

Security is managed declaratively by the Spring Security framework.

-   **Authentication:** Both endpoints require a valid JWT `Bearer` token.
-   **Authorization:** Access is restricted by method-level security. Both the `registerClientAndAccount` and `fundAccount` methods are annotated with `@PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")`, ensuring only authorized callers can use these endpoints.

## 4. Payloads and Responses

### 4.1. Stage 1: Registration

#### Request Payload (`/api/registration/register`)

| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | `String` | **Yes** | The customer's first name. |
| `lastName` | `String` | **Yes** | The customer's last name. |
| `email` | `String` | No | The customer's email address. |
| `phone` | `String` | **Yes** | The customer's mobile phone number. |
| `externalId`| `String` | **Yes** | A unique identifier from the external identity system. |
| `dateOfBirth`| `LocalDate` | No | Format: `YYYY-MM-DD`. |
| ... | ... | ... | (Other address fields as before) |

#### Success Response (`201 Created`)

A successful registration returns the Fineract Client ID and the new (but not yet active) Savings Account ID.

```json
{
  "success": true,
  "status": "success",
  "fineractClientId": 102,
  "savingsAccountId": 205
}
```

### 4.2. Stage 2: Deposit and Activation

#### Request Payload (`/api/registration/approve-and-deposit`)

| Field | Type | Required | Description |
|---|---|---|---|
| `savingsAccountId` | `Long` | **Yes** | The ID of the savings account obtained from the registration step. |
| `depositAmount` | `BigDecimal` | No | The amount to deposit. If not provided or zero, the account will only be approved and activated. |

#### Success Response (`200 OK`)

A successful deposit and activation returns the transaction ID for the deposit.

```json
{
  "success": true,
  "status": "success",
  "savingsAccountId": 205,
  "transactionId": 512
}
```

## 5. Registration Workflow

The process is now split into two distinct, idempotent, and transactional stages.

1.  **Stage 1: Register Client and Account**
    a. A client application sends a `POST` request to `/api/registration/register`.
    b. The service checks if a client with the `externalId` already exists.
    c. If not, it builds and executes a **transactional batch request** to Fineract to:
        i. Create the client.
        ii. Create the savings account (in a "Submitted and pending approval" state).
    d. The service returns a `201 Created` response containing the new `fineractClientId` and `savingsAccountId`.

2.  **Stage 2: Fund Account**
    a. The client application takes the `savingsAccountId` from the Stage 1 response and sends a `POST` request to `/api/registration/approve-and-deposit`.
    b. The service now makes **three sequential API calls** to Fineract to:
        i. Approve the savings account.
        ii. Activate the savings account.
        iii. (If `depositAmount` > 0) Post a deposit transaction to the account.
    c. The service returns a `200 OK` response confirming the activation and providing the `transactionId` if a deposit was made.

## 6. Local Testing via cURL

### 6.1. Obtain an Access Token

First, obtain a token from Keycloak.

```bash
export TOKEN=$(curl -s --location --request POST "http://localhost:9000/realms/fineract/protocol/openid-connect/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=setup-app-client" \
--data-urlencode "client_secret=**********" \
--data-urlencode "username=mifos" \
--data-urlencode "password=password" \
--data-urlencode "grant_type=password" | jq -r '.access_token')
```

### 6.2. Test Suite: Two-Stage Registration

#### Test Case 1, Step 1: Register Client and Account (SUCCESS)
**Objective:** Create the client and the savings account.
**Expected Result:** `201 Created`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Brenda",
    "lastName": "Biya",
    "email": "brenda.biya@example.cm",
    "phone": "+237691111111",
    "externalId": "external-id-001"
}'
```
**Note:** The `depositAmount` is no longer part of this request.

**Sample Response:**
```json
{
  "success": true,
  "status": "success",
  "fineractClientId": 13,
  "savingsAccountId": 26
}
```

#### Test Case 1, Step 2: Approve, Activate, and Deposit (SUCCESS)
**Objective:** Activate the account created in the previous step and make a deposit.
**Instructions:** Manually replace `SAVINGS_ACCOUNT_ID` in the command below with the `savingsAccountId` you received from the previous step's response.
**Expected Result:** `200 OK`

```bash
# IMPORTANT: Replace 26 with the actual savingsAccountId from the previous response
export SAVINGS_ACCOUNT_ID=26

curl --location --request POST 'http://localhost:8081/api/registration/approve-and-deposit' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw "{
    \"savingsAccountId\": $SAVINGS_ACCOUNT_ID,
    \"depositAmount\": 1000
}"
```

**Sample Response:**
```json
{
  "success": true,
  "status": "success",
  "savingsAccountId": 26,
  "transactionId": 512
}
```

## 7. Post-Registration State

-   **After Stage 1:** A **Client** exists and is active. A **Savings Account** exists but is in a "Submitted and pending approval" state. It cannot be transacted upon yet.
-   **After Stage 2:** The **Savings Account** is now **Approved** and **Activated**, making it ready for transactions. The initial deposit has been credited.
