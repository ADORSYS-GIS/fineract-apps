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

Creating an asset is a multi-step process that provisions resources in Fineract. Assets are sold by **Liquidity Partners (LPs)** — resellers who purchase assets from the original issuer off-platform and sell them to investors on the platform.

### Prerequisites
- A **Liquidity Partner client** must exist in Fineract (legalForm = ENTITY)
- The LP must have an **active XAF savings account** (auto-detected during provisioning)

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
  "issuerPrice": 4000,
  "lpAskPrice": 5000,
  "lpBidPrice": 4800,
  "tradingFeePercent": 0.50,
  "totalSupply": 100000,
  "decimalPlaces": 0,
  "lpClientId": 42,
  "subscriptionStartDate": "2025-12-15",
  "subscriptionEndDate": "2026-03-15",
  "capitalOpenedPercent": 44.44
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
  "issuerPrice": 10000,
  "lpAskPrice": 10000,
  "lpBidPrice": 10000,
  "tradingFeePercent": 0.25,
  "totalSupply": 50000,
  "decimalPlaces": 0,
  "lpClientId": 42,
  "subscriptionStartDate": "2025-12-01",
  "subscriptionEndDate": "2026-06-30",
  "issuerName": "Etat du Senegal",
  "isinCode": "SN0000000001",
  "maturityDate": "2028-06-30",
  "interestRate": 5.80,
  "couponFrequencyMonths": 6
}
```

### Pricing Fields

| Field | Required | Description |
|-------|----------|-------------|
| `issuerPrice` | Yes | The wholesale/face value per unit from the original issuer. Immutable after creation. Used for coupon and income calculations. |
| `lpAskPrice` | Yes | The price investors pay to buy (LP's selling price). Must be >= `issuerPrice`. |
| `lpBidPrice` | Yes | The price investors receive when selling (LP's buying price). Must be <= `lpAskPrice`. |

The LP's margin per unit on BUY = `lpAskPrice - issuerPrice`. For bonds, the LP typically sets ask = bid = issuerPrice (no markup on face value).

Bond-specific fields:

| Field | Required | Description |
|-------|----------|-------------|
| `issuerName` | Yes (for BONDS) | Original issuer name (e.g. company or government). Optional for non-bond assets. |
| `isinCode` | No | International Securities Identification Number |
| `maturityDate` | Yes (for BONDS) | Bond maturity date (must be in the future) |
| `interestRate` | Yes (for BONDS) | Annual coupon rate as percentage (e.g. 5.80). Coupon is calculated from `issuerPrice × rate × period`. |
| `couponFrequencyMonths` | Yes (for BONDS) | Payment frequency: 1 (monthly), 3 (quarterly), 6 (semi-annual), or 12 (annual) |

General fields (all categories):

| Field | Required | Description |
|-------|----------|-------------|
| `subscriptionStartDate` | Yes | Start of the subscription window. BUY orders are rejected before this date. |
| `subscriptionEndDate` | Yes | End of the subscription window. BUY orders are rejected after this date; SELL is always allowed. |
| `capitalOpenedPercent` | No | Percentage of capital opened for subscription (e.g. 44.44 for RENAPROV-style offerings). |

### What Happens on Create

1. Auto-detects the LP's active XAF savings account for trade settlements
2. Registers `DTT` as a custom currency in Fineract (`PUT /currencies`)
3. Creates a savings product for DTT with cash-based accounting (GL 47 → GL 65)
4. Creates an LP asset savings account (holds the token inventory)
5. Approves and activates the LP asset account
6. **Creates an LP spread savings account** (XAF, for collecting LP margin on trades)
7. Approves and activates the LP spread account
8. Deposits 100,000 DTT units into the LP asset account
9. Persists the asset in PENDING status
10. Initializes price data: current price at `lpAskPrice`, bid/ask from request

The asset starts in **PENDING** status and must be explicitly activated.

---

## 3. Activate an Asset

```
POST /api/admin/assets/{id}/activate
```

Transitions the asset from PENDING to ACTIVE. Trading becomes possible immediately — investors buy at the LP's ask price, sell at the LP's bid price.

---

## 4. Manage Pricing

### Manual Price Override

```
POST /api/admin/assets/{id}/set-price
Body: {
  "price": 5500,
  "bidPrice": 5300,
  "askPrice": 5500
}
```

Updates the current price and optionally the LP's bid/ask prices. If `bidPrice`/`askPrice` are omitted, only the reference price is updated.

### Price Modes

- **MANUAL**: Price only changes via admin API calls
- **AUTO**: Price updates based on trade execution (updated on each trade)

### Editable vs Immutable Pricing

| Field | Editable? | Notes |
|-------|-----------|-------|
| `issuerPrice` | No | Face value / wholesale price, fixed at creation |
| `lpAskPrice` | Yes | LP adjusts via set-price or update |
| `lpBidPrice` | Yes | LP adjusts via set-price or update |
| `tradingFeePercent` | Yes | Platform fee, adjustable |

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

Deposits additional token units into the LP's asset account in Fineract, increasing the total supply. This makes more units available for investors to buy.

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
    "lpAssetBalance": 85000
  }
]
```

