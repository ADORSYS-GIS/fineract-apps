# Asset Service — Feature Reference

A comprehensive catalog of every capability provided by the asset service.

---

## 1. Asset Lifecycle Management

### 1.1 Asset Creation & Provisioning
Create digital assets across six categories: **Stocks, Bonds, Commodities, Real Estate, Crypto, Agriculture**. Each asset is managed by a **Liquidity Partner (LP)** — a reseller who purchased the asset from the original issuer and sells it on the platform. During provisioning, three accounts are created automatically in Fineract: an LP asset account (token inventory), an LP spread account (margin collection), and the LP's existing cash account is linked.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets` | Create a new asset |

- Configurable decimal places (0–8) for fractional unit support
- Automatic Fineract savings product creation with custom currency code
- Per-asset LP spread account for margin tracking

### 1.2 Activation
Transition an asset from PENDING to ACTIVE, enabling trading.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/activate` | Activate a pending asset |

### 1.3 Halt & Resume
Temporarily suspend trading without affecting existing positions.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/halt` | ACTIVE → HALTED |
| `POST /api/admin/assets/{id}/resume` | HALTED → ACTIVE |

- All buy/sell orders are blocked while halted.

### 1.4 Metadata Updates
Update display information (name, description, image URL) without affecting financial state.

| Endpoint | Description |
|---|---|
| `PUT /api/admin/assets/{id}` | Update asset metadata |

### 1.5 Supply Minting
Increase total supply by depositing additional units into the LP's asset inventory account.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/mint` | Mint additional supply |

- Only available for ACTIVE assets.

---

## 2. Pricing

### 2.1 Dual Pricing Model
Each asset has three price references:
- **Issuer Price** — wholesale/face value from the original issuer (immutable, used for coupon/income calculations)
- **LP Ask Price** — what investors pay to buy (set by LP, >= issuer price)
- **LP Bid Price** — what investors receive when selling (set by LP, <= ask price)

The LP's margin per unit = `askPrice - issuerPrice`.

