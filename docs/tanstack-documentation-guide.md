# TanStack Ecosystem: A Comprehensive Guide

This guide provides a comprehensive overview of the TanStack ecosystem, focusing on its core libraries: **TanStack Router**, **TanStack Query**, and **TanStack Store**. It aims to equip all team members with a solid understanding of these powerful tools, their best practices, and how they integrate to build robust and performant React applications within our monorepo.

## 1. Introduction to TanStack

TanStack is a collection of high-quality, open-source libraries for web development, primarily focused on data management and UI state. They are designed to be framework-agnostic but offer excellent integrations with React. By leveraging TanStack, we aim to:

*   Improve developer experience with type-safe APIs.
*   Enhance application performance through efficient data handling.
*   Standardize patterns for routing, data fetching, and state management.

### 2.6. Installation and Setup for Frontend Applications

This section outlines the steps to set up TanStack Router in a new or existing frontend application within our monorepo, using the `cashier-app` as an example.

#### Step 1: Install Dependencies

Navigate to the root of your monorepo and add the necessary TanStack Router packages to your specific frontend application using `pnpm --filter`.

```bash
# Install core router library and devtools
pnpm add @tanstack/react-router @tanstack/react-router-devtools --filter <your-app-name>

# Install the Vite plugin for file-based routing (as a dev dependency)
pnpm add -D @tanstack/router-plugin --filter <your-app-name>
```
*   **Note**: Replace `<your-app-name>` with the actual name of your application (e.g., `cashier-app`). Use `@latest` to get the most recent stable version, or specify a version if needed.

#### Step 2: Configure Vite Plugin

Update your application's `vite.config.ts` file to include the TanStack Router Vite plugin. This plugin automatically generates your route tree based on your file structure.

```typescript
// <your-app-name>/vite.config.ts
import path from "node:path";
import { fileURLToPath } from "node:url";
import { baseViteConfig } from "@fineract-apps/config/vite.config.base";
import { tanstackRouter } from "@tanstack/router-plugin/vite"; // Import the plugin
import { defineConfig, mergeConfig } = "vite";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default mergeConfig(
	baseViteConfig, // Merge with your monorepo's base Vite config
	defineConfig({
		plugins: [
            tanstackRouter({
                target: "react", // Specify your framework (e.g., "react", "solid")
                autoCodeSplitting: true // Enable automatic code splitting for routes
            })
        ],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"), // Setup path alias for cleaner imports
			},
		},
	}),
);
```

#### Step 3: Initialize Router in `main.tsx`

Set up your application's entry point (`src/main.tsx`) to initialize and render the TanStack Router.

```tsx
// <your-app-name>/src/main.tsx
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css"; // Your global styles
import { routeTree } from "./routeTree.gen"; // Auto-generated route tree

// Create a new router instance from the generated route tree
const router = createRouter({ routeTree });

// Register the router instance for type safety (important for TypeScript)
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render your React application with the router
createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense fallback={<div>Loading...</div>}> {/* Optional: Suspense for lazy-loaded routes */}
			<RouterProvider router={router} />
		</Suspense>
	</StrictMode>,
);
```

#### Step 4: Define Your Routes

Create your route files within the `src/routes/` directory. TanStack Router will automatically detect and configure them.

*   **Root Layout**: Define your main application layout in `src/routes/__root.tsx`.
    ```tsx
    // src/routes/__root.tsx
    import { createRootRoute, Outlet } from "@tanstack/react-router";
    import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"; // Optional

    function RootLayout() {
      return (
        <>
          <header>
            {/* Your global header/navigation */}
            <h1>My App</h1>
          </header>
          <main>
            <Outlet /> {/* Child routes will render here */}
          </main>
          <TanStackRouterDevtools /> {/* Optional devtools */}
        </>
      );
    }

    export const Route = createRootRoute({
      component: RootLayout,
    });
    ```
*   **Index Route**: Define your homepage in `src/routes/index.tsx`.
    ```tsx
    // src/routes/index.tsx
    import { createFileRoute } from "@tanstack/react-router";
    import React from "react";

    function HomePage() {
      return <div>Welcome to the Home Page!</div>;
    }

    export const Route = createFileRoute("/")({
      component: HomePage,
    });
    ```
*   **Other Routes**: Create additional route files (e.g., `src/routes/about.tsx`, `src/routes/users/$userId.tsx`).
*   **Excluding Files**: Remember to prefix files/folders with a hyphen (`-`) if they are not route definitions but co-located logic (e.g., `src/routes/-components/`).

#### Step 5: Run the Development Server

Navigate to the root of your monorepo and start your application's development server.

```bash
pnpm --filter <your-app-name> dev
```
*   This command will trigger the Vite plugin to generate the `routeTree.gen.ts` file and start your application.

## 3. TanStack Query: Powerful Server State Management

TanStack Query (formerly React Query) is a robust library for managing server state in your applications. It handles fetching, caching, synchronizing, and updating server data, significantly simplifying complex data flows.

