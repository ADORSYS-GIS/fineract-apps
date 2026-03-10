# Layout and Routing Guide

This guide provides a comprehensive overview of the layout and routing architecture for the Fineract frontend applications. It is intended for developers working on the project to ensure consistency and maintainability.

## 1. Introduction

The primary goal of the layout and routing architecture is to create a consistent, reusable, and maintainable foundation for the three distinct frontend applications: `account-manager-app`, `branchmanager-app`, and `cashier-app`. This is achieved by leveraging a shared UI library, a centralized routing solution, and a consistent styling approach.

## 2. Shared Layout Components

The foundation of the application layout is a set of shared, reusable components from the `@fineract-apps/ui` library.

### 2.1. `AppLayout` Component

The `AppLayout` component is the main container for all application content. It is responsible for arranging the `Navbar`, `Sidebar`, and the main content area.

**Usage:**

```tsx
import { AppLayout, Navbar, Sidebar, menuAccountManager } from "@fineract-apps/ui";

function RootLayout() {
  const handleLogout = () => alert("Logout clicked!");

  return (
    <AppLayout
      sidebar={<Sidebar menuItems={menuAccountManager} onLogout={handleLogout} />}
      navbar={<Navbar logo={<div>My App</div>} />}
    >
      {/* Main content goes here */}
    </AppLayout>
  );
}
```

### 2.2. `Navbar` Component

The `Navbar` component provides a consistent header for all applications. It is highly customizable through its props, allowing for different logos, links, user sections, and actions.

**Props:**

*   `logo`: A `ReactNode` for the application's logo or title.
*   `links`: A `ReactNode` for navigation links.
*   `notifications`: A `ReactNode` for notification indicators.
*   `userSection`: A `ReactNode` for the user's avatar and menu.
*   `actions`: A `ReactNode` for action buttons, such as a logout button.
*   `variant`: The visual style of the navbar (`default`, `primary`, `transparent`).
*   `size`: The size of the navbar (`sm`, `md`, `lg`).

### 2.3. `Sidebar` Component

The `Sidebar` component provides a consistent navigation panel for all applications. It is integrated into the `AppLayout` component.

**Props:**

*   `menuItems`: An array of `MenuItem` objects that define the navigation links.
*   `onLogout`: A function to be called when the logout button is clicked.

## 3. Routing with TanStack Router

The project uses TanStack Router for a modern, file-based routing architecture. This simplifies route management and ensures a consistent routing setup across all applications.

### 3.1. Configuration

TanStack Router is configured in each application's `vite.config.ts` file using the `@tanstack/router-plugin/vite` plugin. This plugin automatically generates a `routeTree.gen.ts` file that contains all the route definitions and types.

### 3.2. File-Based Routing

Routes are defined by creating files in the `src/routes` directory of each application.

*   `__root.tsx`: This file defines the root layout for the application. It uses the `AppLayout` component to provide a consistent structure for all pages.
*   `index.tsx`: This file defines the default page for the application.
*   **Other Routes:** New pages can be created by adding new files to the `src/routes` directory. For example, creating a file named `about.tsx` will automatically create an `/about` route.

## 4. Styling

Consistent styling is achieved through a shared stylesheet located at `packages/ui/src/styles.css`. This file contains all the necessary Tailwind CSS directives and custom CSS variables for the shared components.

To ensure that the styles are applied, this stylesheet must be imported into the `main.tsx` file of each application:

```typescript
import "@fineract-apps/ui/styles.css";
```

## 5. Developer Workflow

### 5.1. Creating a New Page

To create a new page in an application:

1.  Create a new `.tsx` file in the `src/routes` directory of the application (e.g., `src/routes/my-new-page.tsx`).
2.  Define the page component and export it as a `Route` using the `createFileRoute` function from TanStack Router.

```tsx
import { createFileRoute } from "@tanstack/react-router";

function MyNewPage() {
  return <div>This is my new page!</div>;
}

export const Route = createFileRoute("/my-new-page")({
  component: MyNewPage,
});
```

### 5.2. Adding a Link to a Page

To add a link to a page, use the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";

<Link to="/my-new-page">Go to My New Page</Link>