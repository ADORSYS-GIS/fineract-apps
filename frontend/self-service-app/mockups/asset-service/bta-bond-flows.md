# BTA Bond Flows — Design Documentation

Documentation for the three BTA-specific screens added in April 2026 (PR #315 — bond lifecycle accounting).

## Context: What is a BTA?

A **BTA (Bon du Trésor Actualisé)** is a zero-coupon discount government bond issued in the CEMAC zone. Key characteristics:

- Issued **below face value** (e.g., 9,268 XAF for a face value of 10,000 XAF)
- **No periodic coupon payments** — the return is entirely realised as a capital gain at maturity
- Price **accretes daily** toward the face value as the maturity date approaches
- Capital gain at maturity is subject to **IRCM** (Impôt sur Revenus des Capitaux Mobiliers) at 16.5%
- Maturity is typically short-term (3 months, 6 months, 1 year, 2 years)

Contrast with an **OTA (Obligation du Trésor Actualisée)**: OTA bonds pay semi-annual coupons; the buyer pays accrued interest on top of the clean price at purchase.

## Screen 03c — BTA Asset Detail

**File:** `03c-bta-bond-asset-detail.svg` / `03c-bta-bond-asset-detail.spec.svg`

### What it shows

The detail screen for a BTA bond, displayed when a user taps a BTA entry in the market list (screen 02).

| Section | Key difference from OTA (03b) |
|---------|-------------------------------|
| Price block | Shows "Prix Actualisé" (accreted price). No dirty/clean split. No accrued interest row. |
| Bond type badge | "BTA · Discount Bond" (purple) instead of "OTA · Coupon Bond" |
| Bond details grid | Rows: taux implicite, prix nominal, maturité, ACT/360, jours restants, prix d'émission initial, ISIN, émetteur |
| Capital gain card | Replaces the coupon forecast table. Shows: gain brut/unité, IRCM retenu, gain net/unité |

### Price Accretion

The displayed ask price is set daily by `BtaPriceAccretionScheduler` (runs at 00:20 WAT, after `MaturityScheduler`):

```
theoreticalPrice = faceValue / (1 + impliedRate × daysToMaturity / 360)

impliedRate = (faceValue / issuerPrice − 1) × (360 / originalTotalDays)

originalTotalDays = dayjs(maturityDate).diff(issueDate, 'day')
daysToMaturity    = dayjs(maturityDate).diff(today, 'day')
```

The spread ratio from the current ask is preserved when updating the bid.

### Capital Gain Projection (client-side computed)

```
gainBrut   = faceValue − ask          // remaining gain from today's price
ircm       = gainBrut × ircmRate      // ircmRate from taxConfig.ircmRate (16.5%)
gainNet    = gainBrut − ircm
```

Note: this projection is based on the **current ask price**. If the user buys at a different price on a different day, the actual gain will differ.

## Screen 05c — BTA Buy Review

**File:** `05c-buy-review-bta.svg` / `05c-buy-review-bta.spec.svg`

### What it shows

Step 2 of 3 in the buy flow, specific to BTA discount bonds.

### Why there is no "Accrued Interest" line

BTA bonds are zero-coupon. There are no coupon periods, so there is no accrued interest to compensate the seller for. The buyer pays exactly the accreted ask price × units.

### Order breakdown

| Line item | Value | Source |
|-----------|-------|--------|
| Prix actualisé / unité | accreted ask price | `QuoteResponse.executionPrice` |
| Sous-total | units × executionPrice | `QuoteResponse.grossAmount` |
| Frais de plateforme | 0.3% | `QuoteResponse.fee` |
| TVA (buyer-only) | 19.25% on fee | computed |
| **Total à débiter** | subtotal + fee + TVA | `QuoteResponse.netAmount` |

IRCM does **not** appear in the order summary because it is not charged at purchase time. It is deferred to maturity.

### Capital Gain Projection card (replaces coupon projection)

```
gainBrutTotal  = units × (faceValue − executionPrice)
ircmRetenu     = gainBrutTotal × ircmRate
gainNetEstimé  = gainBrutTotal − ircmRetenu
principalTotal = units × faceValue      // amount credited at maturity before IRCM
```

This card gives the buyer a clear picture of expected return at maturity.

## Screen 09b — BTA Maturity Redemption

**File:** `09b-bta-redemption.svg` / `09b-bta-redemption.spec.svg`

### What it shows

A push-notification-triggered confirmation screen that appears when the user's BTA bond reaches its maturity date and is automatically redeemed by the platform.

### How it is triggered

1. `BtaMaturityScheduler` runs on the bond's maturity date
2. `PrincipalRedemptionService.redeemBta()` is called for all holders
3. IRCM is computed and deducted; net proceeds are credited to the customer's Fineract savings account
4. A push notification is dispatched; tapping it opens screen 09b with the order ID

### Redemption calculation

```
grossProceeds    = units × faceValue
capitalGain      = (faceValue − avgPurchasePrice) × units
ircmWithheld     = capitalGain × ircmRate
netProceeds      = grossProceeds − ircmWithheld
```

`avgPurchasePrice` is the weighted-average cost basis across all the customer's BTA purchases of that asset (different lots at different accreted prices).

### API Fields Reference

| UI Label | DTO Field | Screen(s) |
|----------|-----------|-----------|
| Prix Actualisé | `AssetPublicDetailResponse.ask` | 03c |
| Valeur nominale | `.faceValue` | 03c, 05c, 09b |
| Taux implicite | computed client-side | 03c |
| Jours restants | computed: `dayjs(maturityDate).diff(today, 'day')` | 03c |
| Prix d'émission initial | `.issuerPrice` | 03c |
| Prix actualisé / unité | `QuoteResponse.executionPrice` | 05c |
| Gain brut total | computed: `units × (faceValue − executionPrice)` | 05c |
| IRCM retenu (buy preview) | computed: `gainBrut × ircmRate` | 05c |
| Unités remboursées | `OrderDetailResponse.units` | 09b |
| Produit brut | `OrderDetailResponse.grossProceeds` | 09b |
| Prix d'achat moyen | `OrderDetailResponse.avgPurchasePrice` | 09b |
| Gain en capital | `OrderDetailResponse.capitalGain` | 09b |
| IRCM retenu (redemption) | `OrderDetailResponse.ircmWithheld` | 09b |
| Produit net crédité | `OrderDetailResponse.netProceeds` | 09b |

## Tax Rules Summary

| Event | Tax | Rate | When |
|-------|-----|------|------|
| BTA purchase | None | — | Not at purchase |
| BTA coupon | None | — | No coupons exist |
| BTA maturity redemption | IRCM on capital gain | 16.5% | At maturity |
| OTA coupon receipt | IRCM | 16.5% | Per coupon payment |
| Dividend receipt | IRCM | 16.5% | Per dividend payment |
| Rent income | None (CEMAC rule) | — | Per payment |

IRCM rate is stored per-asset in `AssetPublicDetailResponse.taxConfig.ircmRate`. The 16.5% figure applies to Cameroon; other CEMAC countries may differ.
