# Component Architecture

The `cashier-app` follows a consistent and well-defined component architecture, designed to promote a clear separation of concerns, enhance reusability, and improve the overall maintainability of the codebase.

## The Container/Hook/View Pattern

At the core of our component architecture is the **Container/Hook/View pattern**. This pattern dictates that every component should be split into three distinct parts:

1.  **The Hook (Logic)**: A custom React hook (e.g., `useClientDetails.ts`) that contains all the component's logic, state management, and side effects. This hook is responsible for fetching data, handling user interactions, and managing the component's internal state.
2.  **The View (Presentational Component)**: A pure presentational component (e.g., `ClientDetails.view.tsx`) that is responsible for rendering the UI. This component receives all its data and callbacks as props from the container, and it should not contain any business logic or side effects.
3.  **The Container (Assembly)**: The main component file (e.g., `ClientDetails/index.tsx`) that acts as the "container" or "assembly." It imports the logic hook and the view component, calls the hook, and passes the returned values as props to the view. This is the only file that should be exported from the component's directory.

### Component File Structure

To enforce this separation, each component is broken down into four distinct files:

-   **`*.types.ts`**: This file is exclusively for TypeScript definitions. It contains all the interfaces and type aliases related to the component's props and internal state.
    -   **Responsibility**: Defines the "shape" of the component's data.
-   **`use*.ts`**: This file contains the component's logic, encapsulated in a custom React hook. It manages state, handles side effects, and exposes the necessary data and callbacks.
    -   **Responsibility**: Handles all business logic and state management.
-   **`*.view.tsx`**: This file contains the pure presentational component. It is responsible for rendering the UI and should be completely stateless.
    -   **Responsibility**: Renders the JSX markup.
-   **`index.tsx`**: This is the container file. It connects the logic (hook) to the presentation (view).
    -   **Responsibility**: Connects the logic to the view.

### Example: `ClientDetails` Component

-   **`ClientDetails.types.ts`**: Defines the `ClientDetailsViewProps` interface.
-   **`useClientDetails.ts`**: Contains the `useClientDetails` hook for fetching the client's data.
-   **`ClientDetails.view.tsx`**: The `ClientDetailsView` component, which renders the client's information.
-   **`index.tsx`**: The `ClientDetails` container, which assembles the hook and the view.

### Benefits of This Pattern

This granular separation provides several key benefits:

-   **Improved Readability**: The code is easier to read and understand.
-   **Enhanced Reusability**: The presentational components and logic hooks can be reused independently.
-   **Better Testability**: The logic hooks can be tested in isolation, and the presentational components can be tested with tools like Storybook.

## The "Smart" Child Component Pattern

In some cases, a parent component may render a list of items where each item needs to fetch its own detailed data. This is common when a list API endpoint provides only a summary of information, and a separate, more detailed endpoint must be called for each item.

For this scenario, we use the **"Smart" Child Component** pattern.

### Example: `SavingsAccountCard`

The `ClientDetails` page displays a list of savings accounts. The API endpoint to fetch this list (`/clients/{id}/accounts`) does not include the real-time balance for each account. To get the balance, a separate call to `/savingsaccounts/{id}` is required for each account.

Instead of making the parent `ClientDetails` component responsible for all these individual calls, we delegate this responsibility to a "smart" child component: `SavingsAccountCard`.

-   **`ClientDetailsView`**: Maps over the list of savings accounts and renders a `SavingsAccountCard` for each one, passing only the summary data (like `accountId` and `productName`).
-   **`SavingsAccountCard`**: This component receives the `accountId`, and then uses its own `useSavingsAccountCard` hook to fetch the detailed information for that specific account, including the balance.

### Benefits of This Pattern

-   **Encapsulation**: Each child component is self-contained and manages its own data fetching, loading, and error states.
-   **Parallel Data Fetching**: TanStack Query automatically runs all the individual detail fetches in parallel, which is highly efficient.
-   **Resilience**: If one card fails to load its details, it does not impact the other cards in the list.

## Shared UI Library

We make extensive use of our shared UI library, located in the `@fineract-apps/ui` package. This library provides a set of pre-built, reusable components that are used throughout the application, ensuring a consistent look and feel.

### Key Components

-   **`AppLayout`**: Provides the main layout structure for the application.
-   **`Navbar`**: The application's main navigation bar.
-   **`Sidebar`**: The application's sidebar.
-   **`Card`**: A flexible and reusable card component.
-   **`Button`**: A standardized button component.
-   **`SearchBar`**: A reusable search bar component.

## Adherence to Best Practices

Our component architecture is designed to align with the best practices of the React and TanStack ecosystems. All team members are expected to adhere to the Container/Hook/View pattern and to make use of the shared UI library whenever possible.