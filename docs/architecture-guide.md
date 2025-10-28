# Architecture Guide

This guide provides a high-level overview of the project's architecture, focusing on the relationships between the different parts of the monorepo.

## Monorepo Structure and Dependencies

The project is organized as a monorepo with a clear separation between applications and shared packages. The following diagram illustrates the dependencies between the different namespaces:

```mermaid
graph LR;
    subgraph Frontend Apps
        A[account-manager-app]
        B[branchmanager-app]
        C[cashier-app]
    end

    subgraph Shared Packages
        UI[packages/ui]
        Config[packages/config]
        I18n[packages/i18n]
    end

    A --> UI;
    B --> UI;
    C --> UI;

    A --> Config;
    B --> Config;
    C --> Config;
    UI --> Config;

    A --> I18n;
    B --> I18n;
    C --> I18n;
    UI --> I18n;
```

## Configuration Management

The project uses a shared configuration approach to ensure consistency across all applications and packages. Base configuration files are located in the `@fineract-apps/config` package and are imported by the individual projects.

The following diagram shows the configuration inheritance model:

```mermaid
graph TD;
    subgraph "Shared Configuration (@fineract-apps/config)"
        BaseVite[vite.config.base.js]
        BaseTS[tsconfig.base.json]
    end

    subgraph "App/Package Configuration"
        AppVite[vite.config.ts]
        AppTS[tsconfig.json]
    end

    BaseVite --> AppVite;
    BaseTS --> AppTS;
```

This setup allows for centralized management of common settings while providing flexibility for project-specific overrides. The shared configurations are imported as modules, thanks to the pnpm workspace setup.

## Root Configuration

The monorepo is governed by several root-level configuration files that apply to all packages and applications.

*   **`package.json`**: The root `package.json` file defines scripts for the entire monorepo (e.g., `dev`, `build`, `lint`) and contains the development dependencies required for the whole project.
*   **`pnpm-workspace.yaml`**: This file defines the workspaces in the monorepo, telling `pnpm` where to find the different applications and packages.
*   **`biome.json`**: This is the configuration file for Biome, which is used for linting and formatting the entire codebase to ensure a consistent style.
*   **`jest.config.js`**: This file configures Jest, the framework used for running tests across the monorepo.
*   **`commitlint.config.js`**: This file configures commitlint, which enforces conventional commit messages to maintain a clean and readable version history.
*   **`tsconfig.json`**: This is the base TypeScript configuration for the entire project. Each package and application extends this base configuration.

The following diagram illustrates how these root configuration files apply to all projects within the monorepo:

```mermaid
graph LR;
    subgraph Root Configuration
        direction TB
        RootPackageJson[package.json]
        PnpmWorkspace[pnpm-workspace.yaml]
        BiomeJson[biome.json]
        JestConfig[jest.config.js]
        CommitLint[commitlint.config.js]
        TSConfig[tsconfig.json]
    end

    subgraph Monorepo
        direction TB
        subgraph Frontend Apps
            A[account-manager-app]
            B[branchmanager-app]
            C[cashier-app]
        end

        subgraph Shared Packages
            UI[packages/ui]
            Config[packages/config]
            I18n[packages/i18n]
        end
    end

    RootPackageJson -.-> Monorepo;
    PnpmWorkspace -.-> Monorepo;
    BiomeJson -.-> Monorepo;
    JestConfig -.-> Monorepo;
    CommitLint -.-> Monorepo;
    TSConfig -.-> Monorepo;
```
