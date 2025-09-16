# Form Component — Usage Guide

This document explains how to use the reusable **Form** component and helpers we built (green-themed, strongly-typed, accessible). It includes minimal examples, common patterns, validation guidance, customization tips, testing notes, and troubleshooting.

---

## What the package exports

From `packages/ui/src/components/Form` (index):

* `Form<T>()` — top-level form container. Generic over value shape `T`.
* `Input` — flexible field component (text, email, number, textarea, select, checkbox, radio).
* `useFormContext<T>()` — hook to read form state inside children (values, errors, touched, etc.).
* `useForm<T>()` — utility hook (useful for building custom controls or tests).
* `FormWarning` — optional warning/notice block.
* `SubmitButton` — convenience submit button wired to `isSubmitting` state.

Import path examples (adjust to your repo layout):

```ts
import { Form, Input, FormWarning, SubmitButton, useFormContext } from "@fineract-apps/ui/src/components/Form/";
// or relative path when developing: import { Form, Input } from "./components/Form";
```

---

# Quickstart Examples

All examples assume you are using TypeScript + React.

## 1) Get just the frame of the form

If you only need the form container (frame) and will add fields later:

```tsx
import React from "react";
import { Form } from "components/Form";

function MyFormShell() {
  return (
    <Form initialValues={{}} onSubmit={(v) => console.log(v)}>
      {/* no fields yet — frame is rendered with padding, border, and accessibility */}
    </Form>
  );
}
```

Notes:

* `Form` accepts generic type `T` for `initialValues` and `onSubmit`. Use when you want strict typing.
* `Form` adds `noValidate` to the native `<form>` and handles submit via the hook.

## 2) Add a single field to the frame

Add an `Input` and it will automatically bind to form context by `name`:

```tsx
import { Form, Input } from "components/Form";

<Form initialValues={{ email: "" }} onSubmit={(v) => console.log(v)}>
  <Input name="email" label="Email" type="email" helperText="We will never share this" />
</Form>
```

* The `name` must match a key in `initialValues` (for typed protection).
* `Input` reads/writes value via `useFormContext()` internally.

## 3) Add a warning box to the form

Use the `FormWarning` component for the yellow/notice block from the screenshot:

```tsx
import { FormWarning } from "components/Form";

<Form ...>
  {/* fields */}
  <FormWarning title="Requires Manager Approval">
    This action must be reviewed & approved before activation.
  </FormWarning>
</Form>
```

`FormWarning` accepts `title`, `children`, and `className` for small customizations.

## 4) Implement a submit button

Option A — use the provided `SubmitButton`:

```tsx
import { SubmitButton } from "components/Form";

<Form ...>
  {/* fields */}
  <SubmitButton label="Submit for Approval" />
</Form>
```

Option B — make your own button and read `isSubmitting` via `useFormContext()`:

```tsx
import { useFormContext } from "components/Form";

function MySubmit() {
  const form = useFormContext();
  return (
    <button type="submit" disabled={form.isSubmitting}>
      {form.isSubmitting ? "Submitting…" : "Submit"}
    </button>
  );
}
```

Notes:

* `Form` will call the `onSubmit` you provide with the typed `values` object when validation passes.
* On submit the hook marks all fields `touched` and runs `validateForm()`.

---

# Validation: guidelines & examples

Validation is intentional and flexible: you pass a `validationSchema` object to `Form` where each key is a field name and the value is a validator function.

**Type:**

```ts
type ValidationFn<T> = (value: T[keyof T] | undefined, values?: T) => string | undefined;
```

## Starting from scratch — simple patterns

1. **Required field**

```ts
const required = (v: unknown) => (!v || (typeof v === 'string' && v.trim() === '') ? 'Required' : undefined);
```

2. **Min length**

```ts
const minLength = (n: number) => (v: unknown) =>
  typeof v === 'string' && v.length < n ? `Must be at least ${n} characters` : undefined;
```

3. **Email**

```ts
const email = (v: unknown) => {
  const s = typeof v === 'string' ? v : '';
  if (!s) return 'Required';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? undefined : 'Invalid email';
};
```

4. **Cross-field validation (password confirmation)**

```ts
const confirmPassword = (v: unknown, values?: MyFormValues) => {
  if (!v) return 'Required';
  return v === values?.password ? undefined : 'Passwords must match';
};
```

5. **Complex rules**

* Compose validators: return first failing message.
* For async validation you'd call an API in the `onSubmit` or build an async validator then adapt the hook — current hook expects synchronous validators.

## Example validation schema (typed)

```ts
type SignupValues = { username: string; email: string; password: string; confirmPassword: string };
const validationSchema: Partial<Record<keyof SignupValues, ValidationFn<SignupValues>>> = {
  username: (v) => (!v ? 'Required' : undefined),
  email: emailValidator,
  password: (v) => required(v) ?? minLength(8)(v),
  confirmPassword: (v, values) => required(v) ?? (v === values?.password ? undefined : 'Passwords must match'),
};
```

**Tip:** keep validators small and composable. Compose with helper functions (`required`, `minLength`, etc.).

---

# Using the form from another file (page)

**Typical file layout:**

