# Asset Manager — Admin Guide

> For API-level details (endpoints, request/response formats), see [ADMIN-GUIDE.md](./ADMIN-GUIDE.md).

## Table of Contents

- [1. Getting Started](#1-getting-started)
  - [1.1 Logging In](#11-logging-in)
  - [1.2 Navigation](#12-navigation)
  - [1.3 Prerequisites](#13-prerequisites)
- [2. Dashboard](#2-dashboard)
  - [2.1 Market Status](#21-market-status)
  - [2.2 Summary Cards](#22-summary-cards)
  - [2.3 Asset Catalog Table](#23-asset-catalog-table)
  - [2.4 Quick Actions](#24-quick-actions)
- [3. Creating a New Asset](#3-creating-a-new-asset)
  - [Step 1: Select Liquidity Partner](#step-1-select-liquidity-partner)
  - [Step 2: Asset Details](#step-2-asset-details)
  - [Step 3: Bond Details (Bonds Only)](#step-3-bond-details-bonds-only)
  - [Step 4: Pricing & Fees](#step-4-pricing--fees)
  - [Step 5: Supply & Precision](#step-5-supply--precision)
  - [Step 6: Income Distribution (Non-Bond Assets)](#step-6-income-distribution-non-bond-assets)
  - [Step 7: Tax Configuration](#step-7-tax-configuration)
  - [Step 8: Review & Create](#step-8-review--create)
- [4. Managing an Asset](#4-managing-an-asset)
  - [4.1 Opening Asset Details](#41-opening-asset-details)
  - [4.2 Available Actions by Status](#42-available-actions-by-status)
  - [4.3 Activating an Asset](#43-activating-an-asset)
  - [4.4 Halting Trading](#44-halting-trading)
  - [4.5 Resuming Trading](#45-resuming-trading)
  - [4.6 Editing Asset Metadata](#46-editing-asset-metadata)
  - [4.7 Minting Additional Supply](#47-minting-additional-supply)
  - [4.8 Delisting an Asset](#48-delisting-an-asset)
  - [4.9 Cancelling a Delisting](#49-cancelling-a-delisting)
  - [4.10 Redeeming a Bond](#410-redeeming-a-bond)
  - [4.11 Deleting a Pending Asset](#411-deleting-a-pending-asset)
  - [4.12 Information Cards](#412-information-cards)
- [5. Pricing Management](#5-pricing-management)
  - [5.1 Opening the Pricing Page](#51-opening-the-pricing-page)
  - [5.2 Current Prices](#52-current-prices)
  - [5.3 Setting a New Price](#53-setting-a-new-price)
  - [5.4 Price History](#54-price-history)
- [6. Inventory](#6-inventory)
  - [6.1 Overview](#61-overview)
  - [6.2 Inventory Table](#62-inventory-table)
  - [6.3 CSV Export](#63-csv-export)
- [7. Scheduled Payments](#7-scheduled-payments)
  - [7.1 Summary Cards](#71-summary-cards)
  - [7.2 Filters](#72-filters)
  - [7.3 Payments Table](#73-payments-table)
  - [7.4 Payment Detail Panel](#74-payment-detail-panel)
  - [7.5 Confirming a Payment](#75-confirming-a-payment)
  - [7.6 Cancelling a Payment](#76-cancelling-a-payment)
- [8. Order Resolution](#8-order-resolution)
  - [8.1 When to Check This Page](#81-when-to-check-this-page)
  - [8.2 Summary Cards](#82-summary-cards)
  - [8.3 Order Statuses Explained](#83-order-statuses-explained)
  - [8.4 Filters](#84-filters)
  - [8.5 Resolving a Stuck Order](#85-resolving-a-stuck-order)
  - [8.6 Cancelling an Order](#86-cancelling-an-order)
- [9. Reconciliation](#9-reconciliation)
  - [9.1 What It Detects](#91-what-it-detects)
  - [9.2 Summary Cards](#92-summary-cards)
  - [9.3 Running Reconciliation](#93-running-reconciliation)
  - [9.4 Report Severity](#94-report-severity)
  - [9.5 Report Table](#95-report-table)
  - [9.6 Acknowledging a Report](#96-acknowledging-a-report)
  - [9.7 Resolving a Report](#97-resolving-a-report)
- [10. LP Performance](#10-lp-performance)
  - [10.1 Summary Cards](#101-summary-cards)
  - [10.2 Per-Asset Breakdown](#102-per-asset-breakdown)
- [11. Market Settings](#11-market-settings)
  - [11.1 Market Status](#111-market-status)
  - [11.2 Trading Schedule](#112-trading-schedule)
  - [11.3 What Happens Outside Hours](#113-what-happens-outside-hours)
- [12. Income Calendar](#12-income-calendar)
  - [12.1 Projected Income Timeline](#121-projected-income-timeline)
- [13. Audit Log](#13-audit-log)
  - [13.1 Admin Action History](#131-admin-action-history)
- [Appendix A: How Calculations Work](#appendix-a-how-calculations-work)
  - [A.1 Trading Fees](#a1-trading-fees)
  - [A.2 LP Spread (Margin)](#a2-lp-spread-margin)
  - [A.3 Bond Coupon Payments](#a3-bond-coupon-payments)
  - [A.4 Income Distribution (Non-Bond Assets)](#a4-income-distribution-non-bond-assets)
  - [A.5 Tax Calculations](#a5-tax-calculations)
  - [A.6 Profit & Loss (FIFO Cost Basis)](#a6-profit--loss-fifo-cost-basis)
  - [A.7 Amount-to-Units Conversion](#a7-amount-to-units-conversion)
  - [A.8 Bond Redemption at Maturity](#a8-bond-redemption-at-maturity)
  - [A.9 Market Cap and Utilization](#a9-market-cap-and-utilization)
- [Appendix B: Asset Lifecycle States](#appendix-b-asset-lifecycle-states)
- [Appendix C: Order Lifecycle](#appendix-c-order-lifecycle)
- [Appendix D: Glossary](#appendix-d-glossary)

---

## 1. Getting Started

### 1.1 Logging In

- Open the Asset Manager application in your browser.
- Log in with your admin credentials (Keycloak SSO).
- You will land on the Dashboard page.

### 1.2 Navigation

The sidebar on the left provides access to all features:

| Menu Item | Purpose |
|-----------|---------|
| Dashboard | Overview of all assets, market status, and platform health |
| Create Asset | Multi-step wizard to create a new digital asset |
| LP Performance | Liquidity partner earnings and margin tracking |
| Inventory | Supply tracking across all assets |
| Scheduled Payments | Manage coupon and income payments |
| Market Settings | View trading hours and market status |
| Order Resolution | Handle failed or stuck orders |
| Reconciliation | Detect and resolve data discrepancies |
| Settings | Application configuration |

### 1.3 Prerequisites

Before you can create and trade assets, ensure:

- A **Liquidity Partner (LP)** client exists in Fineract with `legalForm = ENTITY`.
- The LP has an **active XAF savings account** for trade settlements.
- The platform **fee collection account** is configured (auto-created at startup with external ID `PLATFORM-FEE-COLLECT`).

---

## 2. Dashboard

When you open the Asset Manager, the Dashboard is your home screen.

### 2.1 Market Status

At the top of the dashboard, a badge shows whether the market is currently **Open** (green) or **Closed** (red), along with the trading schedule (8:00 AM -- 8:00 PM WAT).

### 2.2 Summary Cards

Four cards give you an instant overview:

| Card | What It Shows |
|------|---------------|
| **Assets** | Count of active, pending, halted, and total assets |
| **Trading (24h)** | Number of trades, buy/sell volume (XAF), active traders in the last 24 hours |
| **Order Health** | Count of problematic orders (stuck in EXECUTING, failed) |
| **Reconciliation** | Open reconciliation reports, split by critical and warning severity |

### 2.3 Asset Catalog Table

Below the summary cards, a table lists all assets:

| Column | Description |
|--------|-------------|
| Name | Asset display name (clickable) |
| Symbol | 3-letter ticker code |
| Price (XAF) | Current LP ask price |
| 24h Change | Price change percentage (green if positive, red if negative) |
| Available Supply | Units remaining in LP inventory |
| Status | Color-coded badge: ACTIVE (green), PENDING (gray), HALTED (red), DELISTING (orange), MATURED (purple), REDEEMED (blue) |
| Actions | "Manage" button -- opens the Asset Details page |

**Filters:**

- Category pills at the top: All, Stocks, Bonds, Commodities, Real Estate, Crypto, Agriculture
- Search bar for filtering by name or symbol
- Pagination controls at the bottom

### 2.4 Quick Actions

- Click **"Create Asset"** (top right) to start the creation wizard.
- Click **"Export Template"** to download an Excel template for bulk asset import.
- Click **"Import Assets"** to upload a filled template and create multiple assets at once.
- Click **"Manage"** on any asset row to open its details page.

### 2.5 Bulk Asset Import

If you need to create many assets at once, the Excel import workflow is faster than creating them one by one:

1. **Download the template** — Click the **"Export Template"** button. An `.xlsx` file downloads with:
   - All column headers matching the asset creation fields
   - Mandatory columns marked with `*` and highlighted in red
   - An example row (row 2) showing realistic sample data
   - Hover over any header cell to see a description of that field

2. **Fill in the template** — Open the file in Excel or Google Sheets:
   - Keep the header row (row 1) intact
   - You can delete or keep the example row (it will be skipped during import)
   - Add one row per asset you want to create
   - Fill in all mandatory fields (marked with `*`)
   - Use the dropdown menus for category, income type, frequencies, and boolean fields

3. **Import the file** — Click **"Import Assets"** on the Dashboard:
   - Select your filled `.xlsx` file
   - A preview shows all parsed rows with any validation errors highlighted
   - Click **"Import X Assets"** to start creating them
   - A progress bar shows how many have been created
   - Results show success/failure for each row with error details

All imported assets are created in **PENDING** status. You can then review and activate them individually.
---

## 3. Creating a New Asset

The creation wizard guides you through 8 steps. A progress stepper at the top shows your current position. Completed steps display green checkmarks.

Navigate with **Previous** / **Next** buttons. The final step has a **"Create Asset"** button.

### Step 1: Select Liquidity Partner

Choose the company that will act as the market maker for this asset.

- A **dropdown** lists all eligible Fineract clients (entity-type, excluding tax authority accounts).
- Each option shows: **display name**, **account number**, and **office name**.
- After selection, a blue info card confirms your choice with the client ID.

The LP is the entity that purchased the asset off-platform and resells it to investors. They hold the asset inventory and provide cash for buybacks.

### Step 2: Asset Details

Fill in the basic identity of your asset:

| Field | Description | Rules |
|-------|-------------|-------|
| **Asset Name** | Display name investors will see | Required |
| **Symbol** | 3-letter ticker (e.g., DTT, SEN) | Required, auto-uppercased, becomes the currency code |
| **Category** | Asset classification | Required. Options: Stocks, Bonds, Commodities, Real Estate, Crypto, Agriculture |
| **Description** | Detailed description for investors | Optional, max 1,000 characters |
| **Asset Image** | Logo or representative image | Optional. Drag-and-drop or click to upload. Accepts JPEG, PNG, WebP, SVG. Max 5 MB. |

> **Tip:** If you select **Bonds** as the category, a "Bond Details" step will appear next. For all other categories, the wizard skips directly to Pricing & Fees.

### Step 3: Bond Details (Bonds Only)

This step only appears when you selected "Bonds" in Step 2. The form adapts based on the selected bond type.

**Bond Type (required):**

| Type | Label | Description |
|------|-------|-------------|
| **COUPON** | OTA / T-Bonds | Periodic coupon payments until maturity. Standard for long-term CEMAC treasury bonds (2-7 years). |
| **DISCOUNT** | BTA / T-Bills | Zero-coupon. LP buys at discount from BEAC, resells with spread. Investor redeems at face value at maturity. Standard for short-term treasury bills (26-52 weeks). |

**Common Fields (all bond types):**

| Field | Description | Rules |
|-------|-------------|-------|
| **Instrument Type** | COUPON (OTA) or DISCOUNT (BTA) | Required. Determines which fields are shown below. |
| **Day Count Convention** | Interest accrual basis | Auto-set: ACT/365 for OTA, ACT/360 for BTA. Changeable. |
| **Issuer Name** | The original bond issuer (e.g., "Republique du Cameroun") | Required |
| **Issuer Country** | CEMAC member state | Optional. Dropdown: Cameroun, Congo, Tchad, Gabon, RCA, Guinee Equatoriale |
| **ISIN Code** | International Securities Identification Number | Optional, 12 characters uppercase |
| **Maturity Date** | When the bond principal is due | Required, must be in the future |

**Coupon Fields (OTA only — hidden for BTA):**

| Field | Description | Rules |
|-------|-------------|-------|
| **Interest Rate (%)** | Annual coupon rate | Required for OTA (e.g., 5.80 for 5.8% annual) |
| **First Coupon Date** | Date of the first coupon payment | Required for OTA |
| **Coupon Frequency** | How often coupons are paid | Required for OTA. Options: Monthly, Quarterly, Semi-Annual, Annual |

> **OTA coupon trading:** When an OTA bond is traded between coupon dates, the buyer pays the seller accrued interest ("pied du coupon") on top of the trade price. This appears as `accruedInterestAmount` in trade quotes.

> **BTA yield:** For BTA bonds, the investor's return comes from the difference between the purchase price (LP ask) and the face value at maturity. No coupons are scheduled.

### Step 4: Pricing & Fees

Set the financial terms for your asset:

**Core Prices:**

| Field | Description | Rules |
|-------|-------------|-------|
| **Issuer Price (XAF)** | Wholesale/face value per unit | Required. **Immutable after creation.** Used for coupon and income calculations. |
| **LP Ask Price (XAF)** | Price investors pay to BUY | Required. Must be >= issuer price. |
| **LP Bid Price (XAF)** | Price investors receive when they SELL | Required. Must be <= ask price. |
| **Trading Fee (%)** | Platform fee on every trade | Required. Default: 0.50%. Range: 0--10%. |

A live **LP Margin** display shows the difference between ask and issuer price in XAF and as a percentage.

> **Tip for bonds:** Typically set ask = bid = issuer price (no markup on face value). The LP earns from trading fees instead of spread.

**Trading Limits (all optional -- leave blank for no limit):**

| Field | Description |
|-------|-------------|
| **Max Position % of Supply** | Maximum % of total supply one investor can hold (e.g., 10%) |
| **Max Order Size (units)** | Maximum units per single trade |
| **Daily Trade Limit (XAF)** | Maximum XAF value one investor can trade per day for this asset |
| **Min Order Size (units)** | Minimum units per trade |
| **Min Order Amount (XAF)** | Minimum cash amount per trade |

### Step 5: Supply & Precision

| Field | Description | Rules |
|-------|-------------|-------|
| **Total Supply** | Total units to create | Required. Deposited into LP's asset account. Can mint more later. |
| **Decimal Places** | Fractional unit precision | Options: 0 (whole units), 2, 4, or 8 |
| **Lock-up Days** | Minimum holding period after purchase | Optional. 0 or blank = no lock-up. |

A **Supply Summary** box shows: total supply, price per unit, and total market cap.

> **Lock-up explained:** If you set lock-up to 30 days, an investor who buys on January 1 cannot sell until January 31. Each purchase has its own lock-up timer -- buying more units later creates a new lock-up period for those new units only.

### Step 6: Income Distribution (Non-Bond Assets)

This step configures recurring income payments for non-bond assets (dividends, rent, etc.).

| Field | Description |
|-------|-------------|
| **Income Type** | None, Dividend, Rental Income, Harvest Yield, or Profit Share |
| **Income Rate (%)** | Annual income rate (appears when a type is selected) |
| **Distribution Frequency** | Monthly (1), Quarterly (3), Semi-Annual (6), or Annual (12) |
| **First Distribution Date** | Date of the first payment |

Each income type shows an info badge: **Fixed** or **Variable**.

> **Note for bonds:** Bonds use the coupon system configured in Step 3 instead. This step is for non-bond asset categories only.

> **How income works:** The system pays income based on the **issuer price**, not the ask price. See [Appendix A.4](#a4-income-distribution-non-bond-assets) for the formula and a worked example.

### Step 7: Tax Configuration

Configure Cameroon/CEMAC tax compliance settings:

**Registration Duty (Droit d'enregistrement):**

- Toggle **Enabled** (default: on)
- **Rate**: Default 2% of transaction value on every trade

**IRCM Withholding (Impot sur les Revenus des Capitaux Mobiliers):**

- Toggle **Enabled** (default: on)
- **IRCM Exempt** checkbox (e.g., for government bonds, setting this results in a 0% rate)
- **Rate Override**: Leave blank for automatic rate determination. Auto rates depend on asset type:
  - Government bonds: 0%
  - Bonds with maturity >= 5 years: 5.5%
  - BVMAC-listed securities: 11%
  - All others (dividends, rent, etc.): 16.5%

**Capital Gains Tax (Impot sur les Plus-Values):**

- Toggle **Enabled** (default: on)
- **Rate**: Default 16.5%
- A 500,000 XAF annual exemption per investor is applied automatically

See [Appendix A.5](#a5-tax-calculations) for detailed tax calculation examples.

### Step 8: Review & Create

A read-only summary shows all the information you entered, organized into cards:

- Liquidity Partner
- Asset Details
- Bond Details (if applicable)
- Pricing & Fees
- Supply & Precision
- Income Distribution (if configured)
- Tax Configuration

A yellow info box explains **what happens when you click "Create Asset"**:

1. Your asset's symbol is registered as a custom currency in Fineract.
2. A savings product is created for the asset currency.
3. An LP asset account (token inventory) and LP spread account (margin collection) are created.
4. The total supply is deposited into the LP's asset account.
5. The asset is created in **PENDING** status.

Click **"Create Asset"** to submit. After successful creation, you need to **activate** the asset before trading can begin.

---

## 4. Managing an Asset

### 4.1 Opening Asset Details

From the Dashboard, click **"Manage"** on any asset row. The Asset Details page shows everything about the asset and provides action buttons.

### 4.2 Available Actions by Status

The buttons you see depend on the asset's current status:

| Status | Available Actions |
|--------|-------------------|
| **PENDING** | Activate, Delete, Edit, Pricing |
| **ACTIVE** | Halt Trading, Delist Asset, Edit, Mint Supply, Pricing |
| **HALTED** | Resume Trading, Delist Asset, Edit, Mint Supply, Pricing |
| **DELISTING** | Cancel Delisting, Edit, Pricing |
| **MATURED** (bonds) | Redeem Bond, Edit, Pricing |
| **DELISTED / REDEEMED** | View only (no actions) |

### 4.3 Activating an Asset

1. Open the PENDING asset's details page.
2. Click the green **"Activate"** button.
3. Confirm in the dialog that appears.
4. Status changes to **ACTIVE** -- trading is now possible.

### 4.4 Halting Trading

1. Click the red **"Halt Trading"** button on an ACTIVE asset.
2. Confirm in the dialog.
3. Status changes to **HALTED** -- all buy and sell orders are blocked.
4. Existing investor positions are **not affected** -- they just cannot trade.

### 4.5 Resuming Trading

1. Click the green **"Resume Trading"** button on a HALTED asset.
2. Confirm in the dialog.
3. Status returns to **ACTIVE** -- trading reopens.

### 4.6 Editing Asset Metadata

1. Click the **"Edit"** button.
2. A dialog opens where you can update:
   - Name, description, image URL
   - Trading fee %, LP ask/bid prices
   - Exposure limits
   - Income configuration, tax settings
3. **When the asset is PENDING**, you can also edit:
   - Issuer price (face value)
   - Total supply
   - Issuer name, ISIN code, coupon frequency (bond assets)
4. You **cannot change**: symbol, currency code, decimal places. To change these, delete the PENDING asset and recreate it.
5. Once an asset is **ACTIVE or beyond**, the core fields (issuer price, total supply, etc.) become read-only.
6. Click **"Save"** to apply changes.

### 4.7 Minting Additional Supply

1. Click **"Mint Supply"**.
2. The dialog shows the current total supply and asset symbol.
3. Enter the number of **additional** units to mint.
4. Click **"Mint"** -- units are deposited into the LP's asset account in Fineract.

> Only minting (increasing supply) is supported. You cannot burn (decrease) supply.

### 4.8 Delisting an Asset

Delisting removes an asset from the marketplace with a grace period:

1. Click the orange **"Delist Asset"** button.
2. In the dialog, enter:
   - **Delisting Date** (required): The date of forced buyback.
   - **Redemption Price** (optional): Price for forced buyback. If left blank, uses the last ask price.
3. Click **"Delist"** to confirm.

**During the DELISTING period:**

- A **warning banner** appears on the asset details page showing the delisting date and redemption price.
- **BUY orders are blocked** -- investors cannot purchase more units.
- **SELL orders are allowed** -- investors can voluntarily sell at the current bid price.
- The asset remains visible with a **DELISTING** badge.

**On the delisting date:** The system automatically buys back all remaining holdings at the redemption price. All positions are closed and the asset status changes to **DELISTED**.

### 4.9 Cancelling a Delisting

1. While status is DELISTING (and before the delisting date), click **"Cancel Delisting"**.
2. Confirm in the dialog.
3. Asset returns to **ACTIVE** -- BUY orders are allowed again.

### 4.10 Redeeming a Bond

When a bond reaches its maturity date, the system automatically transitions it to **MATURED** status. To pay back investors:

1. Open the MATURED bond's details page.
2. Click the purple **"Redeem Bond"** button.
3. Confirm in the dialog.
4. The system pays each holder their **face value** (issuer price x units) from the LP's cash account.
5. Asset units are returned from holders to the LP.
6. Status changes to **REDEEMED**.

> This action is **irreversible**. If some holders fail (e.g., LP runs out of cash), the successful ones are not rolled back. You can retry for failed holders.

### 4.11 Deleting a Pending Asset

1. Only available for **PENDING** assets (never activated, no trades).
2. Click the red **"Delete"** button.
3. Confirm in the dialog.
4. The asset, its Fineract savings product, accounts, and currency registration are permanently removed.

### 4.12 Information Cards

The Asset Details page displays several information cards:

**Stat Cards (top row):**

- Ask Price (with 24h change %), Bid Price, Total Supply, Circulating Supply (with % of total)

**Bond Information** (bonds only):

- Issuer, ISIN, Maturity Date, Coupon Amount per unit, Current Yield, Coupon Frequency, Next Coupon Date, Residual Days until maturity

**Pricing & Limits:**

- Issuer price, trading fee, spread, all exposure limits, lock-up period

**Income Distribution** (non-bonds with income configured):

- Income type (with Fixed/Variable badge), rate, frequency, next distribution date

**Tax Configuration:**

- Registration Duty (enabled/disabled + rate), IRCM Withholding (enabled/disabled + rate), Capital Gains Tax (enabled/disabled + rate)

**Forecast Cards** (conditional):

- **Coupon Forecast** (bonds): remaining coupon obligations, principal at maturity, LP cash coverage, shortfall warning
- **Income Forecast** (non-bonds): per-period obligation, LP cash coverage, shortfall warning

**Integration:**

- Fineract savings product name and ID
- LP client name and ID (clickable link to Account Manager)
- LP Asset Account, Cash Account, and Spread Account (clickable links)

---

## 5. Pricing Management

### 5.1 Opening the Pricing Page

From the Asset Details page, click **"Pricing"**. This opens a dedicated pricing view.

### 5.2 Current Prices

Three cards show the current state:

- **LP Bid** (red) -- what sellers receive
- **LP Ask** (green) -- what buyers pay
- **24h Change %** -- price movement

An **OHLC card** shows today's Open, High, Low, and Close prices.

### 5.3 Setting a New Price

1. Enter the new **Ask Price** in the input field.
2. The system shows a live preview of the **derived Bid Price** (maintains the current spread ratio).
3. Optionally, toggle **"Override bid price"** to set it independently.
4. Click **"Set Price"** to apply.

### 5.4 Price History

- Select a period: **1D**, **1W**, **1M**, **3M**, **1Y**, or **ALL**.
- A line chart shows the price over time.
- A data table below lists each price point with timestamp.

---

## 6. Inventory

### 6.1 Overview

The Inventory page tracks supply across all assets.

**Summary cards:**

- Total Assets count
- Total Circulating Units (held by investors)
- Total Available Units (remaining in LP accounts)

### 6.2 Inventory Table

| Column | Description |
|--------|-------------|
| Asset | Name (clickable link to details) |
| Symbol | Ticker code |
| Total Supply | Total units ever minted |
| Circulating | Units held by investors |
| Available | Units in LP inventory |
| Price (XAF) | Current ask price |
| TVL (XAF) | Total Value Locked (circulating x price) |
| Utilization % | Circulating / Total Supply as a progress bar |

### 6.3 CSV Export

Click **"Export CSV"** to download all inventory data as a spreadsheet.

---

## 7. Scheduled Payments

This page manages coupon payments (bonds) and income distributions (non-bonds). The system automatically creates payment schedules when due dates arrive. You review and confirm them before execution.

### 7.1 Summary Cards

- **Pending** (yellow): Payments awaiting your confirmation
- **Confirmed This Month** (green): Payments executed this month
- **Total Paid This Month** (gray): Total XAF distributed

### 7.2 Filters

- **Status**: All, Pending, Confirmed, Cancelled
- **Type**: All, Coupon, Income
- **Asset**: Filter by specific asset
- **Clear Filters** button to reset

### 7.3 Payments Table

| Column | Description |
|--------|-------------|
| Asset | Name (clickable link) |
| Type | COUPON or INCOME |
| Schedule Date | When the payment is due |
| Holders | Number of eligible investors |
| Estimated Total | Projected total payout (XAF) |
| LP Balance | LP's cash balance, color-coded: green if sufficient, red if shortfall |
| Status | PENDING (yellow), CONFIRMED (green), CANCELLED (gray) |
| Actions | Confirm / Cancel buttons (for PENDING payments) |

### 7.4 Payment Detail Panel

Click any row to open a **slide-over panel** on the right showing:

- Asset, type, schedule date, status
- Rate, estimated amount per unit, holder count, estimated total
- LP cash balance (with color warning if insufficient)
- Holder breakdown table: each investor's user ID, units held, and estimated payment
- Action buttons (Confirm/Cancel for PENDING)

### 7.5 Confirming a Payment

1. Click **"Confirm"** on a PENDING payment (or from the detail panel).
2. A confirmation dialog shows payment details.
3. **For INCOME type**: You can optionally enter a custom **"Amount per unit"** (useful for variable income like dividends where the actual amount may differ from the estimate).
4. **For COUPON type**: The amount is fixed based on the bond's interest rate.
5. If the LP balance is insufficient, a **warning** appears (you can still proceed, but some payments may fail).
6. Click **"Confirm & Pay"**.
7. The system distributes payments to all eligible holders.

### 7.6 Cancelling a Payment

1. Click **"Cancel"** on a PENDING payment.
2. Enter an optional **cancellation reason**.
3. Click **"Cancel Payment"**.
4. The payment will not be processed. No funds are moved.

---

## 8. Order Resolution

This page handles orders that encountered problems during execution.

### 8.1 When to Check This Page

- When the dashboard shows **Order Health** issues.
- When you receive admin notifications about stuck orders.
- During routine daily operations.

### 8.2 Summary Cards

- **Needs Reconciliation** (yellow): Orders that timed out during execution and need manual verification
- **Failed** (red): Orders where the Fineract transfer failed
- **Manually Closed** (gray): Orders previously resolved by an admin

### 8.3 Order Statuses Explained

| Status | Meaning | Action Required? |
|--------|---------|------------------|
| QUOTED | Price locked, awaiting user confirmation | No -- expires in 30 seconds |
| PENDING | Confirmed, awaiting execution | No -- will execute automatically |
| QUEUED | Submitted outside market hours | No -- executes at next market open |
| EXECUTING | Currently being processed | No -- wait for completion |
| FILLED | Successfully completed | No |
| FAILED | Fineract transfer failed | Yes -- investigate and resolve |
| NEEDS_RECONCILIATION | Timed out during execution | Yes -- verify in Fineract and resolve |
| MANUALLY_CLOSED | Resolved by admin | No |
| REJECTED | Validation failed (insufficient funds, etc.) | No |
| CANCELLED | Cancelled by user or system | No |

### 8.4 Filters

- **Status**: Filter by specific order status
- **Asset**: Filter by asset
- **Search**: Search by order ID or user external ID
- **Date Range**: From and To date filters

### 8.5 Resolving a Stuck Order

1. Click on the problematic order row to open the **detail panel**.
2. Review: Order ID, asset, user, side (BUY/SELL), amount, failure reason.
3. Check the **Fineract Batch ID** -- use this to verify the transfer status in Fineract directly.
4. Click **"Resolve Order"**.
5. Enter a **resolution description** (required) explaining what you found and what was done.
6. Click **"Resolve"** -- status changes to MANUALLY_CLOSED.

### 8.6 Cancelling an Order

For PENDING or QUEUED orders that need to be stopped:

1. Click **"Cancel"** on the order row.
2. The order transitions to CANCELLED.

---

## 9. Reconciliation

Reconciliation detects discrepancies between the asset service database and Fineract account balances. It runs automatically every day, but you can trigger it manually.

### 9.1 What It Detects

- **Supply Mismatch**: The recorded circulating supply doesn't match what Fineract shows.
- **Position Mismatch**: An investor's recorded holdings differ from their Fineract account balance.
- **LP Cash Negative**: The LP's cash account has gone negative (can't cover payouts).

### 9.2 Summary Cards

- **Open Reports** (red): Unresolved discrepancies
- **Total Reports** (blue): All reports including resolved
- **Status** (green): "All Clear" or "Needs Attention"

### 9.3 Running Reconciliation

Click the **"Trigger Reconciliation"** button at the top. A spinner shows while the scan runs. The system checks all active, delisting, and matured assets.

### 9.4 Report Severity

- **CRITICAL** (red badge): Position mismatches or negative LP cash -- investigate immediately.
- **WARNING** (yellow badge): Supply mismatches -- investigate soon but not urgent.

### 9.5 Report Table

| Column | Description |
|--------|-------------|
| Date | When the discrepancy was detected |
| Type | SUPPLY_MISMATCH, POSITION_MISMATCH, or LP_CASH_NEGATIVE |
| Asset | Affected asset ID |
| Expected | What the asset service expects |
| Actual | What Fineract shows |
| Discrepancy | The difference (shown in red) |
| Severity | CRITICAL or WARNING badge |
| Status | OPEN, ACKNOWLEDGED, or RESOLVED |
| Actions | Acknowledge (Ack) and Resolve buttons |

### 9.6 Acknowledging a Report

Click **"Ack"** on an OPEN report to signal that you are investigating. Status changes to ACKNOWLEDGED.

### 9.7 Resolving a Report

1. Click the **checkmark** icon on an OPEN or ACKNOWLEDGED report.
2. A dialog opens asking for **Resolution Notes** (optional but recommended).
3. Click **"Resolve"** -- status changes to RESOLVED.

> **Best practice:** After correcting the underlying issue, re-trigger reconciliation to confirm 0 new discrepancies before resolving.

---

## 10. LP Performance

This page shows how profitable the liquidity provider operations are.

### 10.1 Summary Cards

- **Net Margin** (green if positive, red if negative): Spread + Fees - Buyback Premium
- **Spread Earned**: Total earnings from bid/ask spread on trades
- **Buyback Premium Paid** (orange): Premium paid when bid > issuer price on SELL trades
- **Total Trades**: Trade count, with fee commission total

### 10.2 Per-Asset Breakdown

A table shows performance for each asset:

| Column | Description |
|--------|-------------|
| Asset | Symbol |
| Spread Earned | Cumulative spread from this asset |
| Buyback Premium | Cumulative premium paid on SELL trades |
| Fee Commission | Cumulative trading fees |
| Net Margin | Spread + Fees - Buyback (green/red) |
| Trades | Number of trades |

If no trades have occurred yet, the table shows: "No trade data yet. Performance will appear after trades are executed."

---

## 11. Market Settings

This page displays the market configuration (read-only in the UI -- changes are made in backend configuration).

### 11.1 Market Status

- A card shows **"Market Open"** (green) or **"Market Closed"** (red).
- **Countdown timer**: Time until close (if open) or time until open (if closed).

### 11.2 Trading Schedule

- **Schedule**: 8:00 AM -- 8:00 PM WAT
- **Timezone**: Africa/Douala (WAT, UTC+1)
- **Weekend Trading**: Disabled
- **Trading Days**: Monday -- Friday

### 11.3 What Happens Outside Hours

Orders submitted outside market hours are **queued** (not rejected). They execute automatically at the next market open. If the price has moved more than 5% since the order was queued, it is rejected as stale.

---

## 12. Income Calendar

### 12.1 Projected Income Timeline

This page shows a visual timeline of all upcoming coupon and income payments across all assets.

- **Period selector**: 6M, 12M, or 24M buttons to change the time horizon.
- The calendar shows projected payments grouped by month.
- Includes both bond coupons and non-bond income distributions (dividends, rent, etc.).

Use this to plan ahead for LP cash needs and identify months with heavy payment obligations.

---

## 13. Audit Log

### 13.1 Admin Action History

The Audit Log page shows a chronological record of all admin actions:

- Asset creation, activation, halting, price changes
- Order resolutions
- Reconciliation acknowledgements and resolutions
- Scheduled payment confirmations and cancellations

Each entry shows: timestamp, action type, admin who performed it, target asset, result (success/failure), and duration.

Use the filters to narrow by admin user, asset, or action type.

---
---

## Appendix A: How Calculations Work

This appendix explains every calculation the system performs in the background, with detailed worked examples.

---

### A.1 Trading Fees

**Formula:**

```
fee = grossAmount x (tradingFeePercent / 100)
```

Where `grossAmount = units x executionPrice`.

**Example -- BUY:**

An investor buys 100 units of DTT at an ask price of 5,000 XAF with a 0.5% trading fee.

```
Gross amount   = 100 units x 5,000 XAF  = 500,000 XAF
Fee            = 500,000 x (0.50 / 100) =   2,500 XAF
                                           ─────────────
Total cost     = 500,000 + 2,500         = 502,500 XAF
```

The investor pays **502,500 XAF** total. The 2,500 XAF fee goes to the platform fee collection account.

**Example -- SELL:**

An investor sells 50 units of DTT at a bid price of 4,800 XAF with a 0.5% fee.

```
Gross proceeds = 50 units x 4,800 XAF   = 240,000 XAF
Fee            = 240,000 x (0.50 / 100) =   1,200 XAF
                                           ─────────────
Net received   = 240,000 - 1,200         = 238,800 XAF
```

The investor receives **238,800 XAF**. The fee is deducted from the proceeds.

---

### A.2 LP Spread (Margin)

The LP earns a spread on every BUY trade -- the difference between the ask price (what the investor pays) and the issuer price (what the asset is "worth").

**Formula:**

```
Spread per unit  = askPrice - issuerPrice
Spread %         = (askPrice - issuerPrice) / issuerPrice x 100
Total spread     = spreadPerUnit x units
```

**Example:**

DTT has issuer price 4,000 XAF and ask price 5,000 XAF. An investor buys 100 units.

```
Spread per unit = 5,000 - 4,000 = 1,000 XAF
Spread %        = 1,000 / 4,000 x 100 = 25%
Total spread    = 1,000 x 100 = 100,000 XAF
```

This 100,000 XAF flows to the LP's spread account. The LP's total earnings from this trade: spread (100,000) + share of trading fee.

**On SELL trades**, if the bid price is higher than the issuer price, the LP pays a **buyback premium**:

```
Buyback premium per unit = bidPrice - issuerPrice  (when bid > issuer)
```

If bid = 4,800 and issuer = 4,000, the LP pays 800 XAF/unit more than the asset's face value.

---

### A.3 Bond Coupon Payments

Bond holders receive periodic interest payments (coupons) based on the bond's face value.

**Formula:**

```
couponPerUnit  = issuerPrice x (interestRate / 100) x (couponFrequencyMonths / 12)
totalCoupon    = couponPerUnit x unitsHeld
```

**Example:**

An investor holds 100 units of the "Senegal Treasury Bond 5.80%" (SEN580):

- Issuer price (face value): 10,000 XAF
- Interest rate: 5.80% annual
- Coupon frequency: Semi-annual (every 6 months)

```
Coupon per unit = 10,000 x (5.80 / 100) x (6 / 12)
               = 10,000 x 0.058 x 0.5
               = 290 XAF per unit per period

Total coupon   = 290 x 100 units
               = 29,000 XAF
```

Every 6 months, the investor receives **29,000 XAF** from the LP's cash account.

**Current Yield:**

If the LP sells the bond at a markup (ask > issuer), the investor's effective yield is lower:

```
currentYield = issuerPrice x interestRate / askPrice
```

If ask price is 11,000 XAF for a bond with 10,000 face value and 5.80% rate:

```
currentYield = 10,000 x 5.80 / 11,000 = 5.27%
```

The investor pays more per unit but coupons are still based on the 10,000 face value, so their effective return is 5.27% instead of 5.80%.

**Daily Accrued Interest:**

Between coupon dates, the system accrues interest daily:

```
dailyAccrual = units x issuerPrice x (rate / 100) / 365
```

For our example: 100 x 10,000 x 0.058 / 365 = **158.90 XAF/day**. This accrued amount resets to zero after each coupon payment.

---

### A.4 Income Distribution (Non-Bond Assets)

Non-bond assets (real estate, agriculture, stocks) can pay periodic income to holders. Like coupons, income is calculated from the **issuer price**, not the LP's selling price.

**Formula:**

```
incomePerUnit  = issuerPrice x (incomeRate / 100) x (distributionFrequencyMonths / 12)
totalIncome    = incomePerUnit x unitsHeld
```

**Example -- Monthly Rental Income:**

An investor holds 200 units of "Douala Tower Token" (DTT):

- Issuer price: 4,000 XAF
- Ask price: 5,000 XAF (what the investor actually paid)
- Income type: RENT
- Income rate: 8% annual
- Distribution frequency: Monthly (1 month)

```
Income per unit = 4,000 x (8 / 100) x (1 / 12)
               = 4,000 x 0.08 x 0.0833
               = 26.67 XAF per unit per month

Total income   = 26.67 x 200 units
               = 5,333 XAF per month

Annual income  = 5,333 x 12
               = 64,000 XAF per year
```

The investor's **effective yield** based on what they actually paid:

```
Effective yield = (64,000 / (200 x 5,000)) x 100 = 6.4%
```

Note: The income rate is 8% on the issuer price, but the investor paid the higher ask price, so their effective return is 6.4%.

---

### A.5 Tax Calculations

#### A.5.1 Registration Duty (Droit d'enregistrement)

Applied to the gross transaction value on **every trade** (both BUY and SELL).

**Formula:**

```
registrationDuty = grossTransactionValue x registrationDutyRate
```

**Example:**

An investor buys 100 units at 5,000 XAF. Registration duty rate: 2%.

```
Gross value       = 100 x 5,000     = 500,000 XAF
Registration duty = 500,000 x 0.02  =  10,000 XAF
```

The investor pays an additional **10,000 XAF** in registration duty on top of the trading fee.

#### A.5.2 IRCM (Withholding Tax on Income)

Deducted from coupon and income payments **before** the investor receives them.

**Rate determination:**

| Asset Type | IRCM Rate |
|-----------|-----------|
| Government bond (`isGovernmentBond = true`) | **0%** (exempt) |
| Asset marked IRCM exempt | **0%** |
| Per-asset rate override (if set) | Override value |
| Bond with maturity >= 5 years | **5.5%** |
| BVMAC-listed security | **11%** |
| Default (dividends, rent, harvest, etc.) | **16.5%** |

**Example -- Bond coupon (7-year maturity):**

```
Gross coupon   = 29,000 XAF (from our SEN580 example)
IRCM rate      = 5.5% (bond maturity >= 5 years)
IRCM amount    = 29,000 x 0.055 = 1,595 XAF
                                   ─────────
Net to investor = 29,000 - 1,595 = 27,405 XAF
```

**Example -- Rental income:**

```
Gross income   = 5,333 XAF (from our DTT example)
IRCM rate      = 16.5% (default for rental income)
IRCM amount    = 5,333 x 0.165 = 880 XAF
                                  ──────
Net to investor = 5,333 - 880   = 4,453 XAF
```

**Example -- Government bond:**

```
Gross coupon   = 29,000 XAF
IRCM rate      = 0% (government bond exempt)
IRCM amount    = 0 XAF
Net to investor = 29,000 XAF (full amount)
```

#### A.5.3 Capital Gains Tax (Impot sur les Plus-Values)

Applied to **profitable SELL trades only**. Includes an annual exemption.

**Rules:**

- Default rate: **16.5%**
- Annual exemption: **500,000 XAF** per investor per fiscal year
- Only the portion of cumulative gains exceeding 500,000 XAF is taxed
- Cost basis is calculated using **FIFO** (see [A.6](#a6-profit--loss-fifo-cost-basis))

**Example -- Within annual exemption:**

An investor sells for a profit of 300,000 XAF. This is their first profitable sale this year.

```
Realized gain        = 300,000 XAF
Cumulative YTD gains = 0 + 300,000 = 300,000 XAF
Annual exemption     = 500,000 XAF
Taxable amount       = max(0, 300,000 - 500,000) = 0 XAF
Capital gains tax    = 0 XAF
```

No tax -- the gain is within the annual exemption.

**Example -- Exceeding the annual exemption:**

Later the same year, the investor sells for another 250,000 XAF profit.

```
This sale's gain     = 250,000 XAF
Cumulative YTD gains = 300,000 + 250,000 = 550,000 XAF
Annual exemption     = 500,000 XAF
Taxable amount       = 550,000 - 500,000 = 50,000 XAF
Capital gains tax    = 50,000 x 0.165    = 8,250 XAF
```

The investor pays **8,250 XAF** in capital gains tax, deducted from the sale proceeds.

**Combined tax example -- Full SELL transaction:**

Selling 120 units at 700 XAF, cost basis 62,000 XAF (see FIFO example below), 0.5% fee, 2% registration duty, 16.5% capital gains:

```
Gross proceeds        = 120 x 700           = 84,000 XAF
Trading fee           = 84,000 x 0.005      =    420 XAF
Registration duty     = 84,000 x 0.02       =  1,680 XAF
Realized gain         = 84,000 - 62,000     = 22,000 XAF
Capital gains tax     = 22,000 x 0.165      =  3,630 XAF  (assuming exemption used)
                                               ──────────
Net to investor       = 84,000 - 420 - 1,680 - 3,630 = 78,270 XAF
```

---

### A.6 Profit & Loss (FIFO Cost Basis)

When an investor sells, the system uses **FIFO (First In, First Out)** to determine cost basis. The oldest purchase lots are consumed first.

**Example:**

An investor made two purchases:

- **Lot 1**: 100 units @ 500 XAF = 50,000 XAF total cost (purchased January 10)
- **Lot 2**: 50 units @ 600 XAF = 30,000 XAF total cost (purchased February 15)

They now sell 120 units at 700 XAF.

**FIFO lot consumption:**

```
Step 1: Consume ALL of Lot 1 (oldest first)
        100 units @ 500 XAF cost = 50,000 XAF

Step 2: Need 20 more units, take from Lot 2
        20 units @ 600 XAF cost  = 12,000 XAF

Total cost basis = 50,000 + 12,000 = 62,000 XAF
```

**P&L calculation:**

```
Sale proceeds  = 120 x 700 = 84,000 XAF
Cost basis     = 62,000 XAF
                 ──────────
Realized P&L   = 84,000 - 62,000 = +22,000 XAF (profit)
```

**Remaining position after the sale:**

- Lot 2: 30 remaining units @ 600 XAF
- New average purchase price: 600 XAF

**Unrealized P&L** (for portfolio display):

```
Current price          = 700 XAF
Remaining units        = 30
Current value          = 30 x 700   = 21,000 XAF
Remaining cost basis   = 30 x 600   = 18,000 XAF
                                       ──────────
Unrealized P&L         = 21,000 - 18,000 = +3,000 XAF
```

---

### A.7 Amount-to-Units Conversion

When an investor specifies an XAF budget instead of units, the system computes the maximum purchasable units.

**Formula:**

```
effectivePricePerUnit = askPrice x (1 + tradingFeePercent / 100)
units                 = floor(budget / effectivePricePerUnit)
remainder             = budget - (units x effectivePricePerUnit)
```

**Example:**

Budget: 500,000 XAF. Ask price: 5,000 XAF. Fee: 0.5%. Decimal places: 0 (whole units).

```
Effective price = 5,000 x (1 + 0.005) = 5,025 XAF per unit
Units           = floor(500,000 / 5,025) = floor(99.50) = 99 units
Actual cost     = 99 x 5,025 = 497,475 XAF
Remainder       = 500,000 - 497,475 = 2,525 XAF (returned to investor)
```

The investor gets **99 units** and **2,525 XAF** is returned as change.

---

### A.8 Bond Redemption at Maturity

When a bond matures and the admin triggers redemption, each holder receives the face value.

**Formula:**

```
redemptionAmount = unitsHeld x issuerPrice
```

**Example:**

An investor holds 50 units of SEN580 (face value 10,000 XAF). They originally purchased at ask price 11,000 XAF.

```
Redemption amount = 50 x 10,000 = 500,000 XAF
Original cost     = 50 x 11,000 = 550,000 XAF
                                   ──────────
Realized P&L      = 500,000 - 550,000 = -50,000 XAF (loss)
```

In this case, the investor loses money because they bought above face value. However, they received coupon payments over the bond's life which may offset this loss.

If the investor had bought at face value (ask = issuer = 10,000):

```
Redemption amount = 50 x 10,000 = 500,000 XAF
Original cost     = 50 x 10,000 = 500,000 XAF
Realized P&L      = 0 XAF (break even on principal, profited from coupons)
```

---

### A.9 Market Cap and Utilization

**Market Cap:**

```
Market Cap = totalSupply x issuerPrice
```

Example: 100,000 units x 4,000 XAF = 400,000,000 XAF (400M)

**Utilization (Inventory page):**

```
Utilization % = circulatingSupply / totalSupply x 100
```

Example: 15,000 circulating / 100,000 total = 15% utilization

---

## Appendix B: Asset Lifecycle States

```
                    ┌──────────┐
                    │  PENDING  │
                    └────┬─────┘
                         │ activate
                         ▼
                    ┌──────────┐
              ┌─────│  ACTIVE  │─────┐
              │     └────┬─────┘     │
              │          │           │
         halt │          │ delist    │ maturity date
              │          │           │ (bonds only)
              ▼          ▼           ▼
         ┌────────┐ ┌──────────┐ ┌─────────┐
         │ HALTED │ │DELISTING │ │ MATURED │
         └───┬────┘ └────┬─────┘ └────┬────┘
             │           │            │
        resume│      cancel│  delisting│  redeem
             │      delist│    date   │
             ▼           │           ▼
         ┌────────┐      │      ┌──────────┐
         │ ACTIVE │◄─────┘      │ REDEEMED │
         └────────┘             └──────────┘
                         │
                    delisting date
                         ▼
                    ┌──────────┐
                    │ DELISTED │
                    └──────────┘
```

**Delete** is only available from PENDING (removes the asset entirely).

---

## Appendix C: Order Lifecycle

```
  User requests quote
         │
         ▼
    ┌─────────┐  30s timeout   ┌───────────┐
    │ QUOTED  │──────────────►│ CANCELLED  │
    └────┬────┘                └───────────┘
         │ user confirms
         ▼
    ┌─────────┐  market closed  ┌────────┐
    │ PENDING │────────────────►│ QUEUED │
    └────┬────┘                 └───┬────┘
         │                          │ market opens
         │◄─────────────────────────┘
         │
         ▼
    ┌───────────┐
    │ EXECUTING │
    └─────┬─────┘
          │
     ┌────┼──────────────┐
     │    │              │
     ▼    ▼              ▼
  ┌──────┐ ┌──────┐ ┌─────────────────────┐
  │FILLED│ │FAILED│ │NEEDS_RECONCILIATION │
  └──────┘ └──┬───┘ └──────────┬──────────┘
              │                │
              │    admin resolves
              │                │
              ▼                ▼
         ┌─────────────────┐
         │ MANUALLY_CLOSED │
         └─────────────────┘
```

Users can **cancel** orders in QUOTED, PENDING, or QUEUED status.

---

## Appendix D: Glossary

| Term | Definition |
|------|-----------|
| **LP (Liquidity Partner)** | The market-making entity that holds asset inventory and provides cash for buybacks. Purchases assets off-platform from the issuer. |
| **Ask Price** | The price at which the LP sells units to investors (investor's buying price). |
| **Bid Price** | The price at which the LP buys units back from investors (investor's selling price). |
| **Issuer Price** | The wholesale/face value of one unit. Set at creation and immutable. Used for coupon, income, and redemption calculations. |
| **Spread** | The difference between ask and bid prices. The LP's primary margin on trades. |
| **Trading Fee** | A percentage-based platform fee applied to every trade (BUY and SELL). |
| **FIFO** | First In, First Out -- the method used to determine which purchase lots are sold first. |
| **OHLC** | Open, High, Low, Close -- standard price candlestick data for a trading session. |
| **IRCM** | Impot sur les Revenus des Capitaux Mobiliers -- Cameroon withholding tax on investment income. |
| **Registration Duty** | Droit d'enregistrement -- a tax applied to every trade transaction. |
| **XAF** | Central African CFA franc -- the settlement currency for all trades. |
| **WAT** | West Africa Time (UTC+1) -- the timezone for market hours. |
| **ISIN** | International Securities Identification Number -- a 12-character code identifying a security. |
| **BVMAC** | Bourse des Valeurs Mobilieres de l'Afrique Centrale -- the Central African stock exchange. |
| **Coupon** | Periodic interest payment on a bond, based on the face value. |
| **Maturity** | The date when a bond's principal must be repaid to holders. |
| **Redemption** | The return of face value to bond holders at maturity. |
| **Lock-up** | A period after purchase during which the investor cannot sell their units. |
| **Circulating Supply** | Units currently held by investors (total supply minus LP inventory). |
| **TVL** | Total Value Locked -- the total market value of circulating units. |
