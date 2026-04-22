# Payment Gateway — MTN Sandbox Testing Guide

## 1. Sandbox Readiness Checklist

### Backend (Payment Gateway Service)
- [x] MTN MoMo client fully implemented (`MtnMomoClient.java`)
- [x] Sandbox base URL configured: `https://sandbox.momodeveloper.mtn.com`
- [x] Target environment defaults to `sandbox`
- [x] Collections (deposits) via `/collection/v1_0/requesttopay`
- [x] Disbursements (withdrawals) via `/disbursement/v1_0/transfer`
- [x] OAuth2 token flow with caching
- [x] Callback endpoints: `/api/callbacks/mtn/collection` and `/api/callbacks/mtn/disbursement`
- [x] SealedSecrets exist for dev environment with MTN keys (`mtn-api-key`, `mtn-collection-key`, `mtn-disbursement-key`)

### Missing / Action Items
- [ ] **`mtn.momo.api-user-id`** is NOT set in `values-hetzner.yaml` — falls back to `placeholder`. Must be set to the real sandbox API User UUID.
- [x] **Callback URL**: The main gateway nginx (`gateway.conf`) already proxies `/api/callbacks/` to the payment gateway service. Callbacks from MTN should target `https://dev.azamra.capital/api/callbacks/mtn/collection`. Set `MTN_CALLBACK_URL=https://dev.azamra.capital/api/callbacks` in deployment.
- [ ] **Payment API route missing**: The gateway nginx does NOT yet proxy `/api/payments/` to the payment gateway. The frontend needs this route added to `gateway.conf` to call deposit/withdraw endpoints.
- [ ] **Frontend** deposit/withdraw pages are mock implementations (2-second `setTimeout`). They do NOT call the payment gateway API yet.

---

## 2. MTN Sandbox Setup

### Step 1: Register on MTN Developer Portal
1. Go to https://momodeveloper.mtn.com
2. Create an account and subscribe to:
   - **Collections** product (for deposits)
   - **Disbursements** product (for withdrawals)
3. Each product subscription gives you a **Primary Key** (subscription key)

### Step 2: Create Sandbox API User
```bash
# Generate a UUID for API User
API_USER_ID=$(uuidgen)

# Create the API user (sandbox only)
curl -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser" \
  -H "X-Reference-Id: $API_USER_ID" \
  -H "Ocp-Apim-Subscription-Key: <your-collection-subscription-key>" \
  -H "Content-Type: application/json" \
  -d '{"providerCallbackHost": "https://bff.dev.azamra.capital"}'

# Generate API Key for the user
curl -X POST "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/$API_USER_ID/apikey" \
  -H "Ocp-Apim-Subscription-Key: <your-collection-subscription-key>" \
  -d ''

# Response: {"apiKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
```

### Step 3: Create Callback Ingress (Required for MTN to reach us)
MTN sandbox sends callbacks to the URL specified in `X-Callback-Url` header. The payment gateway sets this to `${MTN_CALLBACK_URL}/mtn/collection`. For Hetzner dev, you need an ingress or route the callbacks through the BFF.

**Option A**: Add ingress rule for payment gateway callbacks
**Option B**: Proxy callbacks through the BFF (already has an ingress)

---

## 3. MTN Sandbox Test Phone Numbers

| Phone Number | Behavior |
|-------------|----------|
| `46733123450` | Auto-approves payment (SUCCESSFUL) |
| `46733123451` | Auto-rejects payment (FAILED) |
| `46733123452` | Payment stays PENDING (timeout test) |

> **Note**: These are European test numbers. Real Cameroon numbers (237xxxxxxxxx) will not work in sandbox mode. The sandbox ignores the phone number and uses the auto-approve/reject behavior based on the number pattern above.

---

## 4. Manual Testing via curl

### Prerequisites
- A valid JWT token from Keycloak (with `fineract_external_id` claim)
- A Fineract savings account belonging to the user
- Payment gateway running (locally or on Hetzner)

### Test a Deposit (Collection)
```bash
# Set variables
BASE_URL="http://localhost:8082"  # or https://bff.dev.azamra.capital
TOKEN="<your-jwt-token>"
IDEMPOTENCY_KEY=$(uuidgen)

# Initiate deposit
curl -X POST "$BASE_URL/api/payments/deposit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "externalId": "<your-fineract-external-id>",
    "accountId": <your-savings-account-id>,
    "amount": 5000,
    "provider": "MTN_MOMO",
    "phoneNumber": "46733123450"
  }'

# Response: {"transactionId":"...","status":"PENDING",...}

# Check status (poll until SUCCESSFUL/FAILED)
curl -X GET "$BASE_URL/api/payments/status/<transactionId>" \
  -H "Authorization: Bearer $TOKEN"
```

### Test a Withdrawal (Disbursement)
```bash
IDEMPOTENCY_KEY=$(uuidgen)

curl -X POST "$BASE_URL/api/payments/withdraw" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "externalId": "<your-fineract-external-id>",
    "accountId": <your-savings-account-id>,
    "amount": 2000,
    "provider": "MTN_MOMO",
    "phoneNumber": "46733123450"
  }'
```

