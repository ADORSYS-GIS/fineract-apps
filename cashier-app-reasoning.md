# Cashier App Epic: Design and Implementation Journey

## 1. Project Overview

This document outlines the development plan and chronicles the implementation of the **Cashier Application**, a core tool for frontline staff to manage client cash transactions efficiently and securely. The application provides key functionality, including secure authentication, client account access, and seamless handling of deposit and withdrawal operations.

The primary goal is to ensure a smooth user experience for cashiers while maintaining system integrity, data accuracy, and compliance with security standards. All development is based on the existing monorepo architecture, leveraging shared UI components and the Fineract API client.

## 2. Authentication Strategy and Debugging

For the initial phase of development, we implemented a basic authentication mechanism using the default Fineract credentials (`username: mifos`, `password: password`). This allowed us to focus on core application features without the immediate complexity of third-party integration. The long-term plan is to integrate **Keycloak** for robust, single sign-on (SSO) authentication.

### Authentication Implementation and Debugging

During development, we encountered a persistent `400 Bad Request` error when communicating with the Fineract backend. This issue blocked all progress on features requiring API interaction.

**Problem Diagnosis:**

The API calls were failing because they were missing two critical HTTP headers required by the Fineract platform:
1.  **`Authorization`**: Containing the user's credentials, Base64 encoded (`Basic <token>`).
2.  **`Fineract-Platform-TenantId`**: Identifying the specific tenant (`default`).

**Solution:**

We implemented a centralized authentication mechanism using an API interceptor. This approach ensures every outgoing request is automatically populated with the necessary headers.

1.  **API Client Configuration**: We leveraged the `OpenAPI` configuration object from the `@fineract-apps/fineract-api` package.
2.  **Request Interceptor**: We added a request interceptor in the application's entry point (`frontend/cashier-app/src/main.tsx`).
3.  **Header Injection**: Inside the interceptor, we retrieve the user's authentication state from the `authStore` and inject the `Authorization` and `Fineract-Platform-TenantId` headers.

**Temporary Login Bypass:**

To facilitate development, we implemented a temporary login bypass in the dashboard's logic (`useDashboard.ts`). This involves programmatically calling the `login` function with a hardcoded, valid authentication token (`bWlmb3M6cGFzc3dvcmQ=`) when the component mounts. This temporary solution will be removed once the final login functionality is implemented.

## 3. Core Features & Implementation Journey

The development was broken down into the following tasks:

### Task 1: Secure Login (Phase 1 Complete)

-   **Description**: As a Cashier, I want to securely log in to the application.
-   **Implementation**: A login form will be created. For now, a temporary login bypass is in place to facilitate development of other features.

### Task 2: View Client Account Details (Complete)

-   **Description**: As a Cashier, I want to view a client's basic account details to verify their identity.
-   **Implementation**:
    1.  **Client Search**: A client search feature was implemented on the dashboard. The search query is stored in the URL's search parameters, making the search state bookmarkable and shareable.
    2.  **Client Details Page**: A dynamic route (`/clients/$clientId`) was created to display the details of a specific client. This page fetches and displays the client's information, including their name, account number, and status.
    3.  **UI/UX Refinements**: The client details page was iteratively refined based on feedback, including layout adjustments and the addition of "Deposit" and "Withdrawal" buttons. A significant performance enhancement was implemented to prevent the client's image from blocking the rendering of the main content. The page now loads instantly, with a dedicated loading state for the image.

### Task 3: Deposit Cash (Complete)

-   **Description**: As a Cashier, I want to deposit cash into a client's account.
-   **Implementation**: A "Deposit" button on the client details page opens a modal form for the transaction. The form includes robust error handling, provides clear feedback on submission and success, and is connected to the Fineract API.

### Task 4: Withdraw Cash (Complete)

-   **Description**: As a Cashier, I want to withdraw cash from a client's account.
-   **Implementation**: The same transaction form is used for withdrawals. The logic dynamically adjusts the API call and user feedback based on the transaction type. Specific API errors, such as "insufficient balance," are now handled gracefully and displayed to the user.

## 4. Architectural Evolution: The Container/Hook/View Pattern

A significant part of our development process involved a major refactoring to align with the project's established **Container/Hook/View** architectural pattern. This pattern enforces a strict separation of concerns, making the codebase more modular, maintainable, and testable.

-   **Initial Implementation**: Initially, some business logic was placed directly within the route components.
-   **Refactoring**: We refactored the `Dashboard` and `ClientDetails` components to adhere to the pattern:
    -   **Hook (`use*.ts`)**: All business logic, state management, and API calls were moved into custom hooks (e.g., `useDashboard.ts`, `useClientDetails.ts`).
    -   **View (`*.view.tsx`)**: The view components were made purely presentational, receiving all data and functions as props.
    -   **Container (`index.tsx`)**: The container component is responsible for calling the hook and passing the results to the view.
    -   **Route (`/routes/...`)**: The route files are now responsible only for defining the route and rendering the container component.

This refactoring has resulted in a much cleaner and more scalable architecture.

## 6. Multi-Account Architecture and Data Fetching Refactor

A pivotal moment in the application's development was the realization that the initial design had two significant limitations: it only handled a client's first savings account, and it couldn't display the account balance due to a limitation in the API. This prompted a major architectural refactoring.

### The Problem: Single-Account Focus and Missing Data

1.  **Multi-Account Requirement**: The initial implementation incorrectly assumed a client would only have one savings account. The design needed to be extended to support clients with multiple accounts.
2.  **API Limitation**: We discovered that the API endpoint used to fetch the list of a client's accounts (`GET /clients/{id}/accounts`) returns a summary view that **does not include the `accountBalance`**. To retrieve the balance, a separate, more detailed API call (`GET /savingsaccounts/{id}`) is required for each individual account.

### The Solution: The "Smart" Child Component Pattern

To address these challenges, we implemented the **"Smart" Child Component** pattern.

1.  **`SavingsAccountCard` Component**: We created a new, self-contained component called `SavingsAccountCard`.
2.  **Delegated Data Fetching**: This component is responsible for its own data. It receives a `savingsAccountId` as a prop and uses its own internal hook (`useSavingsAccountCard`) to make a specific API call to fetch the detailed information for that single account, including its balance.
3.  **Parent Component Update**: The main `ClientDetails` component was updated to simply map over the list of accounts and render a `SavingsAccountCard` for each one.

This architectural shift not only solved the immediate problem of the missing balances but also resulted in a more robust, scalable, and encapsulated design that correctly handles the multi-account requirement.

## 7. Development Roadmap (Updated)

The development has proceeded in the following order:

1.  **Project Setup**: Established the basic file structure for the `cashier-app`. (Complete)
2.  **Authentication & API Integration**: Set up the API interceptor and temporary login bypass. (Complete)
3.  **Client Search & Details**: Developed the client search functionality and the account details view. (Complete)
4.  **Architectural Refactoring**: Refactored the `Dashboard` and `ClientDetails` components to the Container/Hook/View pattern. (Complete)
5.  **Responsiveness**: Made the application layout responsive. (Complete)
6.  **Deposit & Withdrawal**: Implement the deposit and withdrawal forms and connect them to the Fineract API. (Complete)
7.  **Multi-Account Refactoring**: Refactored the `ClientDetails` page to support multiple savings accounts and implemented the "Smart" Child Component pattern to fetch and display account balances correctly. (Complete)
8.  **Documentation**: Create and update detailed documentation for the architecture, API integration, and transaction flow. (Complete)
9.  **Finalize Authentication**: Remove the temporary login bypass and integrate with Keycloak. (Next)