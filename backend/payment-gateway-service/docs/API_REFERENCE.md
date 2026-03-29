# Payment Gateway API Reference

## 1. Overview
The Payment Gateway Service provides a unified interface for processing mobile money deposits (collections) and withdrawals (disbursements) across multiple providers (MTN MoMo, Orange Money, CinetPay). It handles the complexity of interacting with external payment providers and synchronizing transaction states with the Core Banking System (Apache Fineract).

## 2. Base URL
| Environment | Base URL |
|-------------|----------|
| Development | `https://payments-dev.webank.cm/api` |
| Production  | `https://payments.webank.cm/api` |
| Local       | `http://localhost:8082/api` |

## 3. Authentication & Security
All payment endpoints require a Bearer Token (JWT) issued by Keycloak. The JWT must contain a `fineract_external_id` claim matching the request's `externalId`.

**Required Headers:**
- `Authorization`: `Bearer <access_token>`
- `Content-Type`: `application/json`

**Rate Limits:**
| Endpoint Type | Limit |
|---------------|-------|
| Deposit/Withdraw | 5 per minute per user |
| Status check | 50 per minute per user |
| Callbacks | 100 per minute per IP |

**Daily Transaction Limits:**
| Type | Limit |
|------|-------|
| Deposits | 500,000 XAF per day |
| Withdrawals | 500,000 XAF per day |

## 4. Idempotency
All deposit/withdrawal requests **must** include a unique UUID key to prevent duplicate transactions.

**Header:** `X-Idempotency-Key: <UUID>`

- New key: request is processed normally
- Existing key: returns the existing transaction status without re-initiating

---

## 5. Payment Endpoints

### 5.1 Initiate Deposit

Triggers a payment request to the customer's mobile money wallet.

- **Endpoint:** `POST /payments/deposit`
- **Auth:** Bearer JWT

