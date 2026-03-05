# Customer Registration Service: Technical Documentation

## 1. Overview

The Customer Registration Service is a microservice responsible for orchestrating the creation of new customers in a robust, two-stage process. It exposes API endpoints that first create a "Client" entity and a savings account in the Fineract core banking platform, and then separately handle the funding and activation of that account.

## 2. API Endpoints

### `POST /api/registration/register`
This endpoint initiates the first stage of a new customer registration: creating the client and a savings account in a pending state.

### `POST /api/registration/approve-and-deposit`
This endpoint initiates the second stage: approving, activating, and (optionally) making an initial deposit into the newly created savings account. This endpoint is idempotent. See the "Idempotency" section for more details.

## 3. Security Model

Security is managed declaratively by the Spring Security framework.

-   **Authentication:** Both endpoints require a valid JWT `Bearer` token.
-   **Authorization:** Access is restricted by method-level security. Both the `registerClientAndAccount` and `fundAccount` methods are annotated with `@PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")`, ensuring only authorized callers can use these endpoints.

## 4. Idempotency

### Concept
In the context of APIs, idempotency means that making the same request multiple times will produce the same result as making it once. This doesn't mean the server will re-process the request each time; it means the server will guarantee the same outcome.

### Importance
For financial operations like making a deposit, idempotency is critical. Without it, a client-side retry (e.g., due to a temporary network failure) could result in a customer being charged multiple times for the same transaction. The `approve-and-deposit` endpoint is designed to be idempotent to prevent such issues.

### Implementation
Idempotency is achieved by requiring clients to send a unique `X-Idempotency-Key` in the request header.
- The service uses Redis to lock and cache the response for each unique idempotency key. When a request comes in, the service first checks if the key has been processed before.
- If the key is new, the service processes the transaction and stores the result in the Redis cache.
- If a request is received with an idempotency key that is already in the cache, the service returns the cached response without re-processing the transaction.
- The idempotency key is stored for 24 hours.

### Client-side Usage
Clients must generate a unique key (e.g., a UUID) for each distinct transaction. If a client needs to retry a request, it must use the *same* idempotency key as the original request. This allows the server to identify it as a retry and safely return the original result.

## 5. Payloads and Responses

### 5.1. Stage 1: Registration

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

### 5.2. Stage 2: Deposit and Activation

#### Request Headers (`/api/registration/approve-and-deposit`)
| Header | Required | Description |
|---|---|---|
| `X-Idempotency-Key` | **Yes** | A unique key (e.g., UUID) to ensure idempotency. |

#### Request Payload (`/api/registration/approve-and-deposit`)

| Field | Type | Required | Description |
|---|---|---|---|
| `savingsAccountId` | `Long` | **Yes** | The ID of the savings account obtained from the registration step. |
| `depositAmount` | `BigDecimal` | No | The amount to deposit. If not provided or zero, the account will only be approved and activated. |
| `paymentType` | `String` | **Yes** | The name of the payment type for the deposit. This must match a payment type configured in Fineract. The service fetches the list of available payment types from the Fineract API (`/api/v1/paymenttypes`) and caches them. Example: "Cash". |


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

## 6. Registration Workflow

The process is now split into two distinct, idempotent, and transactional stages.

1.  **Stage 1: Register Client and Account**
    a. A client application sends a `POST` request to `/api/registration/register`.
    b. The service checks if a client with the `externalId` already exists.
    c. If not, it builds and executes a **transactional batch request** to Fineract to:
        i. Create the client.
        ii. Create the savings account (in a "Submitted and pending approval" state).
    d. The service returns a `201 Created` response containing the new `fineractClientId` and `savingsAccountId`.

2.  **Stage 2: Fund Account**
    a. The client application takes the `savingsAccountId` from the Stage 1 response, generates a unique `X-Idempotency-Key`, and sends a `POST` request to `/api/registration/approve-and-deposit` with the key in the header.
    b. The service now makes **three sequential API calls** to Fineract to:
        i. Approve the savings account.
        ii. Activate the savings account.
        iii. (If `depositAmount` > 0) Post a deposit transaction to the account.
    c. The service returns a `200 OK` response confirming the activation and providing the `transactionId` if a deposit was made.

