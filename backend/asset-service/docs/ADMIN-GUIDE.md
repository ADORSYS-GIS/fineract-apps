# Admin Guide - Asset Manager

This guide covers all admin operations for managing the asset marketplace.

## 1. Set Up the Fee Collection Account

Before any trading can occur, the admin must create a **platform-wide XAF savings account** that collects all trading fees.

1. Create a new XAF savings account in Fineract (under a platform/admin client)
2. Approve and activate the account
3. Set the account ID in the environment variable `FEE_COLLECTION_ACCOUNT_ID`

This account is shared across all assets. All trading fees (BUY and SELL) are transferred to this account.

---

## 2. Create a New Asset

Creating an asset is a multi-step process that provisions resources in Fineract.

### Prerequisites
- A **company client** must exist in Fineract (legalForm = ENTITY)
- The company must have an **active XAF savings account** (auto-detected during provisioning)

### API Call — Equity/Token Asset

```
POST /api/admin/assets
Headers: Authorization: Bearer {jwt}
Body:
{
  "name": "Douala Tower Token",
  "symbol": "DTT",
  "currencyCode": "DTT",
  "description": "Tokenized commercial real estate in Douala",
  "category": "REAL_ESTATE",
  "initialPrice": 5000,
  "tradingFeePercent": 0.50,
  "spreadPercent": 1.00,
  "totalSupply": 100000,
  "decimalPlaces": 0,
  "treasuryClientId": 42,
  "expectedLaunchDate": "2026-03-15"
}
```

### API Call — Bond/Fixed-Income Asset

Bonds include additional fields for coupon payments, maturity, and offer validity:

```
POST /api/admin/assets
Headers: Authorization: Bearer {jwt}
Body:
{
  "name": "Senegal Treasury Bond 5.80%",
  "symbol": "SEN580",
  "currencyCode": "SEN580",
  "description": "Government bond issued by Etat du Senegal",
  "category": "BONDS",
  "initialPrice": 10000,
  "tradingFeePercent": 0.25,
  "spreadPercent": 0,
  "totalSupply": 50000,
  "decimalPlaces": 0,
  "treasuryClientId": 42,
  "issuer": "Etat du Senegal",
  "isinCode": "SN0000000001",
  "maturityDate": "2028-06-30",
  "interestRate": 5.80,
  "couponFrequencyMonths": 6,
  "validityDate": "2026-06-30"
}
```

Bond-specific fields:

| Field | Required | Description |
|-------|----------|-------------|
| `issuer` | Yes (for BONDS) | Issuer name (e.g. company or government) |
| `isinCode` | No | International Securities Identification Number |
| `maturityDate` | Yes (for BONDS) | Bond maturity date (must be in the future) |
| `interestRate` | Yes (for BONDS) | Annual coupon rate as percentage (e.g. 5.80) |
| `couponFrequencyMonths` | Yes (for BONDS) | Payment frequency: 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual) |
| `validityDate` | No | Offer validity deadline. BUY orders are rejected after this date; SELL is always allowed. |

### What Happens on Create

1. Auto-detects the company's active XAF savings account for trade settlements
2. Registers `DTT` as a custom currency in Fineract (`PUT /currencies`)
2. Creates a savings product for DTT with cash-based accounting (GL 47 → GL 65)
3. Creates a treasury savings account for the company client
4. Approves and activates the treasury account
5. Deposits 100,000 DTT units into treasury
6. Persists the asset in PENDING status
7. Initializes price data at 5,000 XAF

The asset starts in **PENDING** status and must be explicitly activated.

---

## 3. Activate an Asset

```
POST /api/admin/assets/{id}/activate
```

Transitions the asset from PENDING to ACTIVE. Trading becomes possible immediately — users buy at current price + spread, sell at current price - spread.

---

## 4. Manage Pricing

### Manual Price Override

```
POST /api/admin/assets/{id}/set-price
Body: { "price": 5500 }
```

Updates the current price immediately. Useful for initial pricing or corrections.

### Price Modes

- **MANUAL**: Price only changes via admin API calls
- **AUTO**: Price updates based on trade execution (updated on each trade)

---

## 5. Halt / Resume Trading

### Halt Trading

```
POST /api/admin/assets/{id}/halt
```

Transitions status to HALTED. All buy/sell requests are rejected with `TRADING_HALTED`.

