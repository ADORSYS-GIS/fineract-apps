# Payment Gateway Database & Idempotency Implementation Plan

## Overview

This document describes the implementation plan for adding PostgreSQL database persistence and idempotency to the payment-gateway-service, replacing the in-memory `ConcurrentHashMap` that loses data on restart.

## Problem Statement

**Current Issues:**
1. Transactions stored in `ConcurrentHashMap` are lost when the service restarts
2. No idempotency mechanism to prevent duplicate deposits/withdrawals
3. Callbacks can be processed multiple times if retried by providers

**Impact:**
- Lost transaction tracking after deployment/restart
- Potential duplicate transactions causing financial discrepancies
- No audit trail for payment operations

---

## Architecture Decision

### Database Strategy: Reuse Existing RDS Instance

We will create a new database `payment_gateway` in the existing AWS RDS PostgreSQL instance (shared with Fineract and Keycloak).

```
┌─────────────────────────────────────────────────────────────┐
│                AWS RDS PostgreSQL Instance                  │
├─────────────────────────────────────────────────────────────┤
│  fineract_tenants  │  fineract_default  │  keycloak        │
│  (Fineract)        │  (Fineract)        │  (Keycloak)      │
├────────────────────┴──────────────────────────────────────┬─┤
│  payment_gateway   ← NEW                                  │ │
│  (Payment Gateway Service)                                │ │
└───────────────────────────────────────────────────────────┴─┘
```

**Why Separate Database (not Fineract's)?**
| Concern | Explanation |
|---------|-------------|
| Coupling risk | Fineract upgrades could break custom tables |
| Schema ownership | Fineract has its own conventions and migration tools |
| Different purposes | Fineract stores financial records; gateway needs operational state |
| Security | Payment gateway needs only its own data, not Fineract internals |

**Data Responsibility Split:**
```
Payment Gateway DB                    Fineract DB
(Operational State)                   (Financial Truth)
─────────────────────                 ─────────────────────
• Transaction lifecycle               • Savings transactions
• Idempotency tracking                • Account balances
• Provider references                 • GL entries
• Callback logs                       • Audit trail
```

---

## Automation Flow (GitOps)

Database creation happens automatically via ArgoCD sync-waves:

```
ArgoCD Sync
    │
    ├─ sync-wave: -15 → payment-gateway-database-setup Job
    │                   (creates database and user)
    │
    ├─ sync-wave: -10 → keycloak-database-setup Job
    │
    ├─ sync-wave: -1  → fineract-database-init Jobs
    │
    └─ sync-wave: 10  → payment-gateway-service Deployment
                        (Flyway runs migrations on startup)
```

**Key Points:**
- Database is created BEFORE the application starts
- Init container waits for database to be ready
- Flyway handles schema migrations on application startup
- Everything is idempotent (safe to re-run)

---

## Implementation Tasks

### Part 1: GitOps - Database Provisioning (fineract-gitops)

#### 1.1 Create Database Setup Job

**File:** `operations/payment-gateway-database-setup/base/create-payment-gateway-db-job.yaml`

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: create-payment-gateway-db
  annotations:
    argocd.argoproj.io/hook: Sync
    argocd.argoproj.io/hook-delete-policy: HookSucceeded
    argocd.argoproj.io/sync-wave: "-15"
spec:
  ttlSecondsAfterFinished: 3600
  backoffLimit: 3
  template:
    spec:
      restartPolicy: OnFailure
      containers:
      - name: create-db
        image: postgres:15-alpine
        command: ["/bin/sh", "-c"]
        args:
        - |
          # Check if database exists
          if psql -h $DB_HOST -U $DB_USER -d postgres -tc \
            "SELECT 1 FROM pg_database WHERE datname = 'payment_gateway'" | grep -q 1; then
            echo "Database payment_gateway already exists"
          else
            echo "Creating database payment_gateway..."
            psql -h $DB_HOST -U $DB_USER -d postgres -c "CREATE DATABASE payment_gateway"
          fi

          # Create user if not exists
          psql -h $DB_HOST -U $DB_USER -d postgres -c \
            "DO \$\$ BEGIN
              IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'payment_gateway') THEN
                CREATE USER payment_gateway WITH PASSWORD '$PG_PASSWORD';
              END IF;
            END \$\$;"

          # Grant privileges
          psql -h $DB_HOST -U $DB_USER -d payment_gateway -c \
            "GRANT ALL PRIVILEGES ON DATABASE payment_gateway TO payment_gateway;
             GRANT ALL ON SCHEMA public TO payment_gateway;
             ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO payment_gateway;
             ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO payment_gateway;"

          echo "Database setup complete"
        env:
        - name: PGPASSWORD
          valueFrom:
            secretKeyRef:
              name: fineract-db-credentials
              key: password
        - name: DB_HOST
          valueFrom:
            secretKeyRef:
              name: fineract-db-credentials
              key: host
        - name: DB_USER
          valueFrom:
            secretKeyRef:
              name: fineract-db-credentials
              key: username
        - name: PG_PASSWORD
          valueFrom:
            secretKeyRef:
              name: payment-gateway-db-credentials
              key: password
