# Customer Registration Service: Technical Documentation

## 1. Overview

The Customer Registration Service is a microservice responsible for orchestrating the creation of new customers. It exposes a single API endpoint that accepts customer details, validates the request, and creates a corresponding "Client" entity in the Fineract core banking platform. The service is designed to be the primary entry point for all self-service customer onboarding processes.

## 2. API Endpoint

### `POST /api/registration/register`

This is the sole endpoint for initiating a new customer registration.

## 3. Security Model

Security is managed declaratively by the Spring Security framework, ensuring that authentication and authorization are handled before any business logic is executed.

-   **Authentication:** The service is configured as an OAuth2 Resource Server. It requires a valid JWT `Bearer` token in the `Authorization` header for all requests to the registration endpoint. The token's signature and expiration are automatically validated using the JWK Set URI configured in the environment.
-   **Authorization:** Access to the registration endpoint is restricted by method-level security. The service's `register` method is annotated with `@PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")`. This ensures that only a caller with a valid JWT containing the `KYC_MANAGER` role can successfully invoke the registration process. Requests from authenticated users without this role will be rejected with a `403 Forbidden` error.

## 4. Request Payload

The endpoint expects a `Content-Type: application/json` body with the following structure:

| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | `String` | **Yes** | The customer's first name. |
| `lastName` | `String` | **Yes** | The customer's last name. |
| `email` | `String` | **Yes** | The customer's email address. Must be unique. |
| `phone` | `String` | **Yes** | The customer's mobile phone number. |
| `externalId`| `String` | **Yes** | A unique identifier from the external identity system (e.g., Keycloak user ID). |
| `dateOfBirth`| `LocalDate` | No | The customer's date of birth (Format: `YYYY-MM-DD`). |
| `nationalId` | `String` | No | The customer's national identification number. |
| `gender` | `String` | No | The customer's gender. |
| `address` | `AddressDto`| No | The customer's physical address. |

### AddressDto Object

| Field | Type | Required | Description |
|---|---|---|---|
| `street` | `String` | No | Street address line. |
| `city` | `String` | No | City name. |
| `postalCode`| `String` | No | Postal or ZIP code. |
| `country` | `String` | No | Country name. |

### Sample Request

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "phone": "+15551234567",
  "externalId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "dateOfBirth": "1990-01-15"
}
```

## 5. Registration Workflow

1.  A client application sends a `POST` request to `/api/registration/register` with a valid JWT and the customer's data.
2.  The Spring Security filter chain intercepts the request, validates the JWT, and confirms the caller has the `ROLE_KYC_MANAGER` authority.
3.  The `RegistrationController` receives the request and passes it to the `RegistrationService`.
4.  The `RegistrationService` invokes the `FineractService`, which is responsible for all communication with the Fineract platform.
5.  The `FineractService` constructs a specific payload for the Fineract "Create Client" API endpoint, mapping fields from the request and adding necessary default values.
6.  An HTTP `POST` request is sent to the Fineract API.
7.  Upon successful creation in Fineract, the `RegistrationService` forms a success response.
8.  The `RegistrationController` returns a `201 Created` HTTP status to the original caller, including the newly created Fineract Client ID in the response body.

## 6. Fineract Payload Mapping

The service does not send all request fields to Fineract. The following tables detail the exact mapping.

### 6.1. Fields Mapped from the Request

| Request Field | Fineract Payload Field | Sent to Fineract? | Notes |
|---|---|---|---|
| `firstName` | `firstname` | **Yes** | Direct mapping. |
| `lastName` | `lastname` | **Yes** | Direct mapping. |
| `email` | `emailAddress` | **Yes** | Direct mapping. |
| `phone` | `mobileNo` | **Yes** | Direct mapping. |
| `dateOfBirth` | `dateOfBirth` | **Yes** | Sent only if provided. Formatted as "dd MMMM yyyy". |
| `externalId` | `externalId` | **Yes** | Direct mapping. |
| `gender` | `genderId` | **No** | This field is **not** currently used. |
| `address` | N/A | **No** | The address object is **not** currently sent. |
| `nationalId` | N/A | **No** | This field is **not** currently used. |

### 6.2. Hardcoded & Default Fields

The service systematically adds the following fields to every Fineract "Create Client" request:

| Fineract Payload Field | Value | Notes |
|---|---|---|
| `officeId` | `1` (default) | Configurable via `fineract.default-office-id` in `application.yml`. |
| `active` | `false` | All new clients are created in an inactive state, pending KYC activation. |
| `legalFormId` | `1` | This value is hardcoded to represent the "Person" legal form in Fineract. |
| `locale` | `"en"` | Hardcoded to English. |
| `dateFormat`| `"dd MMMM yyyy"` | The date format required by the Fineract API. |

## 7. API Responses

### Success Response (`201 Created`)

```json
{
  "success": true,
  "status": "success",
  "fineractClientId": 102
}
```

### Error Response (`400 Bad Request`)

This is an example for a validation error. Other `4xx` or `5xx` errors follow a similar structure.

```json
{
  "error": "VALIDATION_ERROR",
  "message": "First name is required",
  "field": "firstName",
  "correlationId": "c7a8b9d0-e1f2-3456-7890-123456abcdef",
  "timestamp": "2023-10-27T10:00:00Z",
  "validationErrors": {
    "firstName": "First name is required"
  }
}
```

## 8. Local Testing via cURL

To test the endpoint locally, use a command similar to the following, replacing `<your_jwt_token>` with a valid token that includes the `KYC_MANAGER` role.

```bash
curl --location --request POST 'http://localhost:8080/api/registration/register' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <your_jwt_token>' \
--data-raw '{
    "firstName": "Jane",
    "lastName": "Doe",
    "email": "jane.doe@example.com",
    "phone": "+15551234567",
    "externalId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "dateOfBirth": "1990-01-15"
}'
```

## 9. Post-Registration State

Upon successful registration, the immediate result is the creation of a **Client** record in Fineract with its `active` status set to `false`. No other actions, such as savings account creation or KYC processing, are automatically triggered by this service.
