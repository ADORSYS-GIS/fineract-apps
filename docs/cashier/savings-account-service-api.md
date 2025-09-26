# Savings Account Service API

This document provides a detailed breakdown of the `SavingsAccountService` from the `@fineract-apps/fineract-api` package. It explains the available API endpoints and clarifies which one is actively used in the `cashier-app` to fetch detailed account information.

## Service Overview

The `SavingsAccountService` is a generated client class that provides a comprehensive set of methods for managing savings accounts in the Fineract API. This includes creating, retrieving, updating, and performing various actions on savings accounts.

---

## Endpoints Breakdown

The `SavingsAccountService` is extensive, but its use in the `cashier-app` is very specific and targeted.

### 1. `getV1SavingsaccountsByAccountId`

-   **Endpoint**: `GET /v1/savingsaccounts/{accountId}`
-   **Description**: Retrieves the full details for a single savings account, including sensitive information like the current `accountBalance`. This is distinct from the summary view returned by other endpoints.
-   **Usage in `cashier-app`**: **This is a critical endpoint for the application's "Smart" Child Component architecture.**
    -   **File**: [`frontend/cashier-app/src/components/SavingsAccountCard/useSavingsAccountCard.ts`](frontend/cashier-app/src/components/SavingsAccountCard/useSavingsAccountCard.ts:12)
    -   **Implementation**: This method is called within the `useSavingsAccountCard` hook. Each `SavingsAccountCard` component is responsible for fetching its own details. This is necessary because the initial list of accounts fetched by the `ClientService` does not include the account balance. This endpoint provides that missing piece of data.

    ```typescript
    // frontend/cashier-app/src/components/SavingsAccountCard/useSavingsAccountCard.ts
    import { SavingsAccountService } from "@fineract-apps/fineract-api";
    import { useQuery } from "@tanstack/react-query";

    export const useSavingsAccountCard = (accountId: number) => {
    	const {
    		data: accountDetails,
    		isLoading,
    		isError,
    	} = useQuery({
    		queryKey: ["savingsAccount", accountId],
    		queryFn: () =>
    			SavingsAccountService.getV1SavingsaccountsByAccountId({
    				accountId,
    			}),
    		enabled: !!accountId,
    	});

    	return {
    		accountBalance: accountDetails?.summary?.accountBalance,
    		isLoading,
    		isError,
    	};
    };
    ```

### Other `SavingsAccountService` Methods

The `SavingsAccountService` provides many other methods for full lifecycle management of savings accounts. These are **not currently used** in the `cashier-app`, as its focus is on transactions rather than account administration. These methods include:

-   `getV1Savingsaccounts`: To list all savings accounts.
-   `postV1Savingsaccounts`: To submit a new savings account application.
-   `putV1SavingsaccountsByAccountId`: To modify a savings application.
-   `deleteV1SavingsaccountsByAccountId`: To delete a savings application.
-   `postV1SavingsaccountsByAccountId`: To perform actions on an account (e.g., approve, activate, close, calculate interest).

---

## Summary

The `cashier-app`'s use of the `SavingsAccountService` is a perfect example of targeted API interaction. It exclusively uses the `getV1SavingsaccountsByAccountId` method to solve a specific data-fetching challenge, delegating the responsibility of fetching detailed balance information to the `SavingsAccountCard` component.