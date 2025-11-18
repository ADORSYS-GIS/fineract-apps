# Fineract Apps Documentation

Welcome to the Fineract Frontend Apps documentation.

## Quick Links

- 🚀 **[Quick Start CI/CD](./QUICK-START-CI-CD.md)** - Get CI/CD running in 5 minutes
- 📚 **[Full CI/CD Setup Guide](./CI-CD-SETUP.md)** - Comprehensive CI/CD documentation
- 🏗️ **[Architecture Overview](#architecture-overview)** - System architecture (below)

## Documentation Index

| Document | Description | Audience |
|----------|-------------|----------|
| [QUICK-START-CI-CD.md](./QUICK-START-CI-CD.md) | Quick CI/CD setup guide | Developers, DevOps |
| [CI-CD-SETUP.md](./CI-CD-SETUP.md) | Complete CI/CD documentation | DevOps, Maintainers |

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    Fineract Frontend Apps                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│  Admin App   │      │ Account Mgr  │     │Branch Manager│
│  (User Mgmt) │      │ (Accounting) │     │  (Clients)   │
└──────────────┘      └──────────────┘     └──────────────┘
                              │
                              ▼
                      ┌──────────────┐
                      │ Cashier App  │
                      │  (Teller)    │
                      └──────────────┘
```

### Technology Stack

- **Frontend:** React 19 + TypeScript
- **Routing:** TanStack Router (file-based)
- **State Management:** React Query (TanStack Query)
- **Forms:** Formik + Zod
- **Styling:** TailwindCSS
- **Build Tool:** Vite
- **Package Manager:** pnpm (monorepo)
- **Linting:** Biome
- **API Client:** Generated from OpenAPI spec

### Shared Packages

| Package | Description |
|---------|-------------|
| `@fineract-apps/ui` | Shared UI components (Button, Card, Form, etc.) |
| `@fineract-apps/fineract-api` | Auto-generated API client with React Query hooks |

### CI/CD Pipeline

```
Code Push → GitHub Actions → Docker Build → GHCR → GitOps → ArgoCD → Kubernetes
```

1. **Developer** pushes code to GitHub
2. **GitHub Actions** runs CI/CD workflows
3. **Docker images** built and pushed to GHCR
4. **GitOps repository** updated (manual for now)
5. **ArgoCD** syncs and deploys to Kubernetes

## Getting Started

### For Developers

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ADORSYS-GIS/fineract-apps.git
   cd fineract-apps
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run development servers:**
   ```bash
   pnpm dev
   ```

4. **Access apps:**
   - Admin App: http://localhost:5001
   - Account Manager: http://localhost:5002
   - Branch Manager: http://localhost:5003
   - Cashier: http://localhost:5004

### For DevOps

1. **Enable GitHub Actions** - See [Quick Start](./QUICK-START-CI-CD.md)
2. **Configure secrets** - Only `GITHUB_TOKEN` (auto-provided)
3. **Push to develop** - Triggers Docker image builds
4. **Update GitOps repo** - Deploy to Kubernetes

## Project Structure

```
fineract-apps/
├── frontend/               # Frontend applications
│   ├── admin-app/         # User management app
│   ├── account-manager-app/ # Accounting app
│   ├── branchmanager-app/ # Branch/client management
│   └── cashier-app/       # Teller/cashier app
├── packages/              # Shared packages
│   ├── ui/               # Shared UI components
│   └── fineract-api/     # Generated API client
├── .github/workflows/     # CI/CD workflows
├── docs/                 # Documentation (you are here)
├── Dockerfile.*          # Docker build files
└── package.json          # Workspace root
```

## Common Tasks

### Run Linting

```bash
pnpm lint
```

### Run Tests

```bash
pnpm test
```

### Build All Apps

```bash
pnpm build
```

### Build Specific App

```bash
pnpm --filter admin-app build
```

### Generate API Client

```bash
cd packages/fineract-api
pnpm generate
```

## Authentication & Authorization

- **Authentication:** Keycloak (OIDC)
- **Authorization:** Apache Gateway with mod_auth_openidc
- **RBAC:** Role-based access control at gateway level
- **Roles:**
  - `admin` - User management
  - `accountant` - Accounting operations
  - `branch-manager` - Client/office management
  - `teller` - Cash operations

## Deployment

### Development Environment

- **Trigger:** Push to `develop` branch
- **Images:** Tagged with `develop` and commit SHA
- **Deployed to:** Dev cluster via ArgoCD

### Production Environment

- **Trigger:** Push to `main` branch
- **Images:** Tagged with `main` and commit SHA
- **Deployed to:** Prod cluster via ArgoCD

## Monitoring & Logging

- **Application Logs:** Stdout/stderr (collected by Kubernetes)
- **Metrics:** Prometheus (via Apache exporter)
- **Health Checks:** `/health` endpoint in each app
- **Deployment Status:** ArgoCD UI

## Contributing

1. Create a feature branch
2. Make changes
3. Run linting and tests
4. Create a pull request
5. Wait for CI to pass
6. Get approval and merge

## Support

- **Issues:** [GitHub Issues](https://github.com/ADORSYS-GIS/fineract-apps/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ADORSYS-GIS/fineract-apps/discussions)
- **Documentation:** This docs folder

## License

See [LICENSE](../LICENSE) file in repository root.
