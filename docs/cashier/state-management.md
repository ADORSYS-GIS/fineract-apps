# State Management

The `cashier-app` employs a modern and robust state management strategy. To build a maintainable application, we recognize and manage three distinct types of state, using the best tool for each job.

## 1. The Three Types of State

-   **Server State**: Data that lives on the server, is fetched asynchronously, and can be considered "out of our control."
-   **Client State**: Global state that is owned by the application and needs to be shared across multiple components (e.g., authentication status).
-   **Local Component State**: State that is confined to a single component and its children (e.g., the open/closed state of a modal).

## 2. Server State with TanStack Query

For all server state, we use **TanStack Query**. This powerful library is specifically designed to handle the complexities of asynchronous data, such as caching, background refetching, and error handling.

### Key Features & Benefits

-   **Declarative Data Fetching**: We define our data needs, and TanStack Query manages the request lifecycle.
-   **Automatic Caching**: Reduces the number of API calls, leading to a faster and smoother user experience.
-   **Background Refetching**: Keeps the UI in sync with the server, ensuring data freshness.
-   **Stale-While-Revalidate**: Provides an excellent balance between performance and up-to-date data by showing cached content while refetching in the background.

### Practical Example: Fetching Client Data

A perfect example is in our `useClientDetails` hook. When a cashier views a client's page, we use `useQuery` to fetch their information:

```typescript
// Inside useClientDetails.ts
const { data: client, isLoading, isError } = useQuery({
  queryKey: ['client', clientId],
  queryFn: () => ClientService.getV1ClientsByClientId({ clientId }),
});
```

TanStack Query automatically handles the `isLoading` and `isError` states, caches the client's data to make subsequent visits instantaneous, and can even refetch the data in the background.

## 3. Client State with TanStack Store

For global client state, we use **TanStack Store**. It is a lightweight and flexible tool for managing state that is shared across the application.

### The Authentication Store

Our primary use case for TanStack Store is managing the user's authentication status in `src/store/auth.ts`.

This store is responsible for:

-   **Storing the Authentication Token**: Holds the user's Base64 encoded key.
-   **Tracking Authentication Status**: A boolean flag indicates if the user is authenticated.
-   **Persisting to Local Storage**: The store is synchronized with local storage, so the user's session persists across page reloads.

While our main use is authentication, TanStack Store is also the ideal tool for other global client-side state, such as user preferences (e.g., theme settings) or application-wide notifications.

## 4. Local Component State with `useState`

For state that is only relevant to a single component, we use React's built-in `useState` hook. This is the simplest and most efficient way to manage state that doesn't need to be shared.

### When to Use `useState`

-   Managing the open/closed state of a modal (e.g., `isImageModalOpen` in `useClientDetails`).
-   Handling form input values before they are submitted.
-   Toggling UI elements within a component.

By using `useState` for local concerns, we keep our components encapsulated and prevent our global state from becoming cluttered.

## 5. Why This Separation Matters

We deliberately avoid using a single global state manager (like Redux or Zustand) for everything. Server state and client state are fundamentally different:

-   **Server state is asynchronous**, introducing complexities like loading and error states.
-   **Server state can become stale**, requiring a mechanism to keep it in sync.
-   **Server state is shared** and can be changed by others, requiring careful refetching.

TanStack Query is built to handle these challenges. By using the right tool for each job, our state management strategy remains clean, efficient, and easy to maintain.