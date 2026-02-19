# E2E Tests — Fineract Platform

End-to-end BDD tests that verify full service lifecycles against **real** infrastructure:
real PostgreSQL, real Redis, real Apache Fineract, and WireMock for external providers — no mocking of internal services.

## Suites

| Suite | Application | Scenarios | Tags |
|-------|------------|-----------|------|
| Asset Service | `AssetServiceApplication` | 43 | `@stocks`, `@bonds`, `@treasury`, `@reconciliation`, `@errors`, `@catalog`, `@trading`, `@portfolio`, `@pricing`, `@favorites`, `@admin` |
| Payment Gateway | `PaymentGatewayApplication` | 14 | `@mtn`, `@orange`, `@deposit`, `@withdrawal`, `@idempotency`, `@security`, `@limits`, `@callbacks` |

## Prerequisites

- **Java 21** (via SDKMAN or manual install)
- **Docker** running (Testcontainers uses it for Postgres, Redis, Fineract)
- **`fineract-custom:latest`** Docker image built locally (see below)
- Both services installed in the local Maven repository

## Building the Fineract Custom Image

The E2E tests require a Fineract image with the **custom currency plugin** (`adorsys.currency.enabled=true`),
which auto-creates unknown currencies in the `m_currency` table for tokenized assets.

```bash
cd /path/to/fineract
git checkout feat/currency-plugin
./gradlew :custom:docker:jibDockerBuild
```

Verify the image has the plugin:

```bash
docker run --rm --entrypoint ls fineract-custom:latest /app/libs/ | grep currency
```

## Running the Tests

```bash
# Build both services first (skip their own tests)
mvn -f backend/asset-service/pom.xml install -DskipTests
mvn -f backend/payment-gateway-service/pom.xml install -DskipTests

# Run ALL E2E tests (~57 scenarios)
mvn -f backend/e2e-tests/pom.xml test -Pe2e

# Run only asset-service E2E (~43 scenarios)
mvn -f backend/e2e-tests/pom.xml test -Pe2e-asset

# Run only payment-gateway E2E (~14 scenarios)
mvn -f backend/e2e-tests/pom.xml test -Pe2e-payment

# Run by tag
mvn -f backend/e2e-tests/pom.xml test -Pe2e-asset -Dcucumber.filter.tags="@stocks"
mvn -f backend/e2e-tests/pom.xml test -Pe2e-payment -Dcucumber.filter.tags="@mtn and @deposit"
```

The first run takes ~4–5 minutes (Fineract startup ~2 min). Subsequent scenarios reuse the same containers.

## Using a Different Fineract Image

```bash
mvn -f backend/e2e-tests/pom.xml test -Pe2e -Dfineract.image=ghcr.io/adorsys-gis/fineract:5aa35aa15
```

> **Note:** The registry image may not include the custom currency plugin.

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Test JVM                                    │
│                                                                          │
│  ┌──────────────────┐    ┌─────────────────────────────┐                 │
│  │  Cucumber/JUnit  │───▶│  asset-service OR            │                 │
│  │  Step Definitions│    │  payment-gateway-service     │                 │
│  │  (REST-Assured)  │    │  @SpringBootTest(RANDOM_PORT)│                 │
│  └──────────────────┘    └──────────┬──────────────────┘                 │
│         │                           │                                    │
│         │ verify balances           │ FineractClient (real HTTP)          │
│         ▼                           ▼                                    │
│  ┌──────────────┐          ┌──────────────┐    ┌────────────────┐        │
│  │ FineractTest │          │   Fineract   │    │   WireMock     │        │
│  │   Client     │─────────▶│  Container   │    │ (MTN/Orange/   │        │
│  └──────────────┘          └──────┬───────┘    │  CinetPay)     │        │
│                                   │            └────────────────┘        │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │ Docker Network
          ┌─────────────────────────┼──────────────────────────┐
          │                         │                           │
    ┌─────▼──────┐  ┌──────────────▼──┐  ┌──────────▼──┐  ┌───▼──────────┐
    │ PostgreSQL  │  │   PostgreSQL    │  │ PostgreSQL  │  │    Redis     │
    │ (asset-svc) │  │   (Fineract)   │  │(payment-gw) │  │              │
    └─────────────┘  └────────────────┘  └─────────────┘  └──────────────┘
