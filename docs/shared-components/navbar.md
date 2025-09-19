# Navbar Component

## Overview
A responsive and customizable navigation bar with support for user info, notifications, and mobile layouts.

## Basic Usage
```tsx
import { Navbar } from "@fineract-apps/ui";
import { Bell, UserCircle } from 'lucide-react';

<Navbar 
  logo={<div>MyApp</div>}
  links={<a href="#">Dashboard</a>}
  notifications={<Bell />}
  userSection={<UserCircle />}
  actions={<button>Logout</button>}
  onToggleMenu={() => {}}
  isMenuOpen={false}
  variant="primary"
  size="md"
/>
```
## Props

### Core
- `logo`: Custom logo or brand name (`ReactNode`).
- `links`: Navigation links (`ReactNode`).
- `notifications`: Notification indicator or component (`ReactNode`).
- `userSection`: Component for user profile and actions (`ReactNode`).
- `actions`: Additional action buttons or elements (`ReactNode`).

### Behavior
- `onToggleMenu`: Function to toggle the mobile menu.
- `isMenuOpen`: Boolean controlling the visibility of the mobile menu.

### Styling
- `variant`: The visual style of the navbar.
  - `default`: Standard navbar with a white background.
  - `primary`: Navbar with a primary theme color background.
  - `transparent`: Navbar with a transparent background.
- `size`: The size of the navbar, affecting padding and text size.
  - `sm`: Small
  - `md`: Medium
  - `lg`: Large
- `className`: Additional CSS classes for custom styling.

---

## Best Practices
- Keep navigation items minimal and focused for clarity.
- Ensure full mobile responsiveness by testing on multiple screen sizes.
- Use ARIA labels and roles to ensure accessibility.
- Maintain consistent styling across your app by using design tokens or `className`.