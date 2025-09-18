# Form Component Examples

This directory contains practical examples of how to use the Form component in different scenarios. Each example demonstrates specific features and use cases.

## Available Examples

### 1. SimpleForm.tsx
**Purpose**: Basic form with minimal fields
**Features**:
- Text input
- Email input with validation
- Number input with validation
- Basic Zod validation schema

**Use Case**: Perfect for getting started with the Form component

### 2. LoginForm.tsx
**Purpose**: User authentication form
**Features**:
- Email and password fields
- FormWarning component
- Checkbox for "Remember me"
- Password validation

**Use Case**: Login pages, authentication flows

### 3. RegistrationForm.tsx
**Purpose**: User registration with comprehensive validation
**Features**:
- Multiple input types (text, email, password, date, select, radio, checkbox)
- Complex validation with password confirmation
- Grid layout for name fields
- Terms acceptance requirement

**Use Case**: User registration, account creation

### 4. SurveyForm.tsx
**Purpose**: Customer feedback collection
**Features**:
- Radio button groups
- Textarea for feedback
- Optional fields
- Checkbox inputs

**Use Case**: Customer surveys, feedback forms

### 5. ContactForm.tsx
**Purpose**: Contact and support forms
**Features**:
- FormWarning for response time
- Textarea for messages
- Newsletter subscription option
- Professional layout

**Use Case**: Contact pages, support forms

## How to Use These Examples

### Import Individual Forms
```tsx
import { LoginForm, RegistrationForm } from "./examples";
```

### Import All Examples
```tsx
import { 
  LoginForm, 
  RegistrationForm, 
  SurveyForm, 
  ContactForm, 
  SimpleForm 
} from "./examples";
```

### Use in Your App
```tsx
function MyPage() {
  return (
    <div>
      <h1>Form Examples</h1>
      <LoginForm />
    </div>
  );
}
```

## Viewing the Examples

To see all examples in action, run the development server:

```bash
pnpm dev
```

Then open your browser to see the interactive form examples with:
- Real-time validation
- Error handling
- Loading states
- Form submission simulation

## Customization

Each example can be customized by:
- Modifying the validation schema
- Changing initial values
- Adding or removing fields
- Customizing styling with className props
- Modifying the submit handler

## Best Practices Demonstrated

1. **Type Safety**: All examples use TypeScript with proper type inference
2. **Validation**: Comprehensive Zod schemas with helpful error messages
3. **Accessibility**: Proper labels, ARIA attributes, and error handling
4. **User Experience**: Loading states, helpful text, and clear validation
5. **Code Organization**: Clean separation of concerns and reusable patterns

## Next Steps

1. Copy the example that best fits your use case
2. Modify the validation schema for your specific requirements
3. Update the initial values and field configurations
4. Customize the styling to match your design system
5. Implement your actual submission logic in the handleSubmit function
