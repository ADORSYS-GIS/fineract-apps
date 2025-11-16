[![Frontend Apps CI](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/ci-frontend-apps.yml/badge.svg)](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/ci-frontend-apps.yml)
[![Build](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/build.yml/badge.svg)](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/build.yml)
[![Node.js CI](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/node.js.yml/badge.svg)](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/node.js.yml)
[![Publish Frontend Images](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/publish-frontend-images.yml/badge.svg)](https://github.com/ADORSYS-GIS/fineract-apps/actions/workflows/publish-frontend-images.yml)


# Fineract Frontend Apps

A modern, production-ready monorepo containing frontend applications for the Apache Fineract microfinance platform. Built with React 19, TypeScript, and TanStack ecosystem with full CI/CD automation.

## 📚 Documentation

- **[Quick Start Guide](./docs/QUICK-START-CI-CD.md)** - Get CI/CD running in 5 minutes
- **[Full CI/CD Documentation](./docs/CI-CD-SETUP.md)** - Complete setup guide with troubleshooting
- **[Architecture & Documentation Index](./docs/README.md)** - System overview and docs index

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Install MIFOS Web App dependencies (uses npm, not pnpm)
pnpm install:mifos

# Start all React development servers
pnpm dev

# Start MIFOS Web App (Angular) separately
pnpm dev:mifos

# Access apps at:
# - Admin App: http://localhost:5001
# - Account Manager: http://localhost:5002
# - Branch Manager: http://localhost:5003
# - Cashier: http://localhost:5004
# - Reporting App: http://localhost:5005
# - Accounting App: http://localhost:5006
# - MIFOS Web App: http://localhost:4200
```

## 🏗️ Applications

### React Apps (pnpm workspace)

| App | Description | Port | Role |
|-----|-------------|------|------|
| **Admin App** | User & staff management | 5001 | `admin` |
| **Account Manager** | Accounting & financial operations | 5002 | `accountant` |
| **Branch Manager** | Client & office management | 5003 | `branch-manager` |
| **Cashier App** | Teller operations & transactions | 5004 | `teller` |
| **Reporting App** | Reports, analytics & audit trails | 5005 | `branch-manager`, `admin` |
| **Accounting App** | GL accounts, journal entries & closures | 5006 | `accountant`, `admin` |

### Angular Apps (npm)

| App | Description | Port | Tech Stack |
|-----|-------------|------|------------|
| **MIFOS Web App** | Complete Apache Fineract frontend | 4200 | Angular 19, Material, OAuth2-Proxy |

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Full type safety
- **TanStack Router** - File-based routing with code splitting
- **TanStack Query** - Server state management
- **Formik + Zod** - Form handling with validation
- **TailwindCSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **pnpm** - Efficient monorepo package manager
- **Biome** - Fast linting and formatting

## Quality Assurance & Automation

This template is pre-configured with a suite of tools to enforce code quality, consistency, and best practices automatically.

### Biome

An all-in-one toolchain that handles formatting and linting. It is extremely fast and replaces the need for separate tools like ESLint and Prettier.

- **Check code for errors**: `pnpm lint`
- **Format the entire project**: `pnpm format`

### Husky & Git Hooks

Husky is used to manage Git hooks, which are scripts that run automatically at certain points in the Git lifecycle.

- **`pre-commit`**: Before each commit, a hook automatically runs `pnpm lint`. This ensures that no code with linting or formatting errors can be committed to the repository.
- **`commit-msg`**: Before each commit is finalized, a hook runs `commitlint` to ensure the commit message follows the [Conventional Commits](https://www.conventionalcommits.org/) standard. This is crucial for a clean and readable version history.

### CI/CD Pipeline

Fully automated CI/CD with GitHub Actions:

- **CI Workflow** (`.github/workflows/ci-frontend-apps.yml`)
  - Runs on every push and PR
  - Linting, testing, and builds
  - Matrix builds for all 4 apps

- **Docker Publish** (`.github/workflows/publish-frontend-images.yml`)
  - Builds and publishes Docker images to GHCR
  - Multi-stage builds for optimal image size
  - Automatic tagging with branch and SHA
  - GitOps integration ready

**See [CI/CD Documentation](./docs/CI-CD-SETUP.md) for complete setup guide.**

## 📦 Project Structure

```
fineract-apps/
├── frontend/                    # Frontend applications
│   ├── admin-app/              # User management (React)
│   ├── account-manager-app/    # Accounting (React)
│   ├── branchmanager-app/      # Client/office management (React)
│   ├── cashier-app/            # Teller operations (React)
│   ├── reporting-app/          # Reports & audit trails (React)
│   ├── accounting-app/         # GL accounts & journal entries (React)
│   └── mifos-web-app/          # Complete Fineract frontend (Angular)
├── packages/                    # Shared packages (React apps only)
│   ├── ui/                     # Shared UI components
│   └── fineract-api/           # Generated API client
├── .github/workflows/           # CI/CD automation
│   ├── ci-frontend-apps.yml    # React apps CI
│   ├── publish-frontend-images.yml         # React apps Docker publish
│   └── publish-mifos-web-app-image.yml     # MIFOS Web App Docker publish
├── docs/                        # Documentation
├── Dockerfile.admin             # React apps Dockerfiles
├── Dockerfile.account-manager
├── Dockerfile.branch-manager
├── Dockerfile.cashier
├── Dockerfile.reporting
├── Dockerfile.accounting
└── Dockerfile.mifos-web-app     # Angular app Dockerfile
```

## 🔧 Available Scripts

### React Apps (pnpm)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all React dev servers |
| `pnpm build` | Build all React apps for production |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Auto-format code with Biome |
| `pnpm test` | Run tests |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm --filter <app> build` | Build specific React app |

### MIFOS Web App (npm via pnpm)

| Command | Description |
|---------|-------------|
| `pnpm install:mifos` | Install MIFOS Web App dependencies |
| `pnpm dev:mifos` | Start MIFOS Web App dev server |
| `pnpm build:mifos` | Build MIFOS Web App for production |
| `pnpm test:mifos` | Run MIFOS Web App tests |

## 🐳 Docker Images

All apps are containerized with multi-stage builds:

```bash
# Build React app images (done by CI/CD automatically)
docker build -f Dockerfile.admin -t fineract-admin-app .

# Build MIFOS Web App image
docker build -f Dockerfile.mifos-web-app -t mifos-web-app .

# Pull from GitHub Container Registry
docker pull ghcr.io/adorsys-gis/fineract-admin-app:develop
docker pull ghcr.io/adorsys-gis/mifos-web-app:develop
```

**Registries:**
- React apps: `ghcr.io/adorsys-gis/fineract-*-app`
  - admin-app, account-manager-app, branch-manager-app, cashier-app, reporting-app
- MIFOS Web App: `ghcr.io/adorsys-gis/mifos-web-app`

## 🔐 Authentication & Authorization

- **Auth Provider:** Keycloak (OIDC)
- **Gateway:** Apache with mod_auth_openidc
- **RBAC:** Role-based access control
- **Roles:** admin, accountant, branch-manager, teller

## 🚀 Deployment

### Development
```bash
# Push to develop branch
git push origin develop

# CI/CD automatically:
# 1. Runs tests and linting
# 2. Builds Docker images
# 3. Pushes to GHCR with 'develop' tag
# 4. Ready for GitOps deployment
```

### Production
```bash
# Push to main branch
git push origin main

# CI/CD automatically:
# 1. Runs tests and linting
# 2. Builds Docker images
# 3. Pushes to GHCR with 'main' tag
# 4. Ready for GitOps deployment
```

**Full deployment guide:** [CI/CD Documentation](./docs/CI-CD-SETUP.md)

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: your feature"`
3. Push and create PR: `git push origin feature/your-feature`
4. Wait for CI to pass
5. Get approval and merge

**Commit Convention:** [Conventional Commits](https://www.conventionalcommits.org/)

## 📄 License

See [LICENSE](./LICENSE) file.