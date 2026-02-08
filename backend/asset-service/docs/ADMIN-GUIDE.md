# Admin Guide - Asset Manager

This guide covers all admin operations for managing the asset marketplace.

## 1. Create a New Asset

Creating an asset is a multi-step process that provisions resources in Fineract.

### Prerequisites
- A **company client** must exist in Fineract (legalForm = ENTITY)
- The company must have an **active XAF savings account** (used as the treasury cash account)

### API Call

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
  "annualYield": 8.5,
  "tradingFeePercent": 0.50,
  "spreadPercent": 1.00,
  "totalSupply": 100000,
  "decimalPlaces": 0,
  "treasuryClientId": 42,
  "treasuryCashAccountId": 123,
  "expectedLaunchDate": "2026-03-15"
}
```

### What Happens on Create

1. Registers `DTT` as a custom currency in Fineract (`PUT /currencies`)
2. Creates a savings product for DTT with cash-based accounting (GL 47 → GL 65)
3. Creates a treasury savings account for the company client
4. Approves and activates the treasury account
5. Deposits 100,000 DTT units into treasury
6. Persists the asset in PENDING status
7. Initializes price data at 5,000 XAF

The asset starts in **PENDING** status and must be explicitly activated.

---

## 2. Activate an Asset

```
POST /api/admin/assets/{id}/activate
```

Transitions the asset from PENDING to ACTIVE. Trading becomes possible once the order book is set up.

---

## 3. Set Up the Order Book

Before users can trade, the admin must place **market maker orders** (standing buy/sell orders at various price levels).

### Place a Sell Order (Ask)

```
POST /api/admin/orderbook/{assetId}/orders
Body:
{
  "side": "SELL",
  "price": 5000,
  "quantity": 10000
}
```

This makes 10,000 units available for purchase at 5,000 XAF each.

### Place a Buy Order (Bid)

```
POST /api/admin/orderbook/{assetId}/orders
Body:
{
  "side": "BUY",
  "price": 4900,
  "quantity": 5000
}
```

This creates a standing offer to buy back units at 4,900 XAF.

### Typical Setup

Create multiple price levels to form a proper order book:

| Side | Price | Quantity | Purpose |
|------|-------|----------|---------|
| SELL | 5000 | 10000 | Primary ask |
| SELL | 5100 | 5000 | Higher price tier |
| SELL | 5200 | 2000 | Premium tier |
| BUY | 4900 | 5000 | Primary bid |
| BUY | 4800 | 3000 | Lower bid |
| BUY | 4500 | 2000 | Floor bid |

### Update an Order

```
PUT /api/admin/orderbook/{assetId}/orders/{orderId}
Body: { "side": "SELL", "price": 5050, "quantity": 8000 }
```

### Delete an Order

```
DELETE /api/admin/orderbook/{assetId}/orders/{orderId}
```

### List All Orders

```
GET /api/admin/orderbook/{assetId}/orders
```

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

## 6. Monitor Inventory

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

## 7. Update Asset Metadata

```
PUT /api/admin/assets/{id}
Body:
{
  "name": "Updated Name",
  "description": "New description",
  "imageUrl": "https://new-image.jpg",
  "category": "REAL_ESTATE",
  "annualYield": 9.0,
  "tradingFeePercent": 0.75,
  "spreadPercent": 1.50
}
```

All fields are optional. Only provided fields are updated.
