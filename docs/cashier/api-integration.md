# API Integration

The `cashier-app` communicates with the Fineract backend through a generated API client, which is located in the `@fineract-apps/fineract-api` package. This client is automatically generated from the Fineract OpenAPI specification, which provides a type-safe and consistent way to interact with the API.

## The Generated API Client

The `@fineract-apps/fineract-api` package is a crucial part of our monorepo. It provides a set of hooks and services that make it easy to fetch data from the Fineract API.

### Key Features

-   **Type Safety**: The client is fully type-safe, which means that all API requests and responses are checked at compile time. This helps to prevent a wide range of bugs and makes the code easier to refactor.
-   **TanStack Query Integration**: The client is designed to work seamlessly with TanStack Query. It provides a set of hooks that are pre-configured to use TanStack Query for data fetching, caching, and synchronization.
-   **Automatic Generation**: The client is automatically generated from the Fineract OpenAPI specification. This means that it is always up-to-date with the latest API changes, and we don't have to write any boilerplate code to interact with the API.

## Authentication

All communication with the Fineract API must be authenticated. We use a centralized authentication mechanism that injects the necessary authentication headers into every outgoing request.

### The API Interceptor

The core of our authentication strategy is an API interceptor, which is defined in the application's entry point (`src/main.tsx`). This interceptor is a function that runs before each API call is sent.

The interceptor is responsible for:

1.  **Retrieving the Authentication Token**: It retrieves the user's authentication state from the `authStore`.
2.  **Injecting the `Authorization` Header**: If the user is authenticated, it injects the `Authorization` header into the request, with the user's Base64 encoded credentials.
3.  **Injecting the `Fineract-Platform-TenantId` Header**: It also injects the `Fineract-Platform-TenantId` header, which is required by the Fineract platform.

This centralized approach ensures that all API requests are properly authenticated, without requiring any changes to the individual service calls.

## API Data Structure Nuances

When working with the Fineract API, it's crucial to be aware that different endpoints for the same resource may return different data structures. A "list" endpoint often returns a summary, while a "detail" endpoint returns the full object.

### Example: Savings Accounts

A key example of this is the distinction between fetching a list of a client's savings accounts versus fetching the details of a single savings account.

-   **`GET /v1/clients/{clientId}/accounts`**: This endpoint returns an object that contains an array of `savingsAccounts`. However, the objects in this array are summaries and **do not contain the `accountBalance`**.
    ```typescript
    // Type: GetClientsSavingsAccounts
    {
      "id": 123,
      "accountNo": "000000123",
      "productId": 1,
      "productName": "Savings Product",
      "status": { "id": 300, "code": "savingsAccountStatusType.active", "value": "Active" },
      // ... other summary fields, but NO accountBalance
    }
    ```

-   **`GET /v1/savingsaccounts/{accountId}`**: This endpoint returns the full details for a single savings account. The response from this endpoint **does include the `accountBalance`**, nested within a `summary` object.
    ```typescript
    // Type: GetSavingsAccountsAccountIdResponse
    {
      "id": 123,
      "accountNo": "000000123",
      // ... all other fields
      "summary": {
        "accountBalance": 5000.00,
        // ... other summary fields
      }
    }
    ```

This distinction is the reason for our "Smart" Child Component architecture, where each `SavingsAccountCard` is responsible for making its own call to the detail endpoint to fetch its balance.