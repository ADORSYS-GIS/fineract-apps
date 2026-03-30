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
- [x] Kubernetes deployment manifests wired for all MTN env vars
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
  -H "Ocp-Apim-Subscription-Key: <your-collection-subscription-key>"
# Response: {"apiKey": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"}
```

### Step 3: Update Kubernetes Secrets
```bash
# Update the payment-gateway-credentials sealed secret with real values:
# - mtn-collection-key: Primary Key from Collections subscription
# - mtn-disbursement-key: Primary Key from Disbursements subscription
# - mtn-api-key: API Key from Step 2

# Update values-hetzner.yaml with the API User ID:
# paymentGateway:
#   mtn:
#     apiUserId: "<your-API_USER_ID-from-step-2>"
```

### Step 4: Create Callback Ingress (Required for MTN to reach us)
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

## 5. Frontend + BFF Integration (What Needs to Happen)

### Current State
The self-service frontend (`frontend/self-service-app/src/routes/deposit.tsx` and `withdraw.tsx`) currently has **mock implementations**:
```typescript
// Current mock — does NOT call the payment gateway
await new Promise((resolve) => setTimeout(resolve, 2000));
setSuccess(true);
```

### What the Frontend Needs to Do

#### Step 1: Add Payment Gateway API Client
Create a payment API client in the frontend (similar to `services/api.ts`):

```typescript
// services/paymentApi.ts
const PAYMENT_API_URL = import.meta.env.VITE_PAYMENT_GATEWAY_URL || '/api';

export async function initiateDeposit(params: {
  accountId: number;
  amount: number;
  provider: 'MTN_MOMO' | 'ORANGE_MONEY' | 'CINETPAY';
  phoneNumber: string;
  externalId: string;
}, accessToken: string): Promise<PaymentResponse> {
  const idempotencyKey = crypto.randomUUID();

  const response = await fetch(`${PAYMENT_API_URL}/payments/deposit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function initiateWithdrawal(params: {
  accountId: number;
  amount: number;
  provider: 'MTN_MOMO' | 'ORANGE_MONEY' | 'CINETPAY';
  phoneNumber: string;
  externalId: string;
}, accessToken: string): Promise<PaymentResponse> {
  const idempotencyKey = crypto.randomUUID();

  const response = await fetch(`${PAYMENT_API_URL}/payments/withdraw`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'X-Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

export async function getTransactionStatus(
  transactionId: string,
  accessToken: string
): Promise<TransactionStatusResponse> {
  const response = await fetch(`${PAYMENT_API_URL}/payments/status/${transactionId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });

  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
```

#### Step 2: Wire Deposit Page to Real API
Replace the mock `handleSubmit` in `deposit.tsx`:

```typescript
const handleSubmit = async () => {
  if (!selectedMethod || !validateAmount()) return;

  setIsSubmitting(true);
  setError(null);

  try {
    const provider = mapMethodToProvider(selectedMethod);
    const result = await initiateDeposit({
      accountId: userAccountId,
      amount: parseInt(amount, 10),
      provider,
      phoneNumber: userPhoneNumber,
      externalId: auth.user?.profile?.fineract_external_id as string,
    }, auth.user?.access_token!);

    // For MTN: Show "Check your phone" message, then poll status
    if (result.status === 'PENDING') {
      setTransactionId(result.transactionId);
      setPendingApproval(true);
      pollTransactionStatus(result.transactionId);
    }
    // For Orange/CinetPay: Redirect to payment URL
    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
    }
  } catch (err) {
    setError(t("errors.generic"));
  } finally {
    setIsSubmitting(false);
  }
};

// Map frontend payment method IDs to backend provider enum
function mapMethodToProvider(method: PaymentMethod): string {
  switch (method) {
    case 'mtn_transfer': return 'MTN_MOMO';
    case 'orange_transfer': return 'ORANGE_MONEY';
    default: return 'CINETPAY';
  }
}
```

#### Step 3: Add Status Polling
After initiating an MTN deposit, poll for status (MTN uses USSD — no redirect):

```typescript
async function pollTransactionStatus(transactionId: string) {
  const maxAttempts = 60; // 5 minutes at 5-second intervals
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 5000));
    const status = await getTransactionStatus(transactionId, auth.user?.access_token!);
    if (status.status === 'SUCCESSFUL') {
      setSuccess(true);
      return;
    }
    if (status.status === 'FAILED') {
      setError('Payment was declined');
      return;
    }
  }
  setError('Payment timed out');
}
```

### BFF Proxy (If Using BFF Instead of Direct Calls)
If the frontend calls the BFF instead of the payment gateway directly, add proxy routes in the BFF:

```yaml
# In BFF (azamra-bff) application.yml or route config
spring:
  cloud:
    gateway:
      routes:
        - id: payment-gateway
          uri: http://payment-gateway-service:8082
          predicates:
            - Path=/api/payments/**, /api/callbacks/**
```

Or if the BFF is a Spring WebFlux app, add a route filter that forwards `/api/payments/*` to the payment gateway.

### Environment Variable
Add to frontend deployment:
```
VITE_PAYMENT_GATEWAY_URL=https://bff.dev.azamra.capital/api
```

---

## 6. Running Automated Tests

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

## 7. Troubleshooting

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
- Check logs: `kubectl logs -l app=payment-gateway-service -n fineract --tail=200`
