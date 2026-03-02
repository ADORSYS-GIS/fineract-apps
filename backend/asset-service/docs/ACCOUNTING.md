# Accounting Guide - Asset Service

## Glossary

| Term | Definition |
|------|------------|
| **Issuer** | The original entity (e.g., government, corporation) that creates a real-world asset such as a bond or equity. The issuer sets the face value (issuer price) and contractual terms (interest rate, maturity). The issuer does **not** sell directly on the platform. |
| **Liquidity Partner (LP)** | A reseller who purchases assets from the issuer off-platform and sells them to investors on the platform at a markup. The LP is the counterparty for all buy/sell trades. Each asset is managed by one LP, represented as a Fineract Client with `legalForm = ENTITY`. |
| **Issuer Price** | The wholesale price at which the LP acquired the asset from the issuer. For bonds, this equals the face value. Coupon and income calculations are always based on the issuer price, not the LP's selling price. Immutable after asset creation. |
| **LP Ask Price** | The price at which the LP sells to investors (BUY side). Always >= issuer price. The difference (`askPrice - issuerPrice`) is the LP's margin on each unit sold. |
| **LP Bid Price** | The price at which the LP buys back from investors (SELL side). Always <= ask price. |
| **LP Margin** | The LP's profit per unit: `askPrice - issuerPrice` on BUY, `issuerPrice - bidPrice` on SELL. Swept to the LP's dedicated spread account on each trade. |
| **LP Cash Account** | The LP's existing XAF savings account in Fineract. Receives the issuer-price portion of each BUY payment, pays out proceeds on SELL. Must exist before asset creation. Maps to `lpCashAccountId` in the code. |
| **LP Asset Account** | A savings account in the asset's custom currency, created automatically during provisioning. Holds the full token supply initially; units move to investors on BUY, return on SELL. Maps to `lpAssetAccountId` in the code. |
| **LP Spread Account** | A per-asset XAF savings account created automatically during provisioning. Collects the LP's margin (spread) on every trade. Maps to `lpSpreadAccountId` in the code. |
| **Fee Collection Account** | A platform-wide XAF savings account that collects all trading fees. Separate from any LP's accounts. Created once by the admin and configured via `FEE_COLLECTION_ACCOUNT_ID`. |
| **DTT** | "Douala Tower Token" — a fictional asset symbol used as an example throughout this doc. In practice, each asset gets its own symbol (e.g., `YMT` for "Yaounde Mall Token"). The symbol is registered as a custom currency in Fineract. |

## Account Structure

Each asset involves **five savings accounts** — three on the LP side, two on the investor side — plus a **platform-wide fee collection account**:

```
Per Asset (e.g., DTT - Douala Tower Token):

┌─────────────────────────────────────────────────────────────┐
│ LIQUIDITY PARTNER (Company Client in Fineract)              │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────┐ │
│  │ LP Cash Account   │  │ LP Asset Account │  │ LP Spread │ │
│  │ (pre-existing)    │  │ (auto-created)   │  │ Account   │ │
│  │                   │  │                  │  │ (auto-    │ │
│  │ Receives issuer-  │  │ Holds 100K DTT   │  │ created)  │ │
│  │ price portion     │  │ initially        │  │           │ │
│  │ on BUY            │  │                  │  │ Collects  │ │
│  │ Pays out on SELL  │  │                  │  │ LP margin │ │
│  └────────┬──────────┘  └────────┬─────────┘  └─────┬─────┘ │
└───────────┼──────────────────────┼───────────────────┼───────┘
            │ XAF                  │ DTT tokens        │ XAF
            ▼                      ▼                    ▲
┌─────────────────────────────────────────────────────────────┐
│ INVESTOR (Individual Client in Fineract)                    │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │ User XAF Account     │  │ User DTT Account             │ │
│  │ (pre-existing)       │  │ (auto-created on first buy)  │ │
│  │                      │  │                              │ │
│  │ Pays ask price + fee │  │ Receives tokens on BUY       │ │
│  │ on BUY               │  │                              │ │
│  │ Receives bid price   │  │                              │ │
│  │ - fee on SELL        │  │                              │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

Platform-wide (shared across all assets):

┌─────────────────────────────────────────────────────────────┐
│ FEE COLLECTION ACCOUNT (XAF savings)                        │
│                                                             │
│  Receives trading fees from every BUY and SELL.             │
│  Configured via FEE_COLLECTION_ACCOUNT_ID env var.          │
└─────────────────────────────────────────────────────────────┘
```