Key metrics:
- **Total Supply**: Total units ever minted
- **Circulating Supply**: Units held by investors
- **Available Supply**: Units remaining in the LP's asset account
- **LP Asset Balance**: Fineract savings account balance for the asset currency (should match Available Supply)

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
  "lpAskPrice": 5500,
  "lpBidPrice": 5200,
  "subscriptionStartDate": "2026-01-01",
  "subscriptionEndDate": "2026-12-31",
  "capitalOpenedPercent": 50.00,
  "interestRate": 6.25,
  "maturityDate": "2029-06-30"
}
```

All fields are optional. Only provided fields are updated.

**Editable fields:** name, description, imageUrl, category, tradingFeePercent, lpAskPrice, lpBidPrice, subscriptionStartDate, subscriptionEndDate, capitalOpenedPercent, maxPositionPercent, maxOrderSize, dailyTradeLimitXaf, lockupDays, income config.

**Immutable fields (cannot be changed after creation):** symbol, currencyCode, issuerPrice, issuerName, lpClientId, totalSupply, decimalPlaces, interestRate, couponFrequencyMonths, maturityDate (bond contractual terms).

---

## 9. View Coupon Payment History

For bond assets, the system automatically pays coupons to all holders on each coupon date. Coupon amounts are calculated from the **issuer price** (face value), not the LP's selling price. View the payment history:

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

Coupon formula: `units × issuerPrice × (annualRate / 100) × (periodMonths / 12)`

In the example above: 100 × 10,000 × (5.80 / 100) × (6 / 12) = **29,000 XAF**

Note: `faceValue` here equals the asset's `issuerPrice`. The LP's markup does not affect coupon calculations.

### Coupon Obligation Forecast

View the remaining coupon obligations, principal at maturity, and LP cash coverage for a bond:

```
GET /api/admin/assets/{id}/coupon-forecast
Headers: Authorization: Bearer {jwt}
```

Response:
```json
{
  "assetId": "uuid",
  "symbol": "SEN580",
  "interestRate": 5.80,
  "couponFrequencyMonths": 6,
  "maturityDate": "2028-06-30",
  "nextCouponDate": "2026-06-30",
  "totalUnitsOutstanding": 5000,
  "faceValuePerUnit": 10000,
  "couponPerPeriod": 1450000,
  "remainingCouponPeriods": 5,
  "totalRemainingCouponObligation": 7250000,
  "principalAtMaturity": 50000000,
  "totalObligation": 57250000,
  "lpCashBalance": 60000000,
  "shortfall": 0,
  "couponsCoveredByBalance": 5
}
```

Key fields:
- `couponPerPeriod` — total coupon payment to all holders per period
- `lpCashBalance` — the LP's cash account balance available for payments
- `shortfall` — how much the LP cash balance is short of total obligation (0 if fully covered)
- `couponsCoveredByBalance` — number of coupon periods the current LP cash balance can cover

### Manually Trigger Coupon Payment

Trigger a coupon payment immediately (bypasses the scheduler):

```
POST /api/admin/assets/{id}/coupons/trigger
Headers: Authorization: Bearer {jwt}
```

Response:
```json
{
  "assetId": "uuid",
  "symbol": "SEN580",
  "couponDate": "2026-06-30",
  "holdersPaid": 42,
  "holdersFailed": 1,
  "totalAmountPaid": 1218000,
  "nextCouponDate": "2026-12-30"
}
```

---

## 10. Scheduled Jobs

The service runs several automated jobs:

### Bond Maturity (daily at 00:05 WAT)

Transitions ACTIVE bonds to **MATURED** status when their `maturityDate` has passed. Matured bonds can no longer be traded. Coupon payments stop once the bond is matured.

### Coupon Payments (daily at 00:15 WAT)

For each ACTIVE bond where `nextCouponDate <= today`:
1. Finds all holders with positive units
2. Calculates coupon: `units × issuerPrice × (rate/100) × (months/12)`
3. Transfers the amount from the LP's cash account to the user's XAF account
4. Records each payment in `interest_payments` (SUCCESS or FAILED)
5. Advances `nextCouponDate` by the coupon frequency

Individual holder failures do not block other holders. Failed payments are logged and can be viewed via the coupon history endpoint.

### Stale Order Cleanup (every 5 minutes)

- **PENDING orders** older than 30 minutes (configurable via `asset-service.orders.stale-cleanup-minutes`) are marked as **FAILED** with a timeout reason
- **EXECUTING orders** older than 30 minutes are marked as **NEEDS_RECONCILIATION** — these require manual verification against Fineract batch transfer logs

### Portfolio Snapshots (daily at 20:30 WAT)

Takes a daily snapshot of each user's portfolio value (total value, cost basis, unrealized P&L, position count). Run 30 minutes after market close. These snapshots power the portfolio history chart endpoint (`GET /api/portfolio/history`).

Each user's snapshot is independent — one failure does not block others. Unique constraint on `(userId, snapshotDate)` prevents duplicates.

### Data Archival (1st of each month at 03:00 WAT)

Moves old records from `trade_log` and `orders` to their respective archive tables (`trade_log_archive`, `orders_archive`) to keep the hot tables small. Only terminal orders (FILLED, FAILED, REJECTED) are archived.

Configuration:

| Property | Env Var | Default | Description |
|----------|---------|---------|-------------|
| `archival.retention-months` | `ARCHIVAL_RETENTION_MONTHS` | 12 | Months to retain before archiving |
| `archival.batch-size` | `ARCHIVAL_BATCH_SIZE` | 1000 | Rows per batch |

Archived data remains queryable via direct SQL on the archive tables (e.g. `SELECT * FROM trade_log_archive WHERE user_id = 42`).

---

## 11. Exposure Limits

Control risk by setting per-asset limits on trading activity. All fields are optional — `null` or `0` means no limit.

### Fields (set during asset creation or update)

| Field | Description |
|-------|-------------|
| `maxPositionPercent` | Max % of totalSupply a single user can hold (e.g. `10.00` = 10%) |
| `maxOrderSize` | Max units in a single BUY or SELL order |
| `dailyTradeLimitXaf` | Max XAF value a user can trade per day for this asset |

### Behavior

- **Max Position %**: On BUY, the system checks `(currentHolding + orderUnits) / totalSupply * 100 <= maxPositionPercent`. Rejected with `MAX_POSITION_EXCEEDED`.
- **Max Order Size**: On BUY or SELL, `orderUnits <= maxOrderSize`. Rejected with `MAX_ORDER_SIZE_EXCEEDED`.
- **Daily Trade Limit**: On BUY or SELL, `todayVolume + orderXafAmount <= dailyTradeLimitXaf`. Resets at midnight WAT. Rejected with `DAILY_VOLUME_EXCEEDED`.

All limits are soft-checked in trade preview (returned as blockers) and hard-checked during execution.

### Example

```
PUT /api/admin/assets/{id}
Body: {
  "maxPositionPercent": 10.00,
  "maxOrderSize": 500,
  "dailyTradeLimitXaf": 5000000
}
```

---

## 12. Lock-up Period

Prevent early selling after purchase. Useful for preventing pump-and-dump on newly issued assets.

### Field

| Field | Description |
|-------|-------------|
| `lockupDays` | Number of days after first purchase before SELL is allowed. `null` or `0` = no lock-up. |

### Behavior

- Lock-up is measured from the user's **first purchase date** (`firstPurchaseDate` on `UserPosition`).
- SELL orders are rejected with `LOCKUP_PERIOD_ACTIVE` until `firstPurchaseDate + lockupDays` has passed.
- Trade preview shows `LOCKUP_PERIOD_ACTIVE` blocker.
- Lock-up only applies to SELL. BUY is always allowed (subject to other limits).

### Example

```
POST /api/admin/assets
Body: { ..., "lockupDays": 30 }
```

A user who buys on Jan 1 cannot sell until Jan 31.

---

## 13. Income Distribution (Non-Bond Assets)

Non-bond assets (REAL_ESTATE, AGRICULTURE, STOCKS, etc.) can pay periodic income to holders. Income is calculated from the **issuer price** (the wholesale/face value), not the LP's selling price.

### Fields

| Field | Description |
|-------|-------------|
| `incomeType` | Type: `DIVIDEND`, `RENT`, `HARVEST_YIELD`, or `PROFIT_SHARE`. `null` = no income. |
| `incomeRate` | Annual income rate as percentage (e.g. `5.0` = 5%) |
| `distributionFrequencyMonths` | Distribution frequency: `1` (monthly), `3` (quarterly), `6` (semi-annual), `12` (annual) |
| `nextDistributionDate` | Next scheduled distribution date (auto-advanced after each distribution) |

### Formula

```
cashAmount = units × issuerPrice × (incomeRate / 100) × (frequencyMonths / 12)
```

Income is based on the issuer price to ensure consistent, predictable payouts regardless of the LP's current bid/ask prices.

### Scheduler (daily at 00:30 WAT)

For each ACTIVE non-bond asset where `nextDistributionDate <= today` and `incomeType` is set:
1. Finds all holders with positive units
2. Calculates income using the formula above with the issuer price
3. Transfers from the LP's cash account to each holder's XAF account
4. Records each payment in `income_distributions` (SUCCESS or FAILED)
5. Advances `nextDistributionDate` by the frequency

### Example — Create Asset with Rental Income

```
POST /api/admin/assets
Body: {
  "name": "Douala Tower Token",
  "symbol": "DTT",
  "category": "REAL_ESTATE",
  "issuerPrice": 4000,
  "lpAskPrice": 5000,
  "lpBidPrice": 4800,
  "totalSupply": 100000,
  "lpClientId": 42,
  ...,
  "incomeType": "RENT",
  "incomeRate": 8.0,
  "distributionFrequencyMonths": 1,
  "nextDistributionDate": "2026-04-01"
}
```

A holder with 100 units would receive:
`100 × 4,000 × (8/100) × (1/12) = 2,667 XAF` monthly.

Note: The investor paid 5,000/unit (LP ask price) but income is calculated on 4,000/unit (issuer price). This gives the investor a true yield based on the underlying asset value.

### Income Types

| Type | Typical Frequency | Description |
|------|-------------------|-------------|
| `DIVIDEND` | Annual or Semi-Annual | Company profit distributions |
| `RENT` | Monthly | Real estate rental income |
| `HARVEST_YIELD` | Semi-Annual | Agricultural harvest proceeds |
| `PROFIT_SHARE` | Annual | Partnership profit sharing |

---

## 14. Delisting

Remove an asset from the marketplace. Supports a grace period for voluntary selling before forced buyback.

### Initiate Delisting

```
POST /api/admin/assets/{id}/delist
Body: {
  "delistingDate": "2026-06-01",
  "delistingRedemptionPrice": 5200
}
```

- `delistingDate` (required): Date of forced buyback. Until then, the asset is in **DELISTING** status.
- `delistingRedemptionPrice` (optional): Price for forced buyback. If null, uses last traded price.

### During DELISTING Status

- **BUY orders are blocked** — rejected with `ASSET_DELISTING`
- **SELL orders remain allowed** — users can voluntarily sell at market price
- Asset is still visible in the marketplace with a DELISTING badge

### Cancel Delisting

```
POST /api/admin/assets/{id}/cancel-delist
```

Returns the asset to **ACTIVE** status. Only possible before the delisting date.

### Forced Buyback (on delisting date)

The scheduler runs daily. When `delistingDate <= today`:
1. For each holder with positive units, executes a forced SELL at the redemption price
2. Cash is transferred from the LP's cash account to each holder
3. Asset units are returned to the LP's asset account
4. All positions are closed
5. Asset status transitions to **DELISTED**

### Lifecycle

```
ACTIVE → DELISTING → DELISTED
                  ↗
           (cancel-delist returns to ACTIVE)
