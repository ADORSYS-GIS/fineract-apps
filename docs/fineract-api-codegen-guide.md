# Fineract API Codegen Guide

This document explains the purpose and workflow for the `@fineract-apps/fineract-api` shared package. This package is the centralized, auto-generated client for interacting with the Fineract backend API.

## 1. Purpose

The `@fineract-apps/fineract-api` package provides a set of type-safe TanStack Query hooks for all Fineract API endpoints. By centralizing this logic, we ensure that all frontend applications (`cashier-app`, `account-manager-app`, etc.) use the exact same, up-to-date API client.

**Key Benefits:**
-   **Consistency**: Guarantees uniform API interactions across all apps.
-   **Type Safety**: Leverages TypeScript to catch errors at compile-time.
-   **Maintainability**: When the Fineract API changes, we only need to update it in one place.

**DO NOT MANUALLY EDIT THE CODE IN `packages/fineract-api/src/generated/`**. All code in this directory is auto-generated and any manual changes will be overwritten.

## 2. How It Works

The process uses the `@7nohe/openapi-react-query-codegen` tool to read an OpenAPI specification file (`fineract.json`) and generate TanStack Query hooks.

1.  **API Specification**: A local copy of the Fineract OpenAPI spec is stored in `packages/fineract-api/fineract.json`.
2.  **Codegen Script**: The `codegen` script in `packages/fineract-api/package.json` runs the generator tool.
3.  **Output**: The tool generates a complete TypeScript client in the `packages/fineract-api/src/generated/` directory.
4.  **Exports**: The main `packages/fineract-api/src/index.ts` file exports all the generated code, making it available to other packages in the monorepo.

## 3. Workflow: Updating the API Client

If the Fineract API has been updated and you need to regenerate the client, follow these steps:

### Step 1: Update the Local Specification

First, you need to get the latest `fineract.json` OpenAPI specification. You can do this by running the `curl` command from the project root:

```bash
curl -k -o packages/fineract-api/fineract.json https://localhost/fineract-provider/fineract.json
```
(Replace the URL if the source has changed).

### Step 2: Run the Codegen Script

From the **root of the monorepo**, run the `codegen` script using `pnpm --filter`:

```bash
pnpm --filter @fineract-apps/fineract-api codegen
```

This will delete the old generated files and create new ones based on the updated specification.

## 4. Using the API Client in an Application

To use the generated hooks in a frontend application (e.g., `cashier-app`), you must first add the `@fineract-apps/fineract-api` package as a dependency.

### Step 1: Add the Dependency

From the **root of the monorepo**, run the following command:

```bash
# pnpm add @fineract-apps/fineract-api --filter <your-app-name>
pnpm add @fineract-apps/fineract-api --filter cashier-app
```

### Step 2: Import and Use the Hooks

You can now import any hook directly from the package in your components:

```tsx
import { useQuery } from '@fineract-apps/fineract-api';

function UserProfile() {
  const { data, isLoading } = useGetUserDetails({ userId: 123 });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Hello, {data?.username}</div>;
}
