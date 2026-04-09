# Payment Gateway Service

Spring Boot microservice that integrates mobile money payment providers (MTN MoMo, Orange Money, CinetPay) with Apache Fineract for the Webank self-service banking application.

**Port:** 8082 | **Java 21** | **Spring Boot 3.2** | **PostgreSQL** | **Redis**

## Architecture

```
                                          ┌─────────────────────┐
┌──────────────┐    JWT     ┌─────────────┤   MTN MoMo API      │
│ Self-Service │───────────▶│  Payment    │└─────────────────────┘
│ Frontend     │            │  Gateway    │┌─────────────────────┐
└──────────────┘            │  Service    ├┤  Orange Money API   │
                            │             │└─────────────────────┘
┌──────────────┐  Callbacks │  Port 8082  │┌─────────────────────┐
│ MTN/Orange/  │───────────▶│             ├┤  CinetPay API       │
│ CinetPay     │            │             │└─────────────────────┘
└──────────────┘            │             │┌─────────────────────┐
                            │             ├┤  Apache Fineract    │
                            │             │└─────────────────────┘
                            │             │┌─────────────────────┐
                            │             ├┤  PostgreSQL         │
                            │             │└─────────────────────┘
                            │             │┌─────────────────────┐
                            │             ├┤  Redis (token cache)│
                            └─────────────┘└─────────────────────┘
```

## API Endpoints

### Payment Operations (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/deposit` | Initiate a deposit from mobile money |
| POST | `/api/payments/withdraw` | Initiate a withdrawal to mobile money |
| GET | `/api/payments/status/{id}` | Get transaction status |

### Provider Callbacks (no auth, IP whitelist optional)

| Method | Endpoint | Provider |
|--------|----------|----------|
| POST | `/api/callbacks/mtn/collection` | MTN deposit |
| POST | `/api/callbacks/mtn/disbursement` | MTN withdrawal |
| POST | `/api/callbacks/orange/payment` | Orange deposit |
| POST | `/api/callbacks/orange/cashout` | Orange withdrawal |
| POST | `/api/callbacks/cinetpay/payment` | CinetPay deposit |
| POST | `/api/callbacks/cinetpay/transfer` | CinetPay withdrawal |

### Admin (ADMIN role required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/reversals/dlq` | List unresolved reversal failures |
| PATCH | `/api/admin/reversals/dlq/{id}` | Resolve a DLQ entry |
| GET | `/api/admin/reversals/dlq/count` | Count unresolved entries |

## Quick Start

### Prerequisites
- Java 21, Maven 3.9+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)

### Build & Run
```bash
mvn clean package
mvn spring-boot:run
```

### Docker
```bash
docker build -t payment-gateway:latest .
docker run -p 8082:8082 payment-gateway:latest
```

### API Documentation
- Swagger UI: http://localhost:8082/swagger-ui.html
- OpenAPI spec: http://localhost:8082/api-docs

## Configuration

### Core

| Variable | Description | Default |
|----------|-------------|---------|
| `KEYCLOAK_ISSUER_URI` | Keycloak realm issuer URL | `http://localhost:8080/realms/fineract` |
| `KEYCLOAK_JWK_SET_URI` | Keycloak JWK set URL | (derived from issuer) |
| `SPRING_DATASOURCE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/payment_gateway` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `payment_gateway` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `password` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |

### Fineract

| Variable | Description | Default |
|----------|-------------|---------|
| `FINERACT_URL` | Fineract API base URL | `https://localhost` |
| `FINERACT_AUTH_TYPE` | Auth type: `oauth` or `basic` | `basic` |
| `FINERACT_USERNAME` | Basic auth username | `mifos` |
| `FINERACT_PASSWORD` | Basic auth password | `password` |
| `FINERACT_CLIENT_ID` | OAuth client ID | `fineract-service` |
| `FINERACT_CLIENT_SECRET` | OAuth client secret | - |

### MTN MoMo

| Variable | Description | Default |
|----------|-------------|---------|
| `MTN_BASE_URL` | MTN MoMo API URL | sandbox URL |
| `MTN_COLLECTION_KEY` | Collection subscription key | - |
| `MTN_DISBURSEMENT_KEY` | Disbursement subscription key | - |
| `MTN_API_USER_ID` | API user ID | - |
| `MTN_API_KEY` | API key | - |
| `MTN_FINERACT_PAYMENT_TYPE_ID` | Fineract payment type for MTN | `1` |

### Orange Money

| Variable | Description | Default |
|----------|-------------|---------|
| `ORANGE_BASE_URL` | Orange Money API URL | `https://api.orange.com/...` |
| `ORANGE_TOKEN_URL` | OAuth token URL | `https://api.orange.com/oauth/v3/token` |
| `ORANGE_CLIENT_ID` | OAuth client ID | - |
| `ORANGE_CLIENT_SECRET` | OAuth client secret | - |
| `ORANGE_MERCHANT_CODE` | Merchant code | - |
| `ORANGE_FINERACT_PAYMENT_TYPE_ID` | Fineract payment type for Orange | `2` |

### CinetPay

| Variable | Description | Default |
|----------|-------------|---------|
| `CINETPAY_BASE_URL` | CinetPay checkout API URL | `https://api-checkout.cinetpay.com` |
| `CINETPAY_TRANSFER_URL` | CinetPay transfer API URL | `https://client.cinetpay.com` |
| `CINETPAY_API_KEY` | API key | - |
| `CINETPAY_SITE_ID` | Site ID | - |
| `CINETPAY_SECRET_KEY` | HMAC secret key | - |
| `CINETPAY_TRANSFER_PASSWORD` | Transfer API password | - |

### Operational

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_DAILY_DEPOSIT_MAX` | Daily deposit limit (XAF) | `500000` |
| `APP_DAILY_WITHDRAWAL_MAX` | Daily withdrawal limit (XAF) | `500000` |
| `RATE_LIMIT_PAYMENT` | Payments per minute per user | `5` |
| `RATE_LIMIT_STATUS` | Status checks per minute | `50` |
| `RATE_LIMIT_CALLBACK` | Callbacks per minute per IP | `100` |
| `APP_CLEANUP_ENABLED` | Enable stale transaction cleanup | `true` |
| `APP_DLQ_RETRY_ENABLED` | Enable DLQ auto-retry | `true` |
| `CALLBACK_IP_WHITELIST_ENABLED` | Enable callback IP filtering | `false` |

## Kubernetes Deployment

```bash
kubectl apply -k k8s/base/
```

## Documentation

- [API Reference](docs/API_REFERENCE.md) - Endpoint specs, request/response examples, error codes
- [Architecture Guide](docs/ARCHITECTURE.md) - Internal design, payment flows, security, database schema
