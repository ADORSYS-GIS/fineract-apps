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
      "currentPrice": 5000,
      "change24hPercent": 2.50,
      "totalSupply": 100000,
      "circulatingSupply": 15000,
      "availableSupply": 85000,
      "category": "REAL_ESTATE",
      "status": "ACTIVE"
    }
  ],
  "totalPages": 1
}
```

Query parameters:
- `page` (int, default 0)
- `size` (int, default 20)
- `category` (string, optional): REAL_ESTATE, COMMODITIES, AGRICULTURE, STOCKS, CRYPTO
- `search` (string, optional): search by name or symbol

---

## Flow 2: View Asset Detail

### 2.1 Get Asset Detail

```
GET /api/assets/{assetId}
```

Response includes full detail: name, symbol, description, imageUrl, category, status, currentPrice, OHLC, totalSupply, circulatingSupply, etc.

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

## Flow 3: Buy Asset

**Prerequisites**: User must have a XAF savings account in Fineract with sufficient balance.

### 3.1 Check market is open

```
GET /api/market/status
```

Assert `isOpen == true`.

### 3.2 Execute buy

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
- Calculates total cost: `units × executionPrice + fee`
- Execution price = asset's current price + spread (buy side)
- All transfers are executed atomically via Fineract Batch API

Response:
```json
{
  "orderId": "uuid",
  "status": "FILLED",
  "units": 10,
  "pricePerUnit": 5050,
  "totalAmount": 50750,
  "fee": 250
}
```

- `totalAmount` = cost (units × price) + fee = 50,500 + 250 = 50,750 XAF (actual amount charged)

Error responses:
- `409` - `MARKET_CLOSED`, `TRADING_HALTED`, `INSUFFICIENT_INVENTORY`
- `429` - `TRADE_LOCKED` (another trade in progress, retry after a few seconds)
- `400` - `NO_XAF_ACCOUNT` (user has no active XAF savings account)
- `400` - `TRADING_ERROR` (insufficient balance, validation errors)

---

## Flow 4: Sell Asset

### 4.1 Execute sell

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
- Calculates net proceeds: `units × executionPrice - fee`
- Execution price = asset's current price - spread (sell side)
- All transfers are executed atomically via Fineract Batch API

Response:
```json
{
  "orderId": "uuid",
  "status": "FILLED",
  "units": 5,
  "pricePerUnit": 4950,
  "totalAmount": 24628,
  "fee": 122,
  "realizedPnl": -500
}
```

- `totalAmount` = gross (units × price) - fee = 24,750 - 122 = **24,628 XAF** (net amount credited to user)

Error responses:
- `400` - `NO_POSITION` (user has no holdings for this asset)
- `400` - `INSUFFICIENT_UNITS` (trying to sell more than held)
- `400` - `NO_XAF_ACCOUNT` (user has no active XAF savings account)

---

## Flow 5: View Portfolio

### 5.1 Full Portfolio

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
      "currentPrice": 5500,
      "marketValue": 55000,
      "costBasis": 50000,
      "unrealizedPnl": 5000,
      "unrealizedPnlPercent": 10.0,
      "realizedPnl": 0
    }
  ]
}
```

### 5.2 Single Position

```
GET /api/portfolio/positions/{assetId}
Headers: Authorization: Bearer {jwt}
```

---

## Flow 6: Trade History

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

---

## Flow 7: Favorites / Watchlist

```
POST /api/favorites/{assetId}          → 201 Created
DELETE /api/favorites/{assetId}        → 204 No Content
GET /api/favorites                     → Array of FavoriteResponse
Headers: Authorization: Bearer {jwt}
```

---

## Flow 8: Discover Upcoming Assets

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
      "expectedLaunchDate": "2026-03-15",
      "daysUntilLaunch": 36
    }
  ]
}
```
