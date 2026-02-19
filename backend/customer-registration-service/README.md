# Customer Registration Service

Self-service customer registration orchestrator for Fineract.

## Overview

This service handles customer self-registration by:
1. Creating a Fineract client with the provided external ID.

## Technology Stack

- Java 21
- Spring Boot 3.2
- Spring MVC (REST APIs)
- Micrometer + OpenTelemetry (observability)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/registration/register` | Register a new customer |
| GET | `/health` | Basic health check |
| GET | `/health/detailed` | Detailed health with dependencies |

## Configuration

Environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `FINERACT_URL` | `https://localhost:8443` | Fineract server URL |
| `FINERACT_TENANT` | `default` | Fineract tenant ID |
| `FINERACT_USERNAME` | `mifos` | Fineract API username |
| `FINERACT_PASSWORD` | `password` | Fineract API password |
| `DEFAULT_OFFICE_ID` | `1` | Default office for new clients |

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
│ 2. Service receives request with externalId                     │
│                                                                 │
│ 3. Create Fineract client                                       │
│    └── POST /fineract-provider/api/v1/clients                   │
│    └── externalId = from request                                │
│                                                                 │
│ 4. Return success with externalId                               │
└─────────────────────────────────────────────────────────────────┘
```


## Related Components

- **GitOps**: `fineract-gitops/apps/customer-registration-service/`
