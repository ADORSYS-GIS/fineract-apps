# Client Search V2 Service API

This document provides a detailed breakdown of the `ClientSearchV2Service` from the `@fineract-apps/fineract-api` package. This service is specifically used for searching for clients within the `cashier-app`.

## Service Overview

The `ClientSearchV2Service` offers a modern, text-based search for clients. Unlike the `ClientService`, which provides broad client management, this service is optimized for a single purpose: efficient, text-based client lookups.

---

## Endpoints Breakdown

### 1. `postV2ClientsSearch`

-   **Endpoint**: `POST /v2/clients/search`
-   **Description**: This endpoint searches for clients based on a text query. It is designed to be fast and is the primary method for finding clients in the `cashier-app`.
-   **Usage in `cashier-app`**: **This is the core endpoint for client search.** It is used in the `useClientSearch` hook to power the search bar on the dashboard.
    -   **File**: [`frontend/cashier-app/src/components/ClientSearch/useClientSearch.ts`](frontend/cashier-app/src/components/ClientSearch/useClientSearch.ts:8)
    -   **Implementation**: The hook calls this service, passing the user's search query in the request body. The query is only enabled when the user has typed at least three characters.

    ```typescript
    // frontend/cashier-app/src/components/ClientSearch/useClientSearch.ts
    import { ClientSearchV2Service } from "@fineract-apps/fineract-api";
    import { useQuery } from "@tanstack/react-query";

    export const useClientSearch = (query: string) => {
    	return useQuery({
    		queryKey: ["clients", { query }],
    		queryFn: () =>
    			ClientSearchV2Service.postV2ClientsSearch({
    				requestBody: {
    					request: { text: query },
    					page: 0,
    					size: 20,
    				},
    			}),
    		// Only enable the query if the query string is not empty
    		enabled: query.length >= 3,
    	});
    };
    ```

---

## Summary

The `ClientSearchV2Service` and its `postV2ClientsSearch` method are the designated tools for finding clients in the `cashier-app`. This centralized approach ensures a consistent and performant search experience.