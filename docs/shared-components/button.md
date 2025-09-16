# Shared Button Component

This document provides a comprehensive guide to the shared `Button` component located in the `@fineract-apps/ui` package.

---

## 1. Developer Guide

This section is for developers who want to use the `Button` component in their applications.

### How to Use

To use the button, import it from `@fineract-apps/ui` and include it in your component.

```tsx
import { Button } from "@fineract-apps/ui";

const MyComponent = () => {
  return <Button>Click me</Button>;
};
```

### Props

The `Button` component accepts the following props to control its appearance and behavior.

#### Variant

The `variant` prop changes the button's visual style. The default is `default`.

| Variant | Description |
| :--- | :--- |
| `default` | The standard, primary button. |
| `destructive` | A red button for dangerous actions (e.g., delete). |
| `outline` | A transparent button with a border. |
| `secondary` | A light gray button for secondary actions. |
| `ghost` | A transparent button with no border. |
| `link` | A button that looks like a link. |

**Example:**
```tsx
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

#### Size

The `size` prop controls the button's size. The default is `default`.

| Size | Description |
| :--- | :--- |
| `default` | The standard size. |
| `sm` | A smaller button. |
| `lg` | A larger button. |

**Example:**
```tsx
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

#### Loading State

The `isLoading` prop puts the button into a disabled loading state and displays a spinner.

**Example:**
```tsx
<Button isLoading>Loading...</Button>
```

### Examples

You can combine these props to create the exact button you need.

```tsx
// A large, destructive button
<Button variant="destructive" size="lg">Confirm Deletion</Button>

// A small, secondary button in a loading state
<Button variant="secondary" size="sm" isLoading>Saving...</Button>
```

### Responsiveness

The Button component is fully responsive. You can use Tailwind's responsive utility classes (like `md:`, `lg:`, etc.) directly in the `className` prop to change the button's styles at different screen sizes.

Here are a few common examples:

**1. Full-width on Mobile, Fixed-width on Desktop**

This is a common pattern for buttons in forms.

```tsx
<Button className="w-full md:w-auto">Submit</Button>
```

**2. Icon-only on Mobile, Icon and Text on Desktop**

This saves space on small screens. You can use a `<span>` with responsive display classes for the text.

```tsx
import { Check } from "lucide-react";

<Button>
  <Check className="h-4 w-4" />
  <span className="hidden md:inline md:ml-2">Approve</span>
</Button>
```

**3. Different Padding on Different Screen Sizes**

You can override the default padding of a size variant to make a button more touch-friendly on smaller screens.

```tsx
<Button size="lg" className="px-4 md:px-8">
  Get Started
</Button>
```

---

## 2. Technical Guide

This section is for developers who need to understand, maintain, or modify the `Button` component itself.

### Overview

The `Button` is a reusable component built with React and styled with Tailwind CSS. It follows the project's "Container/Hook/View" pattern to separate logic from presentation.

It leverages a **semantic color theming system** defined in `packages/ui/src/styles.css`. This means the button uses color tokens (e.g., `bg-primary`, `text-foreground`) that describe the *purpose* of the color rather than its literal value. This approach ensures consistency, maintainability, and easy rebranding across the application.

### Dependencies

The component relies on a few key libraries:

- **`class-variance-authority`**: Manages the button's style variants (like `variant` and `size`).
- **`clsx` & `tailwind-merge`**: Utilities for conditionally combining and merging Tailwind CSS classes.
- **`lucide-react`**: Provides the loading spinner icon.

### Folder Structure

The component's code is organized in the `packages/ui/src/components/Button/` directory:

```
/Button
├── Button.test.tsx     # Unit tests
├── Button.types.ts     # TypeScript type definitions
├── Button.view.tsx     # The presentational component (View)
├── index.tsx           # The main component entry file (Container)
└── useButton.ts        # Logic and state management (Hook)
```

### File Breakdown

- **`Button.view.tsx`**: This is the core presentational component. It uses `cva` (from `class-variance-authority`) to define all the CSS classes for the different variants and sizes. Crucially, it uses our **semantic color tokens** (e.g., `bg-primary`, `text-primary-foreground`, `border-border`) which are defined in `packages/ui/src/styles.css`. This decouples the component's styling from specific color values, making it highly themeable. It also handles the logic for displaying the `Loader2` icon when `isLoading` is true.

- **`Button.types.ts`**: Defines the `ButtonProps` interface. It extends the standard React button attributes and adds our custom props like `variant`, `size`, and `isLoading` by using `VariantProps<typeof buttonVariants>`.

- **`index.tsx`**: This is the public face of the component. It follows the container pattern, taking all the props and passing them down to the `ButtonView`.

- **`useButton.ts`**: This hook is currently empty but is in place to hold any future business logic, state, or event handlers, keeping the `Button.view.tsx` file clean and focused on presentation.

- **`Button.test.tsx`**: Contains unit tests written with React Testing Library. It verifies that the button renders correctly, applies the right classes for each variant, and behaves as expected in the loading state.

### How to Modify

- **To Add a New Variant**:
  1.  Open `Button.view.tsx`.
  2.  Add a new key to the `variant` object inside the `buttonVariants` definition with the required Tailwind CSS classes.
  3.  Your new variant will automatically be available via the `variant` prop.

- **To Add New Logic** (e.g., a new state):
  1.  Open `useButton.ts`.
  2.  Add your state management (`useState`) or event handlers here.
  3.  Return the new values or functions from the hook.
  4.  The `index.tsx` file will pass these down to the `ButtonView` where they can be used.
