# Monorepo Setup & Workflow Guide

This document explains the structure of this monorepo, the reasoning behind it, and the workflow you must follow.

## 1. The Problem With the Old Setup

Your initial approach was not a monorepo. It was a "monorepo-in-name-only"—a collection of disconnected projects sitting in the same repository. This is the worst of both worlds and would have led to severe issues:

-   **Dependency Conflicts**: Each app had its own `package-lock.json`. It was inevitable that `cashier-app` would end up with a different version of `react` or `tailwindcss` than `account-manager-app`, leading to bugs and inconsistencies.
-   **No Code Sharing**: The primary benefit of a monorepo is sharing code (UI components, hooks, utils). The old setup made this impossible without publishing packages to a registry, which is slow and cumbersome.
-   **Maintenance Nightmare**: To update a single dependency (like `tailwindcss`), you would have had to go into each of the three app directories, run `pnpm update`, and hope you did it correctly everywhere. This is not scalable.

## 2. The Solution: A `pnpm` Workspace

A true monorepo uses a workspace manager. We use `pnpm workspaces`. This treats all the projects in the `frontend/` directory as a single, cohesive system.

**The core benefits we now have are:**
-   **Single Lockfile**: One `pnpm-lock.yaml` at the root manages dependencies for the *entire* project, eliminating version conflicts.
-   **Hoisted `node_modules`**: There is only one primary `node_modules` directory at the root. `pnpm` installs all dependencies there and uses symlinks to make them available to the individual apps that need them. This is efficient and saves disk space.
-   **Unified Tooling**: You can run commands for all or some of your apps from the root directory.

## 3. The Changes Explained: What Makes This a "Real" Monorepo?

The transformation into a proper monorepo involved these key changes:

### A. `pnpm-workspace.yaml`
This file was created at the root:
```yaml
packages:
  - 'frontend/*'
  - 'packages/*'
```
-   **Why?** This is the declaration. It explicitly tells `pnpm` that this is a workspace and that every folder inside `/frontend` and `/packages` is a package to be managed. This is the single most important file for enabling monorepo functionality.

### B. The Root `package.json` Was Gutted
Your old root `package.json` contained application dependencies. This was incorrect.
-   **Why was `tailwindcss` (and `react`, etc.) removed?** Because the monorepo root is **not an application**. It's a manager. `tailwindcss` is a dependency of your *applications* (`cashier-app`, etc.), not of the workspace manager itself. Dependencies must be declared in the `package.json` of the package that actually imports and uses them.
-   The only `devDependencies` that remain at the root are tools for managing the entire repository: `biome`, `husky`, `commitlint`, `typescript`, and `vite`. Keeping these here ensures you use one consistent version for linting, building, and testing across all packages.

### C. Individual `package.json` Files Remain
-   **Why wasn't the `package.json` from each app removed?** Because each package is still its own project. It needs a manifest to declare its unique properties:
    1.  Its **name** (e.g., `"name": "cashier-app"`).
    2.  Its **dependencies** (e.g., `react`, `tailwindcss`). This is how `pnpm` knows what to install for each app.
    3.  Its **scripts** (e.g., `"dev": "vite"`).

When you run `pnpm install` at the root, `pnpm` reads the `package.json` from *every single package* and builds a single dependency tree.

## 4. Your New Workflow: How to Work Now

**Always run commands from the project root.** Do not `cd` into individual package directories.

### Running Scripts
-   **Run for all apps:** `pnpm dev` (runs the `dev` script in every package).
-   **Run for one app:** `pnpm --filter <package-name> <script>`
    ```bash
    # Start the dev server for only the cashier-app
    pnpm --filter cashier-app dev
    ```

### Managing Dependencies
-   **Add a dependency to an app:** `pnpm add <dependency-name> --filter <package-name>`
    ```bash
    # Add zod to the account-manager-app
    pnpm add zod --filter account-manager-app
    ```
-   **Add a dev dependency to an app:** `pnpm add -D <dependency-name> --filter <package-name>`
    ```bash
    # Add vitest to the branchmanager-app
    pnpm add -D vitest --filter branchmanager-app
    ```

## 5. The Latest Refinements: True Decoupling

The initial monorepo setup was a huge improvement, but the recent changes have taken it to a professional-grade level. Here's what was done and why it's critically important:

### A. Shared Packages as True Dependencies

**The Old Way (Incorrect):**
```javascript
// in cashier-app/vite.config.ts
import { baseViteConfig } from "../../packages/config/vite.config.base";
```

**The New Way (Correct):**
```javascript
// in cashier-app/vite.config.ts
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
```

**Why this matters:**

-   **No More Relative Path Hell:** The old way created a brittle, tightly coupled system. If you moved a file, you'd have to fix a chain of `../..` imports.
-   **Clarity and Intent:** The new way makes it crystal clear that `cashier-app` has a dependency on the `@fineract-apps/config` package. It treats your internal packages like any other third-party dependency.
-   **Scalability:** This is how you build a monorepo that can grow. You can now easily add more apps and packages without creating a tangled mess of relative paths.

To achieve this, we did two things:
1.  Created a `package.json` for the `@fineract-apps/config` package and defined its `exports`.
2.  Added `@fineract-apps/config` and `@fineract-apps/ui` to the `devDependencies` and `dependencies` of the apps using the `workspace:*` protocol.

### B. Eliminating Unnecessary Configuration

We deleted the `tailwind.config.mjs` files and all `postcss.config.mjs` files from each of the frontend apps and the root. We also removed `postcss` and `autoprefixer` dependencies.

**Why this matters:**

-   **Staying Current:** Tailwind CSS v4 is designed to be zero-config by default and integrates directly with Vite via `@tailwindcss/vite`. The old config files and PostCSS dependencies were boilerplate from an outdated setup. This shows an understanding of the tools you are using.
-   **Simplicity:** Less configuration and fewer dependencies mean less to maintain and less to go wrong.

These recent changes are not just "nice to have." They are essential for building a robust, scalable, and maintainable monorepo. This is the standard you should aim for in all your projects.