```

#### 1.2 Create Kustomization

**File:** `operations/payment-gateway-database-setup/base/kustomization.yaml`

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - create-payment-gateway-db-job.yaml
```

#### 1.3 Create Sealed Secret for Payment Gateway DB

**File:** `secrets/dev/payment-gateway-db-credentials-sealed.yaml`

First create the plain secret, then seal it:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: payment-gateway-db-credentials
  namespace: fineract
type: Opaque
stringData:
  host: <RDS_ENDPOINT>
  port: "5432"
  database: payment_gateway
  username: payment_gateway
  password: <GENERATED_32_CHAR_PASSWORD>
  jdbc-url: jdbc:postgresql://<RDS_ENDPOINT>:5432/payment_gateway?sslmode=require
```

Seal with:
```bash
kubeseal --format=yaml --cert=sealed-secrets-cert.pem \
  < payment-gateway-db-credentials.yaml \
  > payment-gateway-db-credentials-sealed.yaml
```

#### 1.4 Create ArgoCD Application

**File:** `argocd/applications/operations/payment-gateway-database-setup.yaml`

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: payment-gateway-database-setup
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/fineract-gitops.git
    targetRevision: HEAD
    path: operations/payment-gateway-database-setup/base
  destination:
    server: https://kubernetes.default.svc
    namespace: fineract
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

#### 1.5 Update Payment Gateway Deployment

**File:** `apps/payment-gateway-service/base/deployment.yaml`

Add database environment variables:

```yaml
env:
  # ... existing env vars ...

  # Database configuration
  - name: SPRING_DATASOURCE_URL
    valueFrom:
      secretKeyRef:
        name: payment-gateway-db-credentials
        key: jdbc-url
  - name: SPRING_DATASOURCE_USERNAME
    valueFrom:
      secretKeyRef:
        name: payment-gateway-db-credentials
        key: username
  - name: SPRING_DATASOURCE_PASSWORD
    valueFrom:
      secretKeyRef:
        name: payment-gateway-db-credentials
        key: password
```

Add init container to wait for database:

```yaml
initContainers:
  - name: wait-for-db
    image: postgres:15-alpine
    command: ['sh', '-c',
      'until pg_isready -h $DB_HOST -p 5432; do echo waiting for database; sleep 2; done']
    env:
      - name: DB_HOST
        valueFrom:
          secretKeyRef:
            name: payment-gateway-db-credentials
            key: host
```

---

### Part 2: Application Code (fineract-apps)

#### 2.1 Add Dependencies to pom.xml

**File:** `backend/payment-gateway-service/pom.xml`

```xml
<!-- Spring Data JPA -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- PostgreSQL Driver -->
<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <scope>runtime</scope>
</dependency>

<!-- Flyway for migrations -->
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-database-postgresql</artifactId>
</dependency>

<!-- H2 for testing -->
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

#### 2.2 Create JPA Entity

**File:** `src/main/java/com/adorsys/fineract/gateway/entity/PaymentTransaction.java`

```java
package com.adorsys.fineract.gateway.entity;

import com.adorsys.fineract.gateway.dto.PaymentProvider;
import com.adorsys.fineract.gateway.dto.PaymentResponse.TransactionType;
import com.adorsys.fineract.gateway.dto.PaymentStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "payment_transactions", indexes = {
    @Index(name = "idx_provider_reference", columnList = "providerReference"),
    @Index(name = "idx_external_id_created", columnList = "externalId, createdAt"),
    @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
public class PaymentTransaction {

    @Id
    @Column(length = 36)
    private String transactionId;  // UUID - serves as idempotency key

    @Column(length = 100)
    private String providerReference;

    @Column(length = 36, nullable = false)
    private String externalId;  // Customer external ID

    @Column(nullable = false)
    private Long accountId;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentProvider provider;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TransactionType type;

    @Column(precision = 15, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(length = 3, nullable = false)
    private String currency;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant updatedAt;

    private Long fineractTransactionId;

    @Version
    private Long version;  // Optimistic locking for concurrent callback handling

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    // Builder-style constructor for convenience
    public PaymentTransaction(String transactionId, String providerReference, String externalId,
                              Long accountId, PaymentProvider provider, TransactionType type,
                              BigDecimal amount, String currency, PaymentStatus status) {
        this.transactionId = transactionId;
        this.providerReference = providerReference;
        this.externalId = externalId;
        this.accountId = accountId;
        this.provider = provider;
        this.type = type;
        this.amount = amount;
        this.currency = currency;
        this.status = status;
    }
}
```

