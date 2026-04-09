# Payment Gateway Architecture Guide

Technical documentation for the payment gateway service internals.

## Table of Contents
- [Service Layer](#service-layer)
- [Deposit Flow](#deposit-flow)
- [Withdrawal Flow](#withdrawal-flow)
- [Callback Processing](#callback-processing)
- [Reversal Mechanism](#reversal-mechanism)
- [Idempotency](#idempotency)
- [Daily Limits](#daily-limits)
- [Security](#security)
- [Scheduled Tasks](#scheduled-tasks)
- [Database Schema](#database-schema)
- [Provider Integrations](#provider-integrations)

---

## Service Layer

```
PaymentController / CallbackController
        │                    │
        ▼                    ▼
  PaymentService ────────────────────────────────┐
        │                                        │
        ├── TransactionReservationService         │  @Retryable wrappers
        │     (atomic limit check + insert)       │  (thin delegation)
        │                                        │
        ├── CallbackHandlerDelegate ◄────────────┘
        │     (@Transactional callback logic)
        │
        ├── ReversalService
        │     (@Retryable reversal + DLQ fallback)
        │
        ├── FineractClient (deposits/withdrawals)
        ├── MtnMomoClient
        ├── OrangeMoneyClient
        └── CinetPayClient
```

**Key design: AOP proxy separation.** `@Retryable` lives on `PaymentService`, `@Transactional` lives on `CallbackHandlerDelegate`. This ensures Spring AOP correctly wraps retry outside transaction. If both annotations were on the same bean, proxy ordering is unreliable.

---

## Deposit Flow

Customer pays into their savings account via mobile money.

```
1. Frontend ──POST /api/payments/deposit──▶ PaymentController
2. PaymentController: validate JWT, check fineract_external_id matches
3. PaymentService.initiateDeposit():
   a. Fast path: return existing txn if idempotency key exists
   b. Verify account ownership (FineractClient)
   c. TransactionReservationService.reserveWithLimitCheck():
      - pg_advisory_xact_lock(hashtext(externalId))  ◄── serializes per user
      - Check daily deposit limit (500K XAF)
      - INSERT payment_transactions (status=PENDING)
   d. Call provider API:
      - MTN: requestToPay → USSD push to customer
      - Orange: initializePayment → returns payment URL
      - CinetPay: checkout → returns payment URL
   e. Update txn with provider reference
4. Customer approves payment on phone / completes web payment
5. Provider sends callback ──▶ CallbackController
6. PaymentService.handleMtn/Orange/CinetPayCallback() [@Retryable]
   └── CallbackHandlerDelegate.process*Callback() [@Transactional]
       a. Acquire pessimistic lock (SELECT FOR UPDATE)
       b. Verify not already terminal (SUCCESSFUL/FAILED)
       c. Verify callback amount matches (blocks if >1 unit mismatch)
       d. FineractClient.createDeposit() → creates savings transaction
       e. Mark status = SUCCESSFUL
```

**Key point:** The Fineract deposit is created only on successful callback, not upfront.

---

## Withdrawal Flow

Customer receives money from their savings account to mobile money.

```
1. Frontend ──POST /api/payments/withdraw──▶ PaymentController
2. PaymentController: validate JWT identity
3. PaymentService.initiateWithdrawal():
   a. Fast path: return existing txn if idempotency key exists
   b. Verify account ownership
   c. Advisory balance check (Fineract is authoritative)
   d. TransactionReservationService.reserveWithLimitCheck():
      - Advisory lock + daily limit check + INSERT (PENDING)
   e. FineractClient.createWithdrawal()  ◄── debit happens FIRST
   f. Call provider to disburse:
      - MTN: transfer → sends money to phone
      - Orange: cashOut → sends money to phone
      - CinetPay: initiateTransfer → sends money to phone
   g. On provider failure: immediate reversal (compensating deposit)
   h. Update txn with provider ref, status = PROCESSING
4. Provider disburses funds to customer
5. Provider sends callback ──▶ CallbackController
6. CallbackHandlerDelegate [@Transactional]:
   - SUCCESS → mark SUCCESSFUL (Fineract withdrawal already done)
   - FAILED/CANCELLED → mark FAILED, return needsReversal=true
7. PaymentService (AFTER commit):
   - If reversal needed → ReversalService.reverseWithdrawal()
```

**Key point:** Fineract is debited BEFORE calling the provider. This prevents double-spend from concurrent withdrawals. If the provider fails, a compensating deposit (reversal) is created.

---

## Callback Processing

### AOP Pattern

```
PaymentService                         CallbackHandlerDelegate
┌─────────────────────┐               ┌─────────────────────────┐
│ @Retryable          │               │ @Transactional          │
│ (PessimisticLock    │──delegates──▶ │                         │
│  FailureException)  │               │ - Lock txn (FOR UPDATE) │
│                     │               │ - Verify amount         │
│ maxAttempts=3       │               │ - Create Fineract txn   │
│ backoff=100ms x2    │               │ - Update status         │
│                     │◀──returns────│ - Return CallbackResult │
│ if reversalNeeded:  │               └─────────────────────────┘
│   reversalService   │
│   .reverseWithdrawal│  ◄── called AFTER commit (prevents double-credit)
└─────────────────────┘
```

### Amount Verification

Callback amount must match the transaction amount within 1 unit tolerance (for XAF rounding). If the mismatch is greater, the deposit is **blocked** and the transaction is marked FAILED. This prevents fraud where a provider callback reports a lower amount.

---

## Reversal Mechanism

Three layers of reversal protection for failed withdrawals:

### Layer 1: Inline Reversal (immediate)
When the provider call fails immediately after the Fineract withdrawal:
```
PaymentService.initiateWithdrawal()
  → fineractClient.createWithdrawal() ✓
  → provider.transfer() ✗ (fails)
  → fineractClient.createDeposit("REVERSAL-{txnId}")  ◄── compensating deposit
```

### Layer 2: ReversalService (@Retryable)
When a callback reports FAILED/CANCELLED:
```
ReversalService.reverseWithdrawal(txn)
  @Retryable(maxAttempts=3, backoff=1000ms x2)
  → fineractClient.createDeposit("REVERSAL-{txnId}")

  @Recover → saves to reversal_dead_letters table
```

### Layer 3: DLQ Auto-Retry (scheduled)
Failed reversals that exhaust retries land in the dead-letter queue:
```
ReversalDlqRetryScheduler (every 15 min)
  → Find unresolved entries older than 5 min, retry count < 5
  → Optimistically mark resolved BEFORE calling Fineract (prevents double-credit)
  → On success: entry stays resolved
  → On failure: revert resolved status, increment retry count
  → After 5 retries: log CRITICAL, leave for manual admin resolution
```

### Admin DLQ Resolution
Ops team can use `GET /api/admin/reversals/dlq` to list and `PATCH /api/admin/reversals/dlq/{id}` to manually resolve entries after investigation.

---

## Idempotency

Every deposit/withdrawal request requires an `X-Idempotency-Key` header (must be UUID).

```
1. Client sends request with key = "550e8400-..."
2. PaymentService checks: transactionRepository.findById(key)
   → If found: return existing response (no side effects)
3. TransactionReservationService.reserveWithLimitCheck():
   → INSERT ... WHERE NOT EXISTS (SELECT 1 WHERE transaction_id = key)
   → Returns 0 if another thread already inserted (race-safe)
4. Only one thread proceeds to call the provider
```

---

## Daily Limits

Default: 500,000 XAF per day for both deposits and withdrawals.

### Race Condition Prevention

Without protection, two concurrent requests can both pass the limit check before either inserts:

```
Thread A: todayTotal = 400K, limit = 500K → 400K + 200K = 600K > 500K? No → pass
Thread B: todayTotal = 400K, limit = 500K → 400K + 200K = 600K > 500K? No → pass
Both insert → total = 800K (limit violated)
```

**Solution:** `TransactionReservationService` acquires `pg_advisory_xact_lock(hashtext(externalId))` which serializes all transactions for the same user within a database transaction. Thread B blocks until Thread A commits, then sees the updated total.

---

## Security

### Authentication
- **Payment endpoints**: JWT Bearer token (Keycloak OAuth2). The `fineract_external_id` claim must match the request's `externalId`.
- **Callback endpoints**: No JWT. Secured by provider-specific mechanisms below.
- **Admin endpoints**: JWT with ADMIN role.

### Callback Verification

| Provider | Mechanism |
|----------|-----------|
| MTN MoMo | `Ocp-Apim-Subscription-Key` header must match configured key |
| Orange Money | `notif_token` in callback body must match token stored during payment initialization |
| CinetPay (payment) | HMAC-SHA256 of concatenated callback fields, verified against X-Token header |
| CinetPay (transfer) | HMAC-SHA256 of `transactionId + amount + operatorTransactionId`, verified against X-Token |

### Rate Limiting (bucket4j + Redis)
- 5 payments/minute per user
- 50 status checks/minute per user
- 100 callbacks/minute per IP
- Falls back to in-memory buckets if Redis is unavailable

### IP Whitelisting (optional)
Callback endpoints can be restricted to known provider IP addresses via `CALLBACK_IP_WHITELIST_ENABLED=true` and `CALLBACK_IPS_MTN`, `CALLBACK_IPS_ORANGE`, `CALLBACK_IPS_CINETPAY`.

### Trusted Proxy
`server.forward-headers-strategy=framework` ensures `request.getRemoteAddr()` returns the correct client IP when behind a reverse proxy/ingress.

---

## Scheduled Tasks

| Task | Interval | Purpose |
|------|----------|---------|
| **Stale PENDING cleanup** | 5 min | Expires PENDING transactions older than 30 min (no callback received) |
| **Stale PROCESSING resolution** | 10 min | Polls provider APIs for PROCESSING withdrawals older than 60 min. Confirms success or triggers reversal. Escalates after 2 hours. |
| **DLQ auto-retry** | 15 min | Retries failed reversals from dead-letter queue (up to 5 attempts, 5 min cooldown) |

All schedulers are controlled by feature flags: `APP_CLEANUP_ENABLED`, `APP_DLQ_RETRY_ENABLED`.

---

## Database Schema

### payment_transactions

| Column | Type | Description |
|--------|------|-------------|
| `transaction_id` | VARCHAR(36) PK | UUID, doubles as idempotency key |
| `provider_reference` | VARCHAR(255) | Provider's external transaction ID |
| `external_id` | VARCHAR(36) | Customer's Fineract/Keycloak external ID |
| `account_id` | BIGINT | Fineract savings account ID |
| `provider` | VARCHAR(20) | `MTN_MOMO`, `ORANGE_MONEY`, `CINETPAY` |
| `type` | VARCHAR(20) | `DEPOSIT`, `WITHDRAWAL` |
| `amount` | DECIMAL(15,2) | Transaction amount |
| `currency` | VARCHAR(3) | `XAF` |
| `status` | VARCHAR(20) | `PENDING`, `PROCESSING`, `SUCCESSFUL`, `FAILED`, `EXPIRED`, `CANCELLED`, `REFUNDED` |
| `fineract_transaction_id` | BIGINT | Fineract savings transaction ID (set on success) |
| `notif_token` | VARCHAR(255) | Orange notif_token or CinetPay underlying provider hint |
| `version` | BIGINT | Optimistic locking |
| `created_at` | TIMESTAMP | Auto-set on insert |
| `updated_at` | TIMESTAMP | Auto-set on update |

**Indexes:** `provider_reference`, `(external_id, created_at)`, `status`, `(status, created_at)`

### reversal_dead_letters

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGINT PK | Auto-increment |
| `transaction_id` | VARCHAR(36) | Original payment transaction ID |
| `fineract_txn_id` | BIGINT | Fineract withdrawal transaction ID |
| `account_id` | BIGINT | Account to credit (reversal target) |
| `amount` | DECIMAL(15,2) | Amount to reverse |
| `currency` | VARCHAR(3) | Currency |
| `provider` | VARCHAR(20) | Payment provider |
| `failure_reason` | VARCHAR(500) | Last error message |
| `retry_count` | INTEGER | Auto-retry attempts |
| `resolved` | BOOLEAN | Whether manually or auto-resolved |
| `resolved_by` | VARCHAR(100) | Who resolved it |
| `resolved_at` | TIMESTAMP | When resolved |
| `notes` | TEXT | Resolution notes |
| `created_at` | TIMESTAMP | When the reversal first failed |

**Migrations:** V1 (tables), V2 (provider_reference length), V3 (notif_token), V4 (DLQ table), V5 (status constraint), V6 (retry_count)

---

## Provider Integrations

### MTN MoMo
- **Collection (deposit):** `POST /collection/v1_0/requesttopay` → triggers USSD prompt
- **Disbursement (withdrawal):** `POST /disbursement/v1_0/transfer` → sends money
- **Status polling:** `GET /{product}/v1_0/{requesttopay|transfer}/{referenceId}`
- **Auth:** Basic Auth → Bearer token (cached in Redis)
- **Callback auth:** `Ocp-Apim-Subscription-Key` header

### Orange Money
- **Payment (deposit):** `POST /webpayment` → returns payment URL + notif_token
- **Cash-out (withdrawal):** `POST /cashout` → sends money to phone
- **Status polling:** `GET /transactionstatus?order_id=&pay_token=`
- **Auth:** OAuth2 client credentials (cached in Redis)
- **Callback auth:** `notif_token` matching

### CinetPay
- **Payment (deposit):** `POST /v2/payment` → returns checkout URL (customer chooses MTN/Orange)
- **Transfer (withdrawal):** `POST /v1/transfer/money/send/contact` (auth token required)
- **Status polling:** `POST /v2/payment/check`
- **Auth:** API key (payments), login token with 5 min TTL (transfers, cached in Redis)
- **Callback auth:** HMAC-SHA256 signature (X-Token header)
- **GL mapping:** Dynamic — `cpm_payment_method` in callback determines MTN or Orange payment type for Fineract
