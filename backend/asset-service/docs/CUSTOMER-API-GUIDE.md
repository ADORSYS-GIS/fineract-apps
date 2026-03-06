# Customer App Integration Guide

This guide describes every API flow for the customer-facing application. All endpoints are served by the asset-service at `http://localhost:8083`.

## Authentication

Public endpoints (browsing, prices, market status) require no authentication.
Trading, portfolio, and favorites endpoints require a **Bearer JWT** from Keycloak in the `Authorization` header.

---

## Flow 1: Browse Marketplace

### 1.1 Check Market Status

```
GET /api/market/status
```

Response:
```json
{
  "isOpen": true,
  "schedule": "8:00 AM - 8:00 PM WAT",
  "secondsUntilClose": 3600,
  "secondsUntilOpen": null
}
```

### 1.2 List Assets

```
GET /api/assets?page=0&size=20&category=REAL_ESTATE&search=token
```

Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "Douala Tower Token",
      "symbol": "DTT",
      "imageUrl": "https://...",
      "category": "REAL_ESTATE",
      "status": "ACTIVE",
      "askPrice": 5000,
      "change24hPercent": 2.50,
      "availableSupply": 85000,
      "totalSupply": 100000,
      "subscriptionStartDate": "2025-12-15",
      "subscriptionEndDate": "2026-03-15",
      "capitalOpenedPercent": 44.44,
      "issuerName": null,
      "lpName": "Acme Capital Partners",
      "couponAmountPerUnit": null,
      "isinCode": null,
      "maturityDate": null,
      "interestRate": null,
      "residualDays": null,
      "subscriptionClosed": false
    }
  ],
  "totalPages": 1
}
```

For bond assets, the bond-specific fields are populated:

```json
{
  "id": "uuid",
  "name": "Senegal Bond 5.80%",
  "symbol": "SEN580",
  "category": "BONDS",
  "status": "ACTIVE",
  "askPrice": 10000,
  "issuerName": "Etat du Senegal",
  "lpName": "Acme Capital Partners",
  "couponAmountPerUnit": 290,
  "isinCode": "SN0000000001",
  "maturityDate": "2028-06-30",
  "interestRate": 5.80,
  "residualDays": 850,
  "subscriptionClosed": false
}
```

Key fields:
- `issuerName` — the original creator of the asset (e.g., government for bonds). Required for bonds, optional for others.
- `lpName` — the Liquidity Partner reselling this asset on the platform.
- `couponAmountPerUnit` — for bonds, the XAF coupon amount the investor receives per unit per period. Calculated as `issuerPrice × (interestRate / 100) × (couponFrequencyMonths / 12)`. More meaningful to investors than the raw interest rate.
- `interestRate` — annual coupon rate (still available in API but the frontend displays `couponAmountPerUnit` instead, as a raw percentage can be misleading without context of the face value).

Query parameters:
- `page` (int, default 0)
- `size` (int, default 20)
- `category` (string, optional): REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, BONDS
- `search` (string, optional): search by name or symbol

---

## Flow 2: View Asset Detail

### 2.1 Get Asset Detail

```
GET /api/assets/{assetId}
```

Response includes full detail: name, symbol, description, imageUrl, category, status, askPrice, bidPrice, OHLC, totalSupply, circulatingSupply, issuerName, lpName, issuerPrice, couponAmountPerUnit, etc.

Key investor-facing fields:
- `issuerName` — who created/issued the underlying asset
- `lpName` — the Liquidity Partner managing this asset on the platform
- `issuerPrice` — the wholesale/face value per unit (used for coupon/income calculations)
- `couponAmountPerUnit` — XAF amount per unit per coupon period (bonds only)
- `askPrice` — the price buyers pay (LP ask price)
- `bidPrice` — the price sellers receive (LP bid price)

### 2.2 Price History (for charts)

```
GET /api/prices/{assetId}/history?period=1Y
```

Periods: `1D`, `1W`, `1M`, `3M`, `1Y`, `ALL`

Response:
```json
{
  "points": [
    { "price": 4800, "capturedAt": "2025-06-01T00:00:00Z" },
    { "price": 5000, "capturedAt": "2025-07-01T00:00:00Z" }
  ]
}
```

---

## Flow 3: Recent Trades

View the last 20 executed trades for an asset. This is a public, anonymous feed (no user information is exposed).

```
GET /api/assets/{assetId}/recent-trades
```

Response:
```json
[
  {
    "price": 5050,
    "quantity": 10,
    "side": "BUY",
    "executedAt": "2026-02-19T10:30:00Z"
  },
  {
    "price": 4950,
    "quantity": 5,
    "side": "SELL",
    "executedAt": "2026-02-19T10:25:00Z"
  }
]
```

Returns an empty array `[]` if no trades have been executed for this asset yet.

---

## Flow 4: Create Trade Quote

Before executing a trade, create a **price-locked quote** that reserves the current LP price for a configurable TTL (default 30 seconds). The quote is persisted as an order with status `QUOTED`.

```
POST /api/trades/quote
Headers:
  Authorization: Bearer {jwt}
  X-Idempotency-Key: {uuid}
