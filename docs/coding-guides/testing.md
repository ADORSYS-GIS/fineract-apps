# Testing Guide

This guide outlines our strategy for testing to ensure our applications are reliable, robust, and free of regressions.

## 1. Core Philosophy & Tools

- **Guiding Principle**: Test user behavior, not implementation details.
- **Test Runner**: **Jest**
- **Component/Hook Testing**: **React Testing Library (RTL)**
- **E2E Testing**: **Cypress**
- **Accessibility Testing**: **`jest-axe`**

## 2. Unit & Integration Testing (Jest + RTL)

### Testing Components

- **AAA Pattern**: Structure tests using Arrange, Act, Assert.
- **Queries**: Use user-facing queries like `getByRole`, `getByLabelText`, and `getByText`. Avoid implementation-specific queries like `getByTestId` unless absolutely necessary.
- **User Interaction**: Use `@testing-library/user-event` for simulating user interactions as it provides a more realistic event simulation than `fireEvent`.

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

### Testing TanStack Query

- **Mocking**: Use **Mock Service Worker (MSW)** to mock API responses at the network level. This ensures tests are environment-agnostic and reliable.
- **Wrapper**: Wrap your component with a `QueryClientProvider` in your tests. It's best to create a shared custom render function for this.
- **Testing States**: Test for `isLoading`, `isSuccess`, and `isError` states.

```tsx
test('displays user data on successful fetch', async () => {
  renderWithClient(<UserComponent />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
});
```

### Testing Error States

- Ensure your MSW handlers can return error responses (e.g., 404, 500).
- Write tests that assert the correct error UI (error messages, disabled buttons) is displayed when an API call fails.

## 3. Accessibility Testing

- Use `jest-axe` to automatically test for WCAG violations in your rendered components.
- Add accessibility checks to your shared testing utilities to run on every test.

```tsx
import { render } from './test-utils'; // Your custom render
import { axe } from 'jest-axe';

test('should have no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 4. Shared Testing Utilities

- Create a `test-utils.tsx` file in `packages/ui/src` to export a custom render function.
- This function should wrap the rendered component in all necessary providers (`QueryClientProvider`, `ThemeProvider`, etc.) to avoid repetitive setup in every test file.

## 5. End-to-End (E2E) Testing

- **Framework**: **Cypress**
- **Scope**: E2E tests will cover critical user flows from end to end (e.g., login, creating a client, completing a transaction). They are not for testing every component state; that is the job of unit/integration tests.
- **Setup**: A `cypress.config.ts` and support files will be added to the root of each application package (`packages/apps/[app-name]`).