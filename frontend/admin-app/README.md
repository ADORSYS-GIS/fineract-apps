# Fineract Administration App

## Overview
The Administration App is a standalone application for managing users in the Fineract system. It provides a complete user management interface with create, read, update, and activate/deactivate functionality.

## Features

### User Management
- **List Users**: View all users with search/filter capabilities
- **Create User**: Two-step creation process (staff + user)
- **View User Details**: Complete user information display
- **Edit User**: Update user information (email, name, office, roles)
- **Activate/Deactivate**: Toggle user status without deleting

### Key Characteristics
- **Immutable Username**: Username cannot be changed after creation
- **Editable Fields**: Email, firstname, lastname, phone, office, roles
- **Staff Integration**: Automatically creates staff record when creating user
- **No Physical Deletion**: Users can only be deactivated, preserving audit trail
- **Password Management**: Admins can trigger password resets via the app, which sends a secure link to the user through Keycloak.

## Architecture

### Technology Stack
- **React 19** + TypeScript
- **TanStack Router** (file-based routing)
- **React Query** (via @fineract-apps/fineract-api)
- **Formik** + **Zod** (forms & validation)
- **TailwindCSS** (styling)
- **Shared UI Components** (@fineract-apps/ui)

### File Structure
```
frontend/admin-app/
├── src/
│   ├── routes/
│   │   ├── __root.tsx           # Root layout with sidebar & navbar
│   │   ├── index.tsx             # Dashboard page
│   │   └── users/
│   │       ├── index.tsx         # Users list page
│   │       ├── create.tsx        # Create user form
│   │       └── $userId/
│   │           ├── index.tsx     # User detail/view page
│   │           └── edit.tsx      # Edit user form
│   ├── components/
│   │   ├── UserTable/            # Reusable user table component
│   │   ├── UserStatusBadge/      # Active/Inactive badge
│   │   └── UserForm/
│   │       └── userFormSchema.ts # Zod validation schemas
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## User Creation Workflow (Two-Step)

When creating a new user, the app follows this workflow:

### Step 1: Create Staff Record
```typescript
POST /v1/staff
{
  firstname: string,
  lastname: string,
  mobileNo: string,
  officeId: number,
  isLoanOfficer: boolean,
  joiningDate?: string,
  dateFormat?: "yyyy-MM-dd",
  locale?: "en"
}
```

### Step 2: Create User with staffId
```typescript
POST /v1/users
{
  username: string,
  firstname: string,
  lastname: string,
  email: string,
  officeId: number,
  roles: number[],
  staffId: number,  // from Step 1
  sendPasswordToEmail: boolean
}
```

## Password Reset Workflow

The admin app facilitates password resets by integrating with the User Sync Service, which in turn communicates with Keycloak.

1.  **Admin Action**: An admin clicks the "Reset Password" button on the user detail page.
2.  **API Call**: The frontend calls the `POST /api/user-sync/users/{username}/reset-password` endpoint.
3.  **Email Trigger**: The User Sync Service requests Keycloak to send a password reset email to the user.
4.  **User Action**: The user receives an email with a secure link that expires in 24 hours.
5.  **Password Update**: The user follows the link to a Keycloak page where they can set a new password.

## Form Fields

### Create User Form
- **username*** (immutable after creation)
- **firstname***
- **lastname***
- **email***
- **mobileNo*** (phone)
- **officeId*** (dropdown from template)
- **roles*** (multi-select from template)
- joiningDate (optional, for staff record)
- isLoanOfficer (checkbox, default: false)
- sendPasswordToEmail (checkbox, default: true)

### Edit User Form
- firstname* (editable)
- lastname* (editable)
- email* (editable)
- mobileNo* (editable)
- officeId* (editable)
- roles* (editable)
- isLoanOfficer (editable)
- **username** (read-only, displayed but not editable)

## API Integration

### Endpoints Used
- `GET /v1/users` - List all users
- `GET /v1/users/template` - Get form options (offices, roles)
- `GET /v1/users/{userId}` - Get user details
- `POST /v1/users` - Create user
- `PUT /v1/users/{userId}` - Update user
- `POST /v1/staff` - Create staff record
- `PUT /v1/staff/{staffId}` - Update staff record (when phone changes)

### ✅ Real API Integration Complete

The app is fully integrated with Fineract API using React Query hooks:

- **Users List**: `useUsersServiceGetV1Users()` - Fetches all users
- **User Details**: `useUsersServiceGetV1UsersByUserId()` - Fetches individual user
- **User Template**: `useUsersServiceGetV1UsersTemplate()` - Fetches form options (offices, roles)
- **Create User**: `useUsersServicePostV1Users()` - Creates new user
- **Update User**: `useUsersServicePutV1UsersByUserId()` - Updates user
- **Create Staff**: `useStaffServicePostV1Staff()` - Creates staff record
- **Update Staff**: `useStaffServicePutV1StaffByStaffId()` - Updates staff record

All API calls include:
- Automatic loading states
- Error handling with user-friendly messages
- Toast notifications for success/error feedback
- Optimistic UI updates where appropriate

## Development

### Install Dependencies
```bash
pnpm install
```

### Run Development Server
```bash
# Run all frontend apps
pnpm dev

