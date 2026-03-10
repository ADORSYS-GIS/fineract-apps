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
4.  **Post-processing**: After generation, the `scripts/add-ts-nocheck.mjs` script is executed. This script recursively finds all generated `.ts` files and adds a `// @ts-nocheck` comment at the top. This is a necessary workaround to suppress TypeScript errors that arise from the generated code, as excluding the directory in `tsconfig.json` was not effective.
5.  **Exports**: The main `packages/fineract-api/src/index.ts` file exports all the generated code, making it available to other packages in the monorepo.

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

Open the `package.json` file of the application you want to use the client in (e.g., `frontend/cashier-app/package.json`) and add the following line to the `dependencies` section:

```json
    "@fineract-apps/fineract-api": "workspace:*"
```

### Step 2: Install Dependencies

After manually editing a `package.json` file, you must run `pnpm install` from the root of the monorepo to update the lockfile and link the packages correctly.

```bash
pnpm install
```

### Step 3: Import and Use the Hooks

You can now import any hook or type directly from the package in your components.

Here is a real-world example of using the `useDefaultServiceGetApplicationWadl` hook in `App.tsx`:

```tsx
import "@fineract-apps/ui/styles.css";
import { Button } from "@fineract-apps/ui";
import { useDefaultServiceGetApplicationWadl } from "@fineract-apps/fineract-api";

function App() {
  const { data, isLoading, error } = useDefaultServiceGetApplicationWadl();

  if (isLoading) {
    return <div>Loading API Schema...</div>;
  }

  if (error) {
    return <div>Error fetching API Schema!</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Cashier App</h1>
      <Button>Shared Button</Button>
      <h2>Fineract API WADL:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