Body:
{
  "assetId": "{asset-uuid}",
  "side": "BUY",
  "units": 10
}
```

Alternatively, use amount-based mode (system computes max units for the budget):
```json
{
  "assetId": "{asset-uuid}",
  "side": "BUY",
  "amount": 50000
}
```

Response (201 Created):
```json
{
  "orderId": "uuid",
  "status": "QUOTED",
  "assetId": "uuid",
  "assetSymbol": "DTT",
  "side": "BUY",
  "units": 10,
  "executionPrice": 5000,
  "lpMarginPerUnit": 1000,
  "grossAmount": 50000,
  "fee": 250,
  "feePercent": 0.50,
  "spreadAmount": 10000,
  "netAmount": 50250,
  "availableBalance": 100000,
  "availableUnits": null,
  "availableSupply": 85000,
  "bondBenefit": null,
  "incomeBenefit": null,
  "computedFromAmount": null,
  "remainder": null,
  "quotedAt": "2026-03-04T10:00:00Z",
  "quoteExpiresAt": "2026-03-04T10:00:30Z",
  "warnings": []
}
```

Key fields:
- `orderId` — use this to confirm, cancel, or track the order
- `executionPrice` — the LP's ask price (BUY) or bid price (SELL), locked for the quote duration
- `quotedAt` / `quoteExpiresAt` — time window to confirm the quote
- `warnings` — non-blocking issues (e.g. `MARKET_CLOSED` if market is closed but quote is still created)
- `bondBenefit` — coupon/yield projections for bond assets (BUY side only, null for non-bonds)
- `incomeBenefit` — dividend/rent/yield projections for income assets (BUY side only)

Constraints:
- Max 5 active quotes per user (configurable)
- Quote TTL: 30 seconds (configurable)
- BUY quotes soft-reserve inventory (auto-released on expiry/cancel)
- Expired quotes are automatically marked `CANCELLED`

Error responses:
- `409` — `TRADING_HALTED`, `ASSET_DELISTING` (BUY only), `INSUFFICIENT_INVENTORY`
- `409` — `MAX_QUOTES_EXCEEDED` (too many active quotes)
- `409` — `SUBSCRIPTION_NOT_STARTED`, `SUBSCRIPTION_ENDED`
- `400` — `MIN_ORDER_SIZE_NOT_MET`, `PORTFOLIO_EXPOSURE_EXCEEDED`

---

## Flow 4b: Confirm Quote

Confirm a quoted order to trigger async execution. The price is locked from the quote — no slippage within the TTL.

```
POST /api/trades/orders/{orderId}/confirm
Headers: Authorization: Bearer {jwt}
```

Response (202 Accepted):
```json
{
  "orderId": "uuid",
  "assetId": "uuid",
  "assetSymbol": "DTT",
  "side": "BUY",
  "units": 10,
  "executionPrice": 5000,
  "xafAmount": 50250,
  "fee": 250,
  "status": "PENDING",
  "createdAt": "2026-03-04T10:00:00Z"
}
```

The order transitions to:
- `PENDING` — execution will happen asynchronously (typically within 1-2 seconds)
- `QUEUED` — if the market is closed at confirmation time; will execute at market open

Error responses:
- `400` — `CONFIRM_NOT_ALLOWED` (order is not in QUOTED status)
- `409` — `QUOTE_EXPIRED` (TTL has passed; request a new quote)
- `404` — Order not found or belongs to another user

---

## Flow 4c: Trade Preview (Legacy)

> **Note:** This endpoint is preserved for backward compatibility. Prefer the quote-based flow (Flow 4) for new integrations.

```
POST /api/trades/preview
Headers: Authorization: Bearer {jwt}
Body:
{
  "assetId": "{asset-uuid}",
  "side": "BUY",
  "units": 10
}
```

Response:
```json
{
  "feasible": true,
  "blockers": [],
  "assetId": "uuid",
  "assetSymbol": "DTT",
  "side": "BUY",
  "units": 10,
  "basePrice": 5000,
  "executionPrice": 5000,
  "lpMarginPerUnit": 1000,
  "grossAmount": 50000,
  "fee": 250,
  "feePercent": 0.50,
  "spreadAmount": 10000,
  "netAmount": 50250,
  "availableBalance": 100000,
  "availableUnits": null,
  "availableSupply": 85000,
  "bondBenefit": null
}
```

- `feasible` — whether the trade can execute right now
- `blockers` — reasons if not feasible: `MARKET_CLOSED`, `TRADING_HALTED`, `INSUFFICIENT_FUNDS`, `INSUFFICIENT_INVENTORY`, `NO_POSITION`, `SUBSCRIPTION_NOT_STARTED`, `SUBSCRIPTION_ENDED`, `MIN_ORDER_SIZE_NOT_MET`, `MIN_ORDER_CASH_NOT_MET`, `LOCKUP_PERIOD_ACTIVE`, `PORTFOLIO_EXPOSURE_EXCEEDED`, `INSUFFICIENT_LP_FUNDS`

Note: `faceValue` is the issuer price (not the LP selling price). Coupon income is calculated from this face value, so the investor's true yield depends on how much they paid (the LP ask price) vs what the coupons are based on (the issuer price).

---

## Flow 5: Buy Asset (Legacy — prefer Flow 4 quote-based)

> **Note:** This synchronous endpoint is preserved for backward compatibility. New integrations should use the quote → confirm flow (Flows 4 and 4b) for better UX and reliability.

**Prerequisites**: User must have a savings account in the settlement currency (XAF) with sufficient balance.

### How It Works

When an investor buys an asset, they are purchasing from the **Liquidity Partner (LP)** who resells the asset on the platform. The investor pays the LP's **ask price** per unit. This amount is split into three parts:

1. **Issuer-price portion** — sent to the LP's cash account (wholesale value of the asset)
2. **LP margin** — sent to the LP's spread account (LP's profit per unit)
3. **Trading fee** — sent to the platform's fee collection account

### 5.1 Check market is open

```
GET /api/market/status
```

Assert `isOpen == true`.

### 5.2 Execute buy

```
POST /api/trades/buy
Headers:
  Authorization: Bearer {jwt}
  X-Idempotency-Key: {uuid}  (optional, auto-generated if omitted)
