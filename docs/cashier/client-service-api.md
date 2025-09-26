# Client Service API

This document provides a detailed breakdown of the `ClientService` from the `@fineract-apps/fineract-api` package. It explains each available API endpoint and clarifies which ones are actively used in the `cashier-app`.

## Service Overview

The `ClientService` is a generated client class that provides methods for interacting with the Fineract API's client-related endpoints. It handles creating, retrieving, updating, and managing client information and their associated accounts.

---

## Endpoints Breakdown

Below is a comprehensive list of methods available in the `ClientService`, with a focus on their relevance to the `cashier-app`.

### 1. `getV1Clients`

-   **Endpoint**: `GET /v1/clients`
-   **Description**: Retrieves a list of clients. It supports pagination, sorting, and filtering by various attributes like `displayName`, `firstName`, and `lastName`.
-   **Usage in `cashier-app`**: **Not currently used.** The client search functionality in this application is handled by the `ClientSearchV2Service`.

### 2. `getV1ClientsByClientId`

-   **Endpoint**: `GET /v1/clients/{clientId}`
-   **Description**: Retrieves the full details of a single client by their unique `clientId`.
-   **Usage in `cashier-app`**: **This is a core endpoint used in our application.** It is called in [`frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts`](frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts:33) to fetch the primary details of the client being viewed.
    ```typescript
    // frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts
    useQuery({
      queryKey: ["client", clientId],
      queryFn: () => ClientService.getV1ClientsByClientId({ clientId }),
    });
    ```

### 3. `getV1ClientsByClientIdAccounts`

-   **Endpoint**: `GET /v1/clients/{clientId}/accounts`
-   **Description**: Retrieves an overview of a client's associated accounts, including their savings and loan accounts.
-   **Usage in `cashier-app`**: **This is a core endpoint used in our application.** It is called in [`frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts`](frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts:42) to fetch the list of the client's savings accounts.
    ```typescript
    // frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts
    useQuery({
      queryKey: ["clientAccounts", clientId],
      queryFn: () => ClientService.getV1ClientsByClientIdAccounts({ clientId }),
      enabled: !!client,
    });
    ```

### Other `ClientService` Methods

The `ClientService` contains many other methods for comprehensive client management. However, they are **not currently used** in the `cashier-app` as its scope is focused on transactions for existing clients. These methods include:

-   `postV1Clients`: For creating a new client.
-   `putV1ClientsByClientId`: For updating an existing client.
-   `deleteV1ClientsByClientId`: For deleting a client.
-   `postV1ClientsByClientId`: For performing actions on a client (e.g., activate, close, reject, assign staff).
-   `getV1ClientsTemplate`: For retrieving a template for client creation.
-   Methods using `externalId`: The `cashier-app` consistently uses the internal `clientId` for all operations.

---

## Summary of Usage in `cashier-app`

The `cashier-app` utilizes the following methods from `ClientService`:

-   **`getV1ClientsByClientId`**: Fetches the detailed information for a selected client in [`frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts`](frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts:33).
-   **`getV1ClientsByClientIdAccounts`**: Fetches the list of a client's savings accounts in [`frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts`](frontend/cashier-app/src/components/ClientDetails/useClientDetails.ts:42).

These two methods are fundamental to the application's workflow, enabling cashiers to view the specific client and account details necessary to perform transactions.