### 2.2 Manual Price Setting
Admin-controlled price override for MANUAL price mode assets. Can update reference price and LP bid/ask independently.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/set-price` | Set price and optionally bid/ask |

### 2.3 Current Price
Returns the latest price along with 24h change, day open/high/low/close, and LP bid/ask prices.

| Endpoint | Description |
|---|---|
| `GET /api/prices/{assetId}` | Get current price + OHLC summary |

### 2.4 OHLC Data
Daily candlestick bars for charting.

| Endpoint | Description |
|---|---|
| `GET /api/prices/{assetId}/ohlc` | Get OHLC candlestick data |

### 2.5 Price History
Historical price time series for chart rendering. Snapshots captured hourly via cron.

| Endpoint | Description |
|---|---|
| `GET /api/prices/{assetId}/history?period={1D\|1W\|1M\|3M\|1Y\|ALL}` | Get historical price data |

---

## 3. Trading

### 3.1 Trade Preview (Unit-based)
Simulate a trade before execution. Returns gross/net amounts, fees, LP margin, and feasibility checks (balance, inventory, limits, lockup, market hours).

| Endpoint | Description |
|---|---|
| `POST /api/trades/preview` | Preview trade with `units` field |

### 3.2 Trade Preview (Amount-based)
Specify an XAF budget and compute the maximum purchasable units plus remainder.

| Endpoint | Description |
|---|---|
| `POST /api/trades/preview` | Preview trade with `amount` field |

- Returns `computedFromAmount: true`, calculated units, and XAF remainder.

### 3.3 Buy Execution
Purchase asset units via an atomic Fineract batch transaction. The investor pays the LP's ask price.

| Endpoint | Description |
|---|---|
| `POST /api/trades/buy` | Execute buy (requires `X-Idempotency-Key` header) |

- Debits investor XAF → LP cash (issuer-price portion), LP spread (margin), fee collection (trading fee)
- Transfers tokens from LP asset account → investor asset account
- Updates circulating supply and position tracking

### 3.4 Sell Execution
Sell asset units back to the LP at the bid price. Calculates realized P&L using FIFO cost basis.

| Endpoint | Description |
|---|---|
| `POST /api/trades/sell` | Execute sell (requires `X-Idempotency-Key` header) |

- Checks sufficient holdings and respects per-lot lockup periods
- FIFO lot consumption: oldest purchase lots are sold first
- Per-lot realized P&L: `(sellPrice - lotPurchasePrice) × lotUnits`
- Average purchase price recalculated from remaining lots after sell
- LP capital adequacy check: rejects if LP cash insufficient for payout (`INSUFFICIENT_LP_FUNDS`)

### 3.5 Order History & Detail

| Endpoint | Description |
|---|---|
| `GET /api/trades/orders?assetId={optional}` | List user's past orders (paginated) |
| `GET /api/trades/orders/{id}` | Get single order detail |

### 3.6 Trading Fees
A configurable `trading_fee_percent` (default 0.5%) is applied to the cash amount on each trade. Fee proceeds are routed to the platform's fee collection account.

### 3.7 Idempotency
The `X-Idempotency-Key` header prevents duplicate trade execution. Submitting the same key returns the original result.

---

## 4. Portfolio & Positions

### 4.1 Portfolio Summary
Full portfolio view with all positions, total value, and unrealized/realized P&L.

| Endpoint | Description |
|---|---|
| `GET /api/portfolio` | Get portfolio summary |

### 4.2 Single Position Detail
Detailed breakdown of one asset holding: units, average cost, current value, P&L.

| Endpoint | Description |
|---|---|
| `GET /api/portfolio/positions/{assetId}` | Get position detail |

### 4.3 Portfolio Value History
Time series of portfolio value for charting growth over time. Daily snapshots captured at 20:30 Africa/Douala.

| Endpoint | Description |
|---|---|
| `GET /api/portfolio/history?period={1M\|3M\|6M\|1Y}` | Get portfolio history |

### 4.4 FIFO Cost Basis & P&L Tracking
- **Purchase Lots**: Each BUY creates a `PurchaseLot` tracking units, purchase price, and lockup expiry
- **FIFO Sell**: On SELL, oldest lots are consumed first; per-lot realized P&L is calculated
- **Realized P&L**: Sum of `(sellPrice - lotPurchasePrice) × consumedUnits` across all consumed lots
- **Cost Basis**: Recalculated from remaining lots after each sell; falls back to WAP for legacy positions

### 4.5 Bond Accrued Interest
Daily scheduler accrues interest on bond positions:
- Formula: `units × issuerPrice × (rate / 100) / 365` per day
- Tracked in `accruedInterest` field on `UserPosition`
- Reset to zero on coupon payment

---

## 5. Exposure Limits & Risk Controls

Per-asset configurable limits to manage risk concentration.

| Limit | Description |
|---|---|
| **Min Order Size (units)** | Rejects orders below a minimum number of units |
| **Min Order Amount (XAF)** | Rejects orders below a minimum cash value |
| **Max Order Size** | Caps the number of units in a single order |
| **Max Position Percent** | Prevents a single user from owning more than X% of total supply |
| **Daily Trade Limit (XAF)** | Caps total XAF volume traded per asset per day |
| **Portfolio Exposure Limit (XAF)** | Platform-wide limit on a user's total portfolio value |

- All limits are optional (null = unlimited).
- Enforced at both preview and execution time.
- Portfolio exposure limit is platform-wide (configured in `application.yml`), not per-asset.
- Blocker codes: `MIN_ORDER_SIZE_NOT_MET`, `MIN_ORDER_CASH_NOT_MET`, `ORDER_SIZE_LIMIT_EXCEEDED`, `POSITION_LIMIT_EXCEEDED`, `PORTFOLIO_EXPOSURE_EXCEEDED`

---

## 6. Lock-up Periods

Configurable restriction that prevents selling for a specified number of days after purchase.

### 6.1 Per-Lot Lockup
Each purchase creates a **PurchaseLot** with its own lockup expiry (`lockupExpiresAt = purchaseDate + lockupDays`). Units from a lot become sellable only when its lockup expires. This means different purchase batches unlock independently.

### 6.2 Legacy Fallback
For positions without lots (pre-existing), falls back to global `firstPurchaseDate` check.

- Blocker code: `LOCKUP_PERIOD_ACTIVE`
- Error includes how many units are unlocked vs requested

---

## 7. Market Hours & Order Queuing

### 7.1 Market Hours
Trading is only allowed during configured market hours.

| Endpoint | Description |
|---|---|
| `GET /api/market/status` | Get market open/closed state, next open/close times, countdown |

- Default: **08:00–20:00 Africa/Douala (WAT)**, weekdays only
- Weekend trading disabled by default

### 7.2 Out-of-Hours Order Queuing
Orders submitted outside market hours are **queued** instead of rejected.

- Order status is set to `QUEUED` with the current price stored as `queuedPrice`
- At market open (08:01 WAT, Mon-Fri), the `QueuedOrderScheduler` processes queued orders FIFO
- Orders where the price moved > 5% (configurable) since queue time are **rejected** as stale
- Non-stale orders are promoted to `PENDING` for normal execution

### 7.3 Order Cancellation
Users can cancel their own `PENDING` or `QUEUED` orders.

| Endpoint | Description |
|---|---|
| `POST /api/trades/orders/{id}/cancel` | Cancel a pending/queued order |

- Only `PENDING` and `QUEUED` orders can be cancelled
- Cancelled orders transition to `CANCELLED` status

---

## 8. Bond Features

### 8.1 Bond Creation
Create fixed-income bonds with coupon schedule and maturity date.

- Fields: `issuerName` (original issuer), `interestRate`, `couponFrequencyMonths`, `maturityDate`, `nextCouponDate`
- `issuerName` is required for bonds (the entity that issued the bond, e.g., "Etat du Senegal")
- Coupon amount per unit = `issuerPrice × (interestRate / 100) × (couponFrequencyMonths / 12)`

### 8.2 Coupon Payments
Pay periodic interest to all bond holders. Calculated from the **issuer price** (face value), not the LP's selling price.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/coupons/trigger` | Trigger coupon payment |
| `GET /api/admin/assets/{id}/coupons` | View coupon payment history |

