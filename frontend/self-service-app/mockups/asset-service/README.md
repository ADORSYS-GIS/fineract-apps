# Asset Service — Customer-Facing Wireframes

Self-service app wireframes for the asset trading and portfolio management flows. Each screen ships as a pair of files:

- `NN-screen-name.svg` — the mobile wireframe (390 px wide, rendered at full height)
- `NN-screen-name.spec.svg` — 820 px wide; left half is the mockup embedded via `<image>`, right half is an annotation panel mapping every visible UI element to its API response field

## How to Read a Spec SVG

Open the `.spec.svg` in any browser or SVG-aware viewer. The right panel contains:

- **Endpoint badge** (green = GET, orange = POST) — the API call that populates the screen
- **Section headers** (dark blue) — logical UI sections matching what you see on the left
- **Annotation rows** — `UI label` → `DTO.fieldName` in purple monospace
- **Notes** (amber) — computed fields, tax logic, navigation targets, and edge-case rules

## Screen Index

| # | File | Description | Bond type | Status |
|---|------|-------------|-----------|--------|
| 01 | `01-dashboard` | Home dashboard with portfolio summary | — | Stable |
| 02 | `02-market-asset-list` | Browse tradeable assets | — | Stable |
| 03 | `03-asset-detail` | Equity / REIT / commodity asset detail | — | Stable |
| 03b | `03b-bond-asset-detail` | Coupon bond detail (OTA) | OTA | Stable |
| **03c** | **`03c-bta-bond-asset-detail`** | **Discount bond detail (BTA)** | **BTA** | **New** |
| 04 | `04-buy-step1-amount` | Buy flow — enter amount | — | Stable |
| 04b | `04b-buy-step1-units` | Buy flow — enter units | — | Stable |
| 05 | `05-buy-step2-review` | Buy review (equity/REIT) | — | Stable |
| 05b | `05b-buy-review-bond` | Buy review — OTA coupon bond | OTA | Stable |
| **05c** | **`05c-buy-review-bta`** | **Buy review — BTA discount bond** | **BTA** | **New** |
| 06 | `06-buy-step3-confirmation` | Buy confirmation | — | Stable |
| 07 | `07-sell-step1-amount` | Sell flow — enter amount | — | Stable |
| 08 | `08-sell-step2-review` | Sell review | — | Stable |
| 09 | `09-sell-step3-confirmation` | Sell confirmation | — | Stable |
| **09b** | **`09b-bta-redemption`** | **BTA maturity redemption confirmation** | **BTA** | **New** |
| 10 | `10-portfolio` | Portfolio holdings | — | Stable |
| **11** | **`11-income-calendar`** | **Income calendar** (gross/net/IRCM per unit) | OTA / all | **Updated** |
| 12 | `12-order-history` | Order history list | — | Stable |
| 13 | `13-order-detail` | Order detail | — | Stable |
| 15 | `15-wallet-balance` | Fineract wallet balance | — | Stable |
| 16 | `16-insufficient-funds-warning` | Feasibility warning (insufficient funds) | — | Stable |

## Bond Type Distinctions

The platform supports two government bond types issued in the CEMAC zone:

**OTA — Obligation du Trésor Actualisée (Coupon Bond)**
- Pays periodic coupons (semi-annual)
- Price has a dirty/clean split: buyer pays clean price + accrued interest
- IRCM applies to coupon income
- Screens: 03b, 05b

**BTA — Bon du Trésor Actualisé (Discount Bond / Zero-Coupon)**
- No periodic coupon payments
- Issued below face value; price accretes daily toward face value at maturity
- Buyer pays the current accreted ask price — no accrued interest added
- Capital gain (face − purchase price) realised at maturity; IRCM deducted then
- Price updated daily at 00:20 WAT by `BtaPriceAccretionScheduler`
- Screens: 03c, 05c, 09b

## Data Sources

| Layer | Endpoint | Used by |
|-------|----------|---------|
| Asset catalogue | `GET /assets/{id}` → `AssetPublicDetailResponse` | 03, 03b, 03c |
| Feasibility check | `GET /assets/{id}/feasibility` → `FeasibilityResponse` | 05, 05b, 05c |
| Trade quote | `POST /trades/quote` → `QuoteResponse` | 05, 05b, 05c |
| Order confirm | `POST /trades/orders/{id}/confirm` | 05, 05b, 05c |
| Income calendar | `GET /portfolio/income-calendar` → `IncomeCalendarResponse` | 11 |
| Redemption detail | `GET /portfolio/orders/{id}` → `OrderDetailResponse` | 09b |

## Changelog

| Date | Change |
|------|--------|
| 2026-04-14 | Added 03c (BTA asset detail), 05c (BTA buy review), 09b (BTA redemption) + spec SVGs. Updated 11 (income calendar) with gross/net/IRCM per unit. Driven by PR #315 bond lifecycle accounting. |
| 2026-04-09 | Added spec SVG field-mapping companions for all 18 prior screens. |
| 2026-03-27 | Removed LP spread from insufficient-funds screen; added registration duty example. |
| 2026-03-24 | Removed TVA from sell review (buyer-only). Fixed sell review layout overlap. |
| 2026-03-21 | Removed outdated screens; cleaned up bond annotations. |
| 2025-12-04 | Initial wireframe set for customer-facing asset service. |
