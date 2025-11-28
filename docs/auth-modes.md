# Frontend Authentication Modes

This document explains how to configure the frontend applications to switch between two authentication modes: `basic` and `oauth`.

## Overview

The frontend applications can be configured to handle authentication in two ways:

1.  **`basic`**: The frontend sends basic authentication credentials (username and password) with each API request.
2.  **`oauth`**: The frontend is "auth-dumb" and does not send any authentication credentials. In this mode, a proxy and an identity provider (like Keycloak) are expected to handle authentication.

## Configuration

The authentication mode is controlled by the `VITE_AUTH_MODE` environment variable in the `.env` file of each frontend application.

### Setting the Authentication Mode

To set the authentication mode, add the following line to the `.env` file of the desired application (e.g., `fineract-apps/frontend/cashier-app/.env`):

```
VITE_AUTH_MODE=basic
```

Or:

```
VITE_AUTH_MODE=oauth
```

If the `VITE_AUTH_MODE` variable is not set, the applications will default to `basic` authentication.

### How It Works

-   When `VITE_AUTH_MODE` is set to `basic`, the application's API client is configured with the username, password, and tenant ID from the `.env` file. The logout function redirects to the application's base URL.
-   When `VITE_AUTH_MODE` is set to `oauth`, the API client is not configured with any credentials, and the logout function redirects to a `/callback?logout=` endpoint for the proxy to handle.