- Formula: `units × issuerPrice × (annualRate / 100) × (periodMonths / 12)`
- Auto-advances `nextCouponDate` after each payment
- Partial failure isolation (per-holder success/fail tracking)

### 8.3 Coupon Forecast
Project remaining coupon obligations until maturity.

| Endpoint | Description |
|---|---|
| `GET /api/admin/assets/{id}/coupon-forecast` | Get coupon forecast |

- Shows total remaining liability, principal at maturity, LP cash balance, and any shortfall

### 8.4 Bond Maturity
Daily scheduler automatically transitions bonds to MATURED status when `maturityDate` is reached. Matured bonds cannot be traded.

### 8.5 Principal Redemption
Return face value to all bond holders at maturity.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/redeem` | Redeem matured bond principal |
| `GET /api/admin/assets/{id}/redemptions` | View redemption history |

- Transfers XAF from LP cash to each holder (units × issuerPrice)
- Returns asset units from holder back to LP asset account
- Partial failure isolation for retry

---

## 9. Income Distribution

Recurring income for non-bond assets (dividends, rent, harvest yields, royalties). Calculated from the **issuer price**, not the LP's selling price.

### 9.1 Configuration
Set income type, rate, frequency, and next distribution date per asset.

- Supported types: `DIVIDEND`, `RENT`, `HARVEST`, `ROYALTY`

### 9.2 Distribution Trigger

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/income-distributions/trigger` | Trigger income distribution |
| `GET /api/admin/assets/{id}/income-distributions` | View distribution history |

- Iterates all holders, calculates payment from issuer price, transfers XAF from LP cash
- Auto-advances `nextDistributionDate`

### 9.3 Income Forecast

| Endpoint | Description |
|---|---|
| `GET /api/admin/assets/{id}/income-forecast` | Project future income obligations |

### 9.4 Income Calendar (User View)
Unified timeline of all upcoming income events across a user's portfolio.

| Endpoint | Description |
|---|---|
| `GET /api/portfolio/income-calendar?months={1-36}` | Get income calendar |

- Aggregates both bond coupons and non-bond income distributions
- Shows projected income by month

---

## 10. Delisting

### 10.1 Initiate Delisting
Schedule an asset for removal with a grace period.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/delist` | Initiate delisting |

- Status → DELISTING, sets `delistingDate` and `delistingRedemptionPrice`
- Blocks new BUY orders, allows SELL orders during grace period

### 10.2 Cancel Delisting
Abort delisting before the deadline.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/cancel-delist` | Cancel delisting |

