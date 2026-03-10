# CI/CD Quick Start Guide

> **TL;DR** - Get the CI/CD pipeline running in 5 minutes

## Required Setup (One-Time)

### 1. Enable GitHub Actions

1. Go to **Settings → Actions → General**
2. Select **"Allow all actions and reusable workflows"**
3. Under **Workflow permissions**:
   - ✅ Select **"Read and write permissions"**
   - ✅ Check **"Allow GitHub Actions to create and approve pull requests"**
4. Click **Save**

### 2. Verify Token Access

No manual token setup needed! `GITHUB_TOKEN` is auto-provided by GitHub.

## Required Secrets & Variables

### ✅ Required

| Name | Type | Value | Notes |
|------|------|-------|-------|
| `GITHUB_TOKEN` | Secret | Auto-provided | No setup needed |

### ❌ Optional

None! Everything else is hardcoded in workflows.

## Quick Test

### Test CI Workflow

```bash
# 1. Create a test branch
git checkout -b feature/test-ci

# 2. Make a change
echo "// test" >> frontend/admin-app/src/main.tsx

# 3. Commit and push
git add .
git commit -m "test: verify CI"
git push origin feature/test-ci
```

**Expected Result:** GitHub Actions runs `Frontend Apps CI` workflow

### Test Docker Build

```bash
# 1. Push to develop
git checkout develop
git merge feature/test-ci
git push origin develop
```

**Expected Result:** Docker images published to `ghcr.io/adorsys-gis/fineract-*-app:develop`

## What Gets Built

| Trigger | Workflows Run | Output |
|---------|---------------|--------|
| Push to `feature/*` | CI only | Linting + Tests + Builds |
| Push to `develop` | CI + Docker | Linting + Tests + Builds + Docker Images |
| Push to `main` | CI + Docker | Linting + Tests + Builds + Docker Images |
| Pull Request | CI only | Linting + Tests + Builds |
| Manual Dispatch | Docker only | Selected Docker Images |

## Docker Images

### Where They Go

- **Registry:** `ghcr.io` (GitHub Container Registry)
- **Organization:** `adorsys-gis`
- **Images:**
  - `ghcr.io/adorsys-gis/fineract-admin-app`
  - `ghcr.io/adorsys-gis/fineract-account-manager-app`
  - `ghcr.io/adorsys-gis/fineract-branch-manager-app`
  - `ghcr.io/adorsys-gis/fineract-cashier-app`

### Image Tags

| Branch | Tags Created |
|--------|-------------|
| `develop` | `develop`, `abc1234` (short SHA), full SHA |
| `main` | `main`, `abc1234` (short SHA), full SHA |
| `feature/x` | `feature-x`, `abc1234` (short SHA) |

### Pull an Image

```bash
# Public images (no auth needed if made public)
docker pull ghcr.io/adorsys-gis/fineract-admin-app:develop

# Private images (auth required)
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
docker pull ghcr.io/adorsys-gis/fineract-admin-app:develop
```

## Troubleshooting

### ❌ "Permission denied" pushing to GHCR

**Fix:** Go to **Settings → Actions → General** → Select **"Read and write permissions"**

### ❌ Lint fails

**Fix:**
```bash
pnpm biome check --write .
git add .
git commit -m "fix: apply linting fixes"
```

### ❌ Build fails

**Fix:**
```bash
# Verify locally first
pnpm install
pnpm build

# If it works locally, check GitHub Actions logs
```

## Manual Workflow Dispatch

Build specific apps without pushing code:

1. Go to **Actions** tab
2. Click **Publish Frontend Docker Images**
3. Click **Run workflow**
4. Choose:
   - **Branch:** `develop` or `main`
   - **Apps:** `admin` or `account-manager` or `all`
5. Click **Run workflow**

## After Images Are Published

### Current Process (Manual)

1. Go to **fineract-gitops** repository
2. Update image tags in Kustomize overlays
3. Commit and push
4. ArgoCD auto-syncs

### Example

```bash
cd fineract-gitops

# Update image tag
yq -i '.images[0].newTag = "abc1234"' apps/admin-app/overlays/dev/kustomization.yaml

# Commit
git add .
git commit -m "chore: update admin-app to abc1234"
git push

# ArgoCD will deploy automatically
```

## Full Documentation

For detailed information, see [CI-CD-SETUP.md](./CI-CD-SETUP.md)

## Common Commands

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Build all apps
pnpm build

# Build specific app
pnpm --filter admin-app build

# View Docker images locally
docker images | grep fineract

# Remove old Docker images
docker image prune -a
```

## Next Steps

- [ ] Enable GitHub Actions (one-time)
- [ ] Push to `develop` branch
- [ ] Verify images in Packages tab
- [ ] Update GitOps repo with new image tags
- [ ] Monitor ArgoCD for deployment

## Need Help?

1. Check workflow logs in **Actions** tab
2. Read full documentation: [CI-CD-SETUP.md](./CI-CD-SETUP.md)
3. Create an issue with error logs
