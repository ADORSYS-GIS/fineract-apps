# Customer Registration Service

Self-service customer registration orchestrator for Fineract and Keycloak.

## Overview

This service handles customer self-registration by:
1. Creating a Fineract client with a unique external ID (UUID)
2. Creating a default savings account for the client
3. Creating a Keycloak user with attributes linking to Fineract
4. Assigning the user to the self-service-customers group
5. Setting required actions for email verification and WebAuthn registration

## Technology Stack

- Java 21
- Spring Boot 3.2
- Keycloak Admin Client
- Spring MVC (REST APIs)
- Micrometer + OpenTelemetry (observability)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/registration/register` | Register a new customer |
| GET | `/api/registration/status/{externalId}` | Get registration status |
| GET | `/api/registration/kyc/status` | Get KYC verification status |
| GET | `/api/registration/limits` | Get transaction limits |
| GET | `/health` | Basic health check |
| GET | `/health/detailed` | Detailed health with dependencies |

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `KEYCLOAK_URL` | `http://localhost:8080` | Keycloak server URL |
| `KEYCLOAK_REALM` | `fineract` | Keycloak realm name |
| `KEYCLOAK_CLIENT_ID` | `customer-registration-service` | Service account client ID |
| `KEYCLOAK_CLIENT_SECRET` | - | Service account client secret |
| `FINERACT_URL` | `https://localhost:8443` | Fineract server URL |
| `FINERACT_TENANT` | `default` | Fineract tenant ID |
| `FINERACT_USERNAME` | `mifos` | Fineract API username |
| `FINERACT_PASSWORD` | `password` | Fineract API password |
| `DEFAULT_OFFICE_ID` | `1` | Default office for new clients |
| `DEFAULT_GROUP_PATH` | `/self-service-customers` | Keycloak group path |

## Development

### Prerequisites

- Java 21
- Maven 3.9+
- Docker (for local Keycloak/Fineract)

### Build

```bash
# Install Maven wrapper (first time only)
mvn -N wrapper:wrapper

# Build
./mvnw clean package

# Run
./mvnw spring-boot:run
```

### Docker Build

```bash
docker build -t customer-registration-service .
docker run -p 8080:8080 \
  -e KEYCLOAK_URL=http://host.docker.internal:9000 \
  -e KEYCLOAK_CLIENT_SECRET=your-secret \
  customer-registration-service
```

## Transaction Limits

| Tier | Daily Deposit | Daily Withdrawal | Per Transaction |
|------|--------------|------------------|-----------------|
| Tier 1 (Unverified) | 50,000 XAF | 25,000 XAF | 25,000 XAF |
| Tier 2 (Verified) | 500,000 XAF | 250,000 XAF | 100,000 XAF |

## Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Customer submits registration form                           │
│    └── POST /api/registration/register                          │
│                                                                 │
│ 2. Service generates UUID (externalId)                          │
│                                                                 │
│ 3. Create Fineract client                                       │
│    └── POST /fineract-provider/api/v1/clients                   │
│    └── externalId = UUID                                        │
│                                                                 │
│ 4. Create savings account                                       │
│    └── POST /fineract-provider/api/v1/savingsaccounts           │
│                                                                 │
│ 5. Create Keycloak user                                         │
│    └── POST /admin/realms/fineract/users                        │
│    └── attributes: fineract_external_id, kyc_tier, kyc_status   │
│    └── requiredActions: VERIFY_EMAIL, webauthn-register         │
│                                                                 │
│ 6. Return success with externalId                               │
│    └── Customer verifies email                                  │
│    └── Customer registers WebAuthn                              │
└─────────────────────────────────────────────────────────────────┘
```

## Rollback

If any step fails, the service automatically rolls back:
- Delete Keycloak user (if created)
- Delete Fineract client (if created)

## Related Components

- **Keycloak Client**: `self-service-app` (customer-facing)
- **Keycloak Service Account**: `customer-registration-service` (this service)
- **GitOps**: `fineract-gitops/apps/customer-registration-service/`
