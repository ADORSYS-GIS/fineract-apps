# Reusing Sidebar in Fineract Apps

## Introduction

This document explains how to reuse the Sidebar component across multiple applications in the Fineract project:

* Account Manager App
* Branch Manager App
* Cashier App

## Project Structure

The package `@fineract-apps/ui` contains the following structure:

```
ui/
├─ Sidebar/
│  ├─ Sidebar.tsx
│  ├─ Sidebar.types.ts
│  ├─ menus.tsx
│  ├─ Sidebar.test.tsx
│  └─ index.ts
└─ index.ts
```

## Exports from UI Package

The `index.ts` in `ui/` re-exports everything from the Sidebar folder:

```ts
// packages/ui/index.ts
export * from "./Sidebar";
```

Inside `Sidebar/index.ts`:

```ts
export { Sidebar } from "./Sidebar";
export type { SidebarProps, MenuItem } from "./Sidebar.types";
// Menus
export { menuAccountManager, menuBranchManager, menuCashier } from "./menus";
```

## Importing Sidebar in an App

Example import for Account Manager App:

```ts
import { Sidebar, menuAccountManager } from "@fineract-apps/ui";
```

Replace the menu with:

* `menuBranchManager` for Branch Manager App
* `menuCashier` for Cashier App

## Using the Sidebar

```tsx
<Sidebar menuItems={menuAccountManager} onLogout={handleLogout} />
```

### Props

* **menuItems**: `MenuItem[]` – array of menu entries (name, link, icon)
* **onLogout**: `() => void` – callback for logout action

## Example: Account Manager App

```tsx
import { Sidebar, menuAccountManager } from "@fineract-apps/ui";

function AccountManagerApp() {
  const handleLogout = () => alert("Logout clicked!");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={menuAccountManager} onLogout={handleLogout} />
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f9fafb" }}>
        <h1>Account Manager Dashboard</h1>
        <p>Manage accounts and transactions.</p>
      </div>
    </div>
  );
}
```

## Example: Branch Manager App

```tsx
import { Sidebar, menuBranchManager } from "@fineract-apps/ui";

function BranchManagerApp() {
  const handleLogout = () => alert("Logout clicked!");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={menuBranchManager} onLogout={handleLogout} />
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f0f4f8" }}>
        <h1>Branch Manager Dashboard</h1>
      </div>
    </div>
  );
}
```

## Example: Cashier App

```tsx
import { Sidebar, menuCashier } from "@fineract-apps/ui";

function CashierApp() {
  const handleLogout = () => alert("Logout clicked!");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar menuItems={menuCashier} onLogout={handleLogout} />
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#fef9f0" }}>
        <h1>Cashier Dashboard</h1>
      </div>
    </div>
  );
}
```

## Best Practices for Menus

The `menus.tsx` file defines the menu options for each application (`Account Manager`, `Branch Manager`, `Cashier`).
There are two possible approaches when managing these menus:

### 1. Fixed Business-Oriented Menus (Recommended )

* Each app (`Account Manager`, `Branch Manager`, `Cashier`) has its own pre-defined menu.
* The names and icons are explicitly written in `menus.tsx`:

  ```ts
  export const menuAccountManager = [
    { name: "Dashboard", link: "/dashboard", icon: Home },
    { name: "Accounts", link: "/accounts", icon: CreditCard },
    { name: "Transactions", link: "/transactions", icon: Send },
    { name: "Settings", link: "/settings", icon: Settings },
  ];
  ```
* **Advantages**:

  * Very simple to reuse (`import { menuAccountManager } from "@fineract-apps/ui";`).
  * Guarantees consistent menus across applications.
  * Minimal configuration in each app.
* **When to use**:

  * Ideal for stable, domain-specific apps like banking (`Account Manager`, `Branch Manager`, `Cashier`).

### 2. Generic or Placeholder Menus

* Menu items are defined as generic placeholders (e.g., `Item 1`, `Item 2`, or keys like `MENU_ACCOUNTS`).
* Each app is responsible for mapping these items to actual labels or translations.
* **Advantages**:

  * Useful for internationalization (multi-language support).
  * Allows custom branding per client/project.
* **When to use**:

  * Ideal if apps need dynamic customization or multiple languages.

### Recommendation

For this banking project, use **fixed business-oriented menus** (approach 1).
This ensures consistency across all apps and reduces complexity. If future requirements include multi-language support or client-specific branding, migrate to the generic approach later.
