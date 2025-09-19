# Card Component

## Overview
A flexible and customizable container for displaying content in a card format.

## Basic Usage
```tsx
import { Card } from "@fineract-apps/ui";
import { User } from 'lucide-react';

<Card 
  title="User Profile"
  media={<User size={24} />}
  hoverable
  variant="primary"
  size="md"
>
  View and edit user profile information.
</Card>
```
## Props

### Core
- `title`: Text for the card header (`ReactNode`).
- `children`: Main content (**required**, `ReactNode`).
- `footer`: Optional footer content (`ReactNode`).
- `media`: Icon or image displayed at the top (`ReactNode`).

### Styling
- `variant`: The visual style of the card.
  - `default`: Standard card with a white background.
  - `primary`: Card with a primary theme color background.
  - `transparent`: Card with a transparent background.
- `size`: The size of the card, affecting padding and text size.
  - `sm`: Small
  - `md`: Medium
  - `lg`: Large
- `className`: Additional CSS classes for custom styling.

### Behavior
- `hoverable`: Enables hover effects (`boolean`).
- `onClick`: Click handler function.
- `loading`: Shows a loading state (`boolean`).
- `ariaLabel`: ARIA label for accessibility.

---

## Best Practices
- Keep content concise and focused.
- Maintain consistent spacing and alignment.
- Ensure high contrast for readability, especially with custom variants.
- Apply hover effects for interactive cards to provide clear feedback.
