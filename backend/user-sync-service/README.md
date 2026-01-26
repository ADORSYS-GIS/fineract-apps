# User Sync Service

The User Sync Service is a Python-based microservice responsible for synchronizing user data between the Fineract platform and Keycloak, our identity and access management solution. It acts as a bridge, ensuring that user creation, status changes, and password management are seamlessly reflected in Keycloak.

## Purpose

In the Fineract ecosystem, user administration is handled through a central admin application (`frontend/admin-app`). When an administrator creates or manages an employee (user) in the Fineract admin UI, this service is called to perform the corresponding identity operations in Keycloak.

This service is crucial for:

-   **Decoupling**: It decouples the Fineract core from the identity provider (Keycloak), allowing for a more modular and maintainable architecture.
-   **Security**: It centralizes user identity management in Keycloak, leveraging its security features like password policies, multi-factor authentication, and single sign-on.
-   **Automation**: It automates the process of creating users in Keycloak, reducing manual effort and potential for errors.

## Integration with `frontend/admin-app`

The `frontend/admin-app` interacts with this service via a set of RESTful APIs. The Vite development server in the admin app is configured to proxy requests from `/api/user-sync` to this service, which runs on `http://localhost:5000` in a development environment. The API client for this service can be found in `frontend/admin-app/src/services/userSyncApi.ts`.

## API Endpoints

All endpoints are prefixed with the base path configured in the frontend's proxy, but the service itself does not have a base path.

### Health Check

-   **Endpoint**: `GET /health`
-   **Description**: Checks the health of the service and its connection to Keycloak.
-   **Success Response (200 OK)**:
    ```json
    {
      "status": "healthy",
      "service": "fineract-keycloak-sync",
      "keycloak_connected": true,
      "realm": "fineract"
    }
    ```
-   **Error Response (503 Service Unavailable)**:
    ```json
    {
      "status": "unhealthy",
      "error": "Failed to connect to Keycloak: ..."
    }
    ```

### User Management

#### Sync User

-   **Endpoint**: `POST /sync/user`
-   **Description**: Creates a new user in Keycloak. This is the first step in the user creation process. It generates a temporary password and sets required actions for the user.
-   **Request Body**:
    ```json
    {
      "username": "newuser",
      "email": "newuser@example.com",
      "firstName": "New",
      "lastName": "User",
      "role": "Loan Officer"
    }
    ```
-   **Success Response (201 Created)**:
    ```json
    {
      "status": "success",
      "message": "User newuser synced to Keycloak successfully",
      "keycloak_user_id": "...",
      "temporary_password": "...",
      "required_actions": ["UPDATE_PASSWORD", "VERIFY_EMAIL", "webauthn-register"]
    }
    ```
-   **Error Responses**: `400 Bad Request` for missing fields, `500 Internal Server Error` for other issues.

#### Reset User Password

-   **Endpoint**: `POST /users/{username}/reset-password`
-   **Description**: Triggers a password reset email to be sent to the user from Keycloak.
-   **Success Response (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "Password reset email sent to newuser@example.com",
      "username": "newuser",
      "email": "newuser@example.com"
    }
    ```
-   **Error Responses**: `404 Not Found` if the user doesn't exist, `400 Bad Request` if the user has no email, `500 Internal Server Error` for other issues.

#### Update User Status

-   **Endpoint**: `PUT /users/{username}/status`
-   **Description**: Enables or disables a user in Keycloak.
-   **Request Body**:
    ```json
    {
      "enabled": false
    }
    ```
-   **Success Response (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "User newuser disabled successfully",
      "username": "newuser",
      "enabled": false
    }
    ```
-   **Error Responses**: `400 Bad Request` for invalid body, `404 Not Found` if the user doesn't exist, `500 Internal Server Error` for other issues.

#### Force Password Change

-   **Endpoint**: `POST /users/{username}/force-password-change`
-   **Description**: Forces a user to change their password on their next login.
-   **Success Response (200 OK)**:
    ```json
    {
      "status": "success",
      "message": "User newuser will be required to change password on next login",
      "username": "newuser"
    }
    ```
-   **Error Responses**: `404 Not Found` if the user doesn't exist, `500 Internal Server Error` for other issues.

#### Get Keycloak Status

-   **Endpoint**: `GET /users/{username}/keycloak-status`
-   **Description**: Retrieves a user's status and details from Keycloak.
-   **Success Response (200 OK)**:
    ```json
    {
      "status": "success",
      "keycloak_user": {
        "id": "...",
        "username": "newuser",
        "email": "newuser@example.com",
        "firstName": "New",
        "lastName": "User",
        "enabled": true,
        "emailVerified": true,
        "requiredActions": [],
        "roles": ["loan-officer"],
        "groups": ["loan-officers"]
      }
    }
    ```
-   **Error Responses**: `404 Not Found` if the user doesn't exist, `500 Internal Server Error` for other issues.

## Configuration

The service is configured using environment variables. A `.env` file is used to store these variables for local development.

-   `KEYCLOAK_URL`: The URL of the Keycloak server.
-   `KEYCLOAK_REALM`: The Keycloak realm to use.
-   `KEYCLOAK_CLIENT_ID`: The client ID for the service to authenticate with Keycloak.
-   `KEYCLOAK_CLIENT_SECRET`: The client secret for the service.

-   `PORT`: The port on which the service will run (defaults to 5000).

## Production Configuration (Gunicorn)

For production deployments, the service uses the `gunicorn` WSGI server. The configuration for Gunicorn is defined in `app/gunicorn.conf.py`. This file allows for fine-tuning of the server's performance, security, and logging.

Key configuration options include:

-   **`bind`**: The socket to bind to (IP address and port).
-   **`workers`**: The number of worker processes for handling requests.
-   **`threads`**: The number of threads per worker.
-   **`user` and `group`**: The user and group to run the worker processes as, which enhances security by dropping root privileges.
-   **`accesslog` and `errorlog`**: Where to send access and error logs. A value of `-` means stdout and stderr, respectively.
-   **`loglevel`**: The granularity of the logs.
-   **Timeouts**: Various timeout settings to prevent requests from hanging.
-   **`max_requests`**: The maximum number of requests a worker will process before gracefully restarting, which helps prevent memory leaks.

These settings can be configured using environment variables, as shown in the `gunicorn.conf.py` file.

## Role Mapping

The service maps Fineract roles to Keycloak roles using a predefined mapping. This allows for consistent role management across both systems. The mapping can be found in the `sync_service.py` file.
## Local Development and Deployment

### Running with Python and Pip

To run the service locally without Docker, follow these steps:

1.  **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure environment variables**:
    Copy the `.env.example` file to `.env` and fill in the required Keycloak details.

4.  **Run the service**:
    ```bash
    python app/sync_service.py
    ```
    The service will start on the port specified in your `.env` file (default is 5000).

### Running with Docker

This is the recommended way to run the service for development and production.

1.  **Build the Docker image**:
    From the `user-sync-service` directory, run:
    ```bash
    docker build -t user-sync-service:latest .
    ```

2.  **Run the Docker container**:
    Make sure you have a `.env` file in the `user-sync-service` directory.
    ```bash
    docker run -d --name user-sync-service --network="host" --env-file .env user-sync-service:latest
    ```
    -   `--network="host"` is used to allow the service inside the container to connect to other services running on `localhost` on the host machine, like Keycloak.
    -   `--env-file .env` passes the environment variables from your `.env` file into the container.

3.  **Check the logs**:
    To see the logs from the running container:
    ```bash
    docker logs -f user-sync-service
    ```