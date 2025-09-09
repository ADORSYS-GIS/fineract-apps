# React & Component Design Guide

This guide outlines the best practices for building React components, ensuring a scalable, maintainable, and clean codebase.

## 1. Core Principle: Atomic and Modular Design

Our architecture is based on a blend of **Atomic Design** and **modular, feature-based development**.

- **Shared Components (`packages/ui`)**: Follows Atomic Design.
  - **Atoms**: The smallest UI elements (`Button`, `Input`, `Spinner`).
  - **Molecules**: Simple groups of atoms (`SearchForm`).
  - **Organisms**: Complex components forming a section of an interface (`ClientProfileHeader`).
  - **Templates**: Reusable page layouts (`TwoColumnLayout`).

- **Application-Specific Components (`packages/apps/[app-name]/src/features`)**: Components that are specific to a feature and not shared.

### Example Directory Structure

Every component is a self-contained module within its own directory:

```
/Button
├── index.tsx                 # Container: Connects logic to view
├── useButton.ts              # Hook: Contains all logic and state
├── Button.view.tsx           # View: Purely presentational (JSX)
├── Button.module.css         # Styles: Scoped CSS Modules
├── Button.types.ts           # Types: Component-specific types
└── Button.test.tsx           # Tests: Unit and integration tests
```

## 2. Component Pattern: Logic-View Separation

We enforce a strict separation between component logic and the view (JSX).

- **`use[ComponentName].ts` (The Hook)**: Contains all business logic, state (`useState`, `useReducer`), side effects (`useEffect`), and event handlers. It returns an object containing all the values and functions the view needs.
- **`[ComponentName].view.tsx` (The View)**: A "dumb" component that only receives props. It contains no logic and is responsible only for rendering the UI.
- **`index.tsx` (The Container)**: The public entry point for the component. It calls the custom hook and passes the returned values and functions as props to the View component.

## 3. State Management

- **Local State (`useState`, `useReducer`)**: Use for state confined to a single component.
- **Server State (`TanStack Query`)**: Use for all asynchronous operations (fetching, caching, updating server data). It is the default choice for data that persists outside the client.
- **Global UI State (`Zustand`)**: Use for client-side state that is shared across many components and is not server state (e.g., theme preference, notification toasts, wizard state).
- **React Context**: Use for low-frequency updates and simple state that needs to be passed down a component tree without prop drilling. **Prefer Zustand for complex or high-frequency state updates** to avoid performance issues related to context re-renders.

## 4. Error Handling

- **API Errors**: TanStack Query's `useQuery` and `useMutation` hooks provide an `isError` flag and an `error` object. Components should handle these states explicitly to show error messages to the user (e.g., a toast notification or an inline error message).
- **Component Errors**: Use **Error Boundaries**. Each application should have a global error boundary at the root and finer-grained boundaries around major UI sections or features to prevent a single component crash from taking down the entire app.

## 5. Performance Optimization

- **Memoization**:
  - `React.memo()`: Wrap components in `React.memo` to prevent re-renders if their props have not changed. This is especially useful for pure presentational components (`.view.tsx` files).
  - `useCallback()`: Memoize functions passed as props to prevent child components from re-rendering unnecessarily.
  - `useMemo()`: Memoize computationally expensive values.
- **Virtualization**: For long lists or large tables, use a library like `TanStack Virtual` to render only the visible items.

## 6. Accessibility (a11y)

- **Semantic HTML**: Use correct HTML5 elements (`<nav>`, `<main>`, `<button>`).
- **ARIA Roles**: Use ARIA attributes where semantic HTML is not sufficient to describe a component's role or state.
- **Focus Management**: Ensure all interactive elements are focusable and that focus is managed logically, especially in modals and drawers.
- **Testing**: Use accessibility testing tools as described in the [Testing Guide](./testing.md).

## 7. Testing Strategy

- All components must have corresponding tests.
- The testing approach should align with the principles in the [Testing Guide](./testing.md), focusing on user behavior over implementation details.