- Reverts DELISTING → ACTIVE, clears delisting fields

### 10.3 Forced Buyback
Daily scheduler executes automatic buyback at the redemption price on the delisting date. All remaining holders are redeemed and the asset transitions to DELISTED.

---

## 11. Asset Discovery & Catalog

| Endpoint | Description |
|---|---|
| `GET /api/assets?category={optional}&search={optional}` | List active assets (paginated, filterable) |
| `GET /api/assets/{id}` | Get asset detail (public) |
| `GET /api/assets/discover` | Preview upcoming (PENDING) assets |
| `GET /api/assets/{id}/recent-trades` | Last 20 anonymous trades |

- Category filter: STOCKS, BONDS, COMMODITIES, REAL_ESTATE, CRYPTO, AGRICULTURE
- Text search across name and symbol
- Asset listing includes `issuerName`, `lpName`, and `couponAmountPerUnit` (for bonds)

---

## 12. Admin Operations

### 12.1 Asset Management

| Endpoint | Description |
|---|---|
| `GET /api/admin/assets` | List all assets (all statuses) |
| `GET /api/admin/assets/{id}` | Asset detail with LP accounts, issuer price, margin info |
| `GET /api/admin/assets/inventory` | Supply tracking across all assets |

### 12.2 Order Management

| Endpoint | Description |
|---|---|
| `GET /api/admin/orders?status=&assetId=&search=&fromDate=&toDate=` | List orders with filters |
| `GET /api/admin/orders/summary` | Order counts by status |
| `GET /api/admin/orders/{id}` | Order detail with Fineract batch ID |
| `POST /api/admin/orders/{id}/resolve` | Resolve stuck/failed orders |
| `GET /api/admin/orders/asset-options` | Distinct assets for filter dropdown |

- Order statuses: PENDING, EXECUTING, FILLED, FAILED, NEEDS_RECONCILIATION, RESOLVED, CANCELLED, QUEUED, REJECTED

### 12.3 Dashboard

| Endpoint | Description |
|---|---|
| `GET /api/admin/dashboard/summary` | Platform health overview |

- Asset counts by status, 24h trading volume, order health, reconciliation status, LP cash balances

---

## 13. Reconciliation

Verify asset-service state against Fineract account balances.

| Endpoint | Description |
|---|---|
| `POST /api/admin/reconciliation/trigger` | Full reconciliation (all assets) |
| `POST /api/admin/reconciliation/trigger/{assetId}` | Single-asset reconciliation |
| `GET /api/admin/reconciliation/reports?status=&severity=&assetId=` | List discrepancy reports |
| `PATCH /api/admin/reconciliation/reports/{id}/acknowledge` | Acknowledge a report |
| `PATCH /api/admin/reconciliation/reports/{id}/resolve` | Resolve a report |
| `GET /api/admin/reconciliation/summary` | Count of open issues |

- Severity levels: INFO, WARNING, CRITICAL
- Automatic daily scheduled reconciliation via cron

---

## 14. Audit Log

Every admin and trade API call is automatically logged for compliance.

| Endpoint | Description |
|---|---|
| `GET /api/admin/audit-log?admin=&assetId=&action=` | View audit trail (paginated, filterable) |

- Fields: action, admin subject, target asset, result, error message, duration, **client IP**, **user agent**
- Covers all admin controllers and the TradeController
- IP extraction supports `X-Forwarded-For` header (first entry) with `RemoteAddr` fallback

---

## 14b. LP Performance Tracking

Aggregated metrics on LP spread earnings, buyback premiums, and fee commissions.

| Endpoint | Description |
|---|---|
| `GET /api/admin/lp/performance` | LP performance summary with per-asset breakdown |

Response includes:
- `totalSpreadEarned` — sum of LP spread across all trades
- `totalBuybackPremiumPaid` — sum of buyback premiums
- `totalFeeCommission` — sum of trading fees
- `netMargin` — `spread + fees - buyback`
- `totalTrades` — total trade count
- `perAsset[]` — per-asset breakdown with symbol, spread, buyback, fee, net margin, trade count

---

## 15. Favorites / Watchlist

