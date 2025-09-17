# Navbar Component

## Overview
Responsive navigation bar with user info, notifications, and mobile support.

## Basic Usage
```tsx
import { Navbar } from "@fineract-apps/ui";

<Navbar 
  userName="John Doe"
  userId="user123"
  onLogout={handleLogout}
  onToggleMenu={toggleMenu}
  isMenuOpen={isMenuOpen}
  notifications={3}
/>
```
## Props

### Required

- `userName`: User's display name
- `userId`: User identifier
- `onLogout`: Logout handler function
- `onToggleMenu`: Function to toggle mobile menu
- `isMenuOpen`: Boolean controlling visibility of mobile menu

### Optional

- `logo`: Custom logo (`ReactNode`, default: `''`)
- `notifications`: Notification count or custom component
- `profileImage`: URL to user’s profile image
- `className`: Additional CSS classes for custom styling

---

## Features

- Responsive design
- Mobile-friendly collapsible menu
- Notification badge support
- Fully customizable appearance via props and classes

---

## Best Practices

- Keep navigation items minimal and focused
- Ensure full mobile responsiveness — test on multiple screen sizes
- Test accessibility with screen readers (e.g., add `aria-label`s where needed)
- Maintain consistent styling across your app using `className` or design tokens