## 7. Local Testing via cURL

### 7.1. Obtain an Access Token

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

### 7.2. Test Suite: Success Scenarios

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
export IDEMPOTENCY_KEY=$(uuidgen)

curl --location --request POST 'http://localhost:8081/api/registration/approve-and-deposit' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--header "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
--data-raw "{
    \"savingsAccountId\": $SAVINGS_ACCOUNT_ID,
    \"depositAmount\": 1000,
    \"paymentType\": \"Cash\"
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

#### Test Case 2: Approve and Activate Only (SUCCESS)
**Objective:** Activate an account without an initial deposit.
**Instructions:** Use a `savingsAccountId` from a new registration to avoid conflicts with previous tests.
**Expected Result:** `200 OK`

```bash
# First, register a new user to get a new savingsAccountId (e.g., with external-id-002)
# ... (run registration curl) ...
# Then, set the new SAVINGS_ACCOUNT_ID
export SAVINGS_ACCOUNT_ID=<new_id>
export IDEMPOTENCY_KEY=$(uuidgen)

curl --location --request POST 'http://localhost:8081/api/registration/approve-and-deposit' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--header "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
--data-raw "{
    \"savingsAccountId\": $SAVINGS_ACCOUNT_ID,
    \"depositAmount\": 0,
    \"paymentType\": \"Cash\" 
}"
```
*Note: `paymentType` is still required, but the `depositAmount` of 0 means no transaction will be posted. The response will not contain a `transactionId`.*


### 7.3. Test Suite: Failure Scenarios

#### Test Case 3: Attempt to Re-register with Same `externalId` (FAILURE)
**Objective:** Verify that the registration endpoint is idempotent based on `externalId`.
**Expected Result:** `409 Conflict` (or similar error indicating a duplicate)

```bash
# This uses the same externalId as Test Case 1
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

#### Test Case 4: Missing Required Field (FAILURE)
**Objective:** Verify server-side validation.
**Expected Result:** `400 Bad Request`

```bash
# Missing "lastName"
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "John",
    "email": "john.doe@example.cm",
    "phone": "+237692222222",
    "externalId": "external-id-003"
}'
```

#### Test Case 5: Invalid `paymentType` (FAILURE)
**Objective:** Verify that the `approve-and-deposit` endpoint validates the `paymentType`.
**Expected Result:** `400 Bad Request`

```bash
# Assumes SAVINGS_ACCOUNT_ID is set from a successful registration
export IDEMPOTENCY_KEY=$(uuidgen)
curl --location --request POST 'http://localhost:8081/api/registration/approve-and-deposit' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--header "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
--data-raw "{
    \"savingsAccountId\": $SAVINGS_ACCOUNT_ID,
    \"depositAmount\": 500,
    \"paymentType\": \"Invalid Payment Type\"
}"
```

#### Test Case 6: Missing Idempotency Key (FAILURE)
**Objective:** Verify that the `X-Idempotency-Key` header is enforced.
**Expected Result:** `400 Bad Request`

```bash
# Assumes SAVINGS_ACCOUNT_ID is set from a successful registration
curl --location --request POST 'http://localhost:8081/api/registration/approve-and-deposit' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw "{
    \"savingsAccountId\": $SAVINGS_ACCOUNT_ID,
    \"depositAmount\": 500,
    \"paymentType\": \"Cash\"
}"
```

## 8. Post-Registration State

-   **After Stage 1:** A **Client** exists and is active. A **Savings Account** exists but is in a "Submitted and pending approval" state. It cannot be transacted upon yet.
-   **After Stage 2:** The **Savings Account** is now **Approved** and **Activated**, making it ready for transactions. The initial deposit has been credited.