### Simulate a Callback (for local testing without MTN)
```bash
# Simulate MTN collection callback (deposit success)
curl -X POST "$BASE_URL/api/callbacks/mtn/collection" \
  -H "Content-Type: application/json" \
  -H "Ocp-Apim-Subscription-Key: <your-collection-key>" \
  -d '{
    "referenceId": "<uuid>",
    "status": "SUCCESSFUL",
    "externalId": "<providerReference-from-deposit-response>",
    "amount": "5000",
    "currency": "XAF",
    "financialTransactionId": "mtn-fin-123"
  }'
```

---

## 5. Running Automated Tests

### Unit Tests (No Infrastructure Needed)
```bash
cd backend/payment-gateway-service
mvn test
```

### E2E / BDD Tests (Testcontainers — Docker Required)
```bash
cd backend/e2e-tests
mvn test -Dcucumber.filter.tags="@payment and @mtn"
```

### k6 Smoke Test (Against Deployed Environment)
```bash
k6 run docker/k6/payment-gateway-smoke-test.js \
  --env BASE_URL=https://bff.dev.azamra.capital \
  --env TOKEN=<jwt-token>
```

---

## 6. Troubleshooting

### Payment stays PENDING forever
- **Cause**: Callback URL not reachable by MTN
- **Fix**: Ensure callback URL (`MTN_CALLBACK_URL`) points to a publicly accessible endpoint
- **Workaround**: Manually send callback via curl (see Section 4)

### 401 Unauthorized on deposit/withdraw
- **Cause**: JWT doesn't have `fineract_external_id` claim
- **Fix**: Ensure Keycloak token mapper adds `fineract_external_id` to the JWT

### 403 Forbidden — external ID mismatch
- **Cause**: The `externalId` in the request doesn't match the JWT's `fineract_external_id`
- **Fix**: Use the same external ID that's in the user's JWT token

### MTN API returns "Access denied" / 401
- **Cause**: Subscription key or API credentials are invalid
- **Fix**: Verify credentials on https://momodeveloper.mtn.com dashboard

### Stale PENDING transactions
- The cleanup scheduler marks PENDING transactions as EXPIRED after 30 minutes

---

## NOKASH Sandbox Testing Guide

### 1. Sandbox Readiness Checklist

#### Backend (Payment Gateway Service)
- [x] NOKASH client fully implemented (`NokashClient.java`)
- [x] Sandbox base URL configured: `https://api.nokash.app`
- [x] Deposits (Payin) via `/lapas-on-trans/trans/api-payin-request/407`
- [x] Withdrawals (Payout) via `/lapas-on-trans/trans/api-payin-request/407`
- [x] Payout authentication via `/lapas-on-trans/trans/auth`
- [x] Callback endpoint: `/api/callbacks/nokash`
- [x] SealedSecrets should exist for dev environment with Nokash keys (`nokash-i-space-key`, `nokash-app-space-key`)

### 2. NOKASH Sandbox Setup

NOKASH sandbox setup is simpler than MTN's. You do not need to create a separate API user. You will be provided with:
- `i_space_key`
- `app_space_key`

These keys should be configured as environment variables for the payment gateway service.

### 3. NOKASH Sandbox Test Phone Numbers

The NOKASH documentation does not provide specific test phone numbers with predefined behaviors (e.g., auto-approve, auto-reject). You will likely need to use real Cameroonian phone numbers for testing in the sandbox.

### 4. Manual Testing via curl

#### Prerequisites
- A valid JWT token from Keycloak (with `fineract_external_id` claim)
- A Fineract savings account belonging to the user
- Payment gateway running (locally or on Hetzner)
- Your `i_space_key` and `app_space_key` from NOKASH

#### Test a Deposit (Payin)
```bash
# Set variables
BASE_URL="http://localhost:8082"  # or https://bff.dev.azamra.capital
TOKEN="<your-jwt-token>"
IDEMPOTENCY_KEY=$(uuidgen)

# Initiate deposit
curl -X POST "$BASE_URL/api/payments/deposit" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "externalId": "<your-fineract-external-id>",
    "accountId": <your-savings-account-id>,
    "amount": 5000,
    "provider": "NOKASH",
    "paymentMethod": "MTN_MOMO",
    "phoneNumber": "237671234567"
  }'

# Response: {"transactionId":"...","status":"PENDING",...}

# Check status (poll until SUCCESSFUL/FAILED)
curl -X GET "$BASE_URL/api/payments/status/<transactionId>" \
  -H "Authorization: Bearer $TOKEN"
```

#### Test a Withdrawal (Payout)
```bash
IDEMPOTENCY_KEY=$(uuidgen)

curl -X POST "$BASE_URL/api/payments/withdraw" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "externalId": "<your-fineract-external-id>",
    "accountId": <your-savings-account-id>,
    "amount": 2000,
    "provider": "NOKASH",
    "paymentMethod": "MTN_MOMO",
    "phoneNumber": "237671234567"
  }'
```

#### Simulate a Callback (for local testing without NOKASH)
```bash
# Simulate NOKASH callback (deposit success)
# NOTE: The transactionId MUST be in both the URL path AND the JSON payload
curl -X POST "$BASE_URL/api/callbacks/nokash/<transactionId-from-deposit-response>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "<transactionId-from-deposit-response>",
    "status": "SUCCESS",
    "amount": "5000",
    "reference": "nokash-callback-ref-123"
  }'
```