```
src/pages/RegisterPage.tsx
packages/ui/src/components/Form (your reusable package)
```

**Imports in the page:**

```tsx
import React from 'react';
import { Form, Input, FormWarning, SubmitButton } from 'components/Form';
// or from your published package: import { Form } from '@your-scope/ui';
```

**Example page usage**

```tsx
import { Form, Input, SubmitButton } from 'components/Form';

export default function RegisterPage() {
  return (
    <Form initialValues={{ username: '' }} onSubmit={(v) => console.log('submit', v)}>
      <Input name="username" label="Username" />
      <SubmitButton />
    </Form>
  );
}
```

**What to import for each feature:**

* Frame only: `Form`
* Single fields: `Input`
* Warning block: `FormWarning`
* Submit button (convenience): `SubmitButton`
* Custom controls reading form state: `useFormContext`
* Create custom form logic: `useForm`

---

# Customization

The components use utility class names (Tailwind-style), but you can customize via `className` or `theme`/`variant`/`size` props on `Input`.

## Colors / Styling approaches

1. **Tailwind users** — change color tokens in your `tailwind.config.js` (recommended):

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        green: {
          600: '#16a34a',
          700: '#15803d',
        }
      }
    }
  }
}
```

2. **Class override** — pass `className` on container children or wrap `Form` with a styled container:

```tsx
<Form className="bg-gray-50 p-8 border-green-200">
  ...
</Form>
```

3. **Custom Submit Button styling** — either pass `className` to `SubmitButton` or render your own and use `useFormContext()`:

```tsx
<SubmitButton className="bg-emerald-500 hover:bg-emerald-600" />
// or
const form = useFormContext();
<button className={`btn ${form.isSubmitting ? 'disabled' : 'primary'}`} type="submit">Send</button>
```

4. **Switch from Tailwind to plain CSS** — copy the utility classes into a CSS file (or convert to CSS module) and update class names used in component files.

---

# Accessibility & Best Practices

* Inputs expose `aria-invalid` and `aria-describedby` when errors exist.
* Errors render with `role="alert"` to notify assistive tech.
* Labels are associated with inputs via `htmlFor` + `id`.
* The hook marks all fields as `touched` on submit so validators only show after user interaction.

**Tips**:

* Provide helpful `helperText` when the input format might be ambiguous (eg. date format).
* For complex inputs (date pickers, currency), wrap the control and read/write via `useFormContext().setValue(name, value)`.

---

# Testing the Form

We provided an integration test example (`RegistrationForm.test.tsx`) which simulates user events using `@testing-library/react`.

**Test patterns**:

* `fireEvent.change(screen.getByLabelText(/email/), { target: { value } })` to change inputs.
* `fireEvent.click(screen.getByRole('button', { name: /register/i }))` to submit.
* Assert submit callback called with the expected typed payload.
* Assert validators by checking `getByRole('alert')` text.

If your testing environment uses `userEvent`, prefer that for more realistic tests.

---

# Lint & runtime suggestions

* If your linter flags prototype built-in usage (`hasOwnProperty`), we recommend a tiny helper `hasOwn(obj, prop)` that uses `Object.hasOwn` with a safe fallback. Keep this helper in `useForm.ts` and reuse whenever clearing keyed objects.

* The context is created at runtime as a non-generic; components cast it to the generic `FormContextType<T>` when consumed. This is safe and a common pattern for typed React contexts.

---

# Advanced: building custom controls

To create a control that isn't `Input` (e.g., an autocomplete, a datepicker, or currency input):

1. Use `useFormContext<T>()` to read/write values and validation functions:

```tsx
import { useFormContext } from 'components/Form';

function MyDatePicker({ name }: { name: keyof MyValues }) {
  const form = useFormContext<MyValues>();
  const value = form.values[name];
  return (
    <ThirdPartyDatePicker
      value={value as string}
      onChange={(v) => form.setValue(name, v)}
      onBlur={() => form.validateField(String(name))}
    />
  );
}
```

2. Keep validators small and reuse them. If validation is expensive or async, you can perform the check in `onSubmit` instead and surface server errors with `form.setError(field, message)`.

---

# FAQ

**Q: Can validators be async?**
A: The current `useForm` expects synchronous validators. For async validation (unique username check), run that check in `onSubmit` and call `setError()` if the server returns an error.

**Q: How do I reset the form?**
A: Use `useFormContext()` and call `reset()` or expose a `Reset` button calling `form.reset()`.

**Q: How to handle nested objects?**
A: The current implementation keys errors by string keys. For nested objects use string paths (e.g., `address.street`) and utilities to set/get nested values, or extend the hook to support deep structures.

**Q: Can I change when validation runs?**
A: Currently the hook validates on blur for fields individually and validates all fields on submit. You can change this behavior by customizing `Input` to call `validateField` at different times or by modifying the hook.

---

# Appendix: Example full small form (reference)

See the `RegistrationForm.tsx` file in the example folder for a working example with realistic validators and the accompanying `RegistrationForm.test.tsx` that exercises it.

You can import the registration form using
```
import RegistrationForm from "@fineract-apps/ui/src/components/Form/example/RegistrationForm";
```

---

