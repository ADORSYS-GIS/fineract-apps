# Tailwind CSS Guide

This guide covers our approach to using Tailwind CSS to ensure styling is consistent and scalable within each application.

## 1. Philosophy: Utility-First

We favor composing utilities directly in JSX over writing custom CSS. This keeps styling co-located with components and avoids a complex, abstract CSS codebase.

## 2. Configuration

- **Location**: Each application under the `frontend/` directory has its own `tailwind.config.mjs` and `postcss.config.mjs` files. This allows for app-specific theme customizations if necessary.
- **Theme**: All theme values (colors, spacing, fonts) are defined within each app's `tailwind.config.mjs`. To maintain consistency, it is recommended to align the theme configuration across all applications.

## 3. Tailwind vs. CSS Modules

- **Tailwind First**: Always try to implement a design with utility classes first.
- **Use CSS Modules When**:
  - Dealing with complex, state-based styling that would be unreadable with conditional utilities.
  - Styling third-party components that don't accept a `className` prop.
  - Applying styles based on dynamic content where utilities are not possible.
  - The component logic involves complex styling that is better encapsulated in a separate CSS file. The `Button.module.css` is a good example of this.

## 4. Theming & Dark Mode

- **CSS Variables**: For theming, a future goal is to define theme colors as CSS variables in a global CSS file.
- **Dark Mode**: The current setup uses Tailwind’s `dark:` variant. A mechanism to toggle a `dark` class on the `<html>` element will be required to enable this functionality across an application.

```html
<!-- Example of dark mode classes -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">...</h1>
</div>
```

## 5. Global Styles

Each application has its own set of global styles defined in files like `src/index.css` and `src/App.css`. These files are suitable for base styles, font definitions, and any styles that need to be applied globally within that specific app.

## 6. Performance & Optimization

- **Purging**: Tailwind CSS automatically removes unused styles in production builds by scanning your template files. Ensure the `content` array in `tailwind.config.mjs` correctly points to all files containing Tailwind classes.
- **Bundle Size**: Avoid adding a large number of custom utilities or base styles, as this can increase the final CSS bundle size.

## 7. Accessibility

- **Focus Rings**: Ensure all interactive elements have visible focus rings. Use Tailwind's `focus-visible` variant.
- **Contrast**: Use tools to check that text has sufficient color contrast against its background, meeting WCAG AA standards.
- **`sr-only`**: For visually hidden labels or text that should be available to screen readers, use the `sr-only` class.