#### 2.3 Create Repository

**File:** `src/main/java/com/adorsys/fineract/gateway/repository/PaymentTransactionRepository.java`

```java
package com.adorsys.fineract.gateway.repository;

import com.adorsys.fineract.gateway.dto.PaymentStatus;
import com.adorsys.fineract.gateway.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {

    /**
     * Find transaction by provider's reference ID (used in callbacks)
     */
    Optional<PaymentTransaction> findByProviderReference(String providerReference);

    /**
     * Find transactions for a customer within a date range (for daily limits)
     */
    List<PaymentTransaction> findByExternalIdAndCreatedAtBetween(
        String externalId, Instant start, Instant end);

    /**
     * Check if transaction exists (for idempotency)
     */
    boolean existsByTransactionId(String transactionId);

    /**
     * Find pending transactions older than specified time (for cleanup/retry)
     */
    @Query("SELECT t FROM PaymentTransaction t WHERE t.status = 'PENDING' AND t.createdAt < :cutoff")
    List<PaymentTransaction> findStalePendingTransactions(Instant cutoff);

    /**
     * Update status atomically (for callback handling)
     */
    @Modifying
    @Query("UPDATE PaymentTransaction t SET t.status = :newStatus, t.updatedAt = :now, " +
           "t.fineractTransactionId = :fineractTxnId WHERE t.transactionId = :txnId AND t.status = :expectedStatus")
    int updateStatusIfExpected(String txnId, PaymentStatus expectedStatus,
                                PaymentStatus newStatus, Instant now, Long fineractTxnId);
}
```

#### 2.4 Create Flyway Migration

**File:** `src/main/resources/db/migration/V1__create_payment_transactions.sql`

```sql
-- Payment transactions table for tracking payment lifecycle
CREATE TABLE payment_transactions (
    transaction_id VARCHAR(36) PRIMARY KEY,
    provider_reference VARCHAR(100),
    external_id VARCHAR(36) NOT NULL,
    account_id BIGINT NOT NULL,
    provider VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    fineract_transaction_id BIGINT,
    version BIGINT DEFAULT 0,

    -- Constraints
    CONSTRAINT chk_provider CHECK (provider IN ('MTN_MOMO', 'ORANGE_MONEY', 'CINETPAY')),
    CONSTRAINT chk_type CHECK (type IN ('DEPOSIT', 'WITHDRAWAL')),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCESSFUL', 'FAILED'))
);

-- Indexes for common queries
CREATE INDEX idx_provider_reference ON payment_transactions(provider_reference);
CREATE INDEX idx_external_id_created ON payment_transactions(external_id, created_at);
CREATE INDEX idx_status ON payment_transactions(status);
CREATE INDEX idx_status_created ON payment_transactions(status, created_at);

-- Comments
COMMENT ON TABLE payment_transactions IS 'Tracks payment transaction lifecycle for idempotency and audit';
COMMENT ON COLUMN payment_transactions.transaction_id IS 'UUID serving as idempotency key';
COMMENT ON COLUMN payment_transactions.provider_reference IS 'Reference ID returned by payment provider';
COMMENT ON COLUMN payment_transactions.external_id IS 'Customer external ID from Fineract/Keycloak';
COMMENT ON COLUMN payment_transactions.version IS 'Optimistic locking version for concurrent updates';
```

#### 2.5 Update application.yml

**File:** `src/main/resources/application.yml`

Add datasource configuration:

```yaml
spring:
  # Database configuration
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/payment_gateway}
    username: ${SPRING_DATASOURCE_USERNAME:payment_gateway}
    password: ${SPRING_DATASOURCE_PASSWORD:}
    hikari:
      minimum-idle: 2
      maximum-pool-size: 10
      idle-timeout: 30000
      max-lifetime: 600000
      connection-timeout: 20000

  # JPA configuration
  jpa:
    hibernate:
      ddl-auto: validate  # Flyway handles schema, Hibernate only validates
    open-in-view: false   # Prevent lazy loading issues
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          time_zone: UTC

  # Flyway migrations
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    validate-on-migrate: true
```

#### 2.6 Update PaymentController for Idempotency Header

**File:** `src/main/java/com/adorsys/fineract/gateway/controller/PaymentController.java`

