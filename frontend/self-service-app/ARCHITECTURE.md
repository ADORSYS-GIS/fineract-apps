# Self-Service Banking App Architecture

This document provides a detailed overview of the architecture, components, and data flow of the Self-Service Banking App.

## 1. Overview

The Self-Service Banking App is a customer-facing React application designed to provide a seamless and secure banking experience. It leverages modern web technologies to offer features like self-registration, passwordless authentication, account management, and more. The application is built with a focus on security, scalability, and user experience.

## 2. Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based)
- **State Management**: TanStack Query
- **UI Components**: Shared `@fineract/ui` package
- **Styling**: Tailwind CSS
- **Authentication**: `oidc-client-ts` / `react-oidc-context`
- **WebAuthn**: `@simplewebauthn/browser`

## 3. Project Structure

The project follows a feature-based directory structure, which helps in organizing the code in a modular and maintainable way.

```
self-service-app/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── auth/         # Authentication related components
│   │   ├── dashboard/    # Dashboard specific components
│   │   ├── kyc/          # KYC upload and status components
│   │   └── transactions/ # Deposit/withdrawal components
│   ├── hooks/            # Custom React hooks for business logic
│   ├── lib/              # Utilities, API clients, and libraries
│   ├── locales/          # Internationalization (i18n) files
│   ├── routes/           # TanStack Router routes (file-based routing)
│   ├── services/         # API service definitions
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── index.html            # Main HTML entry point
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── tailwind.config.js    # Tailwind CSS configuration
```

## 4. Authentication and Authorization

The application uses OpenID Connect (OIDC) for authentication and JSON Web Tokens (JWT) for authorization. The authentication flow is handled by `oidc-client-ts` and `react-oidc-context`, which communicate with a Keycloak instance.

### 4.1. Authentication Flow

1.  **User Initiates Login**: The user clicks the "Login" button in the application.
2.  **Redirect to Keycloak**: The app redirects the user to the Keycloak authentication server.
3.  **Passwordless Authentication**: Keycloak, configured with a custom `self-service-browser` flow, prompts the user for their email and initiates a WebAuthn challenge.
4.  **WebAuthn Verification**: The user authenticates using Face ID, Touch ID, or a security key.
5.  **Authorization Code Grant**: Upon successful authentication, Keycloak redirects the user back to the application with an authorization code.
6.  **Token Exchange**: The application exchanges the authorization code for an ID token, access token, and refresh token using the PKCE (Proof Key for Code Exchange) flow.
7.  **Session Management**: The tokens are stored securely in the browser, and the user's session is established. The JWT contains important claims like `fineract_external_id`, `kyc_tier`, and `kyc_status`.

## 5. API Communication

The application communicates with two main backend services:

-   **Customer Registration Service**: Handles user registration and KYC processes.
-   **Fineract Platform**: The core banking platform that provides APIs for account information, transactions, and other banking operations.

### 5.1. API Endpoints

The API endpoints are configured in the `.env` file:

-   `VITE_REGISTRATION_API_URL`: The base URL for the Customer Registration Service.
-   `VITE_FINERACT_API_URL`: The base URL for the Fineract API.
-   `VITE_FINERACT_TENANT_ID`: The tenant ID for the Fineract API.

### 5.2. API Calls and Payloads

The `src/services` directory contains the API client implementation. `axios` is used to make HTTP requests, and the API calls are wrapped with `react-query` for caching, refetching, and state management.

#### Example API Call: Fetching Account Details

-   **Endpoint**: `GET /fineract-provider/api/v1/savingsaccounts/{accountId}`
-   **Service**: `src/services/fineractApi.ts`
-   **Payload**: None
-   **Response**:

```json
{
  "id": 123,
  "accountNo": "SB-12345",
  "clientId": 456,
  "clientName": "John Doe",
  "savingsProductId": 1,
  "savingsProductName": "Default Savings",
  "status": {
    "id": 300,
    "code": "savingsAccountStatusType.active",
    "value": "Active"
  },
  "timeline": {
    "submittedOnDate": [2024, 1, 1],
    "submittedByUsername": "admin",
    "approvedOnDate": [2024, 1, 1],
    "approvedByUsername": "admin",
    "activatedOnDate": [2024, 1, 1],
    "activatedByUsername": "admin"
  },
  "currency": {
    "code": "USD",
    "name": "US Dollar",
    "decimalPlaces": 2,
    "inMultiplesOf": 0,
    "displaySymbol": "$",
    "nameCode": "currency.USD",
    "displayLabel": "US Dollar ($)"
  },
  "summary": {
    "currency": {
      "code": "USD",
      "name": "US Dollar",
      "decimalPlaces": 2,
      "inMultiplesOf": 0,
      "displaySymbol": "$",
      "nameCode": "currency.USD",
      "displayLabel": "US Dollar ($)"
    },
    "totalDeposits": 1000.00,
    "totalWithdrawals": 200.00,
    "accountBalance": 800.00,
    "availableBalance": 800.00
  }
}
```

## 6. Key Components and Responsibilities

-   **`main.tsx`**: The entry point of the application, where the React application is initialized and rendered.
-   **`App.tsx`**: The root component of the application, which sets up the router, authentication provider, and other global contexts.
-   **`routes/`**: This directory contains the route definitions for the application, using the file-based routing feature of TanStack Router.
-   **`components/`**: This directory contains reusable UI components that are used throughout the application.
-   **`hooks/`**: This directory contains custom React hooks that encapsulate business logic and data fetching.
-   **`services/`**: This directory contains the API client implementation for communicating with the backend services.

## 7. Build and Deployment

The application is built using Vite, which provides a fast and efficient development and build experience. The application is containerized using Docker and deployed to a Kubernetes cluster.

### 7.1. Dockerfile

The `Dockerfile` is a multi-stage build that first builds the application in a Node.js environment and then serves the static files using an Nginx server.

### 7.2. Deployment Process

The application is deployed using a GitOps workflow. The Kubernetes manifests are stored in a separate Git repository (`fineract-gitops`), and any changes to the manifests trigger a deployment to the Kubernetes cluster.

## 8. Important Dependencies

-   **`@tanstack/react-query`**: A powerful data-fetching and state management library that provides caching, optimistic updates, and more.
-   **`@tanstack/react-router`**: A modern, file-based routing library for React that provides type-safe routing and a great developer experience.
-   **`axios`**: A popular HTTP client for making API requests.
-   **`oidc-client-ts`**: A library for implementing OIDC authentication in JavaScript applications.
-   **`react-oidc-context`**: A set of React components and hooks for integrating `oidc-client-ts` with React.
-   **`@simplewebauthn/browser`**: A library for implementing WebAuthn passwordless authentication in the browser.
-   **`tailwindcss`**: A utility-first CSS framework for building modern and responsive user interfaces.
-   **`zod`**: A TypeScript-first schema validation library for validating data.
-   **`formik`**: A library for building forms in React.

## 9. Connection to Monorepo Architecture

The Self-Service App is part of a larger monorepo architecture. It consumes shared packages from the monorepo, such as the `@fineract/ui` component library and the `@fineract-apps/fineract-api` client. This approach promotes code reuse, consistency, and efficient development across the entire Fineract ecosystem.