## LP Cash Hub Model

LP Cash is the **routing hub** for all money flows. Every XAF amount passes through LP Cash, then gets distributed internally to LP Spread and Fee Collection. This design ensures:

1. **Investor sees at most 1 XAF transaction per trade** — fee is bundled, spread is invisible
2. **LP Cash net change = ±(issuerPrice × units)** — predictable, auditable
3. **LP Spread balance = net LP profit** — directly visible, no computation needed

## What Happens When an Investor Buys

This section walks through every step that occurs when an investor taps "Buy" in the app.

### Overview

The investor pays the LP's **ask price** per unit plus the trading fee, all in a **single XAF transfer** to LP Cash. LP Cash then distributes internally:
1. **LP margin** → LP Spread account (LP's profit per unit)
2. **Trading fee** → Fee Collection account (platform revenue)
3. The remainder (**issuer-price × units**) stays in LP Cash

### Detailed Example

**Setup:** DTT (Douala Tower Token), a real estate token.
- Issuer price: **4,000 XAF** (what the LP paid the issuer per unit)
- LP ask price: **5,000 XAF** (what the investor pays per unit)
- LP bid price: **4,800 XAF** (what the investor would receive if selling)
- Trading fee: **0.5%**

**Investor wants to buy 10 DTT.**

#### Step 1: Trade Preview

The app calls `POST /api/trades/preview` to show the investor what they'll pay:

```
Units:              10
Execution Price:    5,000 XAF/unit (LP ask price)
Gross Amount:       10 × 5,000 = 50,000 XAF
Trading Fee:        50,000 × 0.5% = 250 XAF
Total Charged:      50,000 + 250 = 50,250 XAF
LP Margin/unit:     5,000 - 4,000 = 1,000 XAF
```

The investor sees: "Buy 10 DTT for 50,250 XAF (incl. 250 XAF fee)."

#### Step 2: Trade Execution

The investor confirms. The backend acquires a Redis lock for this user-asset pair, then builds an atomic Fineract Batch API request with **four transfers**:

| # | Transfer | From | To | Amount | Investor visible? |
|---|----------|------|----|--------|-------------------|
| 1 | Cash leg | Investor XAF | LP Cash | 50,250 XAF | YES (single XAF debit) |
| 2 | Asset leg | LP Asset Account | Investor DTT | 10 DTT | YES (asset credit) |
| 3 | Spread sweep | LP Cash | LP Spread | 10,000 XAF | NO (internal) |
| 4 | Fee sweep | LP Cash | Fee Collection | 250 XAF | NO (internal) |

**LP Cash net:** +50,250 - 10,000 - 250 = **+40,000 XAF** = issuerPrice × units

All four transfers execute atomically — if any fails, all are reversed.

#### Step 3: Post-Trade Updates

After the Fineract batch succeeds:
1. The investor's `UserPosition` is created/updated: +10 units, average purchase price updated
2. The asset's `circulatingSupply` increases by 10
3. The asset's `availableSupply` decreases by 10
4. The trade is logged in `trade_log` and `orders` tables
5. A `TRADE_EXECUTED` notification is sent to the investor
6. If the asset uses AUTO pricing, the price may adjust based on the trade

#### Step 4: What the Investor Sees

The investor's portfolio now shows:
- **10 DTT** at average cost of **5,025 XAF/unit** (including fee amortization)
- Current value: 10 × 5,000 = 50,000 XAF
- The investor sees the **LP name** (who they bought from) and the **issuer name** (the original asset creator)
- The investor sees **one XAF debit** of 50,250 XAF in their transaction history

### Key Insight: Dual Pricing

The investor interacts only with LP prices (bid/ask). But benefit calculations (coupons, income distributions) use the **issuer price** because that's the contractual face value. This means:

- **Coupon per period** = units × issuerPrice × (rate/100) × (months/12)
  - Example: 10 × 4,000 × (5.80/100) × (6/12) = **1,160 XAF**
- The investor paid 5,000/unit but earns coupons on 4,000/unit — the LP markup doesn't inflate their yield

---

## What Happens When an Investor Sells

### Case 1: Bid ≤ Issuer Price (Normal)

The LP buys back below or at the issuer price — the LP profits from the bid-ask spread.

**Same setup as above. The investor sells 5 DTT.**

- LP bid price: **4,800 XAF/unit** (what the LP pays to buy back)
- Trading fee: **0.5%**

**Breakdown:**
- Gross amount: 5 × 4,800 = **24,000 XAF**
- Fee: 24,000 × 0.5% = **120 XAF**
- Net payout to investor: 24,000 - 120 = **23,880 XAF**
- LP spread earned: 5 × (4,000 - 4,800) → `issuerPrice - bidPrice = -800` which is negative, so this is actually: 5 × (4,000 - 4,800). Wait, bid=4,800 < issuer=4,000? No — bid=4,800 > issuer=4,000, so this is the "bid > issuer" case. Let me use a different example.

Let me use bid = **3,500 XAF/unit** for the normal case:

- Gross amount: 5 × 3,500 = **17,500 XAF**
- Fee: 17,500 × 0.5% = **88 XAF**
- Net payout to investor: 17,500 - 88 = **17,412 XAF**
- LP margin: 5 × (4,000 - 3,500) = **2,500 XAF**

#### Transfers

| # | Transfer | From | To | Amount | Investor visible? |
|---|----------|------|----|--------|-------------------|
| 1 | Asset return | Investor DTT | LP Asset Account | 5 DTT | YES (asset debit) |
| 2 | Cash credit | LP Cash | Investor XAF | 17,412 XAF | YES (single XAF credit) |
| 3 | Fee sweep | LP Cash | Fee Collection | 88 XAF | NO (internal) |
| 4 | Spread sweep | LP Cash | LP Spread | 2,500 XAF | NO (internal) |

**LP Cash net:** -17,412 - 88 - 2,500 = **-20,000 XAF** = -(issuerPrice × units)

### Case 2: Bid > Issuer Price (Buyback Premium)

When the LP's bid price exceeds the issuer price, the LP pays a **premium** to buy back. This premium is funded from the LP Spread account (which accumulated margin from earlier BUY trades).

**Example:** The investor sells 5 DTT when bid = **4,800 XAF/unit**, issuer = **4,000 XAF/unit**.

- Gross amount: 5 × 4,800 = **24,000 XAF**
- Fee: 24,000 × 0.5% = **120 XAF**
- Net payout to investor: 24,000 - 120 = **23,880 XAF**
- Buyback premium: 5 × (4,800 - 4,000) = **4,000 XAF** (funded from LP Spread)
- LP spread earned: **0 XAF** (bid > issuer, no spread this direction)

#### Transfers

| # | Transfer | From | To | Amount | Investor visible? |
|---|----------|------|----|--------|-------------------|
| 1 | Asset return | Investor DTT | LP Asset Account | 5 DTT | YES (asset debit) |
| 2 | Premium funding | LP Spread | LP Cash | 4,000 XAF | NO (internal) |
| 3 | Cash credit | LP Cash | Investor XAF | 23,880 XAF | YES (single XAF credit) |
| 4 | Fee sweep | LP Cash | Fee Collection | 120 XAF | NO (internal) |

**LP Cash net:** +4,000 - 23,880 - 120 = **-20,000 XAF** = -(issuerPrice × units)
**LP Spread net:** -4,000 XAF (reduces accumulated margin)

### Round-Trip Example

An investor buys 10 DTT at ask=5,000 and later sells all 10 at bid=4,800 (issuer=4,000):

| | LP Cash | LP Spread | Fee Collection |
|---|---------|-----------|----------------|
| BUY 10 at 5,000 | +40,000 | +10,000 | +250 |
| SELL 10 at 4,800 | -40,000 | -8,000 | +120 |
| **Net** | **0** | **+2,000** | **+370** |

LP Spread balance = **+2,000 XAF** = net LP profit from bid-ask spread.

---

## Settlement Flow Summary

All trades use the **LP Cash hub model** — money flows through LP Cash, then gets distributed internally. The investor sees at most **1 XAF transaction** per trade (fee bundled, spread invisible).

### BUY (3-4 legs)

1. Investor XAF → LP Cash: `grossAmount + fee` (single investor debit)
2. LP Asset → Investor Asset: `units` (token delivery)
3. LP Cash → LP Spread: `spreadAmount` (internal, if > 0)
4. LP Cash → Fee Collection: `fee` (internal, if > 0)

### SELL, bid ≤ issuer (3-4 legs)

1. Investor Asset → LP Asset: `units` (token return)
2. LP Cash → Investor XAF: `grossAmount - fee` (single investor credit)
3. LP Cash → Fee Collection: `fee` (internal, if > 0)
4. LP Cash → LP Spread: `spreadAmount` (internal, if > 0)

### SELL, bid > issuer (3-4 legs)

1. Investor Asset → LP Asset: `units` (token return)
2. LP Spread → LP Cash: `buybackPremium` (internal, funds the premium)
3. LP Cash → Investor XAF: `grossAmount - fee` (single investor credit)
4. LP Cash → Fee Collection: `fee` (internal, if > 0)

All legs execute atomically via the Fineract Batch API — if any fails, all are reversed.

### Order Record Fields (always positive)

| Field | BUY (ask=5000, issuer=4000) | SELL (bid=3500) | SELL (bid=4800) |
|-------|---------------------------|-----------------|-----------------|
| `spreadAmount` | 10,000 | 2,500 | 0 |
| `buybackPremium` | 0 | 0 | 4,000 |

Period margin report: `net margin = SUM(spreadAmount) - SUM(buybackPremium)`

---

## GL Accounts

| GL Code | Name | Type | Purpose |
|---------|------|------|---------|
| 47 | Digital Asset Inventory | Asset | Bank's vault holding of all digital asset units |
| 48 | Asset Transfer Suspense | Asset | Clearing account for in-flight transfers |
| 65 | Customer Digital Asset Holdings | Liability | Obligation to customers who hold asset units |
| 73 | Company Asset Capital | Equity | Origin of minted asset units |
| 87 | Asset Trading Fee Income | Income | Revenue from trading fees |

## Savings Product Accounting Mapping

Each asset's savings product is configured with **Cash-based accounting** (rule = 2):

| Mapping | GL Account |
|---------|------------|
| Savings Reference | GL 47 (Digital Asset Inventory) |
| Savings Control | GL 65 (Customer Digital Asset Holdings) |

## Journal Entry Examples

### 1. Asset Issuance (LP Inventory Deposit)

When the admin creates an asset and deposits 100,000 units into the LP's asset account:

| Account | Debit | Credit |
|---------|-------|--------|
| GL 47 - Digital Asset Inventory | 100,000 units | |
| GL 73 - Company Asset Capital | | 100,000 units |

### 2. Investor Buy Trade

Investor buys 10 DTT. LP ask price = 5,000 XAF, issuer price = 4,000 XAF, fee = 0.5%:

- Gross amount = 10 × 5,000 = **50,000 XAF**
- LP margin = 10 × (5,000 - 4,000) = **10,000 XAF**
- Fee = 50,000 × 0.5% = **250 XAF**
- Total charged from investor = 50,000 + 250 = **50,250 XAF** (single debit)

Four Fineract account transfers (LP Cash hub):

| Transfer | From | To | Amount |
|----------|------|----|--------|
| Cash leg | Investor XAF | LP Cash | 50,250 XAF |
| Asset leg | LP Asset (DTT) | Investor DTT | 10 DTT |
| Spread sweep | LP Cash | LP Spread | 10,000 XAF |
| Fee sweep | LP Cash | Fee Collection | 250 XAF |

**LP Cash net:** +50,250 - 10,000 - 250 = +40,000 XAF = issuerPrice × units

**GL impact (asset leg):**

| Account | Debit | Credit |
|---------|-------|--------|
| GL 65 - Customer Digital Asset Holdings | 10 DTT | |
| GL 47 - Digital Asset Inventory | | 10 DTT |

### 3. Investor Sell Trade (bid ≤ issuer)

Investor sells 5 DTT. LP bid price = 3,500 XAF, issuer price = 4,000 XAF, fee = 0.5%:

- Gross amount = 5 × 3,500 = **17,500 XAF**
- Fee = 17,500 × 0.5% = **88 XAF**
- Net payout to investor = 17,500 - 88 = **17,412 XAF** (single credit)
- LP margin = 5 × (4,000 - 3,500) = **2,500 XAF**

Fineract account transfers (LP Cash hub):

| Transfer | From | To | Amount |
|----------|------|----|--------|
| Asset leg | Investor DTT | LP Asset (DTT) | 5 DTT |
| Cash leg | LP Cash | Investor XAF | 17,412 XAF |
| Fee sweep | LP Cash | Fee Collection | 88 XAF |
| Spread sweep | LP Cash | LP Spread | 2,500 XAF |

**LP Cash net:** -17,412 - 88 - 2,500 = -20,000 XAF = -(issuerPrice × units)

**GL impact (asset leg):**

| Account | Debit | Credit |
|---------|-------|--------|
| GL 47 - Digital Asset Inventory | 5 DTT | |
| GL 65 - Customer Digital Asset Holdings | | 5 DTT |

### 4. Coupon Payment (Bond Interest)

When the InterestPaymentScheduler runs and a bond's coupon date is due, each holder receives a payment calculated from the **issuer price** (face value), not the LP's selling price:

- Formula: `units × issuerPrice × (annualRate / 100) × (periodMonths / 12)`
- Example: Investor holds 100 units of a bond. Issuer price = 10,000 XAF, 5.80% annual rate, semi-annual (6 months):
  - Coupon = 100 × 10,000 × (5.80 / 100) × (6 / 12) = **29,000 XAF**

Single Fineract account transfer:

| Transfer | From | To | Amount |
|----------|------|----|--------|
| Coupon payment | LP Cash | Investor XAF | 29,000 XAF |

No fee is charged on coupon payments. This is a savings-to-savings XAF transfer with no GL impact on the asset side (only XAF accounts are affected).

Each payment is recorded in the `interest_payments` table with status SUCCESS or FAILED. Failed payments (e.g. LP insufficient cash) do not block other holders.

### 5. Income Distribution (Non-Bond Assets)

For non-bond assets (REAL_ESTATE, AGRICULTURE, etc.) with income configured, periodic income is paid based on the **issuer price**:

- Formula: `units × issuerPrice × (incomeRate / 100) × (frequencyMonths / 12)`
- Example: Investor holds 50 units. Issuer price = 4,000 XAF, income rate = 8%, monthly:
  - Income = 50 × 4,000 × (8 / 100) × (1 / 12) = **1,333 XAF**

Single Fineract account transfer:

| Transfer | From | To | Amount |
|----------|------|----|--------|
| Income payment | LP Cash | Investor XAF | 1,333 XAF |

## Payment Types

| Name | Position | Description |
|------|----------|-------------|
| Asset Purchase | 20 | Internal transfer for digital asset buy |
| Asset Sale | 21 | Internal transfer for digital asset sell-back |
| Asset Issuance | 22 | Initial LP inventory deposit of asset units |

## Charges

| Name | Applies To | Type | Amount |
|------|-----------|------|--------|
| Asset Trading Fee | Savings | Percentage of Amount | 0.50% |

## Settlement Currency

All monetary amounts in the system (trade costs, fees, coupon payments) use the configured settlement currency. This defaults to **XAF** (West African CFA franc) but is configurable via the `SETTLEMENT_CURRENCY` environment variable. All references to "XAF" in this document apply to whatever settlement currency is configured.

## Reconciliation

To verify asset accounting is correct:

1. **GL 47 balance** should equal the sum of all LP asset savings account balances across all asset currencies
2. **GL 65 balance** should equal the sum of all investor savings account balances across all asset currencies
3. **GL 47 + GL 65** should equal the total supply of all assets (units minted via GL 73)
4. **Fee collection account balance** should match the sum of all `fee` values in both `orders` and `trade_log_archive` tables
5. **LP Spread account balance** per asset should equal `SUM(spreadAmount) - SUM(buybackPremium)` across all orders for that asset
6. **LP Cash account balance** per asset should reflect `SUM(issuerPrice × units)` for BUY minus `SUM(issuerPrice × units)` for SELL, adjusted for coupon/income payouts
