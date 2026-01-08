# Mifos Web App Authentication and Authorization Guide

This document provides a comprehensive guide to understanding and implementing the authentication and authorization mechanisms used in the Mifos web app. It is intended to serve as a reference for developers building frontend applications that interact with the same backend and require similar security features.

## 1. Authentication Flow

The authentication process in the Mifos web app is handled by the `AuthenticationService`, located in `src/app/core/authentication/authentication.service.ts`. The flow can be summarized as follows:

1.  **Login:** The user enters their credentials, which are encapsulated in a `LoginContext` object.
2.  **Authentication Request:** The `login` method in the `AuthenticationService` sends a POST request to the `/authentication` endpoint with the user's credentials.
3.  **Credential Storage:** Upon successful authentication, the backend returns a `Credentials` object containing the user's information, including their roles and permissions. This object is then stored in either `sessionStorage` or `localStorage`, depending on whether the "Remember Me" option was selected.
4.  **Session Management:** The `isAuthenticated` method in the `AuthenticationService` checks for the presence of the `Credentials` object in storage to determine if the user is logged in.
5.  **Route Protection:** The `AuthenticationGuard`, located in `src/app/core/authentication/authentication.guard.ts`, uses the `isAuthenticated` method to protect routes from unauthorized access.

## 2. Data Models

The authentication system relies on three key data models:

*   **`LoginContext`:** This model, defined in `src/app/core/authentication/login-context.model.ts`, represents the user's login credentials.

    ```typescript
    export interface LoginContext {
      username: string;
      password: string;
      remember: boolean;
    }
    ```

*   **`Credentials`:** This model, defined in `src/app/core/authentication/credentials.model.ts`, represents the authenticated user's profile.

    ```typescript
    export interface Credentials {
      accessToken?: string;
      authenticated: boolean;
      base64EncodedAuthenticationKey?: string;
      isTwoFactorAuthenticationRequired?: boolean;
      officeId: number;
      officeName: string;
      staffId?: number;
      staffDisplayName?: string;
      organizationalRole?: any;
      permissions: string[];
      roles: any;
      userId: number;
      username: string;
      shouldRenewPassword: boolean;
      rememberMe?: boolean;
    }
    ```

*   **`OAuth2Token`:** This model, defined in `src/app/core/authentication/o-auth2-token.model.ts`, is used when OAuth2 is enabled.

    ```typescript
    export interface OAuth2Token {
      access_token: string;
      token_type: string;
      refresh_token: string;
      expires_in: number;
      scope: string;
    }
    ```

## 3. Role-Based Access Control (RBAC)

RBAC in the Mifos web app is implemented using a custom directive called `HasPermissionDirective`, located in `src/app/directives/has-permission/has-permission.directive.ts`. This directive conditionally renders UI elements based on the current user's permissions.

Here's how it works:

1.  **Initialization:** The directive retrieves the user's permissions from the `Credentials` object stored in session/local storage.
2.  **Permission Check:** The `mifosxHasPermission` input property takes a string representing the required permission.
3.  **Conditional Rendering:** The directive's `hasPermission` method checks if the user's permissions array includes the required permission. If it does, the associated UI element is rendered; otherwise, it is hidden.

**Example Usage:**

```html
<button *mifosxHasPermission="'CREATE_CLIENT'">Create Client</button>
```

In this example, the "Create Client" button will only be visible to users who have the `CREATE_CLIENT` permission.

## 4. Implementation Guide

To implement a similar authentication and authorization system in your own frontend application, follow these recommendations:

1.  **Create an Authentication Service:** This service should be responsible for handling all aspects of authentication, including login, logout, and session management.
2.  **Define Data Models:** Create data models to represent user credentials and login context, similar to the ones used in the Mifos app.
3.  **Implement an Authentication Guard:** Use a route guard to protect your application's routes from unauthorized access.
4.  **Create a `HasPermission` Directive:** Implement a directive that allows you to conditionally render UI elements based on the current user's permissions.
5.  **Secure Your API:** Ensure that your backend API enforces the same role-based access control rules as your frontend UI.

By following these guidelines, you can build a secure and robust authentication and authorization system that protects your application and its data from unauthorized access.