| Endpoint | Description |
|---|---|
| `POST /api/favorites/{assetId}` | Add asset to watchlist |
| `GET /api/favorites` | List favorites with current prices |
| `DELETE /api/favorites/{assetId}` | Remove from watchlist |

- Idempotent: adding the same asset twice is safe

---

## 16. Notifications

### 16.1 User Notifications

| Endpoint | Description |
|---|---|
| `GET /api/notifications` | List notifications (paginated) |
| `GET /api/notifications/unread-count` | Get unread count |
| `POST /api/notifications/{id}/read` | Mark single as read |
| `POST /api/notifications/read-all` | Mark all as read |

- Types: trade confirmations, coupon payments, income distributions, LP shortfall alerts

### 16.2 Notification Preferences

| Endpoint | Description |
|---|---|
| `GET /api/notifications/preferences` | Get preference settings |
| `PUT /api/notifications/preferences` | Update preferences |

- Per-event-type toggles (on/off)

### 16.3 Admin Notifications

| Endpoint | Description |
|---|---|
| `GET /api/admin/notifications` | System-wide admin alerts |

- Broadcast notifications for stuck orders, critical reconciliation issues

---

## 17. Fineract Integration

### 17.1 Automatic Provisioning
On asset creation, the service creates in Fineract:
- Savings product with custom currency code
- LP asset inventory account (holds token supply)
- LP spread account (XAF, collects margin on trades)
- Links the LP's existing XAF cash account
- GL account mappings

### 17.2 Atomic Trade Execution
Uses the Fineract batch API for atomic multi-leg transfers. All legs succeed or all fail. Stores `fineractBatchId` on every Order.

### 17.3 Liquidity Partner Management
- LP client holds accounts for all their managed assets
- LP asset account tracks available supply per asset
- LP cash account receives trade payments and disburses benefits (coupons, income, redemptions)
- LP spread account collects margin per asset

### 17.4 Circuit Breaker
Resilience4j circuit breaker protects against Fineract outages: sliding window of 10 calls, opens at 50% failure rate, 30s recovery wait.

---

## 18. Infrastructure

### 18.1 Trade Locking
Redis-based distributed locks prevent concurrent trades for the same user-asset pair. Falls back to local locking if Redis is unavailable.

- Lock TTL: 45 seconds (configurable)

### 18.2 Rate Limiting
- Trade limit: 10 trades per minute per user (default)
- General API limit: 100 requests per minute per user (default)

### 18.3 Order Archival
Scheduled job moves completed orders older than the retention period (default 12 months) to archive tables in batches of 1,000.

### 18.4 Observability
- Prometheus metrics endpoint
- OTLP tracing integration

---

## Data Model

18 database tables managed by 18 Flyway migrations:

| Table | Purpose |
|---|---|
| `assets` | Asset metadata, LP accounts, issuer price, pricing config |
| `asset_prices` | Current price + OHLC data + LP bid/ask |
| `price_history` | Historical price snapshots |
| `user_positions` | Portfolio holdings per user-asset |
| `orders` | Trade orders (includes `queued_price` for queued orders) |
| `trade_log` | Executed trade details (includes `buyback_premium`) |
| `purchase_lots` | FIFO cost basis lots per user-asset |
| `user_favorites` | Watchlist |
| `interest_payments` | Bond coupon payment history |
| `principal_redemptions` | Bond redemption history |
| `income_distributions` | Non-bond income payment history |
| `portfolio_snapshots` | Historical portfolio values |
| `reconciliation_reports` | Reconciliation discrepancies |
| `audit_log` | Admin action trail |
| `notification_log` | User notifications |
| `notification_preferences` | User notification settings |

---

## E2E Test Coverage

60+ scenarios across 22 feature files covering end-to-end workflows for all major features. Tests run with embedded Fineract via Testcontainers (PostgreSQL + Redis + Fineract).

---

## Configuration Summary

| Setting | Default |
|---|---|
| Port | 8083 |
| Settlement currency | XAF |
| Market hours | 08:00–20:00 Africa/Douala |
| Weekend trading | Disabled |
| Trading fee | 0.5% |
| Trade lock TTL | 45s |
| Rate limit (trades) | 10/min |
| Archive retention | 12 months |
| Price snapshot cron | Hourly |
| Portfolio snapshot cron | Daily 20:30 |
| Circuit breaker window | 10 calls, 50% threshold |
