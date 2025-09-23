# Savings Account Transactions API

This document provides a detailed breakdown of the `SavingsAccountTransactionsService` from the `@fineract-apps/fineract-api` package. It explains each available API endpoint and clarifies which ones are actively used in the `cashier-app`.

## Service Overview

The `SavingsAccountTransactionsService` is a generated client class that provides methods for interacting with the Fineract API's savings account transaction endpoints. It handles the low-level details of making HTTP requests, allowing developers to work with type-safe methods and objects.

---

## Endpoints Breakdown

Below is a comprehensive list of all methods available in the `SavingsAccountTransactionsService`.

### 1. `postV1SavingsaccountsBySavingsIdTransactions`

-   **Endpoint**: `POST /v1/savingsaccounts/{savingsId}/transactions`
-   **Description**: This is the primary endpoint for creating a new transaction, such as a deposit or a withdrawal, for a specific savings account.
-   **Usage in `cashier-app`**: **This is the core endpoint used in our application.**
    -   In [`frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts`](frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts:14), this method is called within the `transactionMutation`.
    -   The `command` query parameter is dynamically set to either `deposit` or `withdrawal` based on the user's action.
    -   The request body includes essential transaction details like the amount, date, and payment type.

### 2. `postV1SavingsaccountsBySavingsIdTransactionsQuery`

-   **Endpoint**: `POST /v1/savingsaccounts/{savingsId}/transactions/query`
-   **Description**: Performs an advanced search for savings account transactions using a request body for complex query parameters.
-   **Usage in `cashier-app`**: **Not currently used.** This endpoint is available for future features that might require more complex transaction filtering than the `GET` search endpoint provides.

### 3. `getV1SavingsaccountsBySavingsIdTransactionsSearch`

-   **Endpoint**: `GET /v1/savingsaccounts/{savingsId}/transactions/search`
-   **Description**: A simpler endpoint for searching and filtering savings account transactions based on various query parameters like dates, amounts, and transaction types.
-   **Usage in `cashier-app`**: **Not currently used.** This would be the ideal endpoint to implement a transaction history feature for a specific account.

### 4. `getV1SavingsaccountsBySavingsIdTransactionsTemplate`

-   **Endpoint**: `GET /v1/savingsaccounts/{savingsId}/transactions/template`
-   **Description**: Retrieves a template for a new transaction. This template can be used to pre-fill forms with default values or to understand the required fields for creating a transaction.
-   **Usage in `cashier-app`**: **Not currently used.**

### 5. `getV1SavingsaccountsBySavingsIdTransactionsByTransactionId`

-   **Endpoint**: `GET /v1/savingsaccounts/{savingsId}/transactions/{transactionId}`
-   **Description**: Fetches the complete details of a single, specific transaction by its unique ID.
-   **Usage in `cashier-app`**: **Not currently used.** This would be essential for viewing the details of a past transaction.

### 6. `postV1SavingsaccountsBySavingsIdTransactionsByTransactionId`

-   **Endpoint**: `POST /v1/savingsaccounts/{savingsId}/transactions/{transactionId}`
-   **Description**: Used to perform actions on an existing transaction, such as undoing, reversing, modifying, or releasing an amount.
-   **Accepted `command` parameters**: `undo`, `reverse`, `modify`, `releaseAmount`.
-   **Usage in `cashier-app`**: **Not currently used.** This is a powerful endpoint for administrative actions or correcting transaction errors.

---

## Summary of Usage in `cashier-app`

To be clear, the **only** method from `SavingsAccountTransactionsService` that is currently implemented in the `cashier-app` is:

-   `postV1SavingsaccountsBySavingsIdTransactions`

This single endpoint handles both the **deposit** and **withdrawal** functionality, making it a critical part of the application's core feature set. The other available methods provide opportunities for future expansion, such as implementing transaction histories, detailed transaction views, and administrative corrections.