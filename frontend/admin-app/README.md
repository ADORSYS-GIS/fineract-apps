# Fineract Administration UI

This document provides a detailed explanation of the Fineract Administration UI, a single-page application built with React, TypeScript, and Vite. It is designed to manage users and other administrative tasks within the Fineract ecosystem.

## Core Functionalities

The Fineract Administration UI provides the following core functionalities:

-   **Staff Management**: Create, view, edit, and manage staff.
-   **User Management**: Create, view, edit, delete, and manage users, including assigning and changing their associated staff members.
-   **User Status**: View the status of users (active, inactive, etc.).
-   **Password Reset**: Reset user passwords.
-   **Toast Notifications**: Display toast notifications for user actions.

## Project Structure

The project is structured as follows:

```
├── .env
├── README.md
├── dist/
├── index.html
├── node_modules/
├── package.json
├── src/
│   ├── components/
│   │   ├── CreateStaff/
│   │   ├── CreateUser/
│   │   ├── EditStaff/
│   │   ├── EditUser/
│   │   ├── PasswordResetModal/
│   │   ├── StaffDetails/
│   │   ├── StaffForm/
│   │   ├── StaffTable/
│   │   ├── Toast/
│   │   ├── UserDetails/
│   │   ├── UserForm/
│   │   ├── UserStatusBadge/
│   │   └── UserTable/
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── staff/
│   │   │   ├── create.tsx
│   │   │   ├── index.tsx
│   │   │   ├── list.tsx
│   │   │   └── $staffId/
│   │   │       ├── edit.tsx
│   │   │       └── index.tsx
│   │   └── users/
│   │       ├── create.tsx
│   │       ├── index.tsx
│   │       ├── list.tsx
│   │       └── $userId/
│   │           ├── edit.tsx
│   │           └── index.tsx
│   ├── services/
│   │   ├── api.ts
│   │   └── userSyncApi.ts
│   ├── index.css
│   ├── main.tsx
│   └── routeTree.gen.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo
└── vite.config.ts
```

### `src/main.tsx`

This is the entry point of the application. It initializes the `QueryClient` for TanStack Query and the `RouterProvider` for TanStack Router. It also imports the global CSS files and the generated route tree.

### `src/routes/__root.tsx`

This file defines the root layout of the application. It includes the main `AppLayout`, which is composed of a `Sidebar` and a `Navbar`. The `Outlet` component from TanStack Router is used to render the child routes. The `ToastContainer` is also included here to display toast notifications.

### `src/routes/`

This directory contains the route definitions for the application. The file-based routing system from TanStack Router is used to define the routes.

-   `index.tsx`: The home page of the application.
-   `staff/index.tsx`: The layout for staff-related routes.
-   `staff/list.tsx`: The staff list page, with a centered layout. It includes a "Create Staff" button to navigate to the creation page.
-   `staff/create.tsx`: The staff creation page, featuring a centered form layout for a better user experience.
-   `staff/$staffId/index.tsx`: The staff details page.
-   `staff/$staffId/edit.tsx`: The staff edit page.
-   `users/index.tsx`: The layout for user-related routes.
-   `users/list.tsx`: The user list page, with a centered layout. It includes a "Create User" button to navigate to the creation page.
-   `users/create.tsx`: The user creation page, featuring a centered form layout for a better user experience.
-   `users/$userId/index.tsx`: The user details page.
-   `users/$userId/edit.tsx`: The user edit page.

### `src/components/`

This directory contains all the React components used in the application. Each component is organized in its own directory, which contains the view, the custom hooks, and the types.

-   **`CreateStaff`**: This component is responsible for creating a new staff member. It features a centered form for a clean user experience.
-   **`CreateUser`**: This component is responsible for creating a new user and assigning it to a staff member. It features a centered form for a clean user experience.

-   **`EditStaff`**: This component is responsible for editing an existing staff member, with a centered layout.
-   **`EditUser`**: This component is responsible for editing an existing user, including changing their assigned staff member.

