# Asset Service — Feature Reference

A comprehensive catalog of every capability provided by the asset service.

---

## 1. Asset Lifecycle Management

### 1.1 Asset Creation & Provisioning
Create digital assets across six categories: **Stocks, Bonds, Commodities, Real Estate, Crypto, Agriculture**. Each asset receives a unique symbol, currency code, and treasury accounts (cash + inventory) provisioned automatically in Fineract.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets` | Create a new asset |

- Configurable decimal places (0–8) for fractional unit support
- Automatic Fineract savings product creation with custom currency code

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
Increase total supply by depositing additional units into the treasury inventory account.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/mint` | Mint additional supply |

- Only available for ACTIVE assets.

---

## 2. Pricing

### 2.1 Manual Price Setting
Admin-controlled price override for MANUAL price mode assets. Updates current price, previous close, and OHLC data.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/set-price` | Set exact price |

### 2.2 Current Price
Returns the latest price along with 24h change, day open/high/low/close, and bid/ask prices.

| Endpoint | Description |
|---|---|
| `GET /api/prices/{assetId}` | Get current price + OHLC summary |

### 2.3 OHLC Data
Daily candlestick bars for charting.

| Endpoint | Description |
|---|---|
| `GET /api/prices/{assetId}/ohlc` | Get OHLC candlestick data |

### 2.4 Price History
Historical price time series for chart rendering. Snapshots captured hourly via cron.

| Endpoint | Description |
|---|---|
| `GET /api/prices/{assetId}/history?period={1D\|1W\|1M\|3M\|1Y\|ALL}` | Get historical price data |

### 2.5 Bid/Ask Spreads
Two-sided pricing derived from a configurable `spread_percent` per asset.

- **Ask** (buy price) = price × (1 + spread/2)
- **Bid** (sell price) = price × (1 − spread/2)

---

## 3. Trading

### 3.1 Trade Preview (Unit-based)
Simulate a trade before execution. Returns gross/net amounts, fees, and feasibility checks (balance, inventory, limits, lockup, market hours).

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
Purchase asset units via an atomic 2-leg Fineract batch transaction.

| Endpoint | Description |
|---|---|
| `POST /api/trades/buy` | Execute buy (requires `X-Idempotency-Key` header) |

- Debits user XAF account, credits user asset account
- Debits treasury asset account, credits treasury XAF account
- Collects trading fee and spread
- Updates circulating supply and position tracking

### 3.4 Sell Execution
Sell asset units. Calculates realized P&L using FIFO cost basis.

| Endpoint | Description |
|---|---|
| `POST /api/trades/sell` | Execute sell (requires `X-Idempotency-Key` header) |

- Checks sufficient holdings and respects lockup periods
- Updates average purchase price and realized P&L

### 3.5 Order History & Detail

| Endpoint | Description |
|---|---|
| `GET /api/trades/orders?assetId={optional}` | List user's past orders (paginated) |
| `GET /api/trades/orders/{id}` | Get single order detail |

### 3.6 Trading Fees
A configurable `trading_fee_percent` (default 0.5%) is applied to the cash amount on each trade. Fee proceeds are routed to a fee income GL account.

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

### 4.4 P&L Tracking
- **Realized P&L**: FIFO-based gain/loss calculated on every SELL
- **Cost Basis**: Weighted average purchase price updated on every BUY

---

## 5. Exposure Limits & Risk Controls

Per-asset configurable limits to manage risk concentration.

| Limit | Description |
|---|---|
| **Max Order Size** | Caps the number of units in a single order |
| **Max Position Percent** | Prevents a single user from owning more than X% of total supply |
| **Daily Trade Limit (XAF)** | Caps total XAF volume traded per asset per day |

- All limits are optional (null = unlimited).
- Enforced at both preview and execution time.
- Blocker codes: `ORDER_SIZE_LIMIT_EXCEEDED`, `POSITION_LIMIT_EXCEEDED`

---

## 6. Lock-up Periods

Configurable restriction that prevents selling for a specified number of days after first purchase.

- Tracks `first_purchase_date` per position
- Null `lockup_days` = no restriction
- Blocker code: `LOCKUP_PERIOD_ACTIVE`

---

## 7. Market Hours

Trading is only allowed during configured market hours.

| Endpoint | Description |
|---|---|
| `GET /api/market/status` | Get market open/closed state, next open/close times, countdown |

- Default: **08:00–20:00 Africa/Douala (WAT)**, weekdays only
- Weekend trading disabled by default
- Trades submitted outside hours are rejected

---

## 8. Bond Features

### 8.1 Bond Creation
Create fixed-income bonds with coupon schedule and maturity date.

- Fields: `issuer`, `interestRate`, `couponFrequencyMonths`, `maturityDate`, `nextCouponDate`

### 8.2 Coupon Payments
Pay periodic interest to all bond holders.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/coupons/trigger` | Trigger coupon payment |
| `GET /api/admin/assets/{id}/coupons` | View coupon payment history |

