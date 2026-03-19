# Asset Service API Guide

> **Looking for the UI guide?** See [ASSET-MANAGER-GUIDE.md](./ASSET-MANAGER-GUIDE.md) for step-by-step instructions using the Asset Manager web application.

This guide covers both the **customer-facing API** (Part 1) for frontend developers building the investor app, and the **admin API** (Part 2) for managing the asset marketplace.

---

# Part 1: Customer-Facing API

These endpoints power the investor mobile and web applications. Public endpoints require no authentication. Authenticated endpoints require a JWT bearer token.

**Base URL:** `/api/v1`

**Common Headers (authenticated endpoints):**

| Header | Required | Description |
|--------|----------|-------------|
| `Authorization` | Yes | `Bearer {jwt}` — JWT issued by the auth service |
| `X-Idempotency-Key` | For trades | UUID v4 — prevents duplicate order submission |
| `Content-Type` | For POST/PUT | `application/json` |

---

## 1. Asset Catalog (Public)

### List Active Assets

```
GET /api/v1/assets?category=REAL_ESTATE&search=douala&page=0&size=20
```

No authentication required.

**Query Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `category` | No | — | Filter by category: `REAL_ESTATE`, `BONDS`, `AGRICULTURE`, `STOCKS`, `COMMODITIES` |
| `search` | No | — | Full-text search on name, symbol, description |
| `page` | No | `0` | Page number (zero-based) |
| `size` | No | `20` | Page size (max 100) |

**Response:**

```json
{
  "content": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Douala Tower Token",
      "symbol": "DTT",
      "description": "Tokenized commercial real estate in Douala",
      "category": "REAL_ESTATE",
      "status": "ACTIVE",
      "imageUrl": "https://cdn.example.com/assets/dtt.jpg",
      "currentPrice": 5000,
      "priceChange24h": 2.5,
      "priceChange24hPercent": 0.05,
      "totalSupply": 100000,
      "circulatingSupply": 15000,
      "tradingFeePercent": 0.50,
      "issuerName": null,
      "incomeType": "RENT",
      "incomeRate": 8.0,
      "interestRate": null,
      "maturityDate": null,
      "subscriptionStartDate": "2025-12-15",
      "subscriptionEndDate": "2026-03-15"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Senegal Treasury Bond 5.80%",
      "symbol": "SEN580",
      "description": "Government bond issued by Etat du Senegal",
      "category": "BONDS",
      "status": "ACTIVE",
      "imageUrl": "https://cdn.example.com/assets/sen580.jpg",
      "currentPrice": 10000,
      "priceChange24h": 0,
      "priceChange24hPercent": 0,
      "totalSupply": 50000,
      "circulatingSupply": 12000,
      "tradingFeePercent": 0.25,
      "issuerName": "Etat du Senegal",
      "incomeType": null,
      "incomeRate": null,
      "interestRate": 5.80,
      "maturityDate": "2028-06-30",
      "subscriptionStartDate": "2025-12-01",
      "subscriptionEndDate": "2026-06-30"
    }
  ],
  "totalElements": 42,
  "totalPages": 3,
  "number": 0,
  "size": 20,
  "first": true,
  "last": false
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Unique asset identifier |
| `name` | string | Display name |
| `symbol` | string | Trading symbol (e.g. `DTT`) |
| `category` | string | Asset category |
| `status` | string | `ACTIVE`, `PENDING`, `HALTED`, `DELISTING`, `MATURED`, `DELISTED` |
| `currentPrice` | integer | Current ask price in XAF |
| `priceChange24h` | number | Absolute price change in the last 24 hours |
| `priceChange24hPercent` | number | Percentage price change in the last 24 hours |
| `totalSupply` | integer | Total units ever minted |
| `circulatingSupply` | integer | Units held by investors |
| `tradingFeePercent` | number | Platform trading fee percentage |
| `issuerName` | string | Original issuer (bonds). Null for non-bond assets. |
| `incomeType` | string | `RENT`, `DIVIDEND`, `HARVEST_YIELD`, `PROFIT_SHARE`, or null |
| `incomeRate` | number | Annual income rate as percentage (non-bond assets) |
| `interestRate` | number | Annual coupon rate as percentage (bonds only) |
| `maturityDate` | string | Bond maturity date (bonds only) |
| `subscriptionStartDate` | string | When BUY orders start being accepted |
| `subscriptionEndDate` | string | When BUY orders stop being accepted |

---

### Get Asset Detail

```
GET /api/v1/assets/{id}
```

No authentication required.

**Response:**

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Douala Tower Token",
  "symbol": "DTT",
  "description": "Tokenized commercial real estate in Douala",
  "category": "REAL_ESTATE",
  "status": "ACTIVE",
  "imageUrl": "https://cdn.example.com/assets/dtt.jpg",
  "currentPrice": 5000,
  "bidPrice": 4800,
  "askPrice": 5000,
  "issuerPrice": 4000,
  "priceChange24h": 2.5,
  "priceChange24hPercent": 0.05,
  "totalSupply": 100000,
  "circulatingSupply": 15000,
  "availableSupply": 85000,
  "tradingFeePercent": 0.50,
  "decimalPlaces": 0,
  "issuerName": null,
  "isinCode": null,
  "incomeType": "RENT",
  "incomeRate": 8.0,
  "distributionFrequencyMonths": 1,
  "nextDistributionDate": "2026-04-01",
  "interestRate": null,
  "couponFrequencyMonths": null,
  "maturityDate": null,
  "currentYield": null,
  "subscriptionStartDate": "2025-12-15",
  "subscriptionEndDate": "2026-03-15",
  "capitalOpenedPercent": 44.44,
  "lockupDays": 30,
  "ohlc": {
    "open": 4950,
    "high": 5100,
    "low": 4900,
    "close": 5000,
    "volume": 3200,
    "date": "2026-03-15"
  }
}
```

**Additional fields vs. list endpoint:**

