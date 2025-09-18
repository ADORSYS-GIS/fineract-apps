# Form Component Developer Guide

This guide provides a comprehensive overview of the `Form` component, its features, and how to use it effectively in your application.

## Getting Started

### Basic Form Structure

To create a form, you need to wrap your input fields with the `Form` component. The `Form` component requires three essential props: `initialValues`, `validationSchema`, and `onSubmit`.

-   `initialValues`: An object that defines the initial state of your form fields.
-   `validationSchema`: A Zod schema that defines the validation rules for your form.
-   `onSubmit`: A function that is called when the form is submitted and the data is valid.

Here's how to get the basic frame of the form:

```tsx
import { Form } from "@fineract-apps/ui";
import { z } from "zod";

const MyForm = () => {
	const handleSubmit = (values) => {
		console.log(values);
	};

	return (
		<Form
			initialValues={{}}
			validationSchema={z.object({})}
			onSubmit={handleSubmit}
		>
			{/* Your form fields will go here */}
		</Form>
	);
};
```

### Adding a Single Field

To add a field to your form, use the `Input` component. It requires a `name` prop that corresponds to a key in your `initialValues` and `validationSchema`.

```tsx
<Input name="username" label="Username" type="text" />
```

### Adding a Warning Box

You can add a warning box to your form using the `FormWarning` component. This is useful for displaying important information or alerts to the user.

```tsx
<FormWarning title="Important Notice">
	Please review your information carefully before submitting.
</FormWarning>
```

### Implementing a Submit Button

The `SubmitButton` component provides a convenient way to add a submit button to your form. It automatically handles the form's submission state, displaying a loading indicator when the form is being processed.

```tsx
<SubmitButton label="Submit Form" />
```

## Form Validation

Form validation is handled using Zod, a powerful and flexible schema validation library. You define your validation rules in a Zod schema and pass it to the `validationSchema` prop of the `Form` component.

### Creating a Validation Schema

Here's an example of how to create a validation schema for a simple login form:

```tsx
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Please enter a valid email address."),
	password: z.string().min(8, "Password must be at least 8 characters long."),
});
```

### Displaying Validation Errors

Validation errors are automatically displayed below each input field when the user interacts with the form.

## Using the Form in Your Application

To use the `Form` component in your application, you need to import it and its related components from the `@fineract-apps/ui` package.

### Necessary Imports

Here are the essential imports for creating a form:

```tsx
import { Form, Input, SubmitButton, FormWarning } from "@fineract-apps/ui";
import { z } from "zod";
```

For each feature, you'll need the following imports:

-   **Input Field**: `Input`
-   **Submit Button**: `SubmitButton`
-   **Warning Box**: `FormWarning`

## Customization

### Styling and Theming

The `Form` component and its sub-components are styled using Tailwind CSS. You can customize the appearance of the form by overriding the default styles with your own utility classes.

### Customizing Button Colors

The `SubmitButton` component is built on top of the `Button` component, which means you can customize its appearance using the same props. For example, you can change the button's color by passing a `variant` prop:

```tsx
<SubmitButton label="Submit" variant="primary" />
```

This developer guide provides a solid foundation for using the `Form` component. For more advanced use cases and customizFormik and Zod.ation options, refer to the source code and the documentation for the underlying libraries, such as 