Body:
{
  "assetId": "{asset-uuid}",
  "units": 10
}
```

The backend automatically:
- Extracts user identity from the JWT token
- Resolves the user's XAF savings account (throws error if missing)
- Resolves or creates the user's asset savings account on first buy
- Looks up the LP's ask price for this asset
- Calculates total cost: `units × askPrice + fee`
- Calculates LP margin: `units × (askPrice - issuerPrice)`
- Executes four atomic transfers via Fineract Batch API:
  1. Investor XAF → LP Cash (issuer-price portion)
  2. Investor XAF → LP Spread Account (LP margin)
  3. Investor XAF → Fee Collection Account (trading fee)
  4. LP Asset Account → Investor Asset Account (token delivery)

Response:
```json
{
  "orderId": "uuid",
  "status": "FILLED",
  "units": 10,
  "pricePerUnit": 5000,
  "totalAmount": 50250,
  "fee": 250
}
```

- `pricePerUnit` = LP ask price (what the investor paid per unit)
- `totalAmount` = gross (units × askPrice) + fee = 50,000 + 250 = 50,250 XAF

**Out-of-hours behavior:** If the market is closed, the order is **queued** instead of rejected. The response will have `status: "QUEUED"`. Queued orders are processed at market open (08:01 WAT, Mon-Fri). If the price moved > 5% since queue time, the order is rejected as stale.

Error responses:
- `409` - `MARKET_CLOSED` (only if queuing is not applicable)
- `409` - `TRADING_HALTED`, `INSUFFICIENT_INVENTORY`
- `409` - `SUBSCRIPTION_NOT_STARTED` (subscription period has not started yet)
- `409` - `SUBSCRIPTION_ENDED` (subscription period has passed; SELL is still allowed)
- `429` - `TRADE_LOCKED` (another trade in progress, retry after a few seconds)
- `400` - `NO_XAF_ACCOUNT` (user has no active settlement currency savings account)
- `400` - `MIN_ORDER_SIZE_NOT_MET` (order below minimum unit size)
- `400` - `MIN_ORDER_CASH_NOT_MET` (order below minimum cash amount)
- `400` - `PORTFOLIO_EXPOSURE_EXCEEDED` (total portfolio value would exceed platform limit)
- `400` - `TRADING_ERROR` (insufficient balance, validation errors)

---

## Flow 5b: Order Status Stream (SSE)

Subscribe to real-time order status updates via Server-Sent Events. The stream pushes an event on every status transition and auto-closes when the order reaches a terminal state.

```
GET /api/trades/orders/{orderId}/stream
Headers:
  Authorization: Bearer {jwt}
  Accept: text/event-stream
