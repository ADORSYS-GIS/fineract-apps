# Accounting Guide - GL Account Mappings

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

User buys 10 DTT at 5,000 XAF each (total 50,000 XAF, fee 250 XAF):

**Cash leg** (XAF transfer: user -> treasury):

| Account | Debit | Credit |
|---------|-------|--------|
| User XAF Savings | | 50,000 XAF |
| Treasury XAF Savings | 50,000 XAF | |

**Asset leg** (DTT transfer: treasury -> user):

| Account | Debit | Credit |
|---------|-------|--------|
| GL 65 - Customer Digital Asset Holdings | 10 DTT | |
| GL 47 - Digital Asset Inventory | | 10 DTT |

**Fee** (charged on the XAF amount):

| Account | Debit | Credit |
|---------|-------|--------|
| User XAF Savings | | 250 XAF |
| GL 87 - Asset Trading Fee Income | | 250 XAF |

### 3. Customer Sell Trade

User sells 5 DTT at 4,900 XAF each (total 24,500 XAF, fee 122 XAF):

**Asset leg** (DTT transfer: user -> treasury):

| Account | Debit | Credit |
|---------|-------|--------|
| GL 47 - Digital Asset Inventory | 5 DTT | |
| GL 65 - Customer Digital Asset Holdings | | 5 DTT |

**Cash leg** (XAF transfer: treasury -> user):

| Account | Debit | Credit |
|---------|-------|--------|
| Treasury XAF Savings | | 24,500 XAF |
| User XAF Savings | 24,500 XAF | |

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