```java
@PostMapping("/deposit")
public PaymentResponse initiateDeposit(
        @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
        @Valid @RequestBody DepositRequest request) {
    return paymentService.initiateDeposit(request, idempotencyKey);
}

@PostMapping("/withdraw")
public PaymentResponse initiateWithdrawal(
        @RequestHeader(value = "X-Idempotency-Key", required = false) String idempotencyKey,
        @Valid @RequestBody WithdrawalRequest request) {
    return paymentService.initiateWithdrawal(request, idempotencyKey);
}
```

#### 2.7 Update PaymentService

**File:** `src/main/java/com/adorsys/fineract/gateway/service/PaymentService.java`

Key changes:
1. Inject `PaymentTransactionRepository` instead of using `ConcurrentHashMap`
2. Add `@Transactional` annotations
3. Implement idempotency checks
4. Add callback idempotency

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentTransactionRepository transactionRepository;
    // ... other dependencies ...

    @Transactional
    public PaymentResponse initiateDeposit(DepositRequest request, String idempotencyKey) {
        log.info("Initiating deposit: externalId={}, amount={}, provider={}, idempotencyKey={}",
            request.getExternalId(), request.getAmount(), request.getProvider(), idempotencyKey);

        // Idempotency check: Return existing transaction if already processed
        if (idempotencyKey != null) {
            Optional<PaymentTransaction> existing = transactionRepository.findById(idempotencyKey);
            if (existing.isPresent()) {
                log.info("Returning existing transaction for idempotency key: {}", idempotencyKey);
                return mapToResponse(existing.get());
            }
        }

        String transactionId = idempotencyKey != null ? idempotencyKey : UUID.randomUUID().toString();

        // ... verify account ownership ...

        PaymentResponse response = switch (request.getProvider()) {
            case MTN_MOMO -> initiateMtnDeposit(transactionId, request);
            case ORANGE_MONEY -> initiateOrangeDeposit(transactionId, request);
            case CINETPAY -> initiateCinetPayDeposit(transactionId, request);
            default -> throw new PaymentException("Unsupported provider");
        };

        // Save to database
        PaymentTransaction txn = new PaymentTransaction(
            transactionId,
            response.getProviderReference(),
            request.getExternalId(),
            request.getAccountId(),
            request.getProvider(),
            TransactionType.DEPOSIT,
            request.getAmount(),
            "XAF",
            PaymentStatus.PENDING
        );
        transactionRepository.save(txn);

        return response;
    }

    @Transactional
    public void handleMtnCollectionCallback(MtnCallbackRequest callback) {
        log.info("Processing MTN callback: ref={}, status={}",
            callback.getReferenceId(), callback.getStatus());

        PaymentTransaction txn = transactionRepository
            .findByProviderReference(callback.getExternalId())
            .orElse(null);

        if (txn == null) {
            log.warn("Transaction not found for MTN callback: {}", callback.getExternalId());
            return;
        }

        // Idempotency: Skip if already in terminal state
        if (txn.getStatus() == PaymentStatus.SUCCESSFUL || txn.getStatus() == PaymentStatus.FAILED) {
            log.info("Transaction already in terminal state: {}, status={}",
                txn.getTransactionId(), txn.getStatus());
            return;
        }

        if (callback.isSuccessful()) {
            Long fineractTxnId = fineractClient.createDeposit(
                txn.getAccountId(),
                txn.getAmount(),
                mtnConfig.getFineractPaymentTypeId(),
                callback.getFinancialTransactionId()
            );

            txn.setStatus(PaymentStatus.SUCCESSFUL);
            txn.setFineractTransactionId(fineractTxnId);
        } else {
            txn.setStatus(PaymentStatus.FAILED);
        }

        transactionRepository.save(txn);
    }

    // Similar updates for other callback handlers...

    private PaymentResponse mapToResponse(PaymentTransaction txn) {
        return PaymentResponse.builder()
            .transactionId(txn.getTransactionId())
            .providerReference(txn.getProviderReference())
            .provider(txn.getProvider())
            .type(txn.getType())
            .amount(txn.getAmount())
            .currency(txn.getCurrency())
            .status(txn.getStatus())
            .createdAt(txn.getCreatedAt())
            .fineractTransactionId(txn.getFineractTransactionId())
            .build();
    }
}
```

---

## Idempotency Design

### Request-Level Idempotency

- Client sends `X-Idempotency-Key` HTTP header (UUID)
- If key exists in DB → return existing result (HTTP 200)
- If key doesn't exist → process and store with key as transaction_id
- If header is missing → generate new UUID (backwards compatible)

### Callback-Level Idempotency

- Check transaction status before processing callback
- If status is already `SUCCESSFUL` or `FAILED` → skip processing
- Use optimistic locking (`@Version`) to prevent race conditions

### Idempotency Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Idempotency Flow                           │
├─────────────────────────────────────────────────────────────┤
│  1. Client sends request with X-Idempotency-Key header      │
│     ↓                                                       │
│  2. Check DB: EXISTS transaction_id = idempotencyKey?       │
│     ├─ YES → Return existing PaymentResponse (HTTP 200)     │
│     └─ NO  → Continue                                       │
│     ↓                                                       │
│  3. Create PaymentTransaction (status=PENDING)              │
│     ↓                                                       │
│  4. Call payment provider                                   │
│     ↓                                                       │
│  5. Update status to PROCESSING                             │
│     ↓                                                       │
│  6. Callback received                                       │
│     ├─ Check: status already SUCCESSFUL/FAILED? → Skip      │
│     └─ NO → Update to SUCCESSFUL/FAILED                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Files Summary

### fineract-gitops (GitOps Repository)

| File | Action |
|------|--------|
| `operations/payment-gateway-database-setup/base/create-payment-gateway-db-job.yaml` | CREATE |
| `operations/payment-gateway-database-setup/base/kustomization.yaml` | CREATE |
| `argocd/applications/operations/payment-gateway-database-setup.yaml` | CREATE |
| `secrets/dev/payment-gateway-db-credentials-sealed.yaml` | CREATE |
| `apps/payment-gateway-service/base/deployment.yaml` | MODIFY |

### fineract-apps (Application Repository)

| File | Action |
|------|--------|
| `backend/payment-gateway-service/pom.xml` | MODIFY |
| `backend/payment-gateway-service/src/main/java/.../entity/PaymentTransaction.java` | CREATE |
| `backend/payment-gateway-service/src/main/java/.../repository/PaymentTransactionRepository.java` | CREATE |
| `backend/payment-gateway-service/src/main/java/.../controller/PaymentController.java` | MODIFY |
| `backend/payment-gateway-service/src/main/java/.../service/PaymentService.java` | MODIFY |
| `backend/payment-gateway-service/src/main/resources/db/migration/V1__create_payment_transactions.sql` | CREATE |
| `backend/payment-gateway-service/src/main/resources/application.yml` | MODIFY |

---

## Verification Plan

### 1. Local Testing

```bash
# Start local PostgreSQL
docker run -d --name pg-test \
  -e POSTGRES_DB=payment_gateway \
  -e POSTGRES_USER=payment_gateway \
  -e POSTGRES_PASSWORD=test \
  -p 5432:5432 postgres:15

