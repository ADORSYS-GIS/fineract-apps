# Architecture Guide

This guide provides a high-level overview of the project's architecture, focusing on the relationships between the different parts of the monorepo.

## High-Level System Architecture

The complete system includes staff-facing applications, a self-service customer portal, and supporting backend services. The following diagram shows the overall architecture:

```mermaid
graph TB
    subgraph "Staff Applications"
        AM[Account Manager App]
        BM[Branch Manager App]
        CA[Cashier App]
    end

    subgraph "Self-Service Layer"
        SSA[Self-Service App<br/>Customer Portal]
        CRS[Customer Registration<br/>Service]
        PGS[Payment Gateway<br/>Service]
    end

    subgraph "Core Infrastructure"
        KC[Keycloak<br/>Identity & Access]
        FIN[Apache Fineract<br/>Core Banking]
    end

    subgraph "External Payment Providers"
        MTN[MTN MoMo API]
        ORA[Orange Money API]
    end

    AM --> KC
    BM --> KC
    CA --> KC

    AM --> FIN
    BM --> FIN
    CA --> FIN

    SSA --> KC
    SSA --> CRS
    SSA --> PGS
    SSA --> FIN

    CRS --> FIN
    CRS --> KC

    PGS --> FIN
    PGS --> MTN
    PGS --> ORA
```

### Self-Service Layer Components

| Component | Description | Technology |
|-----------|-------------|------------|
| Self-Service App | Customer-facing PWA for mobile money transactions | React, TanStack Router, PWA |
| Customer Registration Service | Handles customer onboarding and KYC | Spring Boot, REST API |
| Payment Gateway Service | Integrates MTN MoMo and Orange Money | Spring Boot, REST API |

### Data Flow: Customer Registration

```mermaid
sequenceDiagram
    participant C as Customer
    participant SSA as Self-Service App
    participant CRS as Registration Service
    participant KC as Keycloak
    participant FIN as Fineract

    C->>SSA: Register
    SSA->>CRS: POST /register
    CRS->>FIN: Create Client
    FIN-->>CRS: Client ID
    CRS->>FIN: Create Savings Account
    FIN-->>CRS: Account ID
    CRS->>KC: Create User
    KC-->>CRS: User ID
    CRS-->>SSA: Registration Success
    SSA-->>C: Verify Email
```

### Data Flow: Mobile Money Deposit

```mermaid
sequenceDiagram
    participant C as Customer
    participant SSA as Self-Service App
    participant PGS as Payment Gateway
    participant MTN as MTN MoMo
    participant FIN as Fineract

    C->>SSA: Deposit Request
    SSA->>PGS: POST /deposits/mtn
    PGS->>MTN: Request to Pay
    MTN-->>PGS: Request ID
    PGS-->>SSA: Pending (Reference ID)
    MTN->>PGS: Callback (Success)
    PGS->>FIN: Create Deposit Transaction
    FIN-->>PGS: Transaction ID
    PGS-->>SSA: WebSocket: Deposit Complete
    SSA-->>C: Success Notification
```

### Self-Service App Architecture

The following diagram shows how the Self-Service App connects to various backend components:

```mermaid
graph TB
    subgraph "Self-Service Frontend"
        SSA[Self-Service App<br/>React PWA]
    end

    subgraph "Authentication"
        KC[Keycloak<br/>OIDC Provider]
    end

    subgraph "Backend Services"
        CRS[Customer Registration<br/>Service]
        PGS[Payment Gateway<br/>Service]
    end

    subgraph "Core Banking"
        FIN[Apache Fineract]
    end

    subgraph "Payment Providers"
        MTN[MTN MoMo]
        ORA[Orange Money]
    end

    SSA -->|"Login/Auth"| KC
    SSA -->|"Registration<br/>KYC Upload"| CRS
    SSA -->|"Deposits<br/>Withdrawals"| PGS
    SSA -->|"Account Data<br/>Transactions"| FIN

    CRS --> FIN
    CRS --> KC
    PGS --> FIN
    PGS --> MTN
    PGS --> ORA
```

### Data Flow: View Transactions/Account

For read-only operations like viewing account details or transactions, the Self-Service App calls Fineract directly:

```mermaid
sequenceDiagram
    participant C as Customer
    participant SSA as Self-Service App
    participant FIN as Fineract

    C->>SSA: View Transactions
    SSA->>FIN: GET /savingsaccounts/{id}/transactions
    FIN-->>SSA: Transaction List
    SSA-->>C: Display Transactions

    C->>SSA: View Account Details
    SSA->>FIN: GET /savingsaccounts/{id}
    FIN-->>SSA: Account Details
    SSA-->>C: Display Account
```