```

Events:

1. **`connected`** — initial event confirming the SSE connection is live:
```
event: connected
data: {"orderId":"uuid"}
```

2. **`order-status`** — pushed on every status transition:
```
event: order-status
data: {"orderId":"uuid","status":"FILLED","previousStatus":"EXECUTING","side":"BUY","units":10,"executionPrice":5000,"cashAmount":50250,"fee":250,"failureReason":null,"timestamp":"2026-03-04T10:00:02Z"}
```

Terminal statuses (stream auto-closes): `FILLED`, `FAILED`, `REJECTED`, `CANCELLED`

**Important:** The native browser `EventSource` API does not support custom `Authorization` headers. Use a library like `@microsoft/fetch-event-source` for JWT-based SSE:

```javascript
import { fetchEventSource } from '@microsoft/fetch-event-source';

fetchEventSource(`/api/trades/orders/${orderId}/stream`, {
  headers: { 'Authorization': `Bearer ${token}` },
  onmessage(ev) {
    if (ev.event === 'order-status') {
      const status = JSON.parse(ev.data);
      // Update UI based on status.status
    }
  },
});
```

**Fallback:** If SSE is unavailable, poll `GET /api/trades/orders/{orderId}` every 2 seconds until a terminal status is returned.

---

## Flow 6: Sell Asset (Legacy — prefer Flow 4 quote-based)

> **Note:** This synchronous endpoint is preserved for backward compatibility. New integrations should use the quote → confirm flow (Flows 4 and 4b).

### How It Works

When an investor sells, the LP buys back the units at the LP's **bid price**. The proceeds are paid from the LP's cash account to the investor, minus the trading fee.

### 6.1 Execute sell

```
POST /api/trades/sell
Headers:
  Authorization: Bearer {jwt}
  X-Idempotency-Key: {uuid}
