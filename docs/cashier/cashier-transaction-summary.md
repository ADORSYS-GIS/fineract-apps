# Cashier Transaction Summary Component

This document provides a comprehensive overview of the `CashierTransactionSummary` component, detailing its architecture, data fetching logic, API calls, UI implementation, and pagination.

## 1. Architecture

The component follows the standard `Container/Hook/View` pattern established in the project:

-   **`index.tsx` (Container):** Assembles the component, connecting the logic from the hook to the view.
-   **`useCashierTransactionSummary.ts` (Hook):** Contains all the business logic, including the complex chained API calls for data fetching and state management.
-   **`CashierTransactionSummary.view.tsx` (View):** The presentational component responsible for rendering the UI, including summary cards, the transaction table, and pagination controls.
-   **`CashierTransactionSummary.types.ts`:** Defines the TypeScript types for the component's props and data structures.

## 2. Data Fetching and API Calls

The data fetching logic is managed by TanStack Query (`useQuery`) in the `useCashierTransactionSummary.ts` hook. It involves a sequence of dependent API calls to gather all necessary information before fetching the final transaction summary.

### Chained API Calls

1.  **Fetch Authenticated User:**
    -   **API Endpoint:** `GET /v1/userdetails`
    -   **Description:** Retrieves the `staffId` and `officeId` of the currently authenticated user.
    -   **Hook:** `useAuthenticatedUser()`

2.  **Fetch Currencies:**
    -   **API Endpoint:** `GET /v1/currencies`
    -   **Description:** Fetches the list of available currencies to determine the appropriate currency code.
    -   **Hook:** `useCurrencies()`

3.  **Fetch Tellers:**
    -   **API Endpoint:** `GET /v1/tellers`
    -   **Description:** Uses the `officeId` from the authenticated user to get a list of all tellers for that office.
    -   **Hook:** `useTellers(officeId)`

4.  **Find Cashier:**
    -   **Description:** Iterates through the list of tellers to find the cashier that matches the `staffId` of the authenticated user. This step derives the `tellerId` and `cashierId` required for the final API call.

5.  **Fetch Summary and Transactions:**
    -   **API Endpoint:** `GET /v1/tellers/{tellerId}/cashiers/{cashierId}/summaryandtransactions`
    -   **Description:** Fetches the cashier's summary (allocated amount, net cash, etc.) and a paginated list of transactions.
    -   **Hook:** `useCashierTransactionSummary()`

## 3. UI Implementation

The UI is built with Tailwind CSS and shared UI components from the `@fineract-apps/ui` library.

-   **Summary Cards:** Display the cashier's allocated amount, unallocated amount, and net cash for the day.
-   **Transactions Table:** A detailed table of all client transactions, including columns for transaction date, client name, account number, debit, credit, and balance.
-   **Loading Skeleton:** A loading skeleton is displayed while the initial data is being fetched to provide a better user experience.

## 4. Pagination

The component features a robust, URL-driven pagination system for the transactions table.

-   **State Management:** The pagination state (current page and item limit) is managed as URL search parameters (`?page=1&limit=10`), making the state shareable and bookmarkable.
-   **TanStack Router:** The `useSearch` hook from TanStack Router is used to read the `page` and `limit` parameters from the URL.
-   **Zod Validation:** A Zod schema in the route definition (`/dashboard/index.tsx`) validates the search parameters, providing default values if they are missing.
-   **Pagination Controls:** The "Previous" and "Next" buttons use the `<Link>` component from TanStack Router to update the URL search parameters, triggering a data refetch for the new page.