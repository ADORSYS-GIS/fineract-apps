# Fineract-apps Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to the `fineract-apps` repository.

## Project Overview

This is a monorepo for modern frontend applications built with Vite, React, TypeScript, and Tailwind CSS. The project is structured as a pnpm workspace.

-   `frontend/`: Contains the individual React applications (`account-manager-app`, `branch-manager-app`, `cashier-app`).
-   `packages/`: Contains shared code, including:
    -   `ui`: A shared component library.
    -   `config`: Shared configurations for tools like TypeScript and Vite.

## Key Technologies

-   **Build Tool**: Vite
-   **Framework**: React with TypeScript
-   **Styling**: Tailwind CSS
-   **Package Manager**: pnpm with workspaces
-   **Code Quality**: Biome (for linting and formatting)
-   **Git Hooks**: Husky and commitlint

## Development Workflow

### Getting Started

1.  Install dependencies from the root of the project:
    ```bash
    pnpm install
    ```

2.  Run a specific application's development server:
    ```bash
    pnpm --filter <app-name> dev
    ```
    For example, to run `account-manager-app`:
    ```bash
    pnpm --filter account-manager-app dev
    ```

### Building

To build all applications and packages:

```bash
pnpm build
```

To build a specific application:

```bash
pnpm --filter <app-name> build
```

### Testing

Tests are written with Jest and React Testing Library. Test files are located alongside the components they test (e.g., `Component.test.tsx`).

Run all tests:

```bash
pnpm test
```

### Code Quality

-   **Linting and Formatting**: This project uses Biome.
    -   Check for issues: `pnpm lint`
    -   Format code: `pnpm format`
-   **Commit Messages**: Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced by a `commit-msg` hook.

## Architectural Patterns

-   **Shared UI Components**: Reusable UI components are located in `packages/ui/src/components`. When creating a new component that might be used across multiple applications, it should be added here.
-   **Shared Configuration**: Base configurations for TypeScript (`tsconfig.base.json`) and Vite (`vite.config.base.js`) are in `packages/config`. Application-specific configurations extend these base configs.
-   **Monorepo Structure**: The use of pnpm workspaces allows for easy management of dependencies and inter-package linking. When adding a dependency to a specific app, use the `--filter` flag with `pnpm add`.

## Important Files

-   `pnpm-workspace.yaml`: Defines the workspaces in the monorepo.
-   `biome.json`: Configuration for the Biome toolchain.
-   `packages/ui/src/index.ts`: The entry point for the shared UI component library.
-   `frontend/*/vite.config.ts`: Vite configuration for each application, which extends the base configuration.