Body:
{
  "assetId": "{asset-uuid}",
  "units": 5
}
```

The backend automatically:
- Extracts user identity from the JWT token
- Resolves the user's XAF savings account (throws error if missing)
- Resolves the user's asset account from their existing position (throws error if no position)
- Validates the user holds enough units to sell
- Looks up the LP's bid price for this asset
- Calculates net proceeds: `units × bidPrice - fee`
- Executes atomic transfers via Fineract Batch API:
  1. Investor Asset Account → LP Asset Account (token return)
  2. LP Cash → Investor XAF (net proceeds)
  3. LP Cash → Fee Collection Account (trading fee)

Response:
```json
{
  "orderId": "uuid",
  "status": "FILLED",
  "units": 5,
  "pricePerUnit": 4800,
  "totalAmount": 23880,
  "fee": 120,
  "realizedPnl": -1250
}
```

- `pricePerUnit` = LP bid price (what the investor received per unit)
- `totalAmount` = gross (units × bidPrice) - fee = 24,000 - 120 = **23,880 XAF** (net credited to investor)
- `realizedPnl` = realized profit/loss vs average purchase price

Error responses:
- `400` - `NO_POSITION` (user has no holdings for this asset)
- `400` - `INSUFFICIENT_UNITS` (trying to sell more than held)
- `400` - `INSUFFICIENT_LP_FUNDS` (LP doesn't have enough cash for payout)
- `400` - `LOCKUP_PERIOD_ACTIVE` (per-lot lockup not yet expired)
- `400` - `MIN_ORDER_SIZE_NOT_MET` (order below minimum unit size)
- `400` - `NO_XAF_ACCOUNT` (user has no active settlement currency savings account)

---

## Flow 7: View Portfolio

### 7.1 Full Portfolio

```
GET /api/portfolio
Headers: Authorization: Bearer {jwt}
```

Response:
```json
{
  "totalValue": 250000,
  "totalCostBasis": 200000,
  "unrealizedPnl": 50000,
  "unrealizedPnlPercent": 25.0,
  "positions": [
    {
      "assetId": "uuid",
      "symbol": "DTT",
      "name": "Douala Tower Token",
      "totalUnits": 10,
      "avgPurchasePrice": 5000,
      "marketPrice": 5500,
      "marketValue": 55000,
      "costBasis": 50000,
      "unrealizedPnl": 5000,
      "unrealizedPnlPercent": 10.0,
      "realizedPnl": 0,
      "bondBenefit": null
    }
  ],
  "allocations": [
    { "category": "REAL_ESTATE", "totalValue": 150000, "percentage": 60.0 },
    { "category": "BONDS", "totalValue": 100000, "percentage": 40.0 }
  ],
  "estimatedAnnualYieldPercent": 8.50,
  "categoryCount": 2
}
```

For bond positions, the `bondBenefit` field contains projected coupon income and principal return (same structure as the trade preview, but without `investmentCost`, `netProjectedProfit`, or `annualizedYieldPercent` since the user already holds the position).

New fields:
- `allocations` — breakdown of portfolio value by asset category (category name, total value, percentage)
- `estimatedAnnualYieldPercent` — estimated annual return including unrealized gains and projected bond coupon income
- `categoryCount` — number of distinct asset categories in the portfolio

### 7.2 Single Position

```
GET /api/portfolio/positions/{assetId}
Headers: Authorization: Bearer {jwt}
```

---

## Flow 8: Portfolio History

Get portfolio value over time for charting. Snapshots are taken daily at 20:30 WAT.

```
GET /api/portfolio/history?period=1M
Headers: Authorization: Bearer {jwt}
```

Periods: `1M` (default), `3M`, `6M`, `1Y`

Response:
```json
{
  "period": "1M",
  "snapshots": [
    {
      "date": "2026-01-20",
      "totalValue": 200000,
      "totalCostBasis": 195000,
      "unrealizedPnl": 5000,
      "positionCount": 3
    },
    {
      "date": "2026-01-21",
      "totalValue": 205000,
      "totalCostBasis": 195000,
      "unrealizedPnl": 10000,
      "positionCount": 3
    }
  ]
}
```

Returns an empty `snapshots` array if no snapshots exist for the requested period.

---

## Flow 8b: Cancel an Order

Users can cancel their own `QUOTED`, `PENDING`, or `QUEUED` orders before execution.

```
POST /api/trades/orders/{orderId}/cancel
Headers: Authorization: Bearer {jwt}
```

Response:
```json
{
  "orderId": "uuid",
  "status": "CANCELLED",
  "units": 10,
  "pricePerUnit": 5000,
  "totalAmount": 50250,
  "fee": 250
}
```

Error responses:
- `400` — Order is not in `QUOTED`, `PENDING`, or `QUEUED` status (already filled, cancelled, etc.)
- `404` — Order not found or belongs to another user

Cancelling a `QUOTED` BUY order immediately releases the soft-reserved inventory.

---

## Flow 9: Trade History

```
GET /api/trades/orders?page=0&size=20&assetId={optional}
Headers: Authorization: Bearer {jwt}
```

Response:
```json
{
  "content": [
    {
      "orderId": "uuid",
      "assetId": "uuid",
      "side": "BUY",
      "units": 10,
      "executionPrice": 5000,
      "xafAmount": 50000,
      "fee": 250,
      "status": "FILLED",
      "createdAt": "2026-02-07T14:30:00Z"
    }
  ]
}
```

> **Note:** Orders older than the configured retention period (default 12 months) are automatically archived and will no longer appear in this endpoint. Archived orders can be queried via the admin API or direct SQL.

---

## Flow 10: Favorites / Watchlist

```
POST /api/favorites/{assetId}          → 201 Created
DELETE /api/favorites/{assetId}        → 204 No Content
GET /api/favorites                     → Array of FavoriteResponse
Headers: Authorization: Bearer {jwt}
```

---

## Flow 11: Discover Upcoming Assets

```
GET /api/assets/discover?page=0&size=20
```

Response:
```json
{
  "content": [
    {
      "id": "uuid",
      "name": "Yaounde Mall Token",
      "symbol": "YMT",
      "imageUrl": "https://...",
      "category": "REAL_ESTATE",
      "status": "PENDING",
      "subscriptionStartDate": "2025-12-15",
      "subscriptionEndDate": "2026-03-15",
      "daysUntilSubscription": 36
    }
  ]
}
```
