# CI/CD Pipeline Documentation

This document provides a comprehensive guide to the CI/CD setup for the Fineract Frontend Apps monorepo.

## Table of Contents

- [Overview](#overview)
- [Workflows](#workflows)
- [Required Secrets and Variables](#required-secrets-and-variables)
- [Setup Instructions](#setup-instructions)
- [Workflow Details](#workflow-details)
- [Docker Images](#docker-images)
- [GitOps Integration](#gitops-integration)
- [Troubleshooting](#troubleshooting)

## Overview

The CI/CD pipeline is designed to:

1. **Lint and Test** - Run code quality checks and tests on every push/PR
2. **Build Apps** - Build all frontend applications in parallel
3. **Publish Docker Images** - Create and push Docker images to GitHub Container Registry (GHCR)
4. **Trigger GitOps** - Notify GitOps repository for deployment updates (manual for now)

### Architecture

```
┌─────────────────┐
│  Push to GitHub │
└────────┬────────┘
         │
         ├──────────────────────────────────────┐
         │                                      │
         ▼                                      ▼
┌────────────────────┐              ┌──────────────────────┐
│ Frontend Apps CI   │              │ Publish Docker Images│
│ - Lint             │              │ - Build Images       │
│ - Test             │              │ - Push to GHCR       │
│ - Build All Apps   │              │ - Tag Images         │
└────────────────────┘              └──────────┬───────────┘
                                               │
                                               ▼
                                    ┌──────────────────────┐
                                    │ GitOps Update        │
                                    │ (Manual for now)     │
                                    └──────────────────────┘
```

## Workflows

### 1. Frontend Apps CI (`ci-frontend-apps.yml`)

**Triggers:**
- Push to `main`, `develop`, `feature/**`, `bugfix/**` branches
- Pull requests to `main` or `develop`
- Only when frontend or package files change

**Jobs:**
- `lint-and-test`: Runs Biome linter and tests with coverage
- `build-apps`: Builds all 4 frontend apps in parallel
- `summary`: Generates CI results summary

**Status:** ✅ Fully implemented

### 2. Publish Frontend Docker Images (`publish-frontend-images.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Manual workflow dispatch (with app selection)
- Only when frontend/Dockerfile files change

**Jobs:**
- `determine-apps`: Decides which apps to build
- `build-and-push`: Builds and pushes Docker images to GHCR
- `trigger-gitops-update`: Placeholder for GitOps automation

**Status:** ✅ Fully implemented (GitOps trigger is manual)

## Required Secrets and Variables

### GitHub Secrets

These secrets need to be configured in **Settings → Secrets and variables → Actions → Repository secrets**.

| Secret Name | Required | Description | Where to Add | Example Value |
|-------------|----------|-------------|--------------|---------------|
| `GITHUB_TOKEN` | ✅ Yes | GitHub Actions token (auto-provided) | N/A - Auto-provided by GitHub | `ghp_***` |

### GitHub Variables (Optional)

These can be configured in **Settings → Secrets and variables → Actions → Variables**.

| Variable Name | Required | Description | Default Value |
|---------------|----------|-------------|---------------|
| `REGISTRY` | ❌ No | Container registry URL | `ghcr.io` |
| `IMAGE_PREFIX` | ❌ No | Docker image prefix | `adorsys-gis/fineract-` |

### Environment Variables (In Workflows)

| Variable | Set In | Description |
|----------|--------|-------------|
| `REGISTRY` | `publish-frontend-images.yml` | Container registry (ghcr.io) |

## Setup Instructions

### Prerequisites

1. **GitHub Repository** with Actions enabled
2. **GitHub Container Registry (GHCR)** access
3. **GitHub Personal Access Token (PAT)** with `write:packages` permission (optional, for manual testing)

### Step 1: Enable GitHub Actions

1. Go to your repository on GitHub
2. Navigate to **Settings → Actions → General**
3. Under **Actions permissions**, select:
   - ✅ "Allow all actions and reusable workflows"
4. Under **Workflow permissions**, select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
5. Click **Save**

### Step 2: Configure Package Permissions

1. Go to your repository **Settings → Actions → General**
2. Scroll to **Workflow permissions**
3. Ensure **"Read and write permissions"** is selected
4. This allows workflows to push to GHCR

### Step 3: Verify GITHUB_TOKEN

The `GITHUB_TOKEN` is automatically provided by GitHub Actions. No manual configuration needed.

**To verify:**
```yaml
# In any workflow, this token is available as:
${{ secrets.GITHUB_TOKEN }}
```

### Step 4: Enable Package Visibility (Optional)

After first image push:

1. Go to **https://github.com/orgs/ADORSYS-GIS/packages**
2. Find your package (e.g., `fineract-admin-app`)
3. Click **Package settings**
4. Set visibility:
   - **Public** - Anyone can pull
   - **Private** - Only org members can pull

### Step 5: Test the Workflows

#### Test CI Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/test-ci
   ```

2. Make a small change to a frontend file:
   ```bash
   echo "// test" >> frontend/admin-app/src/main.tsx
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "test: verify CI workflow"
   git push origin feature/test-ci
   ```

4. Go to **Actions** tab on GitHub
5. Verify **Frontend Apps CI** workflow runs successfully

#### Test Docker Build Workflow

1. Push to `develop` branch:
   ```bash
   git checkout develop
   git merge feature/test-ci
   git push origin develop
   ```

2. Go to **Actions** tab
3. Verify **Publish Frontend Docker Images** workflow runs
4. Check **Packages** to see published images

## Workflow Details

### Frontend Apps CI Workflow

```yaml
# Location: .github/workflows/ci-frontend-apps.yml

# Jobs breakdown:
1. lint-and-test (runs first)
   - Checkout code
   - Setup pnpm + Node.js
   - Install dependencies
   - Run: pnpm lint
   - Run: pnpm test:coverage
   - Upload coverage artifacts

2. build-apps (runs after lint-and-test)
   - Matrix strategy for 4 apps
   - Build each app in parallel
   - Upload build artifacts (dist folders)

3. summary (runs last, always)
   - Generate summary report
   - Shows pass/fail status
```

### Publish Docker Images Workflow

```yaml
# Location: .github/workflows/publish-frontend-images.yml

# Jobs breakdown:
1. determine-apps
   - Decides which apps to build
   - Default: all apps
   - Can be filtered via manual dispatch

2. build-and-push (matrix)
   - Sets up Docker Buildx
   - Logs into GHCR
   - Extracts git metadata (SHA, branch)
   - Builds Docker image
   - Tags: branch name, short SHA, long SHA
   - Pushes to ghcr.io
   - Uses GitHub Actions cache for layers

3. trigger-gitops-update
   - Placeholder for future automation
   - Currently shows manual steps
```

### Docker Image Tags

Images are tagged with multiple tags for flexibility:

| Branch | Tags Applied |
|--------|-------------|
| `main` | `main`, `<short-sha>`, `<long-sha>` |
| `develop` | `develop`, `<short-sha>`, `<long-sha>` |
| `feature/*` | `<safe-branch-name>`, `<short-sha>` |

**Example:**
```bash
# Push to develop branch at commit abc1234
ghcr.io/adorsys-gis/fineract-admin-app:develop
ghcr.io/adorsys-gis/fineract-admin-app:abc1234
ghcr.io/adorsys-gis/fineract-admin-app:abc123456789abcdef
```

## Docker Images

### Available Images

| App Name | Image Name | Dockerfile |
|----------|-----------|------------|
| Admin App | `ghcr.io/adorsys-gis/fineract-admin-app` | `Dockerfile.admin` |
| Account Manager | `ghcr.io/adorsys-gis/fineract-account-manager-app` | `Dockerfile.account-manager` |
| Branch Manager | `ghcr.io/adorsys-gis/fineract-branch-manager-app` | `Dockerfile.branch-manager` |
| Cashier | `ghcr.io/adorsys-gis/fineract-cashier-app` | `Dockerfile.cashier` |

### Pulling Images

```bash
# Login to GHCR (if private)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull an image
docker pull ghcr.io/adorsys-gis/fineract-admin-app:develop

# Run locally
docker run -p 8080:80 ghcr.io/adorsys-gis/fineract-admin-app:develop
```

### Image Architecture

All Dockerfiles use **multi-stage builds**:

```dockerfile
# Stage 1: Builder
FROM node:22-alpine AS builder
# - Install pnpm
# - Copy workspace files
# - Install dependencies
# - Build app

# Stage 2: Runtime
FROM nginx:alpine
# - Copy built assets from builder
# - Configure nginx
# - Add health check
# - Expose port 80
```

**Benefits:**
- Small final image size (~25MB vs ~1GB)
- No build tools in production image
- Faster deployment and startup

## GitOps Integration

### Current State

The `trigger-gitops-update` job is a **placeholder** that displays manual update instructions.

### Manual GitOps Update (Current Process)

After images are published:

1. Go to the **fineract-gitops** repository
2. Update image tags in Kustomize overlays:
   ```yaml
   # Example: apps/admin-app/overlays/dev/kustomization.yaml
   images:
     - name: fineract-admin-app
       newName: ghcr.io/adorsys-gis/fineract-admin-app
       newTag: abc1234  # Update this SHA
   ```

3. Commit and push:
   ```bash
   git add .
   git commit -m "chore: update admin-app image to abc1234"
   git push
   ```

4. ArgoCD will detect the change and sync automatically

### Future Automation (Planned)

Create a workflow to automatically update GitOps repo:

```yaml
# Future: .github/workflows/update-gitops-repo.yml
- name: Update GitOps repository
  run: |
    git clone https://github.com/ADORSYS-GIS/fineract-gitops.git
    cd fineract-gitops
    # Update image tags using kustomize or yq
    kustomize edit set image fineract-admin-app=ghcr.io/adorsys-gis/fineract-admin-app:$SHA
    git commit -am "chore: update images to $SHA"
    git push
```

**Required:**
- Personal Access Token (PAT) with repo write access
- Store as `GITOPS_REPO_TOKEN` secret

## Troubleshooting

### Common Issues

#### 1. "Permission denied" when pushing to GHCR

**Cause:** Workflow doesn't have package write permission

**Fix:**
1. Go to **Settings → Actions → General**
2. Under **Workflow permissions**, select **"Read and write permissions"**
3. Save and re-run workflow

#### 2. "Resource not accessible by integration"

**Cause:** GITHUB_TOKEN lacks necessary permissions

**Fix:**
1. Check workflow `permissions:` block:
   ```yaml
   permissions:
     contents: read
     packages: write  # Add this
   ```

2. Ensure repository settings allow Actions to write packages

#### 3. Build fails with "ENOENT: no such file or directory"

**Cause:** Dependencies not installed or wrong working directory

**Fix:**
```yaml
# Ensure frozen-lockfile is used
- name: Install dependencies
  run: pnpm install --frozen-lockfile

# Check working directory
- name: Debug
  run: |
    pwd
    ls -la
```

#### 4. Docker build runs out of memory

**Cause:** Node.js build process is memory-intensive

**Fix:**
```dockerfile
# In Dockerfile, set Node memory limit
RUN NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

#### 5. Lint fails on commit

**Cause:** Pre-commit hooks running Biome linter

**Fix:**
```bash
# Auto-fix linting errors
pnpm biome check --write .

# Commit again
git add .
git commit -m "your message"
```

### Debugging Workflows

#### Enable Debug Logging

1. Go to **Settings → Secrets and variables → Actions**
2. Add **Variables**:
   - `ACTIONS_RUNNER_DEBUG` = `true`
   - `ACTIONS_STEP_DEBUG` = `true`
3. Re-run workflow

#### Check Workflow Logs

1. Go to **Actions** tab
2. Click on failed workflow run
3. Click on failed job
4. Expand failed step
5. Look for error messages

#### Manual Workflow Dispatch

Test workflows manually:

1. Go to **Actions** tab
2. Select **Publish Frontend Docker Images**
3. Click **Run workflow**
4. Select branch
5. Enter apps to build (e.g., "admin")
6. Click **Run workflow**

## Best Practices

### For Developers

1. **Always run linting before commit:**
   ```bash
   pnpm lint
   ```

2. **Run tests locally:**
   ```bash
   pnpm test
   ```

3. **Build apps before pushing:**
   ```bash
   pnpm build
   ```

4. **Use feature branches:**
   ```bash
   git checkout -b feature/your-feature
   ```

5. **Create small, focused PRs**

### For CI/CD Maintenance

1. **Pin action versions** - Use specific versions (e.g., `@v4`) not `@latest`
2. **Use caching** - Cache dependencies and Docker layers
3. **Fail fast** - Set `fail-fast: true` in matrix strategies when appropriate
4. **Monitor workflow minutes** - GitHub has usage limits
5. **Keep secrets secure** - Never log secrets, use masked values

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)

## Support

For issues or questions:

1. Check this documentation
2. Review workflow logs in GitHub Actions
3. Search existing GitHub Issues
4. Create a new issue with:
   - Workflow name
   - Error message
   - Steps to reproduce
   - Relevant logs