# Or run just admin-app
cd frontend/admin-app
pnpm dev
```

### Build for Production
```bash
# Build all apps
pnpm build

# Or build just admin-app
cd frontend/admin-app
pnpm build
```

## Integration with Fineract

### Authentication
- Security is handled by Apache Gateway (configured in `/Users/guymoyo/dev/fineract-gitops/apps/apache-gateway`)
- No authentication logic in the frontend app itself

### Keycloak Integration
- User creation in Fineract triggers automatic user creation in Keycloak
- This happens on the backend and is transparent to the frontend
- Admins can trigger password resets from the user detail page.
- The app calls the User Sync Service, which then triggers Keycloak to send a secure, time-sensitive password reset link to the user's email.

## Shared Components

The app uses shared UI components from `@fineract-apps/ui`:

- **AppLayout**: Main layout wrapper
- **Sidebar**: Navigation sidebar with `menuAdmin`
- **Navbar**: Top navigation bar
- **Button**: Reusable button component with variants
- **Card**: Container component
- **Form**: Form wrapper with Formik + Zod integration
- **Input**: Flexible input component (text, email, select, checkbox, date)
- **SubmitButton**: Auto-loading submit button

## Menu Configuration

The admin menu is defined in `packages/ui/src/components/Sidebar/menus.ts`:

```typescript
export const menuAdmin = [
  { name: "Dashboard", link: "/", icon: Home },
  { name: "Users", link: "/users", icon: Users },
  { name: "Settings", link: "/settings", icon: Settings },
];
```

## Validation

Form validation is handled using Zod schemas in `src/components/UserForm/userFormSchema.ts`:

- Username: 3-50 chars, alphanumeric with hyphens/underscores
- Email: Valid email format
- Phone: Valid phone format with international support
- All required fields enforced
- Role selection: At least one role required

## Status Management

Users have an `available` field (boolean) that indicates their status:
- `true` or `undefined`: Active
- `false`: Inactive

The `UserStatusBadge` component displays this visually with a green or gray badge.

## Implemented Features ✅

- ✅ **Real API Integration**: All endpoints connected with React Query
- ✅ **Error Handling**: Comprehensive error handling with user-friendly messages
- ✅ **Loading States**: Loading indicators during all API calls
- ✅ **Activate/Deactivate**: Fully functional toggle status with confirmation
- ✅ **Toast Notifications**: Success/error messages for all operations
- ✅ **Two-Step User Creation**: Automatic staff + user creation workflow
- ✅ **Form Validation**: Zod schemas with real-time validation
- ✅ **Responsive Design**: Mobile-friendly UI with TailwindCSS
- ✅ **Password Reset**: Admins can trigger a secure password reset workflow for users.

## Future Enhancements

1. **Add Pagination**: Implement pagination for large user lists
2. **Add Sorting/Filtering**: Enhance table with sortable columns and advanced filters
3. **Add Tests**: Write unit and integration tests for components
4. **Add User Bulk Operations**: Bulk activate/deactivate, bulk delete
5. **Add User Import/Export**: CSV/Excel import and export functionality
6. **Add User Activity Log**: Track user changes and actions
7. **Add Advanced Search**: Multi-criteria search with filters

## Notes

- The app follows the same patterns as existing apps (account-manager, branchmanager, cashier)
- Consistent look and feel with other apps in the monorepo
- File-based routing with TanStack Router for code splitting
- Type-safe with TypeScript throughout
- Responsive design with TailwindCSS