- Formula: `(units × faceValue × annualRate × periodMonths) / (12 × 100)`
- Auto-advances `nextCouponDate` after each payment
- Partial failure isolation (per-holder success/fail tracking)

### 8.3 Coupon Forecast
Project remaining coupon obligations until maturity.

| Endpoint | Description |
|---|---|
| `GET /api/admin/assets/{id}/coupon-forecast` | Get coupon forecast |

- Shows total remaining liability, principal at maturity, treasury balance, and any shortfall

### 8.4 Bond Maturity
Daily scheduler automatically transitions bonds to MATURED status when `maturityDate` is reached. Matured bonds cannot be traded.

### 8.5 Principal Redemption
Return face value to all bond holders at maturity.

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/redeem` | Redeem matured bond principal |
| `GET /api/admin/assets/{id}/redemptions` | View redemption history |

- Transfers XAF from treasury to each holder (units × faceValue)
- Returns asset units from holder back to treasury
- Partial failure isolation for retry

---

## 9. Income Distribution

Recurring income for non-bond assets (dividends, rent, harvest yields, royalties).

### 9.1 Configuration
Set income type, rate, frequency, and next distribution date per asset.

- Supported types: `DIVIDEND`, `RENT`, `HARVEST`, `ROYALTY`

### 9.2 Distribution Trigger

| Endpoint | Description |
|---|---|
| `POST /api/admin/assets/{id}/income-distributions/trigger` | Trigger income distribution |
| `GET /api/admin/assets/{id}/income-distributions` | View distribution history |

- Iterates all holders, calculates payment, transfers XAF from treasury
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

---

## 12. Admin Operations

### 12.1 Asset Management

| Endpoint | Description |
|---|---|
| `GET /api/admin/assets` | List all assets (all statuses) |
| `GET /api/admin/assets/{id}` | Asset detail with internal IDs |
| `GET /api/admin/assets/inventory` | Supply tracking across all assets |

### 12.2 Order Management

| Endpoint | Description |
|---|---|
| `GET /api/admin/orders?status=&assetId=&search=&fromDate=&toDate=` | List orders with filters |
| `GET /api/admin/orders/summary` | Order counts by status |
| `GET /api/admin/orders/{id}` | Order detail with Fineract batch ID |
| `POST /api/admin/orders/{id}/resolve` | Resolve stuck/failed orders |
| `GET /api/admin/orders/asset-options` | Distinct assets for filter dropdown |

- Order statuses: PENDING, EXECUTING, FILLED, FAILED, NEEDS_RECONCILIATION, RESOLVED, CANCELLED

### 12.3 Dashboard

| Endpoint | Description |
|---|---|
| `GET /api/admin/dashboard/summary` | Platform health overview |

- Asset counts by status, 24h trading volume, order health, reconciliation status, treasury balances

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

Every admin API call is automatically logged for compliance.

| Endpoint | Description |
|---|---|
| `GET /api/admin/audit-log?admin=&assetId=&action=` | View audit trail (paginated, filterable) |

- Fields: action, admin subject, target asset, result, error message, duration

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

- Types: trade confirmations, coupon payments, income distributions, price alerts

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
On asset activation, the service creates in Fineract:
- Savings product with custom currency code
- Treasury cash account (XAF)
- Treasury asset inventory account (asset currency)
- GL account mappings

### 17.2 Atomic Trade Execution
Uses the Fineract batch API for atomic 2-leg transfers. Both legs succeed or both fail. Stores `fineractBatchId` on every Order.

### 17.3 Treasury Management
- Treasury client holds omnibus accounts for all assets
- Inventory account tracks available supply
- Cash account receives trade payments and disburses benefits (coupons, income, redemptions)

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

15 database tables managed by 15 Flyway migrations:

| Table | Purpose |
|---|---|
| `assets` | Asset metadata and configuration |
| `asset_prices` | Current price + OHLC data |
| `price_history` | Historical price snapshots |
| `user_positions` | Portfolio holdings per user-asset |
| `orders` | Trade orders |
| `trade_log` | Executed trade details |
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

57+ scenarios across 17 feature files covering end-to-end workflows for all major features. Tests run with embedded Fineract via Testcontainers (PostgreSQL + Redis + Fineract).

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
