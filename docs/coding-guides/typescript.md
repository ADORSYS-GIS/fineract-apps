# TypeScript Coding Guide

This document provides TypeScript coding conventions to ensure our code is clean, consistent, and type-safe.

## 1. Naming & Declaration

- **Components, Types, Interfaces, Enums**: `PascalCase` (`ClientProfile`, `ButtonProps`).
- **Variables, Functions, Hooks**: `camelCase` (`clientData`, `useAuth`).
- **Interfaces**: **Do not** use the `I` prefix (e.g., `ComponentProps`, not `IComponentProps`).
- **`const` over `let`**: Prefer `const` by default unless a variable needs to be reassigned.
- **Imports**: Avoid namespace imports (`import * as Name from 'module'`). Prefer named or default imports for better clarity and to ensure tree-shaking works effectively.

  ```ts
  // Avoid
  import * as React from 'react';
  const ref = React.useRef();

  // Prefer
  import React, { useRef } from 'react';
  const ref = useRef();
  ```

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
- **Logging**: For now, `console.error` is acceptable for logging errors during development. A dedicated logging service should be considered for production environments.

```ts
async function fetchUser(id: string) {
  try {
    const user = await apiClient.get(`/users/${id}`);
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error; // Re-throw to allow UI to handle it
  }
}
```

## 4. Typing React Patterns

- **Component Props**: Define props with an `interface` or `type`. **Do not use `React.FC` or `React.FunctionComponent`**. This practice is discouraged as it has several drawbacks, including implicitly providing `children` and issues with generics.

- **Typing Components Correctly**: Type props directly on the function declaration.

  ```tsx
  import React, { ReactNode } from 'react';

  interface ButtonProps {
    variant?: 'primary' | 'secondary'; // Optional prop
    onClick: () => void;
    children: ReactNode;
  }

  // Correct: Type props directly on the component function.
  export const Button = ({ variant = 'primary', onClick, children }: ButtonProps) => {
    return <button className={variant} onClick={onClick}>{children}</button>;
  };
  ```

- **Events**: Use the specific event types from React (e.g., `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`).

## 5. Advanced Types

- **Utility Types**: Leverage built-in utility types like `Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, and `ReturnType<T>` to create new types from existing ones without boilerplate.
- **Generics**: Use generics to create reusable, type-safe functions, hooks, or components.
- **Type Guards**: Use `typeof`, `instanceof`, or custom predicate functions (`value is Type`) to narrow types within conditional blocks. Avoid the non-null assertion operator (`!`) where possible.

## 6. Tooling & Enforcement

- **`tsconfig.base.json`**: A base `tsconfig.base.json` in the root enforces strict type checking across the monorepo.
- **Biome**: We use [Biome](https://biomejs.dev/) as an all-in-one tool for linting and formatting. It is configured in the `biome.json` file at the project root.
  - Key lint rules are enabled under the `linter` section of `biome.json` to enforce code quality and type safety, such as `noExplicitAny`.
  - Run `pnpm lint` to check for violations and `pnpm format` to format the codebase.
