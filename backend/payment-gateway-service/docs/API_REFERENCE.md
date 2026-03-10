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
All endpoints require authentication via a Bearer Token (JWT) issued by the Identity Provider (Keycloak).

**Headers:**
*   `Authorization`: `Bearer <access_token>` (Required)
*   `Content-Type`: `application/json` (Required)

## 4. Idempotency
To prevent duplicate transactions (e.g., due to network retries), clients **must** provide a unique key for every transaction request.

**Header:**
*   `X-Idempotency-Key`: `<UUID>` (Required for Deposit/Withdrawal)

**Behavior:**
*   If a request is sent with a new key, it is processed.
*   If a request is sent with an existing key, the system returns the **existing transaction status** without re-initiating the payment.

---

## 5. Endpoints

### 5.1 Initiate Deposit (Collection)
Triggers a payment request to the customer's mobile money wallet (USSD push or payment link).

*   **Endpoint:** `POST /payments/deposit`
*   **Description:** Use this when a customer wants to move money **from** their Mobile Money wallet **to** their Savings Account.

**Request Body:**
```json
{
  "accountId": 12345,                // Fineract Savings Account ID
  "amount": 5000,                    // Amount to deposit
  "currency": "XAF",                 // Currency Code (XAF, XOF)
  "provider": "MTN_MOMO",            // Provider: MTN_MOMO, ORANGE_MONEY, CINETPAY
  "phoneNumber": "237670000000",     // Customer's phone number
  "externalId": "user-uuid-123",     // Customer's unique User ID
  "reference": "Optional note"       // Optional description
}
```

**Success Response (200 OK):**
```json
{
  "transactionId": "550e8400-e29b-41d4-a716-446655440000", // The Idempotency Key
  "providerReference": "c0c66ac4-899e...",                // External Provider ID
  "status": "PENDING",                                    // Initial status
  "message": "Please approve the payment on your phone",
  "paymentUrl": null,                                     // URL if provider requires redirect
  "createdAt": "2026-02-05T14:30:00Z"
}
```

---

### 5.2 Initiate Withdrawal (Disbursement)
Transfers funds from the customer's Savings Account to their Mobile Money wallet.

*   **Endpoint:** `POST /payments/withdraw`
*   **Description:** Use this when a customer wants to move money **from** their Savings Account **to** their Mobile Money wallet.

**Request Body:**
```json
{
  "accountId": 12345,
  "amount": 2000,
  "currency": "XAF",
  "provider": "MTN_MOMO",
  "phoneNumber": "237670000000",
  "externalId": "user-uuid-123",
  "reference": "Withdrawal"
}
```

**Success Response (200 OK):**
```json
{
  "transactionId": "789e8400-e29b-...",
  "providerReference": "mtn-ref-123",
  "status": "PROCESSING",             // Status indicating funds locked & transfer initiated
  "message": "Withdrawal is being processed",
  "createdAt": "2026-02-05T15:00:00Z"
}
```

**Error Response (400/500):**
```json
{
  "error": "PAYMENT_ERROR",
  "message": "Insufficient funds"
}
```

---

### 5.3 Check Transaction Status
Retrieves the current status of a transaction.

*   **Endpoint:** `GET /payments/status/{transactionId}`

**Response (200 OK):**
```json
{
  "transactionId": "550e8400-...",
  "status": "SUCCESSFUL",             // PENDING, PROCESSING, SUCCESSFUL, FAILED
  "amount": 5000,
  "provider": "MTN_MOMO",
  "fineractTransactionId": 102        // ID of the resulting Savings Transaction
}
```

---

## 6. Callback Endpoints (Webhooks)
These endpoints are called by the payment providers (MTN, Orange, CinetPay) to notify the system of transaction status updates. They are **not** intended to be called by the frontend directly, but must be publicly accessible.

### 6.1 MTN MoMo
*   **Deposit Callback:** `POST /callbacks/mtn/collection`
*   **Withdrawal Callback:** `POST /callbacks/mtn/disbursement`

### 6.2 Orange Money
*   **Deposit Callback:** `POST /callbacks/orange/payment`
*   **Withdrawal Callback:** `POST /callbacks/orange/cashout`

### 6.3 CinetPay
*   **Deposit Callback:** `POST /callbacks/cinetpay/payment`
*   **Withdrawal Callback:** `POST /callbacks/cinetpay/transfer`

---

## 7. Supported Providers

| Provider Code | Description | Currency | Features |
| :--- | :--- | :--- | :--- |
| `MTN_MOMO` | MTN Mobile Money | XAF, XOF | Collections, Disbursements |
| `ORANGE_MONEY` | Orange Money | XAF, XOF | Collections, Disbursements |
| `CINETPAY` | CinetPay Gateway | XAF, XOF | Aggregator (Cards, Wallets) |

## 8. Transaction Lifecycle

1.  **PENDING:** Request initiated. Waiting for user approval (Deposit).
2.  **PROCESSING:** Processing with provider (Withdrawal).
3.  **SUCCESSFUL:** Payment confirmed. Funds credited/debited in Core Banking.
4.  **FAILED:** Payment declined, expired, or error occurred.
