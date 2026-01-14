# Semantic Versioning (SemVer) Guide for AI

This guide provides a concise, actionable workflow for versioning and releasing packages in this monorepo. It is intended for language models and automated agents.

---

## 1. Core Concepts

- **Versioning**: `MAJOR.MINOR.PATCH`
  - `MAJOR`: Breaking changes.
  - `MINOR`: Backward-compatible new features.
  - `PATCH`: Backward-compatible bug fixes.
- **Tooling**: We use **Changesets** for versioning and changelog generation.

---

## 2. Branching Strategy

- **`develop`**: Main development branch. All `feature/*` branches merge here.
- **`main`**: Production-ready code. Merges come from `release/*` or `hotfix/*`.
- **`feature/*`**: For new features/fixes. Branched from `develop`.
- **`release/*`**: To prepare a new release. Branched from `develop`.
- **`hotfix/*`**: For urgent production fixes. Branched from `main`.

---

## 3. Standard Workflow: Feature Release

This is the most common workflow for developers

### Step 1: Create Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Step 2: Implement Changes & Add a Changeset

After making code changes, you **must** add a changeset.

```bash
pnpm changeset add
```

Follow the prompts:
1.  Select the package(s) you changed.
2.  Choose the correct SemVer bump (`Patch`, `Minor`, or `Major`).
3.  Write a clear summary of the changes for the changelog.

### Step 3: Commit and Push

Commit the changeset file (`.changeset/*.md`) along with your code.

```bash
git add .
git commit -m "feat(scope): your descriptive commit message"
git push origin feature/your-feature-name
```

### Step 4: Create a Pull Request

Open a Pull Request from your feature branch to `develop`.

---

## 4. Release Manager Workflow: Publishing a New Version

This process is typically handled by a release manager or an automated CI pipeline.

### Step 1: Create Release Branch

Create a `release` branch from `develop`.

```bash
git checkout develop
git pull origin develop
git checkout -b release/vX.Y.Z
```

### Step 2: Version the Packages

This command consumes all changesets, updates `package.json` versions, and updates `CHANGELOG.md` files.

```bash
pnpm changeset version
```

### Step 3: Commit and Push Version Changes

```bash
git add .
git commit -m "chore: bump version for release vX.Y.Z"
git push origin release/vX.Y.Z
```

### Step 4: Finalize Release

1.  **Merge to `main`**: Merge the `release/vX.Y.Z` branch into `main` via Pull Request.
2.  **Tag the release**: After merging, tag the `main` branch.
    ```bash
    git checkout main
    git pull origin main
    git tag -a vX.Y.Z -m "Release vX.Y.Z"
    git push origin vX.Y.Z
    ```
3.  **Merge back to `develop`**: Merge the release branch back into `develop`.
    ```bash
    git checkout develop
    git merge origin/release/vX.Y.Z
    git push origin develop
    ```

### Step 5: Publish (CI Action)

A CI job triggered by the new tag will publish the packages.

```bash
pnpm publish -r --no-git-checks