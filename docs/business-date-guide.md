# Business Date Integration Guide

## Overview

The business date functionality in Fineract Apps provides a centralized way to manage and use the current business date across all frontend applications. This ensures consistency in date handling for financial transactions, account operations, and reporting.

## What is Business Date?

Business date represents the current operational date for the financial institution. It may differ from the system calendar date and is used for:

- Transaction processing
- Account creation dates
- Loan disbursement dates
- Report generation
- Approval timestamps

## Architecture

### Service Layer (`packages/ui/src/services/businessDateService.ts`)

The core service provides methods to interact with Fineract's business date API:

```typescript
class BusinessDateService {
  static async getBusinessDate(): Promise<string>
  static async updateBusinessDate(date: string): Promise<void>
  static async getBusinessDateInfo(): Promise<BusinessDateResponse[]>
}
```

### Hook Layer (`packages/ui/src/hooks/useBusinessDate.ts`)

A React hook that provides business date state management:

```typescript
export const useBusinessDate = () => {
  return {
    businessDate: string,
    isLoading: boolean,
    error: string | null,
  };
};
```

### Usage Pattern

**✅ Correct Usage:**
```typescript
// Use business date as form default
const { businessDate } = useBusinessDate();

const initialValues = {
  transactionDate: businessDate, // Default value
  // ... other fields
};

// Use form value in API request
const requestBody = {
  transactionDate: formValues.transactionDate, // User input respected
  // ... other fields
};
```

**❌ Incorrect Usage:**
```typescript
// Don't hard-code business date in request body
const requestBody = {
  transactionDate: await getBusinessDate(), // Hard-coded, ignores user input
  // ... other fields
};
```

## Setup and Configuration

### 1. Enable Business Date in Fineract

```bash
curl -k --location \
  --request PUT 'https://localhost:8443/fineract-provider/api/v1/configurations/44' \
  -u mifos:password \
  --header 'Content-Type: application/json' \
  --header 'Fineract-Platform-TenantId: default' \
  --data '{
    "enabled": true
  }'
```

### 2. Enable Daily Business Date Update Job

```bash
curl -k --location \
  --request PUT 'https://localhost:8443/fineract-provider/api/v1/jobs/32' \
  -u mifos:password \
  --header 'Content-Type: application/json' \
  --header 'Fineract-Platform-TenantId: default' \
  --data '{
    "active": true
  }'
```

### 3. Set Initial Business Date (Optional)

```bash
curl -k --location --request POST -u mifos:password \
'https://localhost:8443/fineract-provider/api/v1/businessdate' \
--header 'Content-Type: application/json' \
--header 'Fineract-Platform-TenantId: default' \
--data '{
  "type": "BUSINESS_DATE",
  "date": "01 December 2025",
  "dateFormat": "dd MMMM yyyy",
  "locale": "en"
}'
```

### 4. Get Current Business Date

```bash
curl -k --location --request GET -u mifos:password \
'https://localhost:8443/fineract-provider/api/v1/businessdate' \
--header 'Content-Type: application/json' \
--header 'Fineract-Platform-TenantId: default'
```

Response:
```json
[
  {
    "description": "Business Date",
    "type": "BUSINESS_DATE",
    "date": [2025, 12, 1]
  },
  {
    "description": "Close of Business Date",
    "type": "COB_DATE",
    "date": [2025, 11, 30]
  }
]
```

## Implementation Examples

### Form with Business Date Default

```typescript
import { useBusinessDate } from "@fineract-apps/ui";

export function TransactionForm() {
  const { businessDate } = useBusinessDate();

  return (
    <Form
      initialValues={{
        transactionDate: businessDate, // Business date as default
        amount: "",
        // ... other fields
      }}
      onSubmit={(values) => {
        // API call uses form values, not hard-coded business date
        api.submitTransaction({
          transactionDate: values.transactionDate, // Respects user input
          amount: values.amount,
          // ... other fields
        });
      }}
    >
      <Input name="transactionDate" label="Transaction Date" type="date" />
      <Input name="amount" label="Amount" type="number" />
      {/* ... other form fields */}
    </Form>
  );
}
```

