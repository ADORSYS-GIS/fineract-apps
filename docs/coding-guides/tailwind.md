# Tailwind CSS Guide

This guide covers our approach to using Tailwind CSS to ensure styling is consistent, scalable, and performant.

## 1. Philosophy: Utility-First

We favor composing utilities directly in JSX over writing custom CSS. This keeps styling co-located with components and avoids a complex, abstract CSS codebase.

## 2. `tailwind.config.js`

- **Location**: Each app will have its own `tailwind.config.js`, but it should `require()` a shared base configuration from `packages/ui` to ensure consistency.
- **Theme**: All theme values (colors, spacing, fonts) are defined in the shared theme file. Use semantic names (`bg-primary`, `text-accent`).
- **Extending**: Add custom utilities or variants using the `plugins` array in the config.

## 3. Tailwind vs. CSS Modules

- **Tailwind First**: Always implement a design with utility classes first.
- **Use CSS Modules When**:
  - Dealing with complex, state-based styling that would be unreadable with conditional utilities (`clsx`).
  - Styling third-party components that don't accept a `className` prop.
  - Applying styles based on dynamic content where utilities are not possible.

## 4. Theming & Dark Mode

- **CSS Variables**: Define theme colors as CSS variables in a global CSS file.
- **Dark Mode**: Use Tailwind’s `dark:` variant for dark mode styles. A `useTheme` hook connected to our Zustand store will toggle a `dark` class on the `<html>` element.

```html
<!-- App.tsx -->
<html className={theme}>
  ...
  <div class="bg-white dark:bg-gray-900">
    <h1 class="text-gray-900 dark:text-white">...</h1>
  </div>
</html>
```

## 5. Globals and Directory Structure

- A single `globals.css` file will reside in `packages/ui/src/styles/`.
- This file will contain base styles, CSS variable definitions, and any `@apply` directives for truly global classes.
- Each application will import this global stylesheet in its root layout file.

## 6. Performance & Optimization

- **Purging**: Tailwind CSS automatically removes unused styles in production builds by scanning your template files. Ensure the `content` array in `tailwind.config.js` correctly points to all files containing Tailwind classes.
- **Bundle Size**: Avoid adding a large number of custom utilities or base styles, as this can increase the final CSS bundle size.

## 7. Accessibility

- **Focus Rings**: Ensure all interactive elements have visible focus rings. Use Tailwind's `focus-visible` variant.
- **Contrast**: Use tools to check that text has sufficient color contrast against its background, meeting WCAG AA standards.
- **`sr-only`**: For visually hidden labels or text that should be available to screen readers, use the `sr-only` class.

## 8. Testing Styles

- While we don't test CSS properties directly, we can test that the correct classes are applied based on component props or state.
- Use `toHaveClass()` from `@testing-library/jest-dom` to assert that an element has the expected Tailwind utility classes.