# Run service
cd backend/payment-gateway-service
./mvnw spring-boot:run

# Verify Flyway migration ran
curl http://localhost:8082/actuator/flyway

# Test idempotency - first request
IDEMPOTENCY_KEY=$(uuidgen)
curl -X POST http://localhost:8082/api/payments/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "externalId": "customer-uuid",
    "accountId": 1,
    "amount": 1000,
    "provider": "MTN_MOMO",
    "phoneNumber": "237670000000"
  }'

# Second request with same key should return same result
curl -X POST http://localhost:8082/api/payments/deposit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{
    "externalId": "customer-uuid",
    "accountId": 1,
    "amount": 1000,
    "provider": "MTN_MOMO",
    "phoneNumber": "237670000000"
  }'
# Should return identical transactionId, not create new transaction
```

### 2. Kubernetes Testing

```bash
# Check database job completed
kubectl get jobs -n fineract | grep payment-gateway-db

# Verify job logs
kubectl logs job/create-payment-gateway-db -n fineract

# Check database exists (if you have psql access)
kubectl exec -it <fineract-pod> -- psql -h $DB_HOST -U postgres -c "\l" | grep payment_gateway

# Check Flyway migration in app logs
kubectl logs -n fineract deployment/payment-gateway-service | grep -i flyway

# Test persistence across restart
kubectl rollout restart deployment/payment-gateway-service -n fineract
# Verify existing transactions can still be queried after restart
```

### 3. Integration Tests

Add these test cases:
- Transaction persists after service restart
- Duplicate requests with same idempotency key return same result
- Duplicate callbacks don't create duplicate Fineract transactions
- Concurrent callbacks handled correctly (optimistic locking)

---

## Rollback Plan

If issues occur:

1. **Application rollback**: Revert to previous Docker image tag
2. **Database**: Flyway tracks migrations; can write `V2__rollback.sql` if needed
3. **GitOps**: Revert commit in fineract-gitops repository

The database and application are independent - you can roll back the application without affecting the database, and vice versa.
