# Loan Creation Process Developer Guide

This document provides a comprehensive guide to the loan creation process in the Account Manager App. It covers the file structure, components, state management, and API interactions involved in creating a new loan account.

## File Structure

The loan creation feature is located in `fineract-apps/frontend/account-manager-app/src/pages/loan/create-loan-account`. The structure is as follows:

-   **`CreateLoanAccount.tsx`**: The main entry point component for the feature. It wraps the view component with the `FormikProvider`.
-   **`CreateLoanAccount.view.tsx`**: The view layer of the component, responsible for rendering the UI, including the stepper and the different steps of the form.
-   **`useCreateLoanAccount.ts`**: A custom hook that contains all the business logic, state management, and API calls for creating a loan account.
-   **`CreateLoanAccount.schema.ts`**: Defines the form validation schema using Zod.
-   **`CreateLoanAccount.types.ts`**: Contains all the TypeScript types and interfaces used in the loan creation process.
-   **`index.ts`**: Exports the main `CreateLoanAccount` component.
-   **`components/`**: A directory containing the components for each step of the loan creation form (Details, Terms, Charges, Repayment Schedule, and Preview).

## Core Components and Logic

### `CreateLoanAccount.tsx`

This component serves as the entry point for the loan creation feature. Its primary responsibility is to initialize the `useCreateLoanAccount` hook and provide the resulting `formik` instance to the view layer through a `FormikProvider`.

```tsx
import { FormikProvider } from 'formik';
import { CreateLoanAccountView } from '@/pages/loan/create-loan-account/CreateLoanAccount.view';
import { useCreateLoanAccount } from '@/pages/loan/create-loan-account/useCreateLoanAccount';

export const CreateLoanAccount = () => {
  const props = useCreateLoanAccount();
  return (
    &lt;FormikProvider value={props.formik}&gt;
      &lt;CreateLoanAccountView {...props} /&gt;
    &lt;/FormikProvider&gt;
  );
};
```

### `CreateLoanAccount.view.tsx`

This component is responsible for the UI of the loan creation process. It implements a stepper to guide the user through the different stages of creating a loan.

Key features:

-   **Stepper**: A multi-step form wizard with the following steps: Details, Terms, Charges, Repayment Schedule, and Preview.
-   **Step Components**: It dynamically renders the component for the current step (e.g., `DetailsStepView`, `TermsStepView`).
-   **Navigation**: Provides "Next" and "Back" buttons to navigate between steps.
-   **Submission**: The "Submit" button is shown on the final step to trigger the form submission.

### `useCreateLoanAccount.ts` - A Deep Dive

This custom hook is the brain of the feature. It orchestrates state management, API calls, and side effects.

**State Management:**

-   **`formik`**: An instance of Formik is created using `useFormik` to manage the entire form state.
    -   `initialValues`: Sets the default state for all form fields. Dates are initialized to the current date.
    -   `onSubmit`: This function is called when the form is submitted. It transforms the form values into the `PostLoansRequest` payload format required by the API and then triggers the `createLoanAccountMutation`.
-   **`selectedProductId`**: A local state variable (`useState`) that tracks the currently selected loan product ID. This is used to enable or disable the query for loan product details.
-   **`repaymentSchedule`**: A local state variable that stores the calculated repayment schedule returned from the API.

**Side Effects (`useEffect`):**

1.  **`useEffect` for `loanProductId`**:
    -   **Trigger**: This effect runs whenever `values.loanProductId` from the Formik state changes.
    -   **Action**: It updates the `selectedProductId` state. This change, in turn, triggers the `useQuery` hook for fetching the loan product details, as that query's `enabled` option is set to `!!selectedProductId`.