**Request Body:**
```json
{
  "externalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "accountId": 12345,
  "amount": 5000,
  "provider": "MTN_MOMO",
  "phoneNumber": "237670000000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `externalId` | UUID | Yes | Customer's Fineract external ID (must match JWT claim) |
| `accountId` | Long | Yes | Fineract savings account ID |
| `amount` | Decimal | Yes | Amount (100 - 5,000,000 XAF) |
| `provider` | Enum | Yes | `MTN_MOMO`, `ORANGE_MONEY`, `CINETPAY` |
| `phoneNumber` | String | Yes | Cameroon phone number (`237XXXXXXXXX` or `XXXXXXXXX`) |

**Success Response (200):**
```json
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "providerReference": "c0c66ac4-899e-...",
  "provider": "MTN_MOMO",
  "type": "DEPOSIT",
  "amount": 5000,
  "currency": "XAF",
  "status": "PENDING",
  "message": "Please approve the payment on your phone",
  "paymentUrl": null,
  "createdAt": "2026-02-05T14:30:00Z"
}
```

For Orange Money and CinetPay, `paymentUrl` contains the URL to redirect the customer to complete payment.

---

### 5.2 Initiate Withdrawal

Transfers funds from the customer's savings account to their mobile money wallet.

- **Endpoint:** `POST /payments/withdraw`
- **Auth:** Bearer JWT

**Request Body:**
```json
{
  "externalId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "accountId": 12345,
  "amount": 2000,
  "provider": "MTN_MOMO",
  "phoneNumber": "237670000000"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `externalId` | UUID | Yes | Customer's Fineract external ID |
| `accountId` | Long | Yes | Fineract savings account ID |
| `amount` | Decimal | Yes | Amount (100 - 5,000,000 XAF) |
| `provider` | Enum | Yes | `MTN_MOMO`, `ORANGE_MONEY`, `CINETPAY` |
| `phoneNumber` | String | Yes | Destination phone number |

**Success Response (200):**
```json
{
  "transactionId": "789e8400-e29b-...",
  "providerReference": "mtn-ref-123",
  "provider": "MTN_MOMO",
  "type": "WITHDRAWAL",
  "amount": 2000,
  "currency": "XAF",
  "status": "PROCESSING",
  "message": "Withdrawal is being processed",
  "fineractTransactionId": 789,
  "createdAt": "2026-02-05T15:00:00Z"
}
```

---

### 5.3 Check Transaction Status

- **Endpoint:** `GET /payments/status/{transactionId}`
- **Auth:** Bearer JWT (only the transaction owner can query)

**Response (200):**
```json
{
  "transactionId": "550e8400-...",
  "providerReference": "mtn-ref-123",
  "provider": "MTN_MOMO",
  "type": "DEPOSIT",
  "amount": 5000,
  "currency": "XAF",
  "status": "SUCCESSFUL",
  "externalId": "a1b2c3d4-...",
  "accountId": 12345,
  "fineractTransactionId": 102,
  "createdAt": "2026-02-05T14:30:00Z",
  "updatedAt": "2026-02-05T14:31:00Z"
}
```

---

## 6. Callback Endpoints (Webhooks)

These endpoints are called by payment providers to report transaction status updates. They must be publicly accessible but are **not** called by the frontend.

### 6.1 MTN MoMo
| Endpoint | Purpose |
|----------|---------|
| `POST /callbacks/mtn/collection` | Deposit result |
| `POST /callbacks/mtn/disbursement` | Withdrawal result |

Auth: `Ocp-Apim-Subscription-Key` header.

### 6.2 Orange Money
| Endpoint | Purpose |
|----------|---------|
| `POST /callbacks/orange/payment` | Deposit result |
| `POST /callbacks/orange/cashout` | Withdrawal result |

Auth: `notif_token` in callback body matching stored token.

### 6.3 CinetPay
| Endpoint | Purpose |
|----------|---------|
| `POST /callbacks/cinetpay/payment` | Deposit result (JSON or form-encoded) |
| `POST /callbacks/cinetpay/transfer` | Withdrawal result (JSON or form-encoded) |

Auth: HMAC-SHA256 signature in `X-Token` header.

---

## 7. Admin Endpoints

Require JWT with `ADMIN` role.

### 7.1 List Unresolved Reversal Failures
- **Endpoint:** `GET /admin/reversals/dlq`
- **Response:** Array of dead-letter entries ordered by creation time

### 7.2 Resolve a Dead-Letter Entry
- **Endpoint:** `PATCH /admin/reversals/dlq/{id}`
- **Request Body:**
```json
{
  "resolvedBy": "admin-username",
  "notes": "Manually created deposit in Fineract"
}
```

### 7.3 Count Unresolved Entries
- **Endpoint:** `GET /admin/reversals/dlq/count`
- **Response:** `{ "count": 3 }`

---

## 8. Supported Providers

| Code | Name | Deposit | Withdrawal | GL Mapping |
|------|------|---------|------------|------------|
| `MTN_MOMO` | MTN Mobile Money | USSD push | Direct transfer | Dedicated payment type |
| `ORANGE_MONEY` | Orange Money | Payment URL | Cash-out | Dedicated payment type |
| `CINETPAY` | CinetPay Gateway | Checkout URL | Transfer API | Dynamic (maps to MTN/Orange based on customer's payment method) |

---

## 9. Transaction Lifecycle

```
PENDING ──callback──▶ SUCCESSFUL
   │
   │──callback──▶ FAILED
   │
   │──timeout(30min)──▶ EXPIRED
   │
   └──▶ PROCESSING ──callback──▶ SUCCESSFUL
              │
              │──callback──▶ FAILED (+ reversal)
              │
              │──callback──▶ CANCELLED (+ reversal)
              │
              └──poll(60min)──▶ resolved via provider status
```

| Status | Description |
|--------|-------------|
| `PENDING` | Request initiated, waiting for customer action (deposit) or provider confirmation |
| `PROCESSING` | Fineract debited, provider processing disbursement (withdrawal only) |
| `SUCCESSFUL` | Payment confirmed, funds credited/debited in Fineract |
| `FAILED` | Payment declined, provider error, or amount mismatch |
| `EXPIRED` | No callback received within 30 minutes |
| `CANCELLED` | Customer cancelled on provider side (triggers reversal for withdrawals) |
| `REFUNDED` | Reserved for future refund functionality |

---

## 10. Error Responses

All errors follow this format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable description",
  "code": "SPECIFIC_CODE",
  "timestamp": "2026-02-05T14:30:00Z"
}
```

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | `PAYMENT_ERROR` | Validation error (insufficient funds, invalid amount, etc.) |
| 400 | `DAILY_LIMIT_EXCEEDED` | Daily deposit/withdrawal limit exceeded |
| 403 | - | JWT missing `fineract_external_id` or externalId mismatch |
| 404 | `PAYMENT_ERROR` | Transaction not found |
| 429 | `TOO_MANY_REQUESTS` | Rate limit exceeded |
| 500 | `INTERNAL_ERROR` | Unexpected server error |