*   **Official Documentation**: [https://tanstack.com/query](https://tanstack.com/query)

### 3.1. Core Concepts

*   **Queries**: Used for fetching data (GET requests). Defined with a `queryKey` (for caching) and a `queryFn` (the actual data fetching logic).
*   **Mutations**: Used for creating, updating, or deleting data (POST, PUT, DELETE requests).
*   **Caching**: Automatically caches query results, providing instant UI updates for previously fetched data.
*   **Background Refetching**: Intelligently refetches data in the background to keep your UI fresh.

### 3.2. Integration with TanStack Router

TanStack Query integrates seamlessly with TanStack Router, especially through route loaders.

*   **Setup (`src/main.tsx`)**:
    ```tsx
    import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
    import { RouterProvider, createRouter } from "@tanstack/react-router";
    import { routeTree } from "./routeTree.gen";
    import ReactDOM from 'react-dom/client';

    const queryClient = new QueryClient();
    const router = createRouter({ routeTree });

    declare module "@tanstack/react-router" {
      interface Register {
        router: typeof router;
      }
    }

    ReactDOM.createRoot(document.getElementById("root")!).render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
    ```

*   **Using `useQuery` in Components**:
    ```tsx
    // In a React component
    import { useQuery } from "@tanstack/react-query";

    function MyDataComponent() {
      const { data, isLoading, isError, error } = useQuery({
        queryKey: ["myKey", "someId"],
        queryFn: async () => {
          const res = await fetch("/api/data");
          if (!res.ok) throw new Error("Failed to fetch data");
          return res.json();
        },
      });

      if (isLoading) return <div>Loading...</div>;
      if (isError) return <div>Error: {error?.message}</div>;

      return (
        <div>
          <h2>Data:</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
    }
    ```

*   **Devtools**: For debugging and visualizing query states.
    *   **Installation**: `pnpm add -D @tanstack/react-query-devtools`
    *   **Usage (`src/routes/__root.tsx`)**:
        ```tsx
        import { Outlet, createRootRoute } from '@tanstack/react-router';
        import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

        export const Route = createRootRoute({
          component: () => (
            <>
              <Outlet />
              <ReactQueryDevtools buttonPosition="bottom-right" />
            </>
          ),
        });
        ```

## 4. TanStack Store: Lightweight Client-Side State Management

TanStack Store is a framework-agnostic, lightweight state management library. It's ideal for managing client-side UI state that doesn't involve server interactions (which is best handled by TanStack Query).

*   **Official Documentation**: [https://tanstack.com/store](https://tanstack.com/store)

### 4.1. Core Concepts

*   **`Store`**: The basic unit of state. You create a new `Store` instance with an initial value.
*   **`useStore` Hook**: Used in React components to subscribe to a `Store` and get its current value.
*   **`setState`**: Method on a `Store` instance to update its value.
*   **`Derived`**: Allows creating new stores whose values are computed from other stores. They automatically update when their dependencies change.

### 4.2. Basic Usage

*   **Installation**: `pnpm add @tanstack/store @tanstack/react-store` (for React adapter)

*   **Example (Counter)**:
    ```tsx
    // Define a store outside of components
    import { Store, Derived } from "@tanstack/store";
    import { useStore } from "@tanstack/react-store";

    const countStore = new Store(0); // Initial state is 0

    // Optional: Derived store for computed state
    const doubledCountStore = new Derived({
      fn: () => countStore.state * 2,
      deps: [countStore], // Depends on countStore
    });
    doubledCountStore.mount(); // Mount derived stores

    function CounterComponent() {
      const count = useStore(countStore); // Subscribe to countStore
      const doubledCount = useStore(doubledCountStore); // Subscribe to derived store

      return (
        <div>
          <button onClick={() => countStore.setState((prev) => prev + 1)}>
            Increment - {count}
          </button>
          <div>Doubled Count: {doubledCount}</div>
        </div>
      );
    }
    ```

## 5. Best Practices & Tips

*   **Monorepo Integration**: Leverage `pnpm` workspaces and shared `config` packages for consistent setup across applications.
*   **Component Pattern**: Adhere to the `Container/Hook/View` pattern for clear separation of concerns.
*   **Error Boundaries**: Utilize `errorComponent` in routes for graceful error handling.
*   **Lazy Loading**: Use `createLazyFileRoute` for routes that are not critical for initial load to improve performance.
*   **Type Safety**: Always strive for full TypeScript type safety, which TanStack libraries excel at.

## 6. Further Resources

*   **TanStack Official Website**: [https://tanstack.com/](https://tanstack.com/)
*   **TanStack Router Docs**: [https://tanstack.com/router](https://tanstack.com/router)
*   **TanStack Query Docs**: [https://tanstack.com/query](https://tanstack.com/query)
*   **TanStack Store Docs**: [https://tanstack.com/store](https://tanstack.com/store)
*   **TanStack Router File-Based Routing**: [https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing](https://tanstack.com/router/latest/docs/framework/react/routing/file-based-routing)
*   **TanStack Router Route Matching**: [https://tanstack.com/router/latest/docs/framework/react/routing/route-matching](https://tanstack.com/router/latest/docs/framework/react/routing/route-matching)
*   **TanStack Router Link Component**: [https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent](https://tanstack.com/router/latest/docs/framework/react/api/router/linkComponent)
*   **TanStack Router Loader Documentation**: [https://tanstack.com/router/latest/docs/framework/react/guide/data-loading](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading)