2.  **`useEffect` for `loanDetails`**:
    -   **Trigger**: This effect runs whenever the `loanDetails` data from the API changes (i.e., after a new loan product's details have been fetched).
    -   **Action**: It uses Formik's `setValues` function to update the form state with the default values from the fetched `loanDetails`. This populates fields like `principal`, `interestRatePerPeriod`, `numberOfRepayments`, etc., based on the selected loan product's template. It intelligently merges the new details with any existing values the user might have already entered.

**API Interactions (`@tanstack/react-query`):**

-   **`useQuery(['loan-template', clientId])`**: Fetches the initial loan template when the component mounts. This provides the list of available loan products.
-   **`useQuery(['loan-details', clientId, selectedProductId])`**: Fetches the detailed template for a *specific* loan product. This query is only enabled when `selectedProductId` is not null.
-   **`createLoanAccountMutation`**: A `useMutation` hook that handles the final creation of the loan account. It calls `LoansService.postV1Loans`.
    -   `onSuccess`: Displays a success toast notification and navigates the user away from the page.
    -   `onError`: Displays an error toast notification with the error message.
-   **`calculateLoanScheduleMutation`**: A `useMutation` hook that calls `LoansService.postV1Loans` with `command: 'calculateLoanSchedule'`.
    -   `onSuccess`: Stores the returned schedule in the `repaymentSchedule` state and shows a success toast.
    -   `onError`: Displays an error toast.

**Payload Transformation:**

Inside the `onSubmit` function and `handleCalculateSchedule` function, the Formik `values` are transformed into a `PostLoansRequest` object. This involves:
-   Converting numbers to the correct type.
-   Formatting dates using `date-fns` to the `dd MMMM yyyy` format expected by the Fineract API.
-   Mapping the `charges` array into the structure required by the API (`{ chargeId: number, amount: number }`).

## Data Flow and State Management

### Form Validation: `CreateLoanAccount.schema.ts`

The form's validation logic is defined using the Zod library. The `loanDetailsSchema` object specifies the validation rules for each field in the loan creation form.

-   **`loanProductId`**: A required number.
-   **Other fields**: Most other fields are optional, allowing the backend to provide default values based on the selected loan product.
-   **`charges`**: An optional array of charge objects.

The `LoanDetailsFormValues` type is inferred from the schema, ensuring type safety between the form state and the validation logic.

### TypeScript Types: `CreateLoanAccount.types.ts`

This file defines the TypeScript interfaces for the data used in the loan creation process. These types are crucial for ensuring type safety and providing autocompletion during development.

-   **`GetLoansTemplateResponse`**: Extends the base type from the Fineract API to include additional options for dropdowns (e.g., `loanOfficerOptions`, `fundOptions`).
-   **`PostLoansRequest`**: Extends the base request type to include optional fields like `loanPurposeId` and `fundId`.
-   **`LoanDetailsTemplate`**: Represents the detailed information for a selected loan product.
-   **`LoanRepaymentSchedule`**: Defines the structure of the repayment schedule object returned by the API.
-   **`CreateLoanAccountProps`**: Defines the props for the view components.

## API Endpoints

The loan creation feature interacts with the Fineract backend through several API endpoints. All API interactions are managed by the `@fineract-apps/fineract-api` package, which provides auto-generated TanStack Query hooks.

### 1. `GET /v1/loans/template`

This endpoint is used to fetch the initial data required for the loan application form.

-   **Hook**: `LoansService.getV1LoansTemplate`
-   **When it's called**:
    1.  On component mount to get the base template for a new loan for a specific client (`clientId`). This populates the "Loan Product" dropdown and other initial fields.
    2.  When a user selects a "Loan Product" from the dropdown. The `productId` is passed to the endpoint to fetch the specific template and default values for that product (e.g., principal, interest rate, number of repayments).
-   **Query Keys**:
    -   `['loan-template', clientId]`
    -   `['loan-details', clientId, selectedProductId]`
-   **Purpose**: To retrieve loan product options, available loan officers, funds, and default values for the loan form.

### 2. `POST /v1/loans?command=calculateLoanSchedule`

This endpoint is used to calculate the loan repayment schedule based on the current form values without actually creating the loan.

-   **Hook**: `LoansService.postV1Loans` with the `command` parameter set to `calculateLoanSchedule`.
-   **When it's called**: When the user clicks the "Calculate Schedule" button in the "Repayment Schedule" step.
-   **Purpose**: To provide the user with a preview of the repayment schedule before they submit the loan application. The response contains a detailed breakdown of each repayment period, including principal, interest, and total due.

### 3. `POST /v1/loans`

This is the main endpoint for creating the new loan account.

-   **Hook**: `LoansService.postV1Loans`
-   **When it's called**: When the user clicks the "Submit" button on the final "Preview" step of the form.
-   **Purpose**: To submit the complete loan application payload to the server to create the loan account. The payload includes all the details entered by the user, such as client ID, product ID, principal, terms, and charges. On success, the user is redirected.
-   **Post-Creation**: After a loan is successfully created, it will appear on the client's detail page under the "Accounts" section, alongside any savings accounts.

## Shared Components

The loan creation process utilizes several shared components.

### `Stepper.tsx`

This component provides the visual stepper navigation for the multi-step form.

-   **Purpose**: To visually indicate the user's progress through the loan creation steps.
-   **Props**:
    -   `steps`: An array of objects, each with a `label` string to be displayed for the step.
    -   `activeStep`: A number representing the index of the currently active step.
-   **Functionality**: It renders the steps and highlights the current step, completed steps, and pending steps with different colors and icons.

### `Table.tsx`

This is a generic, reusable table component built using `@tanstack/react-table`.

-   **Purpose**: To display tabular data in a consistent and accessible way. In the loan process, it is used to display the calculated repayment schedule.
-   **Props**:
    -   `columns`: An array of column definitions from TanStack Table.
    -   `data`: The array of data to be displayed.
    -   `caption` (optional): A caption for the table for accessibility.
    -   `ariaLabel` (optional): An ARIA label for the table.
-   **Functionality**: It renders a table with a header and body, and it is capable of handling complex data structures and rendering custom cell content.

## Step Components

The `CreateLoanAccount.view.tsx` renders different components based on the current step. These components are located in the `components/` subdirectory.

### `DetailsStep.view.tsx`

-   **Purpose**: This is the first step in the process. It captures the fundamental details of the loan, such as the loan product, loan officer, and purpose.
-   **Key Fields**:
    -   **Loan Product**: A dropdown populated from the `loanTemplate` data. Selecting a product is the most critical action in this step, as it triggers a fetch for the product's specific details which populates the rest of the form.
    -   **Loan Officer**: An optional dropdown.
    -   **Loan Purpose**: An optional dropdown.
    -   **Fund**: An optional dropdown.
    -   **Submitted On**: A date picker, defaults to the current date.
    -   **Expected Disbursement Date**: A date picker, defaults to the current date.
-   **Data Dependencies**: It relies on `loanTemplate` for the dropdown options and `loanDetails` to show loading states while the product-specific template is being fetched.

### `TermsStep.view.tsx`

-   **Purpose**: This step defines the financial terms of the loan. The fields are typically pre-populated with default values from the selected loan product's template but can be overridden by the user.
-   **Key Fields**:
    -   **Principal**: The loan amount.
    -   **Loan Term**: The duration of the loan (e.g., 12 months).
    -   **Number of Repayments**: How many installments the loan will have.
    -   **Repayment Frequency**: How often repayments are made (e.g., every 1 month).
    -   **Interest Rate**: The interest rate per period.
    -   **Amortization, Interest Type, etc.**: Dropdowns that define how the loan is calculated.
-   **Data Dependencies**: This component is only rendered when `loanDetails` is available and is not in a loading state. It uses the `loanDetails` object to populate the initial values of the form fields.

### `ChargesStep.view.tsx`

-   **Purpose**: This step allows the user to add or remove additional fees (charges) to the loan account.
-   **Functionality**: It displays a list of charges associated with the selected loan product. Users can typically select from a list of predefined charges and specify the amount. The form state for charges is managed as an array of objects within Formik.
-   **Data Dependencies**: It uses the `charges` array from the `loanDetails` object to display the available and default charges for the loan product.

### `RepaymentScheduleStep.view.tsx`

-   **Purpose**: This step allows the user to preview the calculated repayment schedule before finalizing the loan.
-   **Functionality**:
    -   It features a "Calculate Schedule" button which triggers the `handleCalculateSchedule` function from the `useCreateLoanAccount` hook.
    -   When the calculation is complete, the `repaymentSchedule` state is populated, and the results are displayed in a `Table` component.
    -   It shows a loading indicator while the calculation is in progress (`isCalculatingSchedule`).
-   **Data Dependencies**: It receives the `repaymentSchedule` data and the `isCalculatingSchedule` boolean as props.

### `PreviewStep.view.tsx`

-   **Purpose**: This is the final step, providing a read-only summary of all the loan details the user has entered across the previous steps.
-   **Functionality**: It displays a summary of the loan details, terms, and charges. This gives the user a final chance to review everything before submitting the application.
-   **Data Dependencies**: It receives the Formik `values`, the `loanTemplate` (to resolve IDs to names, e.g., loan purpose ID to its actual name), and `loanDetails` as props to render the summary.
