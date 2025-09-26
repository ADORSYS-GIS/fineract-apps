# Project Structure

The `cashier-app` follows a standardized and scalable project structure, designed to promote a clear separation of concerns and enhance maintainability. This document provides a detailed overview of the key directories and their purposes.

## Root Directory

The root directory of the `cashier-app` contains the following key configuration files:

-   **`vite.config.ts`**: The Vite configuration file, responsible for bundling the application, managing plugins (like TanStack Router), and setting up path aliases.
-   **`tsconfig.json`**: The TypeScript configuration file, which defines the compiler options and ensures type safety across the project.
-   **`package.json`**: The project's manifest file, which lists all dependencies and scripts.

## `src` Directory

The `src` directory is the heart of the application, containing all the source code. It is organized as follows:

### `src/assets`

This directory contains all static assets, such as images, fonts, and icons.

### `src/components`

This directory houses all reusable React components. Each component follows the Container/Hook/View pattern, with a clear separation between the component's logic (hooks), its presentation (view), and the container that brings them together.

-   **`src/components/Component/index.tsx`**: The container component, which brings together the logic and the view.
-   **`src/components/Component/Component.view.tsx`**: The presentational component, responsible for rendering the UI.
-   **`src/components/Component/useComponent.ts`**: The hook that contains all the component's logic, state management, and side effects.
-   **`src/components/Component/Component.types.ts`**: The TypeScript definitions for the component.

### `src/routes`

This directory contains all the route definitions for the application. We use TanStack Router's file-based routing system, where each file in this directory corresponds to a specific route.

-   **`src/routes/__root.tsx`**: The root layout of the application, which defines the global structure and context.
-   **`src/routes/index.tsx`**: The application's home page.
-   **`src/routes/dashboard/index.tsx`**: The main dashboard route, which includes the client search functionality.
-   **`src/routes/clients/$clientId.tsx`**: A dynamic route for displaying the details of a specific client.

### `src/store`

This directory contains our client-side state management stores, built with TanStack Store.

-   **`src/store/auth.ts`**: The authentication store, responsible for managing the user's login state and credentials.

### `src/query-client.ts`

This file exports a singleton instance of the TanStack Query client. This ensures that the same query client is used throughout the application, which is crucial for caching and data consistency.

### `src/main.tsx`

This is the application's entry point. It is responsible for initializing the TanStack Router, the TanStack Query client, and rendering the root component.