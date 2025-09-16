# Shared Libraries Workflow Guide

This document explains how to use and contribute to the shared libraries located in the `/packages` directory of our monorepo.

## 1. Why Shared Libraries?

The primary purpose of our monorepo is to share code between our different frontend applications (`account-manager-app`, `cashier-app`, etc.). By creating shared libraries, we can:

-   **Eliminate Code Duplication**: Write a component once and use it everywhere.
-   **Ensure Consistency**: Guarantee that UI elements and logic behave identically across all applications.
-   **Simplify Maintenance**: Update a component in one place, and the changes are reflected in all apps that use it.

The `/packages` directory is the designated home for all code intended to be shared across multiple applications.

## 2. Available Libraries

-   `@fineract-apps/ui`: A library of shared, reusable React components (e.g., Button, Input, Card).

## 3. How to Use a Shared Component

Using a component from a shared library in any of the frontend applications is straightforward.

### Step 1: No Installation Required

Because we use `pnpm` workspaces, you **do not** need to manually install the shared packages. After running `pnpm install` at the project root, all packages in the `packages/` directory are automatically linked and made available to every application in the `frontend/` directory.

### Step 2: Import and Use the Component

To use a component, simply import it directly from the shared package by its name.

**Example: Using the `Button` in `account-manager-app`**

```tsx
// In any component file, e.g., /frontend/account-manager-app/src/pages/login/Login.view.tsx

import { Button } from '@fineract-apps/ui';

export const LoginView = () => {
  const handleLogin = () => {
    console.log('Logging in...');
  };

  return (
    <div>
      <h1>Login</h1>
      {/* You can now use the shared Button component */}
      <Button onClick={handleLogin}>Log In</Button>
    </div>
  );
};
```

## 4. How to Add a New Shared Component

Follow these steps to add a new component to the `@fineract-apps/ui` library.

### Step 1: Create the Component Files

Create a new folder for your component inside `packages/ui/src/components/`. Follow the established pattern for component structure.

**Example for a new `Card` component:**

```
/packages/ui/src/components
└── /Card
    ├── index.tsx
    ├── useCard.ts
    ├── Card.view.tsx
    ├── Card.types.ts
    └── Card.module.css
```

### Step 2: Export the New Component

Open the main entry point for the UI library: `packages/ui/src/index.ts`.

Add a new line to explicitly export your new component. This makes it part of the library's public API.

```ts
// packages/ui/src/index.ts

export { Button } from './components/Button';
export { Card } from './components/Card'; // Add this line
```

That's it. Your new `Card` component is now available to be imported and used in any application, just like the `Button`.

## 5. Creating a New Shared Library

If you need to create a completely new library (e.g., for shared authentication logic called `@fineract-apps/auth`), follow the pattern established by `@fineract-apps/ui`:

1.  Create the directory: `packages/auth`.
2.  Add a `package.json` file with the name `"@fineract-apps/auth"`.
3.  Add a `vite.config.ts` and `tsconfig.json`.
4.  Run `pnpm install` from the root to link the new package into the workspace.
