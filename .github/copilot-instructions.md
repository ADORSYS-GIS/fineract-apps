# Fineract-apps Copilot Instructions

This document provides guidance for AI coding agents to effectively contribute to the `fineract-apps` repository.

## Project Overview

This is a monorepo for modern frontend applications built with Vite, React, TypeScript, and Tailwind CSS. The project is structured as a pnpm workspace.

-   `frontend/`: Contains the individual React applications (`account-manager-app`, `branch-manager-app`, `cashier-app`).
-   `packages/`: Contains shared code, including:
    -   `ui`: A shared component library.
    -   `config`: Shared configurations for tools like TypeScript and Vite.

## Key Technologies

-   **Build Tool**: Vite
-   **Framework**: React with TypeScript
-   **Styling**: Tailwind CSS
-   **Package Manager**: pnpm with workspaces
-   **Code Quality**: Biome (for linting and formatting)
-   **Git Hooks**: Husky and commitlint

## Development Workflow

### Getting Started

1.  Install dependencies from the root of the project:
    ```bash
    pnpm install
    ```

2.  Run a specific application's development server:
    ```bash
    pnpm --filter <app-name> dev
    ```
    For example, to run `account-manager-app`:
    ```bash
    pnpm --filter account-manager-app dev
    ```

### Building

To build all applications and packages:

```bash
pnpm build
```

To build a specific application:

```bash
pnpm --filter <app-name> build
```

### Testing

Tests are written with Jest and React Testing Library. Test files are located alongside the components they test (e.g., `Component.test.tsx`).

Run all tests:

```bash
pnpm test
```

### Code Quality

-   **Linting and Formatting**: This project uses Biome.
    -   Check for issues: `pnpm lint`
    -   Format code: `pnpm format`
-   **Commit Messages**: Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This is enforced by a `commit-msg` hook.

## Architectural Patterns

-   **Shared UI Components**: Reusable UI components are located in `packages/ui/src/components`. When creating a new component that might be used across multiple applications, it should be added here.
-   **Shared Configuration**: Base configurations for TypeScript (`tsconfig.base.json`) and Vite (`vite.config.base.js`) are in `packages/config`. Application-specific configurations extend these base configs.
-   **Monorepo Structure**: The use of pnpm workspaces allows for easy management of dependencies and inter-package linking. When adding a dependency to a specific app, use the `--filter` flag with `pnpm add`.

## Important Files

-   `pnpm-workspace.yaml`: Defines the workspaces in the monorepo.
-   `biome.json`: Configuration for the Biome toolchain.
-   `packages/ui/src/index.ts`: The entry point for the shared UI component library.
-   `frontend/*/vite.config.ts`: Vite configuration for each application, which extends the base configuration.

## Component Development Best Practices

### Reusable Component Architecture

When developing shared components in `packages/ui/src/components`, follow these proven patterns:

#### 1. **File Structure Pattern**
```
ComponentName/
├── index.tsx                  # Main component export
├── ComponentName.types.ts     # TypeScript interfaces
├── ComponentName.styles.ts    # Tailwind variants with CVA
├── ComponentName.view.tsx     # Presentational component
├── useComponentName.ts        # Custom hooks (if needed)
├── ComponentName.test.tsx     # Comprehensive test suite
└── ComponentName.stories.tsx  # Storybook stories (optional)
```

#### 2. **TypeScript Best Practices**
- Use `Readonly<>` wrapper for all component props to enforce immutability
- Define strict interfaces with proper JSDoc documentation
- Use union types for variants (e.g., `"default" | "withButton"`)
- Export all types from the main component file for external use

#### 3. **Testing Strategy**
- Aim for **98%+ code coverage** on shared components
- Test all user interactions (click, keyboard, focus)
- Test error scenarios and edge cases
- Use `@testing-library/react` patterns for accessibility testing
- Include tests for:
  - Rendering with different props
  - User interactions
  - Async behavior
  - Error handling
  - Accessibility features

#### 4. **Accessibility Standards**
- Follow WAI-ARIA guidelines strictly
- Implement proper keyboard navigation
- Use semantic HTML elements
- Include ARIA labels and descriptions
- Test with screen readers
- Support focus management
- Use `downshift` for complex interactive components

#### 5. **Performance Optimization**
- Use React.memo for expensive components
- Implement proper debouncing for search/input components
- Use AbortController for canceling async requests
- Minimize re-renders with useCallback and useMemo
- Handle cleanup properly in useEffect

#### 6. **Styling with Tailwind & CVA**
- Use `class-variance-authority` (CVA) for component variants
- Create reusable style variants in separate `.styles.ts` files
- Use `cn()` utility for conditional class merging
- Follow consistent spacing and sizing patterns
- Support responsive design by default

#### 7. **Code Quality & SonarQube Compliance**
- Keep **cognitive complexity** under 15 per function
- Keep **cyclomatic complexity** under 10 per function  
- Extract helper functions/components to reduce complexity
- Use meaningful variable and function names
- Add proper JSDoc comments for complex logic
- Handle all error scenarios gracefully

#### 8. **Documentation Standards**
- Create comprehensive markdown documentation in `docs/shared-components/`
- Include:
  - Component overview and features
  - Complete props table with types and descriptions
  - Multiple usage examples
  - Accessibility notes
  - Common patterns and best practices
- Use TypeScript examples in documentation
- Keep examples up-to-date with actual component API

### Example: SearchBar Component Implementation

The SearchBar component serves as a reference implementation showcasing all best practices:

- **98.01% test coverage** with 30 comprehensive test cases
- **Full accessibility** with ARIA support and keyboard navigation
- **Performance optimized** with debouncing and request cancellation
- **Type safe** with strict TypeScript interfaces
- **SonarQube compliant** with extracted helper functions for complexity reduction
- **Comprehensive documentation** with multiple usage examples
- **Flexible API** supporting both sync and async suggestions

Key implementation techniques used:
- Custom hooks for complex logic (`useSearchBar`)
- Component composition for complexity reduction
- Proper error handling with AbortController
- Debounced input with custom hook
- Accessible dropdown with Downshift
- CVA for style variants
- Comprehensive test coverage

### Quality Gates & CI/CD

All shared components must pass:
- ✅ **Jest tests** with 95%+ coverage
- ✅ **Biome linting** with no errors
- ✅ **TypeScript compilation** with strict mode
- ✅ **SonarQube quality gates** (complexity, coverage, duplicates)
- ✅ **Accessibility testing** with appropriate ARIA attributes
- ✅ **Visual regression tests** (when applicable)
