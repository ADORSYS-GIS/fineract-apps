# Self-Service Banking App

Customer-facing self-service banking application with WebAuthn passwordless authentication.

## Overview

This React application provides customers with:
- Self-registration with email verification
- WebAuthn passwordless login (Face ID, Touch ID, security keys)
- Account dashboard (view balances, transactions)
- KYC document upload and status tracking
- Deposit operations (MTN Transfer, Orange Transfer)
- Withdrawal operations (with WebAuthn step-up authentication)
- Transaction history

## Tech Stack

- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Routing**: TanStack Router (file-based)
- **State Management**: TanStack Query
- **UI Components**: Shared `@fineract/ui` package
- **Styling**: Tailwind CSS
- **Authentication**: `oidc-client-ts` / `react-oidc-context`
- **WebAuthn**: `@simplewebauthn/browser`

## Authentication Flow

This app uses **direct OIDC authentication** with Keycloak (not OAuth2-Proxy):

```
┌────────────────────────────────────────────────────────────────┐
│  1. User clicks "Login"                                        │
│  2. React app redirects to Keycloak (self-service-app client)  │
│  3. Keycloak shows username form (custom self-service-browser) │
│  4. User enters email → WebAuthn challenge                     │
│  5. User authenticates with Face ID / Touch ID                 │
│  6. Keycloak redirects back with authorization code            │
│  7. React app exchanges code for tokens (PKCE)                 │
│  8. JWT contains: fineract_external_id, kyc_tier, kyc_status   │
└────────────────────────────────────────────────────────────────┘
```

## Environment Variables

```env
# OIDC Configuration
VITE_OIDC_AUTHORITY=https://auth.example.com/realms/fineract
VITE_OIDC_CLIENT_ID=self-service-app
VITE_OIDC_REDIRECT_URI=https://apps.example.com/self-service/callback
VITE_OIDC_POST_LOGOUT_URI=https://apps.example.com/self-service

# API Configuration
VITE_REGISTRATION_API_URL=/api/registration
VITE_FINERACT_API_URL=/fineract-provider/api/v1
VITE_FINERACT_TENANT_ID=default
```

## Project Structure

```
self-service-app/
├── src/
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── kyc/          # KYC upload components
│   │   └── transactions/ # Deposit/withdrawal components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API clients
│   ├── routes/           # TanStack Router routes
│   └── types/            # TypeScript types
├── public/               # Static assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## Deployment

The app is containerized and deployed via GitOps:

- **Container**: NGINX serving static build
- **GitOps**: `fineract-gitops/apps/self-service-app/`
- **Ingress**: Public (no OAuth2-Proxy) at `/self-service/*`

## KYC Tiers

| Tier | Status | Limits | Features |
|------|--------|--------|----------|
| Tier 1 | Unverified | 50K XAF/day deposit, 25K withdrawal | MTN/Orange only |
| Tier 2 | Verified | 500K XAF/day deposit, 250K withdrawal | + Bank transfers |

## Related Components

- **Keycloak Client**: `self-service-app` (public, PKCE)
- **Auth Flow**: `self-service-browser` (WebAuthn passwordless)
- **Backend**: `customer-registration-service`
- **GitOps**: `fineract-gitops/apps/self-service-app/`