### Approval Actions

For actions like loan approvals that don't have user-selectable dates:

```typescript
import { useBusinessDate } from "@fineract-apps/ui";

export function useLoanApproval(loanId: number) {
  const { businessDate } = useBusinessDate();

  const approveMutation = useMutation({
    mutationFn: async (note: string) => {
      // For approval actions, using current business date is appropriate
      const date = new Date(businessDate);
      return api.approveLoan(loanId, {
        approvedOnDate: date.toLocaleDateString("en-GB"),
        dateFormat: "dd/MM/yyyy",
        locale: "en",
        note,
      });
    },
  });

  return { approve: approveMutation.mutate };
}
```

## Components Using Business Date

### Account Manager App
- Client creation forms
- Account creation forms
- Loan account forms
- Savings account forms
- Disbursement modal

### Branch Manager App
- Loan approval/rejection
- Savings account approval
- Teller creation/assignment
- Cashier actions

### Cashier App
- Transaction forms
- Repayment forms

### Admin App
- User creation forms

## Best Practices

### ✅ Do's
- Use `useBusinessDate()` hook for consistent state management
- Set business date as form field defaults
- Allow users to override default dates when appropriate
- Use form values in API request bodies
- Handle loading and error states

### ❌ Don'ts
- Don't hard-code business date in API request bodies
- Don't bypass user input by always using current business date
- Don't duplicate business date fetching logic
- Don't ignore loading/error states

## Error Handling

The `useBusinessDate` hook provides error handling:

```typescript
const { businessDate, isLoading, error } = useBusinessDate();

if (isLoading) return <div>Loading business date...</div>;
if (error) return <div>Error: {error}</div>;

// Use businessDate safely
```

## Testing

When testing components that use business date:

```typescript
// Mock the hook
jest.mock("@fineract-apps/ui", () => ({
  useBusinessDate: () => ({
    businessDate: "2025-12-01",
    isLoading: false,
    error: null,
  }),
}));
```

## Migration Guide

### From Direct Service Calls

**Before:**
```typescript
const [businessDate, setBusinessDate] = useState("");
useEffect(() => {
  const fetchDate = async () => {
    const date = await getBusinessDate();
    setBusinessDate(date);
  };
  fetchDate();
}, []);
```

**After:**
```typescript
const { businessDate } = useBusinessDate();
```

### From Hard-coded Request Bodies

**Before:**
```typescript
const submitTransaction = async (formData) => {
  const businessDate = await getBusinessDate();
  return api.submit({
    ...formData,
    transactionDate: businessDate, // Hard-coded
  });
};
```

**After:**
```typescript
const submitTransaction = async (formData) => {
  return api.submit({
    ...formData,
    transactionDate: formData.transactionDate, // User input
  });
};
```

## API Reference

### BusinessDateService

- `getBusinessDate(): Promise<string>` - Get current business date as formatted string
- `updateBusinessDate(date: string): Promise<void>` - Update business date
- `getBusinessDateInfo(): Promise<BusinessDateResponse[]>` - Get detailed business date info

### useBusinessDate Hook

Returns:
- `businessDate: string` - Current business date (yyyy-mm-dd format)
- `isLoading: boolean` - Loading state
- `error: string | null` - Error message if any

## Troubleshooting

### Common Issues

1. **Business date not updating**: Check if the daily update job is enabled
2. **Forms showing wrong defaults**: Ensure `useBusinessDate` hook is used correctly
3. **API errors**: Verify Fineract business date configuration
4. **Loading states**: Handle `isLoading` state in components

### Debug Commands

```bash
# Check business date configuration
curl -k -u mifos:password \
  'https://localhost:8443/fineract-provider/api/v1/configurations/44'

# Check job status
curl -k -u mifos:password \
  'https://localhost:8443/fineract-provider/api/v1/jobs/32'
```

## Related Documentation

- [Fineract Business Date Academy](https://fineract-academy.com/introducing-business-date-into-fineract/)
- [React Query Documentation](https://tanstack.com/query)