```

**Key design decisions:**
- Services run **inside the test JVM** (not in Docker) — enables direct Spring context access, debugging, and code coverage
- External infrastructure runs in **Testcontainers**
- **WireMock** simulates external provider APIs (MTN MoMo, Orange Money, CinetPay) for the payment suite
- **Callbacks** are tested by sending requests directly to payment-gateway's `/api/callbacks/**` endpoints
- Each suite runs in a **separate Surefire execution** with classpath isolation to avoid Flyway migration conflicts

## Directory Structure

```
backend/e2e-tests/
├── pom.xml                         # Dependencies, profiles (e2e, e2e-asset, e2e-payment)
└── src/test/
    ├── resources/features/
    │   ├── asset/                   # Asset-service feature files (10 files)
    │   │   ├── stock-lifecycle.feature
    │   │   ├── bond-lifecycle.feature
    │   │   ├── treasury-management.feature
    │   │   ├── fineract-reconciliation.feature
    │   │   ├── error-scenarios.feature
    │   │   ├── catalog-and-discovery.feature
    │   │   ├── trade-preview-orders.feature
    │   │   ├── portfolio.feature
    │   │   ├── pricing-market.feature
    │   │   ├── favorites.feature
    │   │   └── admin-operations.feature
    │   └── payment/                 # Payment-gateway feature files (7 files)
    │       ├── mtn-deposits.feature
    │       ├── orange-deposits.feature
    │       ├── mtn-withdrawals.feature
    │       ├── idempotency.feature
    │       ├── security.feature
    │       ├── transaction-limits.feature
    │       └── callback-validation.feature
    └── java/com/adorsys/fineract/e2e/
        ├── RunAssetE2ETests.java     # Cucumber runner for asset suite
        ├── RunPaymentE2ETests.java   # Cucumber runner for payment suite
        ├── config/
        │   ├── TestcontainersConfig.java   # Starts Postgres x3, Redis, Fineract
        │   └── FineractInitializer.java    # Creates GL accounts, payment types, users
        ├── client/
        │   └── FineractTestClient.java     # Direct Fineract HTTP client
        ├── support/
        │   ├── E2EScenarioContext.java     # Shared scenario state
        │   └── JwtTokenFactory.java        # Test JWT tokens with embedded JWKS
        ├── asset/                          # Asset suite
        │   ├── AssetE2ESpringConfiguration.java
        │   ├── hooks/ScenarioCleanupHook.java
        │   └── steps/*.java                # 12 step definition files
        └── payment/                        # Payment suite
            ├── PaymentE2ESpringConfiguration.java
            ├── hooks/PaymentScenarioCleanupHook.java
            ├── support/WireMockProviderStubs.java
            └── steps/*.java                # 8 step definition files
```

## Startup Sequence

1. **Start PostgreSQL x3 + Redis** — parallel, ~5s
2. **Start Fineract** — ~2 min (Liquibase migrations + Spring Boot)
3. **FineractInitializer** — creates GL accounts, payment types, XAF currency, savings product, treasury client, test user with 5M XAF — ~10s
4. **Spring Boot** starts the service under test in the test JVM — ~15s
5. **Cucumber scenarios execute**

## Test Isolation

- **Between scenarios:** cleanup hooks truncate service DB tables in FK-safe order before each scenario
- **Fineract state:** persists across scenarios (currencies, savings products are immutable). Each scenario uses a **unique 3-character ticker** to avoid collisions
- **Between suites:** each suite boots a different Spring Boot application with its own PostgreSQL database
- **Between test runs:** Testcontainers creates fresh containers

## How to Add New Scenarios

1. Create a `.feature` file in `features/asset/` or `features/payment/`
2. Add tags (e.g., `@e2e @asset @mystag`) so it can be filtered
3. Create a step definition class in the corresponding `steps/` package
4. Use `@Autowired E2EScenarioContext context` for shared state between steps
5. Use `@LocalServerPort` to make REST-Assured calls to the service
6. For payment tests: add WireMock stubs in `WireMockProviderStubs.java`
7. Run with the appropriate profile: `-Pe2e-asset` or `-Pe2e-payment`

## Test Reports

- **Cucumber HTML:** `target/cucumber-reports/asset-cucumber.html` / `payment-cucumber.html`
- **Cucumber JSON:** `target/cucumber-reports/asset-cucumber.json` / `payment-cucumber.json`
- **Surefire reports:** `target/surefire-reports/`

## Troubleshooting

### Fineract startup fails

Check Docker is running and the `fineract-custom:latest` image exists:

```bash
docker images | grep fineract-custom
```

### Currency registration 500 errors

Custom currency codes must be **exactly 3 characters** (Fineract `m_currency.code` is `VARCHAR(3)`).

### Flyway migration conflicts

If you see `Found more than one migration with version X`, ensure you're using the correct profile:
- `-Pe2e-asset` excludes payment-gateway-service from classpath
- `-Pe2e-payment` excludes asset-service from classpath
- `-Pe2e` runs both in separate Surefire executions with proper exclusions

### Context startup failures

```bash
cat backend/e2e-tests/target/surefire-reports/*.txt
```

### Slow tests

Fineract cold-start is ~2 minutes. All containers are reused across scenarios — only the first scenario pays the startup cost.