-   **`PasswordResetModal`**: This component is a modal that allows the administrator to reset a user's password. It displays the user's username and email and asks for confirmation before sending a password reset email to the user.

-   **`Toast`**: This component is used to display toast notifications.
    -   `index.tsx`: This file exports the `ToastContainer`, `ToastProvider`, and `useToast` hook.
    -   `ToastContainer.tsx`: This component is responsible for rendering the toast notifications.
    -   `useToast.tsx`: This custom hook provides a simple way to display toast notifications from any component.

-   **`StaffDetails`**: This component is used to display the details of a staff member. It uses a consistent two-column layout where labels are in the first column and values are in the second, ensuring a clear and readable presentation.
-   **`UserDetails`**: This component is used to display the details of a user. It uses a consistent two-column layout, matching the `StaffDetails` component, with labels in the first column and values in the second.

-   **`UserForm`**: This directory contains the form validation schema for the user form.
    -   `userFormSchema.ts`: This file defines the Zod schema for the user form. It is used to validate the form data before submitting it to the server. To handle HTML form inputs that return string values for numeric fields, the schema uses `z.coerce.number()` to automatically convert strings to numbers before validation. It also enforces that a user can only be assigned a single role.

-   **`UserStatusBadge`**: This component is used to display the status of a user.
    -   `UserStatusBadge.view.tsx`: This file contains the view for the user status badge. It receives a boolean `isActive` prop and displays a green badge for active users and a gray badge for inactive users.

-   **`StaffTable`**: This component displays a table of staff members with search and pagination functionality.
-   **`UserTable`**: This component displays a table of users with search and pagination functionality.

### `src/services/`

This directory contains the services for interacting with the Fineract API.

-   **`api.ts`**: This file configures the Fineract API client with the environment variables. It sets the `BASE` URL, `USERNAME`, `PASSWORD`, and `HEADERS` for the API client.
-   **`userSyncApi.ts`**: This file serves as an API client for the User Sync Service, which handles interactions between the Fineract platform and Keycloak for user identity management. It provides several functions to manage user synchronization and authentication-related tasks. All functions communicate with the `/api/user-sync` backend endpoint and include OIDC session cookies for authentication.
    -   `resetUserPassword(username)`: Sends a POST request to `/users/{username}/reset-password` to trigger a password reset email for the specified user via Keycloak.
    -   `updateUserStatus(username, enabled)`: Sends a PUT request to `/users/{username}/status` to either enable or disable the user's account in Keycloak.
    -   `forcePasswordChange(username)`: Sends a POST request to `/users/{username}/force-password-change` to require the user to change their password upon their next login.
    -   `getUserKeycloakStatus(username)`: Sends a GET request to `/users/{username}/keycloak-status` to retrieve the user's synchronization status and details from Keycloak, such as whether the account is enabled, email is verified, and what required actions are pending.

### `src/routeTree.gen.ts`

This file is automatically generated by the TanStack Router plugin. It contains the route tree for the application, which is used to initialize the router.

## Routing

The application uses TanStack Router for routing. The routes are defined in the `src/routes` directory using a file-based routing system. The `routeTree.gen.ts` file is generated automatically by the TanStack Router plugin, which provides type safety and autocompletion for the routes.

### Routing Logic and Conventions

The routing is structured around the features of the application, mainly **Staff** and **User** management. The file system inside `src/routes` directly maps to the URL paths.

-   **Root Layout (`__root.tsx`)**: This file defines the main application layout, including the sidebar and navigation bar. All other routes are rendered within this layout.

-   **Index Route (`index.tsx`)**: This is the default route for the application, typically the dashboard or home page. It maps to the `/` path.

-   **Staff Routes (`staff/`)**: All routes related to staff management are located in the `src/routes/staff` directory.
    -   `staff/index.tsx`: Defines the layout for all staff-related pages. It maps to `/staff`.
    -   `staff/list.tsx`: Displays a list of all staff members. It maps to `/staff/list`.
    -   `staff/create.tsx`: A form to create a new staff member. It maps to `/staff/create`.
    -   `staff/$staffId/index.tsx`: Shows the details of a specific staff member. The `$staffId` is a dynamic parameter representing the staff member's ID. It maps to `/staff/:staffId`.
    -   `staff/$staffId/edit.tsx`: A form to edit the details of a specific staff member. It maps to `/staff/:staffId/edit`.

