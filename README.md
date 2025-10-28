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

# Start all development servers
pnpm dev

# Access apps at:
# - Admin App: http://localhost:5001
# - Account Manager: http://localhost:5002
# - Branch Manager: http://localhost:5003
# - Cashier: http://localhost:5004
```

## 🏗️ Applications

| App | Description | Port | Role |
|-----|-------------|------|------|
| **Admin App** | User & staff management | 5001 | `admin` |
| **Account Manager** | Accounting & financial operations | 5002 | `accountant` |
| **Branch Manager** | Client & office management | 5003 | `branch-manager` |
| **Cashier App** | Teller operations & transactions | 5004 | `teller` |

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
├── frontend/               # Frontend applications
│   ├── admin-app/         # User management
│   ├── account-manager-app/ # Accounting
│   ├── branchmanager-app/ # Client/office management
│   └── cashier-app/       # Teller operations
├── packages/              # Shared packages
│   ├── ui/               # Shared UI components
│   └── fineract-api/     # Generated API client
├── .github/workflows/     # CI/CD automation
├── docs/                 # Documentation
└── Dockerfile.*          # Multi-stage Docker builds
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all apps for production |
| `pnpm lint` | Run Biome linter |
| `pnpm format` | Auto-format code with Biome |
| `pnpm test` | Run tests |
| `pnpm test:coverage` | Run tests with coverage |
| `pnpm --filter <app> build` | Build specific app |

## 🐳 Docker Images

All apps are containerized with multi-stage builds:

```bash
# Build images (done by CI/CD automatically)
docker build -f Dockerfile.admin -t fineract-admin-app .

# Pull from GitHub Container Registry
docker pull ghcr.io/adorsys-gis/fineract-admin-app:develop
```

**Registry:** `ghcr.io/adorsys-gis/fineract-*-app`

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