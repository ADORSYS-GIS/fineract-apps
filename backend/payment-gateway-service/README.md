# Payment Gateway Service

A Spring Boot service for integrating mobile money payment providers (MTN MoMo, Orange Money) with Apache Fineract for the Webank self-service banking application.

## Features

- **Deposits**: Collect funds from customers via mobile money and credit their Fineract savings accounts
- **Withdrawals**: Debit Fineract savings accounts and disburse funds to customers via mobile money
- **Multi-provider support**: MTN Mobile Money and Orange Money
- **Async callbacks**: Handle payment status updates from providers
- **JWT authentication**: Secured with Keycloak OAuth2/OIDC

## Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Self-Service   │────▶│  Payment Gateway     │────▶│  MTN MoMo API   │
│  Frontend App   │     │  Service             │     └─────────────────┘
└─────────────────┘     │                      │     ┌─────────────────┐
                        │  - Deposits          │────▶│ Orange Money API│
                        │  - Withdrawals       │     └─────────────────┘
                        │  - Callbacks         │     ┌─────────────────┐
                        │  - Status Queries    │────▶│  Fineract API   │
                        └──────────────────────┘     └─────────────────┘
```

## API Endpoints

### Payments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/deposit` | Initiate a deposit |
| POST | `/api/payments/withdraw` | Initiate a withdrawal |
| GET | `/api/payments/status/{id}` | Get transaction status |

### Callbacks (Provider webhooks)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/callbacks/mtn/collection` | MTN deposit callback |
| POST | `/api/callbacks/mtn/disbursement` | MTN withdrawal callback |
| POST | `/api/callbacks/orange/payment` | Orange deposit callback |
| POST | `/api/callbacks/orange/cashout` | Orange withdrawal callback |

## Payment Flows

### Deposit Flow
1. Customer initiates deposit from mobile app
2. Payment Gateway calls MTN/Orange API to request payment
3. Customer approves payment on their phone (USSD prompt)
4. Provider sends callback on completion
5. Payment Gateway creates Fineract deposit transaction

### Withdrawal Flow
1. Customer initiates withdrawal from mobile app
2. Payment Gateway creates Fineract withdrawal transaction
3. Payment Gateway calls MTN/Orange API to disburse funds
4. Provider sends funds to customer's mobile money account
5. Provider sends callback confirming transfer

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `KEYCLOAK_ISSUER_URI` | Keycloak realm issuer URL | - |
| `FINERACT_URL` | Fineract API base URL | - |
| `FINERACT_USERNAME` | Fineract API username | - |
| `FINERACT_PASSWORD` | Fineract API password | - |
| `MTN_BASE_URL` | MTN MoMo API base URL | sandbox URL |
| `MTN_COLLECTION_KEY` | MTN collection subscription key | - |
| `MTN_DISBURSEMENT_KEY` | MTN disbursement subscription key | - |
| `MTN_API_USER_ID` | MTN API user ID | - |
| `MTN_API_KEY` | MTN API key | - |
| `ORANGE_CLIENT_ID` | Orange API OAuth client ID | - |
| `ORANGE_CLIENT_SECRET` | Orange API OAuth client secret | - |
| `ORANGE_MERCHANT_CODE` | Orange merchant code | - |

## Development

### Prerequisites
- Java 21
- Maven 3.9+
- Docker (optional)

### Build
```bash
mvn clean package
```

### Run locally
```bash
mvn spring-boot:run
```

### Build Docker image
```bash
docker build -t payment-gateway:latest .
```

### API Documentation
When running, OpenAPI documentation is available at:
- Swagger UI: http://localhost:8082/swagger-ui.html
- OpenAPI spec: http://localhost:8082/api-docs

## Kubernetes Deployment

The `k8s/` directory contains Kustomize manifests for Kubernetes deployment.

```bash
# Deploy to Kubernetes
kubectl apply -k k8s/base/
```

## Security Considerations

- All endpoints require JWT authentication (except callbacks)
- Callback endpoints should be secured with IP whitelisting at ingress level
- Secrets (API keys, passwords) are stored in Kubernetes Secrets
- Provider callback signatures should be verified (TODO)

## TODO

- [ ] Implement transaction reversal for failed withdrawals
- [ ] Add WebAuthn step-up authentication for withdrawals
- [ ] Persist transactions to database (currently in-memory)
- [ ] Implement provider callback signature verification
- [ ] Add retry mechanism for failed Fineract transactions
- [ ] Implement idempotency for callback handling