```

---

## 15. Order Resolution

Admin tools for managing stuck or problematic orders.

### List Orders (with Filters)

```
GET /api/admin/orders?status=FAILED&assetId=uuid&search=text&fromDate=ISO&toDate=ISO&page=0&size=20
```

Returns paginated orders with optional filters:
- `status` — Filter by order status (e.g., `FAILED`, `NEEDS_RECONCILIATION`, `MANUALLY_CLOSED`)
- `assetId` — Filter by asset UUID
- `search` — Search by order ID or user external ID (partial match)
- `fromDate` / `toDate` — ISO-8601 date range filter on `createdAt`

All filters are optional. When none are provided, returns all orders sorted by `createdAt` descending.

### Asset Filter Options

```
GET /api/admin/orders/asset-options
```

Returns distinct assets that have orders in resolution-relevant statuses (`NEEDS_RECONCILIATION`, `FAILED`, `MANUALLY_CLOSED`). Used to populate the asset filter dropdown in the UI.

### Order Detail

```
GET /api/admin/orders/{id}
```

Returns full order detail including `assetName`, `idempotencyKey`, `fineractBatchId`, and `version`. Use this to inspect an order's Fineract batch transfer status.

### Order Summary

```
GET /api/admin/orders/summary
```

Returns counts: `{ "needsReconciliation": 2, "failed": 5, "manuallyClosed": 1 }`

### Resolve a Stuck Order

```
POST /api/admin/orders/{id}/resolve
Body: { "resolution": "Manually verified in Fineract. Transfer completed." }
```

Transitions orders in `NEEDS_RECONCILIATION` or `FAILED` status to `MANUALLY_CLOSED`. Use this after verifying the order state in Fineract directly.

### Order Statuses

| Status | Meaning |
|--------|---------|
| `PENDING` | Created, awaiting lock acquisition |
| `EXECUTING` | Inside the distributed lock, executing Fineract batch |
| `FILLED` | Successfully completed |
| `FAILED` | Fineract batch failed or timeout |
| `REJECTED` | Validation failed (insufficient funds, inventory, etc.) |
| `NEEDS_RECONCILIATION` | Timed out during execution — manual verification required |
| `MANUALLY_CLOSED` | Resolved by admin |

---

## 16. Reconciliation

Detects discrepancies between the asset-service database and Fineract ledger. Complements Order Resolution: orders handle stuck trades, reconciliation handles silent drift.

### Trigger Full Reconciliation

```
POST /api/admin/reconciliation/trigger
```

Scans all active/delisting/matured assets. Performs three checks per asset:
1. **Supply mismatch** — `circulatingSupply` vs `totalSupply - lpAssetBalance`
2. **Position mismatch** — Each user's `UserPosition.totalUnits` vs Fineract savings account balance
3. **LP cash negative** — Verifies the LP's cash account balance is non-negative

Returns `{ "discrepancies": 3 }`.

### Trigger Per-Asset Reconciliation

```
POST /api/admin/reconciliation/trigger/{assetId}
```

Runs the same three checks but only for the specified asset. Returns `{ "discrepancies": 0 }`.

### View Reports

```
GET /api/admin/reconciliation/reports?status=OPEN&severity=CRITICAL&page=0&size=20
```

### Report Types

| Type | Description |
|------|-------------|
| `SUPPLY_MISMATCH` | Circulating supply differs from Fineract LP asset balance |
| `POSITION_MISMATCH` | User position differs from Fineract savings account balance |
| `LP_CASH_NEGATIVE` | LP cash account has negative balance |

### Report Severity Levels

| Severity | Meaning |
|----------|---------|
| `WARNING` | Supply mismatch (drift detected, not immediately dangerous) |
| `CRITICAL` | Position mismatch or negative LP cash (immediate investigation required) |

**Note:** CRITICAL discrepancies automatically generate admin broadcast notifications visible at `GET /api/admin/notifications`.

### Acknowledge / Resolve Reports

```
PATCH /api/admin/reconciliation/reports/{id}/acknowledge?admin=john
PATCH /api/admin/reconciliation/reports/{id}/resolve?admin=john&notes=Fixed%20via%20manual%20transfer
```

Report lifecycle: `OPEN` → `ACKNOWLEDGED` → `RESOLVED`

### Summary

```
GET /api/admin/reconciliation/summary
```

Returns `{ "openReports": 5 }`.

### Automated Reconciliation

The reconciliation scheduler runs **daily at 01:30 WAT**. Reports are created automatically for any discrepancies found. CRITICAL discrepancies generate admin notifications.

### Investigation Workflow

When a discrepancy is detected (either by the daily scheduler or ad-hoc trigger):

1. **Receive alert** — CRITICAL discrepancies send an admin broadcast notification (`RECONCILIATION_CRITICAL`). Check `GET /api/admin/notifications` or the dashboard badge.
2. **Review the report** — `GET /api/admin/reconciliation/reports?status=OPEN`. Note the `reportType`, `assetId`, `expectedValue`, `actualValue`, `discrepancy`, and `userId` (for position mismatches).
3. **Acknowledge** — Signal that you are investigating: `PATCH /api/admin/reconciliation/reports/{id}/acknowledge?admin=<your-username>`
4. **Follow the type-specific procedure** below (SUPPLY_MISMATCH, POSITION_MISMATCH, or LP_CASH_NEGATIVE).
5. **Re-trigger reconciliation** — After correcting the issue: `POST /api/admin/reconciliation/trigger/{assetId}` — confirm 0 discrepancies.
6. **Resolve the report** — `PATCH /api/admin/reconciliation/reports/{id}/resolve?admin=<your-username>&notes=<what-was-found-and-fixed>`

### Correcting a SUPPLY_MISMATCH

**What it means:** The `circulatingSupply` recorded in the asset-service database differs from `totalSupply - lpAssetBalance` computed from Fineract. Severity: WARNING.

**Step 1 — Check the LP's asset account in Fineract:**

```sql
-- Get the asset's LP account ID
SELECT id, symbol, total_supply, circulating_supply, lp_asset_account_id
FROM assets WHERE id = '<assetId>';
```

Then query Fineract for the LP's remaining units:

```
GET /fineract-provider/api/v1/savingsaccounts/{lpAssetAccountId}
```

Note `summary.availableBalance` — this is the number of units the LP still holds.

**Step 2 — Compute what circulating supply should be:**

```
expectedCirculating = totalSupply - lpAvailableBalance
```

Compare with the `circulating_supply` value in the `assets` table.

**Step 3 — Identify root cause.** Common causes:

- A trade partially executed (Fineract transfer succeeded but asset-service DB update failed)
- A mint operation updated Fineract but the asset-service `circulating_supply` was not incremented
- A manual Fineract adjustment was made outside the asset-service

**Step 4 — Correct:**

- **If the DB drifted** (Fineract is the source of truth): update `circulating_supply` to match the computed value:

  ```sql
  UPDATE assets
  SET circulating_supply = <totalSupply> - <lpBalance>,
      version = version + 1
  WHERE id = '<assetId>';
  ```

- **If Fineract drifted** (rare — e.g., a manual Fineract adjustment was incorrect): make a manual deposit or withdrawal on the LP asset savings account via the Fineract API to correct the balance.

**Step 5 — Verify:** re-trigger reconciliation and confirm 0 discrepancies.

### Correcting a POSITION_MISMATCH

**What it means:** A user's `UserPosition.totalUnits` in the asset-service database differs from their Fineract savings account balance for that asset. Severity: CRITICAL — investigate immediately.

**Step 1 — Identify the user and their Fineract account:**

```sql
-- Get the user's position in asset-service
SELECT id, user_id, total_units
FROM user_positions WHERE asset_id = '<assetId>' AND user_id = <userId>;
```

Then look up their Fineract savings account for this asset:

```
GET /fineract-provider/api/v1/clients/<userId>/accounts?fields=savingsAccounts
```

Find the savings account whose product matches the asset's `savingsProductId`, and check:

```
GET /fineract-provider/api/v1/savingsaccounts/{savingsAccountId}
→ summary.availableBalance
```

**Step 2 — Review transaction history:**

```
GET /fineract-provider/api/v1/savingsaccounts/{savingsAccountId}?associations=transactions
```

Cross-reference with the user's order history in asset-service:

```
GET /api/admin/orders?search=<userExternalId>&assetId=<assetId>
```

Look for orders that are FILLED in asset-service but whose Fineract transfers may be missing or duplicated.

**Step 3 — Identify root cause.** Common causes:

- Order marked FILLED in asset-service but the Fineract batch transfer partially failed
- Duplicate Fineract deposit/withdrawal from a retry
- Manual Fineract adjustment not reflected in asset-service

**Step 4 — Correct:**

- **If Fineract is correct** (DB drifted): update the user's position to match:

  ```sql
  UPDATE user_positions
  SET total_units = <fineractBalance>,
      version = version + 1
  WHERE asset_id = '<assetId>' AND user_id = <userId>;
  ```

- **If the DB is correct** (Fineract drifted): make a manual deposit or withdrawal on the user's asset savings account:

  ```
  POST /fineract-provider/api/v1/savingsaccounts/{id}/transactions?command=deposit
  Body: {
    "transactionDate": "02 March 2026",
    "transactionAmount": <correctionAmount>,
    "paymentTypeId": 1,
    "locale": "en",
    "dateFormat": "dd MMMM yyyy",
    "note": "Reconciliation correction — report #<id>"
  }
  ```

  Use `?command=withdrawal` if the Fineract balance is too high.

**Step 5 — Verify:** re-trigger reconciliation and confirm 0 discrepancies.

### Correcting LP_CASH_NEGATIVE

**What it means:** The LP's settlement-currency (XAF) cash account for an asset has gone negative, meaning the LP has more cash obligations than available funds. Severity: CRITICAL.

**Step 1 — Check the LP cash account:**

```sql
SELECT id, symbol, lp_cash_account_id
FROM assets WHERE id = '<assetId>';
```

```
GET /fineract-provider/api/v1/savingsaccounts/{lpCashAccountId}
→ summary.availableBalance (should be negative)
```

Review recent transactions to understand how it went negative:

```
GET /fineract-provider/api/v1/savingsaccounts/{lpCashAccountId}?associations=transactions
```

**Step 2 — Identify root cause.** Common causes:

- A SELL order paid out to a user but the corresponding deposit into LP cash failed
- Coupon payments or income distributions exceeded available LP cash
- Multiple concurrent trades caused a race condition on the LP cash balance

**Step 3 — Correct by depositing the deficit into the LP cash account:**

```
POST /fineract-provider/api/v1/savingsaccounts/{lpCashAccountId}/transactions?command=deposit
Body: {
  "transactionDate": "02 March 2026",
  "transactionAmount": <deficitAmount>,
  "paymentTypeId": 1,
  "locale": "en",
  "dateFormat": "dd MMMM yyyy",
  "note": "LP cash top-up — reconciliation correction report #<id>"
}
```

**Step 4 — Verify:** re-trigger reconciliation and confirm 0 discrepancies.

### Resolving Stuck or Failed Orders

Cross-reference with [Section 15 — Order Resolution](#15-order-resolution). When a reconciliation report points to an order-level issue:

**NEEDS_RECONCILIATION orders** (timed out during execution):

1. Get the order's `fineractBatchId`: `GET /api/admin/orders/{orderId}`
2. Check Fineract for evidence of the batch transfer — look for deposits/withdrawals matching the order's `cashAmount`, `fee`, and `units` on the relevant savings accounts
3. **If the transfer completed in Fineract** — the trade was successful but the status update was lost. Resolve:

   ```
   POST /api/admin/orders/{orderId}/resolve
   Body: { "resolution": "Fineract batch verified — transfer completed. savingsAccountId=X, txnId=Y" }
   ```

4. **If no transfer exists in Fineract** — the trade never executed. No funds were moved. Resolve:

   ```
   POST /api/admin/orders/{orderId}/resolve
   Body: { "resolution": "No Fineract transfer found. Trade never executed. User funds and position unchanged." }
   ```

**FAILED orders:**

1. Check the `failureReason` field for the specific Fineract error
2. **"insufficient funds" / "account not active"** — No Fineract cleanup needed. Simply resolve with the reason.
3. **"batch partially failed"** — Check which sub-operations in the batch succeeded and which failed. Manually reverse incomplete operations via Fineract deposit/withdrawal, then resolve with details of what was corrected.

---

## 17. Notifications

The system generates notifications for significant events. Both users and admins receive targeted alerts.

### User Event Types

| Event | Triggered When |
|-------|---------------|
| `TRADE_EXECUTED` | A BUY or SELL order is filled |
| `COUPON_PAID` | Bond coupon payment deposited |
| `INCOME_PAID` | Non-bond income distribution deposited |
| `REDEMPTION_COMPLETED` | Bond principal redeemed |
| `ORDER_STUCK` | User's order stuck in EXECUTING > 30 min |
| `ASSET_STATUS_CHANGED` | Asset transitions status (ACTIVE → HALTED, etc.) |
| `LP_SHORTFALL` | Coupon/income forecast shows LP can't cover obligations |
| `DELISTING_ANNOUNCED` | Asset enters DELISTING status |

### Admin Broadcast Event Types

Admin broadcasts are notifications with `userId = NULL`, visible to all admins via the admin notifications endpoint.

| Event | Triggered When |
|-------|---------------|
| `ORDER_STUCK` | Order stuck in EXECUTING > 30 min (admin broadcast in addition to user notification) |
| `RECONCILIATION_CRITICAL` | Critical discrepancy detected during reconciliation (position mismatch, negative LP cash) |

### User Notification Endpoints

```
GET  /api/notifications?page=0&size=20        # List notifications
GET  /api/notifications/unread-count           # Get unread count
POST /api/notifications/{id}/read              # Mark single as read
POST /api/notifications/read-all               # Mark all as read
GET  /api/notifications/preferences            # Get preference toggles
PUT  /api/notifications/preferences            # Update preferences
```

### Admin Notification Endpoints

```
GET  /api/admin/notifications?page=0&size=20   # List admin broadcast notifications
GET  /api/admin/notifications/unread-count      # Get unread admin notification count
```

### Preferences

Users can toggle which event types generate notifications:

```
PUT /api/notifications/preferences
Body: {
  "tradeExecuted": true,
  "couponPaid": true,
  "incomePaid": true,
  "redemptionCompleted": true,
  "assetStatusChanged": false,
  "orderStuck": true,
  "lpShortfall": true,
  "delistingAnnounced": true
}
```

---

## 18. Amount-Based Trade Preview

In addition to specifying units, the trade preview API accepts an XAF **amount**. The system computes the maximum whole units purchasable for that budget (including fees).

### Request (amount mode)

```
POST /api/trades/preview
Body: {
  "assetId": "uuid",
  "side": "BUY",
  "amount": 500000
}
```

Exactly one of `units` or `amount` must be provided.

### Response (additional fields)

| Field | Description |
|-------|-------------|
| `computedFromAmount` | Original XAF amount from the request (null in unit mode) |
| `remainder` | Leftover XAF that cannot buy another unit (null in unit mode) |
| `units` | Computed units (max purchasable for the amount) |
| `incomeBenefit` | Income projections for non-bond assets (null for bonds) |

### Amount → Units Conversion

```
effectivePricePerUnit = askPrice × (1 + feePercent)
units = floor(amount / effectivePricePerUnit, decimalPlaces)
remainder = amount - netAmount
```

If the amount is too small to buy even 1 unit, `AMOUNT_TOO_SMALL` is returned as a blocker.

### Income Benefit Projections

For non-bond assets with an income type set, BUY previews include an `incomeBenefit` object:

```json
{
  "incomeBenefit": {
    "incomeType": "RENT",
    "incomeRate": 8.0,
    "distributionFrequencyMonths": 1,
    "nextDistributionDate": "2026-04-01",
    "incomePerPeriod": 2667,
    "estimatedAnnualIncome": 32004,
    "estimatedYieldPercent": 7.82,
    "variableIncome": false
  }
}
```

Note: Income is calculated from the `issuerPrice`, not the LP's ask price. The `estimatedYieldPercent` reflects the true yield based on the issuer price.
