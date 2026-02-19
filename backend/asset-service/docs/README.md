# Asset Service

Middleware API for a tokenized Real-World Asset (RWA) marketplace built on Apache Fineract. Assets are modeled as custom currencies in Fineract savings accounts, with a Company Treasury acting as the sole market maker.

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
| `FEE_COLLECTION_ACCOUNT_ID` | — | Platform-wide fee collection savings account ID |
| `SPREAD_COLLECTION_ACCOUNT_ID` | — | Spread collection savings account ID (optional) |
| `ARCHIVAL_RETENTION_MONTHS` | `12` | Months to retain records before archival |
| `ARCHIVAL_BATCH_SIZE` | `1000` | Rows per archival batch |

## Database

Flyway migrations create the following tables:
- `assets` — Asset catalog (symbol, currency code, category, status, supply, bond fields)
- `asset_prices` — Current price + OHLC data
- `price_history` — Time-series for charts
- `user_positions` — WAP tracking per user per asset
- `orders` — Trade orders with idempotency
- `trade_log` — Executed trades (immutable audit log)
- `user_favorites` — Watchlist
- `interest_payments` — Bond coupon payment audit log
- `portfolio_snapshots` — Daily portfolio value snapshots for performance charting
- `orders_archive` — Archived old orders (moved by ArchivalScheduler)
- `trade_log_archive` — Archived old trade logs (moved by ArchivalScheduler)

## API Documentation

- [Customer API Guide](CUSTOMER-API-GUIDE.md) - Integration guide for the customer-facing app
- [Admin Guide](ADMIN-GUIDE.md) - Asset management operations
- [Accounting Guide](ACCOUNTING.md) - GL account mappings and journal entries

## Scheduled Jobs

| Job | Schedule | Purpose |
|-----|----------|---------|
| MaturityScheduler | 00:05 WAT daily | Transitions ACTIVE bonds to MATURED when maturity date passes |
| InterestPaymentScheduler | 00:15 WAT daily | Pays bond coupons to all holders of eligible bonds |
| StaleOrderCleanupScheduler | Every 5 min | Fails stale PENDING orders, flags stuck EXECUTING as NEEDS_RECONCILIATION |
| PriceSnapshotScheduler | Hourly (configurable) | Captures price snapshots for chart history |
| OhlcScheduler | Every 60s | Resets/closes daily OHLC candles at market open/close |
| PortfolioSnapshotScheduler | 20:30 WAT daily | Takes daily portfolio value snapshots for performance charting |
| ArchivalScheduler | 03:00 WAT 1st of month | Archives trade_log + orders older than retention period (default 12 months) |

## Market Hours

Trading is only allowed **8:00 AM - 8:00 PM WAT** (Africa/Douala), Monday-Friday. Configured in `application.yml` under `asset-service.market-hours`.
