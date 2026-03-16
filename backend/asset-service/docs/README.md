# Asset Service

Middleware API for a tokenized Real-World Asset (RWA) marketplace built on Apache Fineract. Assets are modeled as custom currencies in Fineract savings accounts. Liquidity Partners (LPs) purchase assets from original issuers off-platform and resell them to investors on the platform, acting as the counterparty for all trades.

## Architecture

```
Customer App ──┐
               ├──> asset-service ──> PostgreSQL
Admin App ─────┘        │                Redis
                        ▼
                    Fineract (currencies, savings products, account transfers)
```

## Tech Stack

- Java 21, Spring Boot 3.2.2, Maven
- PostgreSQL 15 (Flyway migrations)
- Redis 7 (price cache, distributed trade locks)
- Keycloak (OAuth2/JWT authentication)
- Micrometer + OTLP (metrics/tracing)

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 21+ (for local development)

### Run with Docker Compose

```bash
cd backend/asset-service
docker compose up -d
```

This starts PostgreSQL (port 5433) and Redis (port 6380). Then run the service:

```bash
mvn spring-boot:run
```

The service starts on **port 8083**.

### Swagger UI

http://localhost:8083/swagger-ui.html

### Health Check

http://localhost:8083/actuator/health

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/asset_service` | PostgreSQL connection |
| `SPRING_DATASOURCE_USERNAME` | `asset_service` | DB username |
| `SPRING_DATASOURCE_PASSWORD` | `password` | DB password |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `FINERACT_URL` | `https://localhost` | Fineract base URL |
| `FINERACT_TENANT` | `default` | Fineract tenant ID |
| `FINERACT_AUTH_TYPE` | `basic` | Auth type: `basic` or `oauth` |
| `FINERACT_USERNAME` | `mifos` | Fineract username (basic auth) |
| `FINERACT_PASSWORD` | `password` | Fineract password (basic auth) |
| `KEYCLOAK_ISSUER_URI` | — | Keycloak realm issuer URI |
| `KEYCLOAK_JWK_SET_URI` | — | Keycloak JWKS endpoint |
| `SETTLEMENT_CURRENCY` | `XAF` | ISO 4217 settlement currency code |
| `FEE_COLLECTION_ACCOUNT_EXTERNAL_ID` | `PLATFORM-FEE-COLLECT` | External ID of the fee collection savings account (auto-resolved at startup) |
| `SPREAD_COLLECTION_ACCOUNT_ID` | — | Deprecated — LP spread accounts are now per-asset (auto-created) |
| `ARCHIVAL_RETENTION_MONTHS` | `12` | Months to retain records before archival |
| `ARCHIVAL_BATCH_SIZE` | `1000` | Rows per archival batch |
| `GL_TAX_REGISTRATION_DUTY` | `142` | GL code for registration duty tax payable |
| `GL_TAX_IRCM` | `143` | GL code for IRCM withholding tax payable |
| `GL_TAX_CAPITAL_GAINS` | `144` | GL code for capital gains tax payable |
| `TAX_AUTHORITY_EXTERNAL_ID` | `TAX-AUTHORITY` | External ID of DGI Tax Authority client |
| `TAX_REG_DUTY_ACCOUNT_EXTERNAL_ID` | `TAX-REG-DUTY` | External ID of registration duty collection account |
| `TAX_IRCM_ACCOUNT_EXTERNAL_ID` | `TAX-IRCM` | External ID of IRCM collection account |
| `TAX_CAP_GAINS_ACCOUNT_EXTERNAL_ID` | `TAX-CAP-GAINS` | External ID of capital gains collection account |
| `TAX_DEFAULT_REGISTRATION_DUTY_RATE` | `0.02` | Default registration duty rate (2%) |
| `TAX_DEFAULT_IRCM_DIVIDEND_RATE` | `0.165` | Default IRCM rate for dividends (16.5%) |
| `TAX_DEFAULT_IRCM_BVMAC_RATE` | `0.11` | IRCM rate for BVMAC-listed securities (11%) |
| `TAX_DEFAULT_IRCM_BOND_RATE` | `0.055` | IRCM rate for bonds with maturity ≥ 5yr (5.5%) |
| `TAX_DEFAULT_CAPITAL_GAINS_RATE` | `0.165` | Default capital gains tax rate (16.5%) |
| `TAX_CAPITAL_GAINS_ANNUAL_EXEMPTION` | `500000` | Annual capital gains exemption in XAF |