### Self-Service API Routing

The following table explains which operations go through which services:

| Operation | Route | Reason |
|-----------|-------|--------|
| Login/Auth | SSA → Keycloak | OIDC authentication |
| View account | SSA → Fineract (direct) | Read-only, no business logic needed |
| View transactions | SSA → Fineract (direct) | Read-only, no business logic needed |
| Registration | SSA → CRS → Fineract/KC | Creates accounts in multiple systems |
| KYC upload | SSA → CRS → Fineract | Needs validation, status tracking |
| Deposits | SSA → PGS → MTN/Orange → Fineract | Payment provider integration |
| Withdrawals | SSA → PGS → MTN/Orange → Fineract | Payment provider integration |

## Monorepo Structure and Dependencies

The project is organized as a monorepo with a clear separation between applications and shared packages. The following diagram illustrates the dependencies between the different namespaces:

```mermaid
graph LR;
    subgraph Staff Apps
        A[account-manager-app]
        B[branchmanager-app]
        C[cashier-app]
    end

    subgraph Self-Service
        SSA[self-service-app]
    end

    subgraph Backend Services
        CRS[customer-registration-service]
        PGS[payment-gateway-service]
    end

    subgraph Shared Packages
        UI[packages/ui]
        Config[packages/config]
        I18n[packages/i18n]
    end

    A --> UI;
    B --> UI;
    C --> UI;

    A --> Config;
    B --> Config;
    C --> Config;
    UI --> Config;

    A --> I18n;
    B --> I18n;
    C --> I18n;
    UI --> I18n;

    SSA -.-> CRS;
    SSA -.-> PGS;
```

## Configuration Management

The project uses a shared configuration approach to ensure consistency across all applications and packages. Base configuration files are located in the `@fineract-apps/config` package and are imported by the individual projects.

The following diagram shows the configuration inheritance model:

```mermaid
graph TD;
    subgraph "Shared Configuration (@fineract-apps/config)"
        BaseVite[vite.config.base.js]
        BaseTS[tsconfig.base.json]
    end

    subgraph "App/Package Configuration"
        AppVite[vite.config.ts]
        AppTS[tsconfig.json]
    end

    BaseVite --> AppVite;
    BaseTS --> AppTS;
```

This setup allows for centralized management of common settings while providing flexibility for project-specific overrides. The shared configurations are imported as modules, thanks to the pnpm workspace setup.

## Root Configuration

The monorepo is governed by several root-level configuration files that apply to all packages and applications.

*   **`package.json`**: The root `package.json` file defines scripts for the entire monorepo (e.g., `dev`, `build`, `lint`) and contains the development dependencies required for the whole project.
*   **`pnpm-workspace.yaml`**: This file defines the workspaces in the monorepo, telling `pnpm` where to find the different applications and packages.
*   **`biome.json`**: This is the configuration file for Biome, which is used for linting and formatting the entire codebase to ensure a consistent style.
*   **`jest.config.js`**: This file configures Jest, the framework used for running tests across the monorepo.
*   **`commitlint.config.js`**: This file configures commitlint, which enforces conventional commit messages to maintain a clean and readable version history.
*   **`tsconfig.json`**: This is the base TypeScript configuration for the entire project. Each package and application extends this base configuration.

The following diagram illustrates how these root configuration files apply to all projects within the monorepo:

```mermaid
graph LR;
    subgraph Root Configuration
        direction TB
        RootPackageJson[package.json]
        PnpmWorkspace[pnpm-workspace.yaml]
        BiomeJson[biome.json]
        JestConfig[jest.config.js]
        CommitLint[commitlint.config.js]
        TSConfig[tsconfig.json]
    end

    subgraph Monorepo
        direction TB
        subgraph Staff Apps
            A[account-manager-app]
            B[branchmanager-app]
            C[cashier-app]
        end

        subgraph Self-Service
            SSA[self-service-app]
        end

        subgraph Backend Services
            CRS[customer-registration-service]
            PGS[payment-gateway-service]
        end

        subgraph Shared Packages
            UI[packages/ui]
            Config[packages/config]
            I18n[packages/i18n]
        end
    end

    RootPackageJson -.-> Monorepo;
    PnpmWorkspace -.-> Monorepo;
    BiomeJson -.-> Monorepo;
    JestConfig -.-> Monorepo;
    CommitLint -.-> Monorepo;
    TSConfig -.-> Monorepo;
```
