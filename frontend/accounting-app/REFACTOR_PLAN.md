# Accounting App Refactor and Enhancement Plan

This document outlines the step-by-step plan for refactoring and enhancing the Accounting App.

## 1. UI/UX & Layout Harmonization

-   [ ] **Analyze `branchmanager-app` Layout:** Thoroughly examine the layout and component structure of the `branchmanager-app` to identify the key patterns to replicate.
-   [x] **Refactor Primary Layout:** Update the main layout components in `accounting-app` (likely starting with `__root.tsx`) to match the structure of `branchmanager-app`.
-   [ ] **Identify Custom Components:** Systematically scan the `accounting-app` codebase to find all instances of custom-built buttons and cards that have equivalents in the `@/packages/ui` library.
-   [ ] **Replace Buttons:** Replace all identified custom buttons with the `<Button>` component from `@/packages/ui`.
-   [ ] **Replace Cards:** Replace all identified custom cards with the `<Card>` component from `@/packages/ui`.
-   [ ] **Verify Theming:** Ensure all replaced components correctly use the application's color scheme as defined in the styling guides.
-   [ ] **Update Sidebar Labels:** Modify the sidebar configuration to replace underscores with spaces and apply Title Case to all menu items.
-    [ ] **fix the navbar color:** The color of the navebar should have the same color like for the other apps

## 2. Role-Based Access Control (RBAC) Implementation

-   [ ] **Create `usePermissions` Hook:** Develop a new hook, `usePermissions`, to fetch the current user's roles from the `GET /v1/users/{userId}` endpoint. The endpoint to retrieve a user's details, including their assigned roles, is:

GET /v1/users/{userId}

This endpoint will return a JSON object containing the user's details. The selectedRoles field in the response will be an array of objects, each representing a role assigned to the user.

Here is an example of what the response might look like:

{
    "id": 1,
    "officeId": 1,
    "officeName": "Head Office",
    "username": "mifos",
    "firstname": "Mifos",
    "lastname": "Administrator",
    "email": "admin@example.com",
    "allowedOffices": [
        ...
    ],
    "availableRoles": [
        ...
    ],
    "selectedRoles": [
        {
            "id": 1,
            "name": "Super User",
            "description": "This role has all permissions."
        }
    ],
    "staff": {
        ...
    }
}
 This hook should provide a simple interface to check for the "Accountant" and "Supervisor Accountant" roles.
-   [x] **Implement Default Deny Rule:** In the main layout or root component, use the `usePermissions` hook to check the user's roles. If the user does not have "Accountant" or "Supervisor Accountant", render a user-friendly "access denied" message.
-   [ ] **Implement "Accountant" Role Rules:**
    -   [ ] Conditionally hide the "Approval Queue" menu item and its corresponding routes from users with only the "Accountant" role.
    -   [ ] Ensure users with the "Accountant" role can access the "Create Journal Entry" feature.
-   [ ] **Implement "Supervisor Accountant" Role Rules:**
    -   [ ] Conditionally hide the "Create Journal Entry" menu item and its corresponding routes from users with the "Supervisor Accountant" role.
    -   [ ] Ensure users with the "Supervisor Accountant" role can access the "Approval Queue" feature.
- [ ] **Implement Super user roles:**
    - [ ] Ensure users with role super user can access everything in the accounting appj

## 3. Feature Implementation & Critical Bug Fixes

-   [ ] **Implement Pagination:**
    -   [ ] Identify all list-based pages that require pagination.
    -   [ ] For each identified page, implement the standard `offset` and `limit` query parameter approach using the pagination component from `@/packages/ui`.
-   [ ] **Responsiveness:**
    -   [ ] **Audit Responsiveness:** Perform a full audit of the application on desktop, tablet, and mobile screen sizes.
    -   [ ] **Fix Horizontal Scrolling:** Identify and fix all instances of horizontal scrolling on small screens.
    -   [ ] **Responsive Data Tables:** For tables with many columns, implement the pattern of hiding less critical columns on smaller screens, referencing the `branchmanager-app`'s "pending loans" and "pending savings accounts" tables.
-   [ ] **Routing System Errors:**
    -   [ ] **Analyze `branchmanager-app` Routing:** Compare the routing file structure and export patterns in `accounting-app` with `branchmanager-app`.
    -   [ ] **Correct Route File Exports:** Refactor the route files listed in the error logs to correctly export their route components, resolving the "route piece" warnings.
