# Routing

The `cashier-app` uses **TanStack Router** for all its routing needs. This powerful library provides a type-safe, file-based routing system that is both flexible and highly performant.

## File-Based Routing

Our routing strategy is centered around the `src/routes` directory. Each file in this directory (and its subdirectories) corresponds to a specific route in the application. This approach eliminates the need for manual route configuration and makes the routing structure easy to understand and maintain.

### Key Route Files

-   **`src/routes/__root.tsx`**: This is the root layout of the application. It defines the global structure, including the main layout, navigation, and any context providers that need to be available to all routes.
-   **`src/routes/index.tsx`**: This is the application's home page, which typically redirects to the login or dashboard page.
-   **`src/routes/dashboard/index.tsx`**: This is the main dashboard route, which serves as the primary interface for cashiers. It includes the client search functionality and other key features.
-   **`src/routes/clients/$clientId.tsx`**: This is a dynamic route that displays the details of a specific client. The `$clientId` parameter in the filename corresponds to the client's ID, which is passed to the component as a prop.

## State Management with Search Parameters

TanStack Router provides a robust mechanism for managing state through URL search parameters. We use this feature to manage the state of the client search, where the search query is stored in the URL.

This approach has several advantages:

-   **Bookmarkable and Sharable URLs**: Users can bookmark or share a URL that includes a specific search query, and the application will automatically re-fetch the data and display the results.
-   **Predictable State**: The URL becomes the single source of truth for the search state, making the application's behavior more predictable and easier to debug.
-   **Browser History Integration**: The browser's back and forward buttons work as expected, allowing users to navigate through their search history.