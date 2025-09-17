# Form Component — Developer Guide

This document provides a comprehensive guide to using the refactored `Form` component. The new architecture emphasizes simplicity, type-safety, and ease of customization.

---

## Core Concepts

The `Form` component is built around a few key concepts:

-   **`useForm` Hook**: A powerful, generic hook that manages form state, validation, and submission logic. It uses a reducer for predictable state management.
-   **`Form` Component**: A thin wrapper around a standard `<form>` element that provides a context for its children.
-   **`Input` Component**: A versatile component for various input types, now with its logic separated for clarity.
-   **Strong Typing**: All parts of the form are strongly typed to prevent common errors and improve developer experience.

---

## API Reference

### `useForm<T>`

The `useForm` hook is the core of the `Form` component.

**Props:**

-   `initialValues`: `T` - An object containing the initial values for the form fields.
-   `validationSchema`: `ValidationSchema<T>` - An object where keys are field names and values are validation functions.
-   `onSubmit`: `(values: T) => void | Promise<void>` - A function to be called when the form is submitted and valid.

**Return Value:**

An object with the following properties:

-   `values`: `T` - The current values of the form fields.
-   `errors`: `Partial<Record<keyof T & string, string>>` - An object containing validation errors.
-   `touched`: `Partial<Record<keyof T & string, boolean>>` - An object tracking which fields have been touched.
-   `isSubmitting`: `boolean` - `true` if the form is currently submitting.
-   `isValid`: `boolean` - `true` if the form is valid.
-   `setValue`: `<K extends keyof T>(name: K, value: T[K]) => void` - A function to set the value of a field.
-   `setError`: `(name: keyof T & string, error?: string) => void` - A function to set the error of a field.
-   `validateField`: `(name: keyof T & string, value?: T[keyof T]) => string | undefined` - A function to validate a single field.
-   `validateForm`: `() => boolean` - A function to validate the entire form.
-   `handleSubmit`: `(e: React.FormEvent<HTMLFormElement>) => Promise<void>` - The form submission handler.
-   `reset`: `() => void` - A function to reset the form to its initial state.

### `Form<T>`

The main form component.

**Props:**

-   Accepts all props from `useForm` and standard `<form>` attributes.
-   `children`: `React.ReactNode` - The content of the form, typically `Input` components.

### `Input`

A flexible input component.

**Props:**

-   `name`: `string` - The name of the field, corresponding to a key in `initialValues`.
-   `label`: `string` - The label for the input.
-   `type`: `InputType` - The type of input (e.g., `"text"`, `"email"`, `"checkbox"`).
-   `options`: `InputOption[]` - An array of options for `select` or `radio` inputs.
-   `helperText`: `string` - Text to display below the input.
-   ...and other standard input attributes.

---

## Quickstart Example

Here's a simple example of how to use the `Form` component:

```tsx
import React from "react";
import { Form, Input, SubmitButton } from "@fineract-apps/ui";

const MyForm = () => {
	const initialValues = { email: "", password: "" };

	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Form initialValues={initialValues} onSubmit={handleSubmit}>
			<Input name="email" label="Email" type="email" />
			<Input name="password" label="Password" type="password" />
			<SubmitButton label="Log In" />
		</Form>
	);
};
```

---

## Validation

Validation is handled by the `validationSchema` prop. Each validation function receives the field's value and all form values, and should return an error message string or `undefined` if the value is valid.

```tsx
const validationSchema = {
	email: (value) => {
		if (!value) {
			return "Required";
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			return "Invalid email address";
		}
		return undefined;
	},
	password: (value) => {
		if (!value) {
			return "Required";
		}
		if (value.length < 8) {
			return "Password must be at least 8 characters";
		}
		return undefined;
	},
};
```

---

## Customization

The `Form` and `Input` components can be customized using `className` props, which will be merged with the default styles.

For more advanced customizations, you can build your own input components using the `useFormContext` hook to access the form's state and methods.
