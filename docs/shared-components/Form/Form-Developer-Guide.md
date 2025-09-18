# Form Component Developer Guide

## Overview

The Form component is a comprehensive, reusable form system built with React, TypeScript, and Zod validation. It provides automatic spacing, type-safe validation, multiple input types, built-in error handling, accessibility features, and customizable styling.

## Getting Started

### Installation
```bash
pnpm add @fineract-apps/ui
```

### Required Dependencies
- `react` (^19.1.1)
- `zod` (^3.23.8) - for validation
- `tailwindcss` - for styling

## Basic Usage

### 1. Form Frame
```tsx
import { Form } from "@fineract-apps/ui";

function MyPage() {
  const handleSubmit = async (values: any) => {
    console.log("Form submitted:", values);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Your form content */}
    </Form>
  );
}
```

### 2. Adding Fields
```tsx
import { Form, Input } from "@fineract-apps/ui";

<Form onSubmit={handleSubmit}>
  <Input
    name="email"
    label="Email Address"
    type="email"
    placeholder="Enter your email"
    helperText="We'll never share your email"
  />
</Form>
```

### 3. Warning Boxes
```tsx
import { FormWarning } from "@fineract-apps/ui";

<FormWarning title="Security Notice">
  Please ensure you're using a secure connection.
</FormWarning>
```

### 4. Submit Buttons
```tsx
import { SubmitButton } from "@fineract-apps/ui";

<SubmitButton label="Submit Form" />
```

## Input Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Standard text input | `<Input name="name" type="text" />` |
| `email` | Email input with validation | `<Input name="email" type="email" />` |
| `password` | Password input (hidden) | `<Input name="password" type="password" />` |
| `number` | Numeric input | `<Input name="age" type="number" />` |
| `textarea` | Multi-line text | `<Input name="message" type="textarea" />` |
| `select` | Dropdown selection | `<Input name="country" type="select" options={...} />` |
| `checkbox` | Single checkbox | `<Input name="agree" type="checkbox" />` |
| `radio` | Radio button group | `<Input name="gender" type="radio" options={...} />` |
| `date` | Date picker | `<Input name="birthday" type="date" />` |

## Input Props

```tsx
interface InputProps {
  name: string;                    // Required: field name
  label?: string;                  // Optional: field label
  type?: InputType;               // Optional: input type (default: "text")
  options?: InputOption[];        // Required for select/radio
  helperText?: string;            // Optional: help text below field
  error?: string;                 // Optional: custom error message
  size?: "sm" | "md" | "lg";     // Optional: field size (default: "md")
  variant?: "outlined" | "filled" | "standard"; // Optional: style variant
  placeholder?: string;           // Optional: placeholder text
  disabled?: boolean;             // Optional: disable field
  required?: boolean;             // Optional: mark as required
}
```

## Form Validation with Zod

### Basic Schema
```tsx
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof schema>;
```

### Common Validation Patterns

**Required Fields:**
```tsx
name: z.string().min(1, "Name is required")
```

**String Length:**
```tsx
password: z.string().min(8, "Password must be at least 8 characters")
```

**Number Validation:**
```tsx
age: z.number().min(18, "Must be at least 18 years old")
```

**Enum/Choice:**
```tsx
role: z.enum(["admin", "user", "guest"], {
  errorMap: () => ({ message: "Please select a valid role" })
})
```

**Password Confirmation:**
```tsx
const schema = z.object({
  password: z.string().min(6),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
```

## Complete Form Example

```tsx
import React from "react";
import { z } from "zod";
import { Form, Input, SubmitButton, FormWarning } from "@fineract-apps/ui";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const initialValues: FormData = {
  name: "",
  email: "",
  message: "",
};

export default function ContactPage() {
  const handleSubmit = async (values: FormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Form submitted:", values);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <Form
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
    >
      <h2>Contact Us</h2>
      
      <FormWarning title="Response Time">
        We typically respond within 24 hours.
      </FormWarning>
      
      <Input
        name="name"
        label="Full Name"
        type="text"
        placeholder="Enter your name"
        required
      />
      
      <Input
        name="email"
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        helperText="We'll use this to respond"
        required
      />
      
      <Input
        name="message"
        label="Message"
        type="textarea"
        placeholder="Tell us more..."
        required
      />
      
      <SubmitButton label="Send Message" />
    </Form>
  );
}
```

## Customization

### Form Styling
```tsx
<Form className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-8">
```

### Input Styling
```tsx
<Input
  name="email"
  size="lg"
  variant="filled"
  className="custom-input-class"
/>
```

### Button Styling
```tsx
<SubmitButton 
  label="Submit"
  variant="primary"
  className="w-full bg-blue-600"
/>
```

### Warning Box Styling
```tsx
<FormWarning 
  title="Custom Warning"
  className="bg-red-50 border-red-200"
>
  Custom warning content
</FormWarning>
```

## Advanced Features

### Manual Form Control
```tsx
import { useForm } from "@fineract-apps/ui";

function CustomForm() {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validationSchema: mySchema,
    onSubmit: handleSubmit,
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        value={form.values.email}
        onChange={(e) => form.setValue("email", e.target.value)}
        onBlur={() => form.validateField("email")}
      />
      {form.errors.email && form.touched.email && (
        <span className="error">{form.errors.email}</span>
      )}
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
```

### Form Context Access
```tsx
import { useFormContext } from "@fineract-apps/ui";

function CustomField() {
  const form = useFormContext();
  
  return (
    <div>
      <p>Form is valid: {form.isValid ? "Yes" : "No"}</p>
      <p>Is submitting: {form.isSubmitting ? "Yes" : "No"}</p>
    </div>
  );
}
```

## Examples

See the `examples/` directory for complete working examples:
- `SimpleForm.tsx` - Basic form with minimal fields
- `LoginForm.tsx` - Authentication form with warning box
- `RegistrationForm.tsx` - Complex registration with all input types
- `SurveyForm.tsx` - Customer feedback form with radio groups
- `ContactForm.tsx` - Contact form with message field

## Troubleshooting

### Common Issues

**TypeScript Errors:**
- Use `z.infer<typeof schema>` for proper types
- Ensure `@fineract-apps/ui` is installed

**Validation Issues:**
- Always provide `validationSchema` prop
- Use `.refine()` for complex validation

**Styling Issues:**
- Ensure Tailwind CSS is configured
- Use `className` prop for custom styles

**Form Submission:**
- Use `SubmitButton` for automatic loading states
- Handle errors in `onSubmit` function

### Performance Tips

1. Keep validation schemas outside components
2. Use `useCallback` for submit handlers in re-rendering components
3. Use `useMemo` for complex initial values
4. Consider form splitting for very large forms

---

This guide covers the essential aspects of using the Form component. For complete examples, see the `examples/` directory. The component is designed to be flexible and powerful while maintaining simplicity for common use cases.