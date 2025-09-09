# TypeScript Coding Guide

This document provides TypeScript coding conventions to ensure our code is clean, consistent, and type-safe.

## 1. Naming & Declaration

- **Components, Types, Interfaces, Enums**: `PascalCase` (`ClientProfile`, `ButtonProps`).
- **Variables, Functions, Hooks**: `camelCase` (`clientData`, `useAuth`).
- **Interfaces**: **Do not** use the `I` prefix (e.g., `ComponentProps`, not `IComponentProps`).
- **`const` over `let`**: Prefer `const` by default unless a variable needs to be reassigned.

## 2. Immutability

- **Core Principle**: Never mutate state or props directly. Treat all objects and arrays as immutable.
- **Arrays**: Use non-mutating array methods (`.map()`, `.filter()`, `.reduce()`) instead of mutating methods like `.push()` or `.splice()`. Use the spread syntax `[...arr]` to create copies.
- **Objects**: Use the object spread syntax `{...obj}` to create copies before modification.

```ts
// Incorrect: Mutation
const user = { name: 'John' };
user.name = 'Jane';

// Correct: Immutability
const user = { name: 'John' };
const updatedUser = { ...user, name: 'Jane' };
```

## 3. Asynchronous Code

- **`async/await`**: Always prefer `async/await` over `Promise.then()` chains for cleaner, more readable asynchronous code.
- **Error Handling**: All `async` functions that can fail (especially API calls) **must** be wrapped in a `try...catch` block to handle errors gracefully.
- **Logging**: Use a dedicated logging service for capturing errors in production. In development, `console.error` is acceptable.

```ts
async function fetchUser(id: string) {
  try {
    const user = await apiClient.get(`/users/${id}`);
    return user;
  } catch (error) {
    // In a real app, use a logging service
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw to allow UI to handle it
  }
}
```

## 4. Typing React Patterns

- **Component Props**: Define props with an `interface` or `type`. Use `React.FC` (FunctionComponent) for component definitions to get automatic `children` typing and other benefits.
- **Optional & Default Props**: Prefer default parameter values over the deprecated `defaultProps`.

  ```tsx
  interface ButtonProps {
    variant?: 'primary' | 'secondary'; // Optional prop
    onClick: () => void;
    children: React.ReactNode;
  }

  export const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children }) => {
    // `variant` will default to 'primary' if not provided
    return <button className={variant} onClick={onClick}>{children}</button>;
  };
  ```

- **Events**: Use the specific event types from React (e.g., `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`).

## 5. Advanced Types

- **Utility Types**: Leverage built-in utility types like `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, and `ReturnType<T>` to create new types from existing ones without boilerplate.
- **Generics**: Use generics to create reusable, type-safe functions, hooks, or components.
- **Type Guards**: Use `typeof`, `instanceof`, or custom predicate functions (`value is Type`) to narrow types within conditional blocks. Avoid the non-null assertion operator (`!`).

## 6. Tooling & Enforcement

- **`tsconfig.json`**: A base `tsconfig.json` in `packages/config/tsconfig` enforces strict type checking across the monorepo.
- **ESLint/Prettier**: Configuration is centralized. Key ESLint rules to enforce these standards include:
  - `@typescript-eslint/no-explicit-any`: Disallows using the `any` type.
  - `@typescript-eslint/explicit-function-return-type`: Requires explicit return types on functions.
  - `no-floating-promises`: Requires that every `Promise` is handled correctly (e.g., with `await` or `.catch()`).
  - Rules to enforce immutability (e.g., from `eslint-plugin-functional`).
