# Accounting Guide - Asset Service

## Glossary

| Term | Definition |
|------|------------|
| **Issuer** | The company (Fineract Client with `legalForm = ENTITY`) that tokenizes a real-world asset and offers it for trading. Acts as the counterparty for all buy/sell trades. |
| **Treasury** | The issuer's reserve accounts. In corporate finance, "treasury stock" refers to a company's own shares held in reserve, not in public circulation. Here, the treasury holds both unsold token inventory and the XAF cash used for trade settlements. |
| **Treasury XAF Account** | The issuer's existing XAF savings account in Fineract. Receives cash when customers buy tokens, pays out cash when customers sell. Must exist before asset creation. Maps to `treasuryCashAccountId` in the code. |
| **Treasury Asset Account** | A savings account in the asset's custom currency, created automatically during asset provisioning. Holds the full token supply initially; units move to customers on buy, return on sell. Maps to `treasuryAssetAccountId` in the code. |
| **DTT** | "Douala Tower Token" — a fictional asset symbol used as an example throughout this doc. In practice, each asset gets its own symbol (e.g., `YMT` for "Yaounde Mall Token"). The symbol is registered as a custom currency in Fineract. |
| **Spread** | The percentage markup/markdown applied to the base price. Buyers pay `price + spread`, sellers receive `price - spread`. This is the issuer's margin on each trade, separate from the trading fee. |

## Account Structure

Each asset involves **four savings accounts** — two on the issuer side, two on the customer side:

```
Per Asset (e.g., DTT - Douala Tower Token):

┌─────────────────────────────────────────────────────┐
│ ISSUER (Company Client in Fineract)                 │
│                                                     │
│  ┌────────────────────────┐  ┌────────────────────┐ │
│  │ Treasury XAF Account   │  │ Treasury DTT       │ │
│  │ (pre-existing)         │  │ Account            │ │
│  │                        │  │ (auto-created)     │ │
│  │ Receives cash on BUY   │  │ Holds 100K DTT     │ │
│  │ Pays cash on SELL      │  │ initially          │ │
│  └───────────┬────────────┘  └──────────┬─────────┘ │
└──────────────┼──────────────────────────┼───────────┘
               │ XAF                      │ DTT tokens
               ▼                          ▼
┌─────────────────────────────────────────────────────┐
│ CUSTOMER (Individual Client in Fineract)            │
│                                                     │
│  ┌────────────────────────┐  ┌────────────────────┐ │
│  │ User XAF Account       │  │ User DTT Account   │ │
│  │ (pre-existing)         │  │ (auto-created on   │ │
│  │                        │  │  first buy)        │ │
│  │ Pays cash on BUY       │  │ Receives tokens    │ │
│  │ Receives cash on SELL  │  │ on BUY             │ │
│  └────────────────────────┘  └────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

## Settlement Flow

Each trade has **two legs** executed atomically with compensating transactions on failure:

- **BUY**: (1) Cash leg — Customer XAF &rarr; Issuer XAF, then (2) Asset leg — Issuer DTT &rarr; Customer DTT. If the asset leg fails, the cash leg is automatically reversed.
- **SELL**: (1) Asset leg — Customer DTT &rarr; Issuer DTT, then (2) Cash leg — Issuer XAF &rarr; Customer XAF. If the cash leg fails, the asset leg is automatically reversed.

---

## GL Accounts

| GL Code | Name | Type | Purpose |
|---------|------|------|---------|
| 47 | Digital Asset Inventory | Asset | Bank's vault holding of all digital asset units |
| 48 | Asset Transfer Suspense | Asset | Clearing account for in-flight transfers |
| 65 | Customer Digital Asset Holdings | Liability | Obligation to customers who hold asset units |
| 73 | Company Asset Capital | Equity | Origin of minted asset units |
| 87 | Asset Trading Fee Income | Income | Revenue from trading fees/spreads |

## Savings Product Accounting Mapping

Each asset's savings product is configured with **Cash-based accounting** (rule = 2):

| Mapping | GL Account |
|---------|------------|
| Savings Reference | GL 47 (Digital Asset Inventory) |
| Savings Control | GL 65 (Customer Digital Asset Holdings) |

## Journal Entry Examples

### 1. Asset Issuance (Treasury Deposit)

When the admin creates an asset and deposits 100,000 units into treasury:

| Account | Debit | Credit |
|---------|-------|--------|
| GL 47 - Digital Asset Inventory | 100,000 units | |
| GL 73 - Company Asset Capital | | 100,000 units |

### 2. Customer Buy Trade

User buys 10 DTT at 5,000 XAF/unit with 0.5% fee:

- Cost = 10 × 5,000 = **50,000 XAF**
- Fee = 50,000 × 0.5% = **250 XAF**
- Total charged = 50,000 + 250 = **50,250 XAF**

**Cash leg** (XAF transfer: user -> treasury, cost + fee):

| Account | Debit | Credit |
|---------|-------|--------|
| User XAF Savings | | 50,250 XAF |
| Treasury XAF Savings | 50,250 XAF | |

**Asset leg** (DTT transfer: treasury -> user):

| Account | Debit | Credit |
|---------|-------|--------|
| GL 65 - Customer Digital Asset Holdings | 10 DTT | |
| GL 47 - Digital Asset Inventory | | 10 DTT |

**Fee journal entry** (reclassifies fee from cash to fee income):

| Account | Debit | Credit |
|---------|-------|--------|
| Cash GL (XAF savings product reference) | 250 XAF | |
| GL 87 - Asset Trading Fee Income | | 250 XAF |

### 3. Customer Sell Trade

User sells 5 DTT at 4,900 XAF/unit with 0.5% fee:

- Gross amount = 5 × 4,900 = **24,500 XAF**
- Fee = 24,500 × 0.5% = **122 XAF**
- Net payout = 24,500 - 122 = **24,378 XAF**
- Fee (122 XAF) is retained in treasury

**Asset leg** (DTT transfer: user -> treasury):

| Account | Debit | Credit |
|---------|-------|--------|
| GL 47 - Digital Asset Inventory | 5 DTT | |
| GL 65 - Customer Digital Asset Holdings | | 5 DTT |

**Cash leg** (XAF transfer: treasury -> user, net of fee):

| Account | Debit | Credit |
|---------|-------|--------|
| Treasury XAF Savings | | 24,378 XAF |
| User XAF Savings | 24,378 XAF | |

**Fee journal entry** (reclassifies fee from cash to fee income):

| Account | Debit | Credit |
|---------|-------|--------|
| Cash GL (XAF savings product reference) | 122 XAF | |
| GL 87 - Asset Trading Fee Income | | 122 XAF |

## Payment Types

| Name | Position | Description |
|------|----------|-------------|
| Asset Purchase | 20 | Internal transfer for digital asset buy |
| Asset Sale | 21 | Internal transfer for digital asset sell-back |
| Asset Issuance | 22 | Initial treasury deposit of asset units |

## Charges

| Name | Applies To | Type | Amount |
|------|-----------|------|--------|
| Asset Trading Fee | Savings | Percentage of Amount | 0.50% |

## Reconciliation

To verify asset accounting is correct:

1. **GL 47 balance** should equal the sum of all treasury savings account balances across all asset currencies
2. **GL 65 balance** should equal the sum of all customer savings account balances across all asset currencies
3. **GL 47 + GL 65** should equal the total supply of all assets (units minted via GL 73)
4. **GL 87 balance** should match the sum of all `fee` values in the `trade_log` table
