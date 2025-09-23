# Transactions: Deposits and Withdrawals

This document provides a detailed explanation of how deposit and withdrawal transactions are handled within the `cashier-app`. The goal is to create a seamless, intuitive, and robust experience for the cashier while ensuring all interactions with the backend are secure and accurate.

## 1. Overview of the Transaction Flow

The transaction process is initiated from the **Client Details** page and is designed to be straightforward:

1.  **Initiation**: The cashier navigates to the **Client Details** page, which now displays a list of all the client's savings accounts.
2.  **Selection**: The cashier clicks the "Deposit" or "Withdrawal" button on the specific account card they wish to transact with.
3.  **Modal Display**: A modal window appears, containing a simple form to enter the transaction amount for the selected account.
3.  **Submission**: The cashier enters the amount and submits the form.
4.  **API Call**: The application sends a request to the Fineract API to process the transaction.
5.  **Feedback**: The UI provides clear feedback, indicating whether the transaction is in progress, was successful, or failed.

## 2. Component and Logic Breakdown

The transaction functionality is primarily managed by two components and their associated hooks, following our **Container/Hook/View** pattern.

### `ClientDetails` Component

This component is the entry point for all transactions.

-   **`ClientDetails/useClientDetails.ts` (The Hook)**: This is the brain of the operation. It manages the state of the transaction modal (open/closed, type of transaction), handles the API calls, and manages the success and error states.
    -   It uses a `useQuery` hook to fetch the list of the client's associated accounts (`ClientService.getV1ClientsByClientIdAccounts`).
    -   A `useMutation` hook is used to handle the actual transaction submission. This hook wraps the `SavingsAccountTransactionsService.postV1SavingsaccountsBySavingsIdTransactions` API call.
    -   **State Management**: It uses `useState` to manage `transactionType`, `transactionError`, `isSuccess`, and, most importantly, the `selectedAccount`. When a cashier clicks "Deposit" or "Withdrawal" on an account card, that account's ID is stored in the `selectedAccount` state. This ensures the subsequent transaction is performed on the correct account.
    -   **Error Handling**: The `onError` callback in the mutation is specifically designed to parse the error response from the Fineract API. It extracts the user-friendly error message (e.g., "Insufficient account balance") and stores it in the `transactionError` state, which is then displayed to the user.

-   **`ClientDetails/ClientDetails.view.tsx` (The View)**: This component's primary role is to map over the list of savings accounts and render a `SavingsAccountCard` for each one. It passes the `onDeposit` and `onWithdraw` handler functions down to each card.

### `SavingsAccountCard` Component

This is a new, "smart" component responsible for displaying the details of a single savings account.

-   **`SavingsAccountCard/useSavingsAccountCard.ts` (The Hook)**: This hook receives a `savingsId` and uses a `useQuery` hook to fetch the detailed information for that single account, including its balance, by calling `SavingsAccountService.getV1SavingsaccountsByAccountId`.
-   **`SavingsAccountCard/SavingsAccountCard.view.tsx` (The View)**: Renders the account details, including the balance. It also renders the "Deposit" and "Withdrawal" buttons, but only if the account's status is "active". When clicked, these buttons call the `onDeposit` and `onWithdraw` props that were passed down from the `ClientDetails` parent.

### `TransactionForm` Component

This component is a reusable modal form for entering the transaction amount.

-   **`TransactionForm/TransactionForm.view.tsx` (The View)**: This component is designed to be a "dumb" presentational component.
    -   It receives all necessary props, including `transactionType`, `isSubmitting`, `isSuccess`, and `errorMessage`.
    -   It displays a success message when `isSuccess` is true.
    -   It shows an error message when `errorMessage` has a value.
    -   It disables the form fields and updates the submit button text to "Submitting..." when `isSubmitting` is true, preventing duplicate submissions.
    -   The logic for the submit button's label and the client image rendering were refactored into helper functions (`getSubmitButtonLabel` and `renderClientImage` respectively) to improve readability and resolve SonarQube warnings about nested ternary operators.

## 3. API Interaction and Payload

The `useClientDetails` hook is responsible for constructing and sending the correct payload to the Fineract API.

-   **Endpoint**: `POST /v1/savingsaccounts/{savingsId}/transactions?command={command}`
-   **Command**: The `command` parameter is dynamically set to either `deposit` or `withdrawal` based on which button the user clicked.
-   **Request Body**: The payload is carefully constructed to match the API's requirements:
    ```json
    {
      "locale": "en",
      "dateFormat": "dd MMMM yyyy",
      "transactionDate": "23 September 2025",
      "transactionAmount": 2000.00,
      "paymentTypeId": 1,
      "paymentTypeId": 1
    }
    ```

## 4. User Experience (UX) Considerations

Several key decisions were made to ensure a smooth and intuitive user experience:

-   **Modal Interaction**: Using a modal for the transaction form keeps the user in the context of the client they are working with.
-   **Clear Feedback**: The form provides immediate visual feedback for submission, success, and error states. This prevents user confusion and duplicate actions.
-   **Specific Error Messages**: Displaying the exact error from the API (e.g., "Insufficient account balance") is far more helpful than a generic "An error occurred" message.
-   **Delayed Modal Closing**: On success, the modal displays a success message for two seconds before automatically closing. This gives the user time to confirm that their action was successful.