| Field | Type | Description |
|-------|------|-------------|
| `bidPrice` | integer | LP's buying price (what investors receive on SELL) |
| `askPrice` | integer | LP's selling price (what investors pay on BUY) |
| `issuerPrice` | integer | Face/wholesale value per unit |
| `availableSupply` | integer | Units remaining in LP inventory |
| `decimalPlaces` | integer | Fractional unit precision (0 = whole units only) |
| `isinCode` | string | International Securities Identification Number (bonds) |
| `distributionFrequencyMonths` | integer | Income payout frequency in months |
| `nextDistributionDate` | string | Next scheduled income/coupon date |
| `couponFrequencyMonths` | integer | Bond coupon frequency in months |
| `currentYield` | number | Effective annual return for bonds (issuerPrice x rate / askPrice) |
| `capitalOpenedPercent` | number | Percentage of capital opened for subscription |
| `lockupDays` | integer | Days after purchase before SELL is allowed (0 = none) |
| `ohlc` | object | Today's Open/High/Low/Close/Volume |

---

### Recent Trades

```
GET /api/v1/assets/{id}/recent-trades
```

No authentication required. Returns the last 20 anonymous trades for the asset.

**Response:**

```json
[
  {
    "side": "BUY",
    "units": 50,
    "price": 5000,
    "amount": 250000,
    "executedAt": "2026-03-15T14:32:10Z"
  },
  {
    "side": "SELL",
    "units": 20,
    "price": 4800,
    "amount": 96000,
    "executedAt": "2026-03-15T14:28:45Z"
  }
]
```

| Field | Type | Description |
|-------|------|-------------|
| `side` | string | `BUY` or `SELL` |
| `units` | integer | Number of units traded |
| `price` | integer | Execution price per unit in XAF |
| `amount` | integer | Total trade value in XAF |
| `executedAt` | string | ISO-8601 timestamp |

---

### Discover Upcoming Assets

```
GET /api/v1/discover
```

No authentication required. Returns assets in `PENDING` status with expected launch dates.

**Response:**

```json
[
  {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "name": "Yaounde Agri-Fund",
    "symbol": "YAF",
    "description": "Agricultural investment fund covering cocoa and coffee plantations",
    "category": "AGRICULTURE",
    "status": "PENDING",
    "imageUrl": "https://cdn.example.com/assets/yaf.jpg",
    "issuerPrice": 2000,
    "lpAskPrice": 2500,
    "totalSupply": 200000,
    "incomeType": "HARVEST_YIELD",
    "incomeRate": 6.5,
    "subscriptionStartDate": "2026-04-01",
    "subscriptionEndDate": "2026-09-30",
    "capitalOpenedPercent": 30.00
  }
]
```

---

## 2. Prices (Public)

### Current Price

```
GET /api/v1/prices/{assetId}
```

No authentication required.

**Response:**

```json
{
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "symbol": "DTT",
  "currentPrice": 5000,
  "bidPrice": 4800,
  "askPrice": 5000,
  "priceChange24h": 2.5,
  "priceChange24hPercent": 0.05,
  "high24h": 5100,
  "low24h": 4900,
  "volume24h": 3200,
  "ohlc": {
    "open": 4950,
    "high": 5100,
    "low": 4900,
    "close": 5000,
    "volume": 3200,
    "date": "2026-03-15"
  },
  "updatedAt": "2026-03-15T14:35:00Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `currentPrice` | integer | Current ask price in XAF |
| `bidPrice` | integer | LP bid price (investor sell price) |
| `askPrice` | integer | LP ask price (investor buy price) |
| `priceChange24h` | number | Absolute 24h change |
| `priceChange24hPercent` | number | Percentage 24h change |
| `high24h` | integer | 24-hour high |
| `low24h` | integer | 24-hour low |
| `volume24h` | integer | 24-hour trade volume in units |
| `ohlc` | object | Today's OHLC candlestick |
| `updatedAt` | string | Last price update timestamp |

---

### OHLC Candlestick Data

```
GET /api/v1/prices/{assetId}/ohlc
```

No authentication required. Returns daily OHLC candlestick data.

**Response:**

```json
[
  {
    "date": "2026-03-15",
    "open": 4950,
    "high": 5100,
    "low": 4900,
    "close": 5000,
    "volume": 3200
  },
  {
    "date": "2026-03-14",
    "open": 4900,
    "high": 5000,
    "low": 4850,
    "close": 4950,
    "volume": 2800
  }
]
```

---

### Price History (for Charts)

```
GET /api/v1/prices/{assetId}/history?period=1M
```

No authentication required.

**Query Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `period` | No | `1M` | Time period: `1D`, `1W`, `1M`, `3M`, `1Y`, `ALL` |

**Response:**

```json
{
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "symbol": "DTT",
  "period": "1M",
  "dataPoints": [
    {
      "date": "2026-02-15",
      "price": 4500,
      "volume": 1500
    },
    {
      "date": "2026-02-16",
      "price": 4550,
      "volume": 1800
    },
    {
      "date": "2026-03-15",
      "price": 5000,
      "volume": 3200
    }
  ]
}
```

| Field | Type | Description |
|-------|------|-------------|
| `period` | string | Requested period |
| `dataPoints` | array | One entry per day (or per hour for `1D`) |
| `dataPoints[].date` | string | Date or datetime of data point |
| `dataPoints[].price` | integer | Closing price in XAF |
| `dataPoints[].volume` | integer | Trade volume in units |

---

## 3. Market Status (Public)

### Get Market Status

```
GET /api/v1/market/status
```

No authentication required.

**Response (market open):**

```json
{
  "open": true,
  "currentTime": "2026-03-15T10:30:00Z",
  "timezone": "Africa/Lagos",
  "schedule": {
    "openTime": "08:00",
    "closeTime": "20:00",
    "tradingDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
  },
  "nextClose": "2026-03-15T19:00:00Z",
  "nextCloseCountdownSeconds": 30600,
  "nextOpen": null,
  "nextOpenCountdownSeconds": null
}
```

**Response (market closed):**

```json
{
  "open": false,
  "currentTime": "2026-03-15T21:00:00Z",
  "timezone": "Africa/Lagos",
  "schedule": {
    "openTime": "08:00",
    "closeTime": "20:00",
    "tradingDays": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]
  },
  "nextClose": null,
  "nextCloseCountdownSeconds": null,
  "nextOpen": "2026-03-16T07:00:00Z",
  "nextOpenCountdownSeconds": 36000
}
```

| Field | Type | Description |
|-------|------|-------------|
| `open` | boolean | Whether trading is currently allowed |
| `currentTime` | string | Server time (UTC) |
| `timezone` | string | Market timezone |
| `schedule.openTime` | string | Daily open time (local) |
| `schedule.closeTime` | string | Daily close time (local) |
| `schedule.tradingDays` | array | Days when market is open |
| `nextClose` | string | Next market close (UTC), null if closed |
| `nextCloseCountdownSeconds` | integer | Seconds until close, null if closed |
| `nextOpen` | string | Next market open (UTC), null if open |
| `nextOpenCountdownSeconds` | integer | Seconds until open, null if open |

---

## 4. Trading (Authenticated)

Trading follows a **quote-based async flow**: request a quote (locks price for 30 seconds), confirm the quote, then track execution via SSE.

### Create Trade Quote

```
POST /api/v1/trades/quote
Headers:
  Authorization: Bearer {jwt}
  X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
  Content-Type: application/json
