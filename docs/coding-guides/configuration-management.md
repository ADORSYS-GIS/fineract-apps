# Configuration Management Guide

This document outlines the centralized configuration architecture for our monorepo. The goal is to provide a single source of truth for shared settings, reduce duplication, and simplify maintenance.

## 1. Centralized Configuration (`packages/config`)

All shared configuration files are now located in the `packages/config` directory. This approach ensures consistency across all applications and shared libraries within the monorepo.

## 2. TypeScript Configuration (`tsconfig.json`)

-   **Base Configuration**: The primary TypeScript configuration is defined in `packages/config/tsconfig.base.json`. This file sets the core TypeScript compiler options for the entire monorepo.
-   **Usage**: All other `tsconfig.json` files (e.g., in `frontend/account-manager-app` or `packages/ui`) extend this base configuration using the `"extends"` property. This means they inherit all the common settings and only need to specify their unique configurations (e.g., `include` paths, `outDir`).
-   **Where to Edit**:
    -   To change **global TypeScript settings** (e.g., `target`, `strict` mode), edit `packages/config/tsconfig.base.json`.
    -   To change **app-specific or library-specific TypeScript settings** (e.g., files to include, output directory), edit the respective `tsconfig.json` file within that application or library.

## 3. Vite Configuration (`vite.config.ts`)

-   **Base Configuration**: A common Vite configuration is defined in `packages/config/vite.config.base.ts`. This file exports a `baseViteConfig` object that includes shared plugins (like React) and other common build settings.
-   **Usage**: Each application's or library's `vite.config.ts` imports `baseViteConfig` and merges it with its own specific configurations using Vite's `mergeConfig` utility. This allows for app-specific entry points, build outputs, or additional plugins without duplicating common setup.
-   **Where to Edit**:
    -   To add a **Vite plugin that should apply to all applications and libraries**, or to change **global Vite build settings**, edit `packages/config/vite.config.base.ts`.
    -   To change **app-specific Vite settings** (e.g., entry file, output path, or add a plugin only for that app), edit the `vite.config.ts` within that specific application or library.

## 4. Tailwind CSS & PostCSS Configuration

-   **Base Tailwind Config**: The core Tailwind CSS theme and plugins are defined in `packages/config/tailwind.config.base.mjs`. This includes your design system's colors, typography, spacing, etc.
-   **Base PostCSS Config**: The PostCSS plugins (like `tailwindcss` and `autoprefixer`) are configured in `packages/config/postcss.config.base.mjs`.
-   **Usage**: Each application's `tailwind.config.mjs` uses the `presets` property to extend the base Tailwind config. Similarly, each `postcss.config.mjs` imports and spreads the base PostCSS config.
-   **Where to Edit**:
    -   To change **global design tokens** (e.g., primary color, font sizes) or to add a **Tailwind plugin that applies to all apps**, edit `packages/config/tailwind.config.base.mjs`.
    -   To change **PostCSS plugins that apply globally**, edit `packages/config/postcss.config.base.mjs`.
    -   To specify **which files Tailwind should scan** for classes within an app, edit the `content` array in that app's `tailwind.config.mjs`.

## 5. Jest Configuration (`jest.config.js`)

-   **Centralized Config**: The `jest.config.js` at the project root is the single source of truth for running tests across the entire monorepo.
-   **Test Discovery**: It is configured to discover tests within both the `frontend/` applications and the `packages/` shared libraries.
-   **Module Aliases**: It includes `moduleNameMapper` to correctly resolve imports using package aliases (e.g., `@fineract-apps/ui`).
-   **Where to Edit**:
    -   To change **global Jest settings** (e.g., test environment, module file extensions, test match patterns), edit `jest.config.js` at the project root.
    -   For **app-specific test setup** (e.g., mocks, test data), consider creating `setupFilesAfterEnv` within the app's test directory if needed, but keep the main configuration centralized.