## Database

Flyway migrations create the following tables:
- `assets` — Asset catalog (symbol, currency code, category, status, supply, bond fields)
- `asset_prices` — Current price + OHLC data
- `price_history` — Time-series for charts
- `user_positions` — WAP tracking per user per asset
- `orders` — Trade orders with idempotency (includes quote columns: quoted_at, quote_expires_at, quoted_ask_price, quoted_bid_price)
- `trade_log` — Executed trades (immutable audit log)
- `user_favorites` — Watchlist
- `interest_payments` — Bond coupon payment audit log
- `portfolio_snapshots` — Daily portfolio value snapshots for performance charting
- `purchase_lots` — FIFO cost basis tracking per user per asset
- `principal_redemptions` — Bond redemption payment history
- `income_distributions` — Non-bond income payment history
- `scheduled_payments` — Pending coupon/income payment schedules awaiting admin confirmation
- `reconciliation_reports` — Discrepancy reports between asset-service and Fineract
- `audit_log` — Admin action audit trail (IP, user agent, duration)
- `notification_log` — User and admin broadcast notifications
- `notification_preferences` — Per-user notification event toggles
- `category_snapshots` — Per-category daily portfolio value snapshots
- `orders_archive` — Archived old orders (moved by ArchivalScheduler)
- `trade_log_archive` — Archived old trade logs (moved by ArchivalScheduler)
- `tax_transactions` — Tax calculation and collection audit trail (registration duty, IRCM, capital gains)

## Documentation

- [API Guide](ADMIN-GUIDE.md) - Complete API reference (Part 1: Customer-facing API, Part 2: Admin API)
- [Asset Manager UI Guide](ASSET-MANAGER-GUIDE.md) - Step-by-step guide for using the Asset Manager web application
- [Accounting Guide](ACCOUNTING.md) - GL account mappings, settlement flows, and journal entries

## Scheduled Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| MaturityScheduler | 00:05 WAT daily | Transitions ACTIVE bonds to MATURED when maturity date passes |
| InterestPaymentScheduler | 00:15 WAT daily | Pays bond coupons to all holders of eligible bonds |
| QuoteExpiryScheduler | Every 10s | Cancels expired QUOTED orders and releases soft-reserved inventory |
| TradeWorkerService | Every 5s (fallback) | Picks up PENDING orders for async execution (also event-driven) |
| StaleOrderCleanupScheduler | Every 5 min | Fails stale PENDING orders, flags stuck EXECUTING as NEEDS_RECONCILIATION |
| PriceSnapshotScheduler | Hourly (configurable) | Captures price snapshots for chart history |
| OhlcScheduler | Every 60s | Resets/closes daily OHLC candles at market open/close |
| PortfolioSnapshotScheduler | 20:30 WAT daily | Takes daily portfolio value snapshots for performance charting |
| IncomeDistributionScheduler | 00:30 WAT daily | Creates pending income distribution schedules for eligible non-bond assets |
| AccruedInterestScheduler | 00:30 WAT daily | Accrues daily interest on bond positions |
| DelistingScheduler | Daily | Executes forced buyback on delisting date |
| ReconciliationScheduler | 01:30 WAT daily | Compares asset-service state vs Fineract, creates discrepancy reports |
| TreasuryShortfallScheduler | Daily | Checks LP cash coverage for upcoming coupon/income obligations |
| ArchivalScheduler | 03:00 WAT 1st of month | Archives trade_log + orders older than retention period (default 12 months) |

## Market Hours

Trading is only allowed **8:00 AM - 8:00 PM WAT** (Africa/Douala), Monday-Friday. Configured in `application.yml` under `asset-service.market-hours`.