```

**Request Body (unit mode):**

```json
{
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "side": "BUY",
  "units": 100
}
```

**Request Body (amount mode):**

```json
{
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "side": "BUY",
  "amount": 500000
}
```

Exactly one of `units` or `amount` must be provided.

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `assetId` | UUID | Yes | Asset to trade |
| `side` | string | Yes | `BUY` or `SELL` |
| `units` | integer | One of units/amount | Number of units to trade |
| `amount` | integer | One of units/amount | XAF budget (BUY only). System computes max whole units. |

**Response (200 OK):**

```json
{
  "orderId": "d4e5f6a7-b8c9-0123-def0-123456789abc",
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "symbol": "DTT",
  "side": "BUY",
  "units": 100,
  "executionPrice": 5000,
  "grossAmount": 500000,
  "fee": 2500,
  "feePercent": 0.50,
  "spreadAmount": 100000,
  "netAmount": 502500,
  "computedFromAmount": null,
  "remainder": null,
  "availableBalance": 1500000,
  "availableUnits": null,
  "availableSupply": 85000,
  "bondBenefit": null,
  "incomeBenefit": {
    "incomeType": "RENT",
    "incomeRate": 8.0,
    "distributionFrequencyMonths": 1,
    "nextDistributionDate": "2026-04-01",
    "incomePerPeriod": 2667,
    "estimatedAnnualIncome": 32004,
    "estimatedYieldPercent": 7.82,
    "variableIncome": false
  },
  "taxBreakdown": {
    "registrationDutyRate": 0.01,
    "registrationDutyAmount": 5000,
    "capitalGainsRate": 0,
    "capitalGainsTaxAmount": 0,
    "totalTax": 5000
  },
  "warnings": [],
  "expiresAt": "2026-03-15T14:35:30Z",
  "status": "QUOTED"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `orderId` | UUID | Order ID (use this to confirm, cancel, or track) |
| `side` | string | `BUY` or `SELL` |
| `units` | integer | Number of units (computed if amount mode) |
| `executionPrice` | integer | Price per unit in XAF |
| `grossAmount` | integer | `units x executionPrice` |
| `fee` | integer | Platform trading fee in XAF |
| `feePercent` | number | Fee percentage applied |
| `spreadAmount` | integer | LP spread included in the price |
| `netAmount` | integer | Total amount debited (BUY) or credited (SELL) in XAF |
| `computedFromAmount` | integer | Original XAF budget (null if unit mode) |
| `remainder` | integer | Leftover XAF that cannot buy another unit (null if unit mode) |
| `availableBalance` | integer | User's current XAF cash balance |
| `availableUnits` | integer | User's current units of this asset (SELL only) |
| `availableSupply` | integer | LP inventory remaining |
| `bondBenefit` | object | Bond yield projections (null for non-bonds). Contains `couponFrequencyMonths`, `nextCouponDate`, `couponPerPeriod`, `estimatedAnnualCoupon`, `currentYield`. |
| `incomeBenefit` | object | Income projections for non-bond assets (null for bonds) |
| `taxBreakdown` | object | Applicable tax breakdown |
| `taxBreakdown.registrationDutyRate` | number | Registration duty rate |
| `taxBreakdown.registrationDutyAmount` | integer | Registration duty in XAF |
| `taxBreakdown.capitalGainsRate` | number | Capital gains tax rate (SELL only) |
| `taxBreakdown.capitalGainsTaxAmount` | integer | Capital gains tax in XAF (SELL only) |
| `taxBreakdown.totalTax` | integer | Total taxes in XAF |
| `warnings` | array | Non-blocking warnings (e.g. `["APPROACHING_POSITION_LIMIT"]`) |
| `expiresAt` | string | Quote expiry (30 seconds). Must confirm before this time. |
| `status` | string | `QUOTED` |

**Error Codes:**

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `INSUFFICIENT_FUNDS` | XAF balance too low for BUY |
| 400 | `INSUFFICIENT_INVENTORY` | LP does not have enough units |
| 400 | `MIN_ORDER_SIZE_NOT_MET` | Order below minimum unit requirement |
| 400 | `ORDER_SIZE_LIMIT_EXCEEDED` | Order exceeds max order size |
| 400 | `POSITION_LIMIT_EXCEEDED` | Would exceed max position percentage |
| 400 | `DAILY_LIMIT_EXCEEDED` | Would exceed daily XAF trade limit |
| 400 | `AMOUNT_TOO_SMALL` | Amount cannot buy even 1 unit |
| 400 | `LOCKUP_PERIOD_ACTIVE` | Units still in lockup (SELL only) |
| 404 | `ASSET_NOT_FOUND` | Asset ID does not exist |
| 409 | `IDEMPOTENCY_CONFLICT` | Duplicate idempotency key with different params |
| 409 | `MAX_QUOTES_EXCEEDED` | Too many active quotes (max 3 concurrent) |
| 422 | `TRADING_HALTED` | Asset trading is halted |
| 422 | `ASSET_DELISTING` | Asset is delisting (BUY blocked) |
| 422 | `MARKET_CLOSED` | Market is closed. Response includes `nextOpenAt` and `nextOpenCountdownSeconds`. |
| 422 | `SUBSCRIPTION_NOT_STARTED` | BUY before subscription start date |
| 422 | `SUBSCRIPTION_ENDED` | BUY after subscription end date |

---

### Confirm Order

```
POST /api/v1/trades/orders/{id}/confirm
Headers:
  Authorization: Bearer {jwt}
```

No request body.

**Response (202 Accepted):**

```json
{
  "orderId": "d4e5f6a7-b8c9-0123-def0-123456789abc",
  "status": "PENDING",
  "message": "Order confirmed and queued for execution."
}
```

The order transitions to:
- **PENDING** if the market is currently open — execution starts immediately
- **QUEUED** if the market is closed — will execute at next market open

**Error Codes:**

| HTTP | Code | Description |
|------|------|-------------|
| 400 | `QUOTE_EXPIRED` | Quote expired (older than 30 seconds) |
| 404 | `ORDER_NOT_FOUND` | Order ID does not exist or does not belong to user |
| 409 | `INVALID_STATUS_TRANSITION` | Order is not in QUOTED status |

---

### Stream Order Status (SSE)

```
GET /api/v1/trades/orders/{id}/stream
Headers:
  Authorization: Bearer {jwt}
  Accept: text/event-stream
```

**Response:** Server-Sent Events stream (`Content-Type: text/event-stream`).

Pushes an event each time the order status changes:

```
event: status
data: {"orderId":"d4e5f6a7-b8c9-0123-def0-123456789abc","status":"PENDING","timestamp":"2026-03-15T14:35:02Z"}

event: status
data: {"orderId":"d4e5f6a7-b8c9-0123-def0-123456789abc","status":"EXECUTING","timestamp":"2026-03-15T14:35:03Z"}

event: status
data: {"orderId":"d4e5f6a7-b8c9-0123-def0-123456789abc","status":"FILLED","timestamp":"2026-03-15T14:35:05Z","executionPrice":5000,"units":100,"netAmount":502500}
```

The stream auto-closes when the order reaches a terminal state (`FILLED`, `FAILED`, `REJECTED`, `CANCELLED`).

**Terminal event data includes:**

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | Terminal status |
| `executionPrice` | integer | Final execution price (FILLED only) |
| `units` | integer | Units traded (FILLED only) |
| `netAmount` | integer | Net XAF amount (FILLED only) |
| `failureReason` | string | Reason for failure (FAILED/REJECTED only) |

---

### Cancel Order

```
POST /api/v1/trades/orders/{id}/cancel
Headers:
  Authorization: Bearer {jwt}
```

No request body. Cancels an order in `QUOTED`, `PENDING`, or `QUEUED` status.

**Response (200 OK):**

```json
{
  "orderId": "d4e5f6a7-b8c9-0123-def0-123456789abc",
  "status": "CANCELLED",
  "message": "Order cancelled."
}
```

**Error Codes:**

| HTTP | Code | Description |
|------|------|-------------|
| 404 | `ORDER_NOT_FOUND` | Order does not exist or does not belong to user |
| 409 | `CANCEL_NOT_ALLOWED` | Order is already executing or in a terminal state |

---

### Order History

```
GET /api/v1/trades/orders?assetId=a1b2c3d4-e5f6-7890-abcd-ef1234567890&page=0&size=20
Headers:
  Authorization: Bearer {jwt}
```

**Query Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `assetId` | No | — | Filter by asset UUID |
| `page` | No | `0` | Page number |
| `size` | No | `20` | Page size |

**Response:**

```json
{
  "content": [
    {
      "id": "d4e5f6a7-b8c9-0123-def0-123456789abc",
      "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "assetName": "Douala Tower Token",
      "symbol": "DTT",
      "side": "BUY",
      "units": 100,
      "executionPrice": 5000,
      "grossAmount": 500000,
      "fee": 2500,
      "netAmount": 502500,
      "status": "FILLED",
      "failureReason": null,
      "createdAt": "2026-03-15T14:34:00Z",
      "executedAt": "2026-03-15T14:35:05Z"
    }
  ],
  "totalElements": 15,
  "totalPages": 1,
  "number": 0,
  "size": 20
}
```

---

### Get Single Order

```
GET /api/v1/trades/orders/{id}
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
{
  "id": "d4e5f6a7-b8c9-0123-def0-123456789abc",
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "assetName": "Douala Tower Token",
  "symbol": "DTT",
  "side": "BUY",
  "units": 100,
  "executionPrice": 5000,
  "grossAmount": 500000,
  "fee": 2500,
  "feePercent": 0.50,
  "spreadAmount": 100000,
  "netAmount": 502500,
  "taxBreakdown": {
    "registrationDutyRate": 0.01,
    "registrationDutyAmount": 5000,
    "capitalGainsRate": 0,
    "capitalGainsTaxAmount": 0,
    "totalTax": 5000
  },
  "status": "FILLED",
  "failureReason": null,
  "idempotencyKey": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2026-03-15T14:34:00Z",
  "confirmedAt": "2026-03-15T14:34:30Z",
  "executedAt": "2026-03-15T14:35:05Z"
}
```

**Error Codes:**

| HTTP | Code | Description |
|------|------|-------------|
| 404 | `ORDER_NOT_FOUND` | Order does not exist or does not belong to user |

---

## 5. Portfolio (Authenticated)

### Full Portfolio

```
GET /api/v1/portfolio
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
{
  "positions": [
    {
      "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "symbol": "DTT",
      "assetName": "Douala Tower Token",
      "category": "REAL_ESTATE",
      "imageUrl": "https://cdn.example.com/assets/dtt.jpg",
      "totalUnits": 250,
      "avgPurchasePrice": 4800,
      "totalCostBasis": 1200000,
      "currentPrice": 5000,
      "currentValue": 1250000,
      "unrealizedPnl": 50000,
      "unrealizedPnlPercent": 4.17,
      "accruedInterest": 0,
      "incomeType": "RENT"
    },
    {
      "assetId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "symbol": "SEN580",
      "assetName": "Senegal Treasury Bond 5.80%",
      "category": "BONDS",
      "imageUrl": "https://cdn.example.com/assets/sen580.jpg",
      "totalUnits": 50,
      "avgPurchasePrice": 10000,
      "totalCostBasis": 500000,
      "currentPrice": 10000,
      "currentValue": 500000,
      "unrealizedPnl": 0,
      "unrealizedPnlPercent": 0,
      "accruedInterest": 3972,
      "incomeType": null
    }
  ],
  "totalValue": 1750000,
  "totalCostBasis": 1700000,
  "unrealizedPnl": 50000,
  "realizedPnl": 15000
}
```

**Top-Level Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `positions` | array | All positions with non-zero units |
| `totalValue` | integer | Sum of all position current values in XAF |
| `totalCostBasis` | integer | Sum of all position cost bases in XAF |
| `unrealizedPnl` | integer | `totalValue - totalCostBasis` |
| `realizedPnl` | integer | Cumulative realized profit/loss from closed trades |

**Position Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `assetId` | UUID | Asset identifier |
| `symbol` | string | Trading symbol |
| `assetName` | string | Asset display name |
| `category` | string | Asset category |
| `totalUnits` | integer | Units held |
| `avgPurchasePrice` | integer | Volume-weighted average purchase price |
| `totalCostBasis` | integer | `totalUnits x avgPurchasePrice` |
| `currentPrice` | integer | Current ask price |
| `currentValue` | integer | `totalUnits x currentPrice` |
| `unrealizedPnl` | integer | `currentValue - totalCostBasis` |
| `unrealizedPnlPercent` | number | Percentage unrealized gain/loss |
| `accruedInterest` | integer | Accrued but unpaid bond interest in XAF |
| `incomeType` | string | Income type if applicable, null otherwise |

---

### Single Position Detail

```
GET /api/v1/portfolio/positions/{assetId}
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
{
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "symbol": "DTT",
  "assetName": "Douala Tower Token",
  "category": "REAL_ESTATE",
  "totalUnits": 250,
  "avgPurchasePrice": 4800,
  "totalCostBasis": 1200000,
  "currentPrice": 5000,
  "currentValue": 1250000,
  "unrealizedPnl": 50000,
  "unrealizedPnlPercent": 4.17,
  "realizedPnl": 15000,
  "accruedInterest": 0,
  "firstPurchaseDate": "2026-01-15T09:00:00Z"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `realizedPnl` | integer | Realized P&L for this specific asset |
| `firstPurchaseDate` | string | Date of first purchase (used for lockup fallback) |

---

### Portfolio Value History (for Charts)

```
GET /api/v1/portfolio/history?period=3M
Headers:
  Authorization: Bearer {jwt}
```

**Query Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `period` | No | `1M` | `1M`, `3M`, `6M`, `1Y` |

**Response:**

```json
{
  "period": "3M",
  "dataPoints": [
    {
      "date": "2026-01-15",
      "totalValue": 500000,
      "totalCostBasis": 500000,
      "unrealizedPnl": 0,
      "positionCount": 1
    },
    {
      "date": "2026-02-15",
      "totalValue": 1200000,
      "totalCostBasis": 1100000,
      "unrealizedPnl": 100000,
      "positionCount": 2
    },
    {
      "date": "2026-03-15",
      "totalValue": 1750000,
      "totalCostBasis": 1700000,
      "unrealizedPnl": 50000,
      "positionCount": 2
    }
  ]
}
```

Data points are daily snapshots taken at market close (20:30 WAT).

---

### Income Calendar

```
GET /api/v1/portfolio/income-calendar?months=12
Headers:
  Authorization: Bearer {jwt}
```

**Query Parameters:**

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| `months` | No | `12` | Projection window: 1 to 36 months |

**Response:**

```json
{
  "months": 12,
  "events": [
    {
      "date": "2026-04-01",
      "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "symbol": "DTT",
      "assetName": "Douala Tower Token",
      "type": "RENT",
      "estimatedAmount": 6667,
      "units": 250,
      "rate": 8.0,
      "frequencyMonths": 1
    },
    {
      "date": "2026-06-30",
      "assetId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "symbol": "SEN580",
      "assetName": "Senegal Treasury Bond 5.80%",
      "type": "COUPON",
      "estimatedAmount": 14500,
      "units": 50,
      "rate": 5.80,
      "frequencyMonths": 6
    }
  ],
  "totalEstimatedIncome": 94504
}
```

| Field | Type | Description |
|-------|------|-------------|
| `events` | array | Projected income events sorted by date |
| `events[].type` | string | `COUPON` (bonds) or `RENT`, `DIVIDEND`, `HARVEST_YIELD`, `PROFIT_SHARE` |
| `events[].estimatedAmount` | integer | Projected payout in XAF based on current holdings |
| `totalEstimatedIncome` | integer | Sum of all projected events in the window |

---

## 6. Favorites / Watchlist (Authenticated)

### List Favorites

```
GET /api/v1/favorites
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
[
  {
    "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Douala Tower Token",
    "symbol": "DTT",
    "category": "REAL_ESTATE",
    "imageUrl": "https://cdn.example.com/assets/dtt.jpg",
    "currentPrice": 5000,
    "priceChange24h": 2.5,
    "priceChange24hPercent": 0.05,
    "addedAt": "2026-02-10T08:00:00Z"
  }
]
```

---

### Add to Watchlist

```
POST /api/v1/favorites/{assetId}
Headers:
  Authorization: Bearer {jwt}
```

No request body. Idempotent — adding an already-favorited asset returns 200 OK.

**Response (200 OK):**

```json
{
  "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "addedAt": "2026-03-15T14:40:00Z"
}
```

**Error Codes:**

| HTTP | Code | Description |
|------|------|-------------|
| 404 | `ASSET_NOT_FOUND` | Asset does not exist |

---

### Remove from Watchlist

```
DELETE /api/v1/favorites/{assetId}
Headers:
  Authorization: Bearer {jwt}
```

**Response (204 No Content):** Empty body.

---

## 7. Notifications (Authenticated)

### List Notifications

```
GET /api/v1/notifications?page=0&size=20
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
{
  "content": [
    {
      "id": "e5f6a7b8-c9d0-1234-ef01-23456789abcd",
      "eventType": "TRADE_EXECUTED",
      "title": "Order Filled",
      "message": "Your BUY order for 100 DTT has been filled at 5,000 XAF/unit.",
      "data": {
        "orderId": "d4e5f6a7-b8c9-0123-def0-123456789abc",
        "assetId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "symbol": "DTT",
        "side": "BUY",
        "units": 100,
        "executionPrice": 5000
      },
      "read": false,
      "createdAt": "2026-03-15T14:35:06Z"
    },
    {
      "id": "f6a7b8c9-d0e1-2345-f012-3456789abcde",
      "eventType": "COUPON_PAID",
      "title": "Coupon Payment Received",
      "message": "You received 14,500 XAF coupon payment for SEN580.",
      "data": {
        "assetId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
        "symbol": "SEN580",
        "amount": 14500,
        "couponDate": "2026-06-30"
      },
      "read": true,
      "createdAt": "2026-06-30T00:16:00Z"
    }
  ],
  "totalElements": 25,
  "totalPages": 2,
  "number": 0,
  "size": 20
}
```

**Notification Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Notification identifier |
| `eventType` | string | Event type (see table below) |
| `title` | string | Short title for display |
| `message` | string | Human-readable message |
| `data` | object | Structured payload (varies by event type) |
| `read` | boolean | Whether the user has read this notification |
| `createdAt` | string | When the notification was created |

**Event Types:**

| Event Type | Trigger | Data Fields |
|------------|---------|-------------|
| `TRADE_EXECUTED` | Order filled | `orderId`, `assetId`, `symbol`, `side`, `units`, `executionPrice` |
| `COUPON_PAID` | Bond coupon deposited | `assetId`, `symbol`, `amount`, `couponDate` |
| `INCOME_PAID` | Non-bond income deposited | `assetId`, `symbol`, `amount`, `incomeType` |
| `REDEMPTION_COMPLETED` | Bond principal redeemed | `assetId`, `symbol`, `units`, `amount` |
| `ORDER_STUCK` | Order stuck > 30 min | `orderId`, `assetId`, `symbol` |
| `ASSET_STATUS_CHANGED` | Asset status transition | `assetId`, `symbol`, `oldStatus`, `newStatus` |
| `LP_SHORTFALL` | LP cannot cover obligations | `assetId`, `symbol`, `shortfallAmount` |
| `DELISTING_ANNOUNCED` | Asset enters DELISTING | `assetId`, `symbol`, `delistingDate`, `redemptionPrice` |

---

### Unread Count

```
GET /api/v1/notifications/unread-count
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
{
  "unreadCount": 3
}
```

---

### Mark Single as Read

```
POST /api/v1/notifications/{id}/read
Headers:
  Authorization: Bearer {jwt}
```

**Response (200 OK):**

```json
{
  "id": "e5f6a7b8-c9d0-1234-ef01-23456789abcd",
  "read": true
}
```

---

### Mark All as Read

```
POST /api/v1/notifications/read-all
Headers:
  Authorization: Bearer {jwt}
```

**Response (200 OK):**

```json
{
  "markedCount": 3
}
```

---

### Get Notification Preferences

```
GET /api/v1/notifications/preferences
Headers:
  Authorization: Bearer {jwt}
```

**Response:**

```json
{
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

### Update Notification Preferences

```
PUT /api/v1/notifications/preferences
Headers:
  Authorization: Bearer {jwt}
  Content-Type: application/json
```

**Request Body:**

```json
{
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

All fields are optional. Only provided fields are updated.

**Preference Fields:**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `tradeExecuted` | boolean | `true` | Notify when a trade order is filled |
| `couponPaid` | boolean | `true` | Notify when a bond coupon is deposited |
| `incomePaid` | boolean | `true` | Notify when non-bond income is deposited |
| `redemptionCompleted` | boolean | `true` | Notify when bond principal is redeemed |
| `assetStatusChanged` | boolean | `false` | Notify when an asset changes status |
| `orderStuck` | boolean | `true` | Notify when an order is stuck in execution |
| `lpShortfall` | boolean | `true` | Notify when LP may not cover obligations |
| `delistingAnnounced` | boolean | `true` | Notify when an asset you hold is being delisted |

**Response (200 OK):** Returns the full updated preferences object (same shape as GET).

---

## 8. Error Handling

All error responses follow a consistent format:

```json
{
  "error": "INSUFFICIENT_FUNDS",
  "message": "Insufficient XAF balance. Required: 502,500 XAF, available: 300,000 XAF.",
  "timestamp": "2026-03-15T14:35:00Z",
  "path": "/api/v1/trades/quote",
  "details": {
    "required": 502500,
    "available": 300000
  }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `error` | string | Machine-readable error code |
| `message` | string | Human-readable description |
| `timestamp` | string | When the error occurred |
| `path` | string | Request path that caused the error |
| `details` | object | Additional context (varies by error) |

### Error Code Reference

#### 400 Bad Request — Validation Errors

| Code | Description | Details |
|------|-------------|---------|
| `INSUFFICIENT_FUNDS` | XAF balance too low for BUY | `required`, `available` |
| `INSUFFICIENT_INVENTORY` | LP does not have enough units | `requested`, `available` |
| `MIN_ORDER_SIZE_NOT_MET` | Order below minimum units | `minimum`, `requested` |
| `ORDER_SIZE_LIMIT_EXCEEDED` | Order exceeds max units | `maximum`, `requested` |
| `POSITION_LIMIT_EXCEEDED` | Would exceed max % of supply | `maxPercent`, `currentPercent`, `requestedPercent` |
| `DAILY_LIMIT_EXCEEDED` | Would exceed daily XAF limit | `dailyLimit`, `usedToday`, `requested` |
| `AMOUNT_TOO_SMALL` | Amount cannot buy 1 unit | `minimumAmount`, `provided` |
| `LOCKUP_PERIOD_ACTIVE` | Units still in lockup (SELL) | `requestedUnits`, `unlockedUnits`, `nextUnlockDate` |

#### 404 Not Found

| Code | Description |
|------|-------------|
| `ASSET_NOT_FOUND` | Asset UUID does not exist |
| `ORDER_NOT_FOUND` | Order UUID does not exist or does not belong to the authenticated user |

#### 409 Conflict

| Code | Description | Details |
|------|-------------|---------|
| `IDEMPOTENCY_CONFLICT` | Same idempotency key used with different parameters | `existingOrderId` |
| `MAX_QUOTES_EXCEEDED` | User has too many active (unexpired) quotes | `maxQuotes`, `activeQuotes` |

#### 422 Unprocessable Entity

| Code | Description | Details |
|------|-------------|---------|
| `TRADING_HALTED` | Asset trading is halted by admin | — |
| `ASSET_DELISTING` | Asset is in delisting period (BUY blocked) | `delistingDate`, `redemptionPrice` |
| `MARKET_CLOSED` | Market is currently closed | `nextOpenAt`, `nextOpenCountdownSeconds` |
| `SUBSCRIPTION_NOT_STARTED` | BUY attempted before subscription start | `subscriptionStartDate` |
| `SUBSCRIPTION_ENDED` | BUY attempted after subscription end | `subscriptionEndDate` |

#### 429 Too Many Requests

Rate limits apply per authenticated user:

| Limit | Scope | Window |
|-------|-------|--------|
| 10 requests | Trade endpoints (`/trades/*`) | Per minute |
| 100 requests | All authenticated endpoints | Per minute |

Response includes `Retry-After` header with seconds until the limit resets.

```json
{
  "error": "RATE_LIMITED",
  "message": "Too many requests. Please retry after 12 seconds.",
  "retryAfterSeconds": 12
}
```

---

---

# Part 2: Admin API

> The following endpoints are used by the Asset Manager admin panel. They are documented here for reference.

## 1. Set Up the Fee Collection Account

Before any trading can occur, the admin must create a **platform-wide XAF savings account** that collects all trading fees.

The fee collection account is **auto-resolved at startup** by the external ID `PLATFORM-FEE-COLLECT`. The `fineract-config` init creates a "Platform Fee Collector" client (`ASSET-PLATFORM`) and a VSAV savings account with this external ID. No manual env var is needed.

If you need a custom external ID, set `FEE_COLLECTION_ACCOUNT_EXTERNAL_ID` (default: `PLATFORM-FEE-COLLECT`).

This account is shared across all assets. All trading fees (BUY and SELL) are transferred to this account. **Startup fails if the account is not found** — fee collection is mandatory.

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

The API response includes a computed `currentYield` field for bonds: `issuerPrice × interestRate / askPrice`. This is the buyer's effective annual return based on the LP ask price. When askPrice > issuerPrice (LP markup), currentYield < interestRate.

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
  "askPrice": 5500,
  "bidPrice": 5300
}
```

Updates the LP's ask price (required) and optionally the bid price. If `bidPrice` is omitted, it is auto-derived from the ask price using the existing spread ratio.

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

**Editable fields (all states):** name, description, imageUrl, category, tradingFeePercent, lpAskPrice, lpBidPrice, subscriptionStartDate, subscriptionEndDate, capitalOpenedPercent, maxPositionPercent, maxOrderSize, dailyTradeLimitXaf, lockupDays, minOrderSize, minOrderCashAmount, income config, tax config.

**Editable fields (PENDING only):** issuerPrice, totalSupply, issuerName, isinCode, couponFrequencyMonths. These fields are rejected with HTTP 400 if the asset is not in PENDING status. When `totalSupply` is changed, the LP asset account balance is automatically adjusted (minted/burned) to match.

**Immutable fields (cannot be changed after creation):** symbol, currencyCode, decimalPlaces. To change these, delete the PENDING asset and recreate it.

**Example — updating a PENDING asset's issuer price and total supply:**

```
PUT /api/admin/assets/{id}
Body:
{
  "issuerPrice": 6000,
  "totalSupply": 150000
}
```

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

### Queued Order Processing (daily at 08:01 WAT, Mon-Fri)

Processes orders submitted outside market hours:
1. Fetches all `QUEUED` orders in FIFO order (oldest first)
2. For each order, checks if the current price has moved > 5% from the `queuedPrice`
3. Stale orders (price moved too much) are **REJECTED** with reason "Price moved beyond stale threshold"
4. Non-stale orders are promoted to **PENDING** for normal execution

Configuration: `asset-service.queued-orders.stale-price-threshold-percent` (default: `5`)

### Accrued Interest (daily at 00:30 WAT)

Daily interest accrual for bond positions:
1. Finds all ACTIVE bonds with an interest rate set
2. For each bond holder with positive units: `dailyAccrual = units × issuerPrice × (rate / 100) / 365`
3. Adds the daily accrual to the position's `accruedInterest` field
4. On coupon payment, `accruedInterest` is reset to zero

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
| `minOrderSize` | Min units per single order. `null` or `0` = no minimum. |
| `minOrderCashAmount` | Min XAF amount per single order. `null` or `0` = no minimum. |
| `maxPositionPercent` | Max % of totalSupply a single user can hold (e.g. `10.00` = 10%) |
| `maxOrderSize` | Max units in a single BUY or SELL order |
| `dailyTradeLimitXaf` | Max XAF value a user can trade per day for this asset |

### Platform-Wide Limits (application.yml)

| Setting | Description |
|---------|-------------|
| `asset-service.portfolio-exposure-limit-xaf` | Max total portfolio value (XAF) a user can hold across all assets. BUY-only check. `null` = unlimited. |

### Behavior

- **Min Order Size**: On BUY or SELL, `orderUnits >= minOrderSize`. Rejected with `MIN_ORDER_SIZE_NOT_MET`.
- **Min Order Cash Amount**: On BUY or SELL, `orderXafAmount >= minOrderCashAmount`. Rejected with `MIN_ORDER_CASH_NOT_MET`.
- **Max Position %**: On BUY, the system checks `(currentHolding + orderUnits) / totalSupply * 100 <= maxPositionPercent`. Rejected with `POSITION_LIMIT_EXCEEDED`.
- **Max Order Size**: On BUY or SELL, `orderUnits <= maxOrderSize`. Rejected with `ORDER_SIZE_LIMIT_EXCEEDED`.
- **Daily Trade Limit**: On BUY or SELL, `todayVolume + orderXafAmount <= dailyTradeLimitXaf`. Resets at midnight WAT. Rejected with `DAILY_LIMIT_EXCEEDED`.
- **Portfolio Exposure**: On BUY, `portfolioValue + orderXafAmount <= portfolioExposureLimitXaf`. Rejected with `PORTFOLIO_EXPOSURE_EXCEEDED`. Portfolio value is Redis-cached (1-min TTL).

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

## 12. Lock-up Period (Per-Lot)

Prevent early selling after purchase. Each purchase lot has its own lockup expiry.

### Field

| Field | Description |
|-------|-------------|
| `lockupDays` | Number of days after purchase before SELL is allowed. `null` or `0` = no lock-up. |

### Behavior

- Each BUY creates a **PurchaseLot** with `lockupExpiresAt = purchaseDate + lockupDays`
- On SELL, the system checks how many units have expired lockup across all lots
- If requested sell units > unlocked units, rejected with `LOCKUP_PERIOD_ACTIVE`
- Error message includes how many units are currently unlocked
- Legacy positions (without lots) fall back to global `firstPurchaseDate` check
- Lock-up only applies to SELL. BUY is always allowed (subject to other limits).

### LP Capital Adequacy

On SELL, the system verifies the LP's cash account has sufficient balance to pay the seller. If `lpCashBalance < payoutAmount`, the order is rejected with `INSUFFICIENT_LP_FUNDS`.

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
| `QUEUED` | Submitted outside market hours, waiting for market open |
| `EXECUTING` | Inside the distributed lock, executing Fineract batch |
| `FILLED` | Successfully completed |
| `FAILED` | Fineract batch failed or timeout |
| `REJECTED` | Validation failed (insufficient funds, inventory, stale price, etc.) |
| `CANCELLED` | Cancelled by the user before execution |
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

## 16b. LP Performance

Monitor LP profitability across all assets.

```
GET /api/admin/lp/performance
Headers: Authorization: Bearer {jwt} (ASSET_MANAGER role)
```

Response:
```json
{
  "totalSpreadEarned": 500000,
  "totalBuybackPremiumPaid": 50000,
  "totalFeeCommission": 75000,
  "netMargin": 525000,
  "totalTrades": 1250,
  "perAsset": [
    {
      "assetId": "uuid",
      "symbol": "DTT",
      "spreadEarned": 300000,
      "buybackPremiumPaid": 30000,
      "feeCommission": 45000,
      "netMargin": 315000,
      "tradeCount": 750
    }
  ]
}
```

Key metrics:
- **spreadEarned** — cumulative LP spread (askPrice - issuerPrice) × units on all BUY trades
- **buybackPremiumPaid** — cumulative buyback premium on SELL trades
- **feeCommission** — cumulative trading fees
- **netMargin** — `spread + fees - buybackPremium`

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
POST /api/trades/quote
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

---

## 19. Bulk Asset Import via Excel

The Asset Manager UI provides an Excel-based import workflow for creating multiple assets at once.

### Workflow

1. **Export Template** — Click "Export Template" on the Dashboard. This downloads `asset-import-template.xlsx` with:
   - Header row with all column names (mandatory columns marked with `*` and highlighted in red)
   - Example data row (row 2) with realistic sample values
   - Cell comments on each header explaining the field, valid values, and format
   - Dropdown validation for enum fields (category, incomeType, couponFrequencyMonths, boolean fields)

2. **Fill In Data** — Open the template in Excel/Google Sheets. Keep the header row, optionally delete the example row, and add one row per asset. All required fields must be filled.

3. **Import** — Click "Import Assets" on the Dashboard, select the filled .xlsx file. The system will:
   - Parse and validate the file client-side
   - Show a preview of parsed rows with any validation errors highlighted
   - On confirmation, create each asset one-by-one using the standard asset creation endpoint
   - Display per-row results (success or failure with error message)

### Template Columns

| Column | Required | Description |
|--------|----------|-------------|
| name | Yes | Display name (max 200 chars) |
| symbol | Yes | Ticker symbol (max 10 chars, unique) |
| currencyCode | Yes | ISO currency code (max 10 chars, unique) |
| category | Yes | REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO, BONDS |
| issuerPrice | Yes | Face value in XAF |
| totalSupply | Yes | Maximum units |
| decimalPlaces | Yes | Fractional digits (0–8) |
| lpAskPrice | Yes | Investor buy price (XAF) |
| lpBidPrice | Yes | Investor sell price (XAF) |
| subscriptionStartDate | Yes | YYYY-MM-DD |
| subscriptionEndDate | Yes | YYYY-MM-DD |
| lpClientId | Yes | Fineract LP client ID |
| description | No | Long description |
| tradingFeePercent | No | Decimal (e.g. 0.005 = 0.5%) |
| maxPositionPercent | No | Max % of supply per user |
| maxOrderSize / minOrderSize | No | Order unit limits |
| dailyTradeLimitXaf / minOrderCashAmount | No | XAF limits |
| lockupDays | No | Hold period in days |
| issuerName / isinCode | No | Bond identity fields |
| maturityDate / interestRate / couponFrequencyMonths / nextCouponDate | No | Bond fields |
| incomeType / incomeRate / distributionFrequencyMonths / nextDistributionDate | No | Income fields |
| registrationDutyEnabled, registrationDutyRate | No | Registration duty tax config |
| ircmEnabled, ircmRateOverride, ircmExempt | No | IRCM tax config |
| capitalGainsTaxEnabled, capitalGainsRate | No | Capital gains tax config |
| isBvmacListed, isGovernmentBond | No | Special tax treatment flags |

All imported assets are created in **PENDING** status. Use the Activate endpoint to make them available for trading.
