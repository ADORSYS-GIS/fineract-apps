# Testing Guide

This guide outlines our strategy for testing to ensure our applications are reliable, robust, and free of regressions.

## 1. Core Philosophy & Tools

- **Guiding Principle**: Test user behavior, not implementation details.
- **Test Runner**: **Jest** (configured at the root level).
- **DOM Testing Library**: **React Testing Library (RTL)**.

Future considerations for testing include:
- **E2E Testing**: A framework like **Cypress** will be evaluated for critical user flows.
- **Accessibility Testing**: A tool like **`jest-axe`** will be integrated to catch accessibility violations.
- **API Mocking**: **Mock Service Worker (MSW)** is the recommended approach for mocking API responses at the network level.

## 2. Unit & Integration Testing (Jest + RTL)

### Testing Components

- **AAA Pattern**: Structure tests using Arrange, Act, Assert.
- **Queries**: Use user-facing queries like `getByRole`, `getByLabelText`, and `getByText`. Avoid implementation-specific queries like `getByTestId` unless absolutely necessary.
- **User Interaction**: When simulating user events, prefer `@testing-library/user-event` over `fireEvent` as it provides a more realistic event simulation. (Note: `@testing-library/user-event` is not yet a dependency).

### Testing Custom Hooks

- Use the `renderHook` method from RTL to test custom hooks in isolation.
- Test the hook's return values and how they change in response to updates.

```tsx
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter());

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

### Testing Asynchronous Code

- When testing components that fetch data, use Jest's mocking capabilities (`jest.fn()`, `jest.spyOn()`) to mock the fetch call and its response.
- Test for `isLoading`, `isSuccess`, and `isError` states by asserting that the correct UI is rendered in each case.

## 3. Test Utilities

To avoid repetitive setup in test files (e.g., wrapping components in providers), it is recommended to create a custom `render` function within each application's test directory.

**Example (`/frontend/[app-name]/src/test-utils.tsx`):**
```tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Add providers here as they are introduced to the project
const AllTheProviders: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <>{children}</>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
```
