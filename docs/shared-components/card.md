# Card Component

## Overview
A flexible container for displaying content in a card format with various customization options.

## Basic Usage
```tsx
import { Card } from "@fineract-apps/ui";
import { User } from 'lucide-react';

<Card 
  title="User Profile"
  media={<User size={24} />}
  hoverable
>
  View and edit user profile information
</Card>
```
## Props

### Core

- `title`: Text for the card header (`ReactNode`).
- `children`: Main content (**required**, `ReactNode`).
- `footer`: Optional footer content (`ReactNode`).
- `media`: Icon or image displayed at the top (`ReactNode`).

### Layout

- `background`: Background color class (e.g., `bg-gray-100`).
- `width`: Card width — options: `full` | `half` | `third` | `quarter`.
- `height`: Card height — options: `none` | `sm` | `md` | `lg` | `full`.
- `rounded`: Border radius class (e.g., `rounded-md`).
- `padding`: Inner spacing class (e.g., `p-4`).

### Behavior

- `hoverable`: Enables hover effects (`boolean`).
- `onClick`: Click handler function.
- `loading`: Shows loading state (`boolean`).

---

## Best Practices

- Keep content concise and focused.
- Maintain consistent spacing.
- Ensure high contrast for readability.
- Apply hover effects for interactive cards.