-   **User Routes (`users/`)**: All routes related to user management are located in the `src/routes/users` directory.
    -   `users/index.tsx`: Defines the layout for all user-related pages. It maps to `/users`.
    -   `users/list.tsx`: Displays a list of all users. It maps to `/users/list`.
    -   `users/create.tsx`: A form to create a new user. It maps to `/users/create`.
    -   `users/$userId/index.tsx`: Shows the details of a specific user. The `$userId` is a dynamic parameter representing the user's ID. It maps to `/users/:userId`.
    -   `users/$userId/edit.tsx`: A form to edit the details of a specific user. It maps to `/users/:userId/edit`.

This file-based routing approach makes it intuitive to locate the code for a specific page and understand the URL structure of the application. The `routeTree.gen.ts` file, which is auto-generated, ensures that all links and navigations are type-safe, reducing the chance of runtime errors due to incorrect paths.

## State Management

The application uses TanStack Query for state management. The queries and mutations are defined in the `src/services` directory. TanStack Query provides a simple and powerful way to fetch, cache, and update data in the application.

## API Interaction

The application interacts with the Fineract API using the `@fineract-apps/fineract-api` client. The API client is configured in `src/services/api.ts` with the environment variables. The services in the `src/services` directory use the API client to make requests to the Fineract API.

## Fineract API Endpoints

The following Fineract API endpoints are used in the application:

-   **`UsersService.getV1Users()`**: Fetches a list of all users.
-   **`UsersService.getV1UsersByUserId({ userId })`**: Fetches a single user by their ID.
-   **`UsersService.getV1UsersTemplate()`**: Fetches the template for creating a new user. This is primarily used to get the list of available roles.
-   **`UsersService.postV1Users({ requestBody })`**: Creates a new user.
-   **`UsersService.putV1UsersByUserId({ userId, requestBody })`**: Updates an existing user.
-   **`UsersService.deleteV1UsersByUserId({ userId })`**: Deletes an existing user.
-   **`StaffService.getV1Staff()`**: Fetches a list of all staff members.
-   **`StaffService.getV1StaffByStaffId({ staffId })`**: Fetches a single staff member by their ID.
-   **`StaffService.postV1Staff({ requestBody })`**: Creates a new staff member.
-   **`StaffService.putV1StaffByStaffId({ staffId, requestBody })`**: Updates an existing staff member.
-   **`OfficesService.getV1Offices()`**: Fetches a list of all offices. This is used in the staff creation and editing forms to populate the office selection dropdown.
-   **`RolesService.getV1Roles()`**: Fetches a list of all roles.

## Functionality Checklist

This checklist can be used to verify that all core functionalities of the application are working correctly.

-   [x] **User List**: The user list is displayed correctly with search and pagination.
-   [x] **User Details**: Clicking on a user in the user list navigates to the user details page.
-   [x] **Create User**: A "Create User" button is present on the user list page, and a new user can be created successfully.
-   [x] **Edit User**: An existing user can be edited successfully.
-   [x] **Staff List**: The staff list is displayed correctly with search and pagination, and includes a "Create Staff" button.
-   [x] **Staff Details**: Clicking on a staff member in the staff list navigates to the staff details page.
-   [x] **Edit Staff**: An existing staff member can be edited successfully.
-   [ ] **Password Reset**: A password reset email can be sent to a user.
-   [ ] **User Status**: The user status is displayed correctly in the user list and user details page.
-   [ ] **Toast Notifications**: Toast notifications are displayed for user actions (create, update, delete, etc.).
-   [ ] **API Interaction**: All Fineract API endpoints are working correctly.
-   [ ] **User Sync**: All user sync functionalities are working correctly.