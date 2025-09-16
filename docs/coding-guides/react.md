# React & Component Design Guide

This guide outlines the best practices for building React components, ensuring a scalable, maintainable, and clean codebase.

## 1. Core Principle: Feature-Based Modularity

Our architecture is based on a modular, feature-based development model within each application. Components are organized by features and are self-contained within their own directory.

### Example Directory Structure

Every component is a self-contained module. Shared UI elements (like Buttons, Inputs) are currently located within the `components/ui` directory of the primary application.

```
/frontend/[app-name]/src
└── /components
    └── /ui
        └── /Button
            ├── index.tsx                 # Container: Connects logic to view
            ├── useButton.ts              # Hook: Contains all logic and state
            ├── Button.view.tsx           # View: Purely presentational (JSX)
            ├── Button.module.css         # Styles: Scoped CSS Modules
            ├── Button.types.ts           # Types: Component-specific types
            └── Button.test.tsx           # Tests: Unit and integration tests
```

## 2. Component Pattern: Logic-View Separation

We enforce a strict separation between component logic and the view (JSX). This makes components easier to test, reason about, and maintain.

- **`use[ComponentName].ts` (The Hook)**: Contains all business logic, state (`useState`, `useReducer`), side effects (`useEffect`), and event handlers. It returns an object containing all the values and functions the view needs.
- **`[ComponentName].view.tsx` (The View)**: A "dumb" component that only receives props. It contains no logic and is responsible only for rendering the UI.
- **`index.tsx` (The Container)**: The public entry point for the component. It calls the custom hook and passes the returned values and functions as props to the View component.

## 3. State Management

- **Local State (`useState`, `useReducer`)**: Use for state confined to a single component or a small group of related components. This should be your default choice.
- **React Context**: Use for low-frequency updates and simple state that needs to be passed down a component tree without prop drilling. Avoid using Context for high-frequency state updates to prevent performance issues.

For more complex state needs, such as managing server-side data or shared global state, a dedicated state management library will be evaluated and introduced as the project scales.

## 4. Error Handling

- **API Errors**: Asynchronous operations should handle potential errors gracefully. In the absence of a dedicated server state library, ensure that `fetch` calls include `.catch()` blocks or are wrapped in `try...catch` within an `async` function. The UI should reflect loading and error states clearly.
- **Component Errors**: Use **Error Boundaries**. Each application should have a global error boundary at the root to prevent a single component crash from taking down the entire app. Finer-grained boundaries around major UI sections are also encouraged.

## 5. Performance Optimization

- **Memoization**:
  - `React.memo()`: Wrap components in `React.memo` to prevent re-renders if their props have not changed. This is especially useful for pure presentational components (`.view.tsx` files).
  - `useCallback()`: Memoize functions passed as props to prevent child components from re-rendering unnecessarily.
  - `useMemo()`: Memoize computationally expensive values.
- **Virtualization**: For long lists or large tables, plan to use a library like `TanStack Virtual` to render only the visible items.

## 6. Accessibility (a11y)

- **Semantic HTML**: Use correct HTML5 elements (`<nav>`, `<main>`, `<button>`).
- **ARIA Roles**: Use ARIA attributes where semantic HTML is not sufficient to describe a component's role or state.
- **Focus Management**: Ensure all interactive elements are focusable and that focus is managed logically, especially in modals and drawers.
- **Testing**: While not yet implemented, the goal is to use accessibility testing tools as described in the [Testing Guide](./testing.md).
