# Form Component Developer Guide

## Overview

The Form component is a powerful, reusable form system built on top of **Formik**. It leverages Formik for robust state management and **Zod** for type-safe validation. This combination provides a seamless developer experience for creating complex forms with minimal boilerplate.

Key features include:
-   **Powered by Formik:** Manages form state, submission, and validation lifecycle.
-   **Zod Validation:** Write schemas once for both type safety and validation.
-   **Reusable Inputs:** A single `<Input />` component for all standard HTML input types.
-   **Automatic State Handling:** `<SubmitButton />` automatically tracks submission status.
-   **Styled and Accessible:** Clean UI with accessibility in mind.

## Getting Started

### Installation
The Form component is part of the main UI library.

```bash
pnpm add @fineract-apps/ui
```

### Required Dependencies
Ensure your project has the following peer dependencies installed:

-   `react`
-   `formik`
-   `zod`
-   `zod-formik-adapter` (to connect Zod schemas to Formik)
-   `tailwindcss` (for styling)

## Basic Usage

Here's a simple example of a login form.

```tsx
import React from "react";
import { z } from "zod";
import { Form, Input, SubmitButton } from "@fineract-apps/ui";

// 1. Define a validation schema with Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// 2. Infer the type from the schema for type safety
type LoginFormData = z.infer<typeof loginSchema>;

const initialValues: LoginFormData = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const handleSubmit = (values: LoginFormData) => {
    console.log("Form submitted:", values);
    // Handle API submission logic here
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  return (
    // 3. Wrap your inputs with the Form component
    <Form
      initialValues={initialValues}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      <h2>Login</h2>
      <Input
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
      />
      <Input
        name="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
      />
      <SubmitButton label="Log In" />
    </Form>
  );
}
```

## Core Components

### `<Form />`
The main wrapper that provides the Formik context to all child components.

| Prop               | Type                               | Description                                             |
| ------------------ | ---------------------------------- | ------------------------------------------------------- |
| `initialValues`    | `object`                           | **Required.** The initial values of your form fields.   |
| `validationSchema` | `z.ZodSchema`                      | A Zod schema used for validation.                       |
| `onSubmit`         | `(values: T) => void \| Promise<any>` | **Required.** A function to handle form submission.     |

### `<Input />`
A versatile component that renders the appropriate input field based on the `type` prop. It automatically connects to the Formik state via its `name` prop.

| Prop         | Type                                       | Description                                                                 |
| ------------ | ------------------------------------------ | --------------------------------------------------------------------------- |
| `name`       | `string`                                   | **Required.** The field name. Must match a key in `initialValues`.          |
| `label`      | `string`                                   | The label displayed for the input.                                          |
| `type`       | `string`                                   | Input type, e.g., `text`, `email`, `password`, `select`, `checkbox`, `radio`. |
| `options`    | `{ label: string, value: any }[]`          | **Required for `select` and `radio` types.** The options to display.        |
| `helperText` | `string`                                   | Text displayed below the input to guide the user.                           |
| `size`       | `"sm" \| "md" \| "lg"`                     | The visual size of the input (default: `md`).                               |
| `variant`    | `"outlined" \| "filled" \| "standard"`     | The visual style of the input (default: `outlined`).                        |

### `<SubmitButton />`
A button that is automatically aware of the form's submission state. It will be disabled and show a loading indicator while the `onSubmit` function is pending.

| Prop      | Type     | Description                               |
| --------- | -------- | ----------------------------------------- |
| `label`   | `string` | The text to display on the button.        |
| `variant` | `string` | The button's visual style (e.g., `primary`). |

### `<FormWarning />`
A styled component to display important notices or warnings within a form.

| Prop       | Type     | Description                        |
| ---------- | -------- | ---------------------------------- |
| `title`    | `string` | The title of the warning box.      |
| `children` | `node`   | The content/message of the warning. |

## Advanced Usage

### Accessing Formik State with `useFormContext`
In some cases, you may need to access the Formik state from a child component (e.g., to conditionally render fields). The `useFormContext` hook (which is an alias for Formik's `useFormikContext`) provides access to the full Formik bag of properties and helpers.

```tsx
import { useFormContext } from "@fineract-apps/ui";

function CharacterCount() {
  const { values } = useFormContext<{ message: string }>();
  const count = values.message.length;

  return <p>Character count: {count}</p>;
}

// Inside your form:
<Form {...props}>
  <Input name="message" type="textarea" />
  <CharacterCount />
  <SubmitButton />
</Form>
```

## Customization
You can pass a `className` prop to any of the Form components to apply custom Tailwind CSS classes for styling overrides.

**Styling the Form container:**
```tsx
<Form className="max-w-lg p-8 bg-gray-50">
  {/* ... */}
</Form>
```

**Styling an Input:**
```tsx
<Input
  name="email"
  size="lg"
  variant="filled"
  className="rounded-full"
/>
```

## Examples
For complete, working examples of different forms, please see the `examples/` directory.
- `SimpleForm.tsx`
- `LoginForm.tsx`
- `RegistrationForm.tsx`
- `ContactForm.tsx`