### Resume Trading

```
POST /api/admin/assets/{id}/resume
```

Transitions back to ACTIVE.

---

## 6. Mint Additional Supply

```
POST /api/admin/assets/{id}/mint
Body:
{
  "additionalSupply": 5000
}
```

Deposits additional token units into the treasury account in Fineract, increasing the total supply. This makes more units available for customers to buy.

- Only increases are allowed (minting). Burning (decreasing supply) is not supported.
- The asset can be in any status (PENDING, ACTIVE, HALTED).

---

## 7. Monitor Inventory

```
GET /api/admin/assets/inventory
```

Response:
```json
[
  {
    "assetId": "uuid",
    "symbol": "DTT",
    "name": "Douala Tower Token",
    "totalSupply": 100000,
    "circulatingSupply": 15000,
    "availableSupply": 85000,
    "treasuryBalance": 85000
  }
]
```

Key metrics:
- **Total Supply**: Total units ever minted
- **Circulating Supply**: Units held by customers
- **Available Supply**: Units remaining in treasury
- **Treasury Balance**: Fineract savings account balance for the asset currency

---

## 8. Update Asset Metadata

```
PUT /api/admin/assets/{id}
Body:
{
  "name": "Updated Name",
  "description": "New description",
  "imageUrl": "https://new-image.jpg",
  "category": "REAL_ESTATE",
  "tradingFeePercent": 0.75,
  "spreadPercent": 1.50
}
```

All fields are optional. Only provided fields are updated.

---

## 9. View Coupon Payment History

For bond assets, the system automatically pays coupons to all holders on each coupon date. View the payment history:

```
GET /api/admin/assets/{id}/coupons?page=0&size=20
Headers: Authorization: Bearer {jwt}
```

Response:
```json
{
  "content": [
    {
      "id": 1,
      "userId": 42,
      "units": 100,
      "faceValue": 10000,
      "annualRate": 5.80,
      "periodMonths": 6,
      "cashAmount": 29000,
      "fineractTransferId": 12345,
      "status": "SUCCESS",
      "failureReason": null,
      "paidAt": "2026-06-30T00:15:00Z",
      "couponDate": "2026-06-30"
    }
  ],
  "totalPages": 1
}
```

Coupon formula: `units x faceValue x (annualRate / 100) x (periodMonths / 12)`

In the example above: 100 x 10,000 x (5.80 / 100) x (6 / 12) = **29,000 XAF**

---

## 10. Scheduled Jobs

The service runs several automated jobs:

### Bond Maturity (daily at 00:05 WAT)

Transitions ACTIVE bonds to **MATURED** status when their `maturityDate` has passed. Matured bonds can no longer be traded. Coupon payments stop once the bond is matured.

### Coupon Payments (daily at 00:15 WAT)

For each ACTIVE bond where `nextCouponDate <= today`:
1. Finds all holders with positive units
2. Calculates coupon: `units x faceValue x (rate/100) x (months/12)`
3. Transfers the amount from the treasury XAF account to the user's XAF account
4. Records each payment in `interest_payments` (SUCCESS or FAILED)
5. Advances `nextCouponDate` by the coupon frequency

Individual holder failures do not block other holders. Failed payments are logged and can be viewed via the coupon history endpoint.

### Stale Order Cleanup (every 5 minutes)

- **PENDING orders** older than 30 minutes (configurable via `asset-service.orders.stale-cleanup-minutes`) are marked as **FAILED** with a timeout reason
- **EXECUTING orders** older than 30 minutes are marked as **NEEDS_RECONCILIATION** — these require manual verification against Fineract batch transfer logs

### Data Archival (1st of each month at 03:00 WAT)

Moves old records from `trade_log` and `orders` to their respective archive tables (`trade_log_archive`, `orders_archive`) to keep the hot tables small. Only terminal orders (FILLED, FAILED, REJECTED) are archived.

Configuration:

| Property | Env Var | Default | Description |
|----------|---------|---------|-------------|
| `archival.retention-months` | `ARCHIVAL_RETENTION_MONTHS` | 12 | Months to retain before archiving |
| `archival.batch-size` | `ARCHIVAL_BATCH_SIZE` | 1000 | Rows per batch |

Archived data remains queryable via direct SQL on the archive tables (e.g. `SELECT * FROM trade_log_archive WHERE user_id = 42`).
