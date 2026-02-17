# Customer Registration Service: Technical Documentation

## 1. Overview

The Customer Registration Service is a microservice responsible for orchestrating the creation of new customers. It exposes a single API endpoint that accepts customer details, validates the request, and creates a corresponding "Client" entity and a savings account in the Fineract core banking platform. The service is designed to be the primary entry point for all self-service customer onboarding processes.

## 2. API Endpoint

### `POST /api/registration/register`

This is the sole endpoint for initiating a new customer registration.

## 3. Security Model

Security is managed declaratively by the Spring Security framework, ensuring that authentication and authorization are handled before any business logic is executed.

-   **Authentication:** The service is configured as an OAuth2 Resource Server. It requires a valid JWT `Bearer` token in the `Authorization` header for all requests to the registration endpoint. The token's signature and expiration are automatically validated using the JWK Set URI configured in the environment. The endpoint requires an authenticated user, as configured in `SecurityConfig`.
-   **Authorization:** Access to the registration logic is restricted by method-level security within the `RegistrationService`. The `register` method is annotated with `@PreAuthorize("hasAuthority('ROLE_KYC_MANAGER')")`. This ensures that only a caller with a valid JWT containing the `KYC_MANAGER` role can successfully invoke the registration process. Requests from authenticated users without this role will be rejected with a `403 Forbidden` error.

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
| `gender` | `String` | No | The customer's gender. |
| `addressType`| `String`| Conditionally Yes | The type of address. Required if any other address field is provided. |
| `addressLine1`| `String`| No | The customer's primary address line. |
| `addressLine2`| `String`| No | The customer's second address line. Can be used to store latitude. |
| `addressLine3`| `String`| No | The customer's third address line. Can be used to store longitude. |
| `city`| `String`| No | The city of the customer's address. |
| `stateProvince`| `String`| Conditionally Yes | The state or province. Required if any other address field is provided. |
| `country`| `String`| Conditionally Yes | The country. Required if any other address field is provided. |
| `postalCode`| `String`| No | The postal code. Defaults to `0000` if not provided. |

### Sample Request

```json
{
  "firstName": "Fatima",
  "lastName": "Diallo",
  "email": "fatima.diallo@example.cm",
  "phone": "+237699887766",
  "externalId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "dateOfBirth": "1990-01-15",
  "addressType": "Residential",
  "addressLine1": "Rue Drouot",
  "city": "Douala",
  "stateProvince": "Littoral",
  "country": "Cameroon",
  "postalCode": "00237"
}
```

## 5. Registration Workflow

1.  A client application sends a `POST` request to `/api/registration/register` with a valid JWT and the customer's data.
2.  The Spring Security filter chain intercepts the request and validates the JWT.
3.  The `RegistrationController` receives the request and passes it to the `RegistrationService`.
4.  The `RegistrationService`'s `register` method is invoked. Spring Security verifies that the caller has the `ROLE_KYC_MANAGER` authority.
5.  The `RegistrationService` invokes the `FineractService`, which is responsible for all communication with the Fineract platform.
6.  The `FineractService` constructs a specific payload for the Fineract "Create Client" API endpoint, mapping fields from the request and adding necessary default values.
7.  An HTTP `POST` request is sent to the Fineract API to create the client.
8.  Upon successful client creation, the `FineractService` is called again to create a default savings account for the new client.
9.  Upon successful creation of both entities in Fineract, the `RegistrationService` forms a success response.
10. The `RegistrationController` returns a `201 Created` HTTP status to the original caller, including the newly created Fineract Client ID and Savings Account ID in the response body.

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
| `gender` | `genderId` | **Yes** | Mapped to `genderId` by dynamically looking up the ID from Fineract's `/api/v1/codes/name/Gender/codevalues` endpoint. |
| `addressLine1`, `city`, `stateProvince`, `country`, `postalCode` | `address` | **Yes** | These fields are mapped to a nested `address` object in the Fineract payload. |
| `addressLine2` | `addressLine2` | **Yes** | Mapped to the `addressLine2` field within the `address` object. Can be used for latitude. |
| `addressLine3` | `addressLine3` | **Yes** | Mapped to the `addressLine3` field within the `address` object. Can be used for longitude. |

### 6.2. Hardcoded & Default Fields

The service systematically adds the following fields to every Fineract "Create Client" request:

| Fineract Payload Field | Value | Notes |
|---|---|---|
| `officeId` | `1` (default) | Configurable via `fineract.default-office-id` in `application.yml`. |
| `active` | `true` | All new clients are created in an active state. |
| `activationDate` | Current Date | The date the client is activated, formatted as "dd MMMM yyyy". |
| `submittedOnDate` | Current Date | The date the client registration is submitted, formatted as "dd MMMM yyyy". |
| `legalFormId` | `1` | This value is hardcoded to represent the "Person" legal form in Fineract. |
| `locale` | `"en"` | Hardcoded to English. |
| `dateFormat`| `"dd MMMM yyyy"` | The date format required by the Fineract API. |

## 7. API Responses

### Success Response (`201 Created`)

```json
{
  "success": true,
  "status": "success",
  "fineractClientId": 102,
  "savingsAccountId": 205
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

To thoroughly test the service logic, use the following `curl` commands. These cover various success and failure scenarios based on the implemented validation rules.

### 8.1. Obtain an Access Token

First, obtain a token from Keycloak. This token is required in the `Authorization` header for all subsequent requests.

```bash
export TOKEN=$(curl -s --location --request POST "http://localhost:9000/realms/fineract/protocol/openid-connect/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=setup-app-client" \
--data-urlencode "client_secret=**********" \
--data-urlencode "username=mifos" \
--data-urlencode "password=password" \
--data-urlencode "grant_type=password" | jq -r '.access_token')
```

### 8.2. Test Suite: Registration Scenarios

#### Test Case 1: Minimalistic Success (SUCCESS)
**Objective:** Verify that a client can be created with only the absolute minimum required fields.
**Expected Result:** `201 Created`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Brenda",
    "lastName": "Biya",
    "email": "brenda.biya@example.cm",
    "phone": "+237691111111",
    "externalId": "external-id-001"
}'
```

#### Test Case 2: Full Address Success (SUCCESS)
**Objective:** Verify a successful registration with a complete address, including a custom postal code.
**Expected Result:** `201 Created`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Nathalie",
    "lastName": "Koah",
    "email": "nathalie.koah@example.cm",
    "phone": "+237692222222",
    "externalId": "external-id-002",
    "dateOfBirth": "1987-01-15",
    "gender": "Female",
    "addressType": "Residential",
    "addressLine1": "Bastos",
    "addressLine2": "4.1585",
    "addressLine3": "9.2435",
    "city": "Yaoundé",
    "stateProvince": "Centre",
    "country": "Cameroon",
    "postalCode": "54321"
}'
```

#### Test Case 3: Default Postal Code (SUCCESS)
**Objective:** Verify the postal code defaulting logic. No postal code is sent, so the service should apply the default `0000`.
**Expected Result:** `201 Created`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Francis",
    "lastName": "Ngannou",
    "email": "francis.ngannou@example.cm",
    "phone": "+237693333333",
    "externalId": "external-id-003",
    "addressType": "Business",
    "addressLine1": "MMA Factory",
    "city": "Batié",
    "stateProvince": "West",
    "country": "Cameroon"
}'
```

#### Test Case 4: Geolocation Only (SUCCESS)
**Objective:** Verify that a client can be created with only the mandatory address fields plus geolocation.
**Expected Result:** `201 Created`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Stanley",
    "lastName": "Enow",
    "email": "stanley.enow@example.cm",
    "phone": "+237694444444",
    "externalId": "external-id-004",
    "addressType": "Other",
    "stateProvince": "South-West",
    "country": "Cameroon",
    "addressLine2": "4.1585",
    "addressLine3": "9.2435"
}'
```

#### Test Case 5: Missing `stateProvince` (FAILURE)
**Objective:** Verify that the backend validation rejects a request with address info but missing the mandatory `stateProvince`.
**Expected Result:** `400 Bad Request`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Charlotte",
    "lastName": "Dipanda",
    "email": "charlotte.dipanda@example.cm",
    "phone": "+237695555555",
    "externalId": "external-id-005",
    "addressType": "Residential",
    "city": "Ebolowa",
    "country": "Cameroon"
}'
```

#### Test Case 6: Missing `addressType` (FAILURE)
**Objective:** Verify that the backend validation rejects a request with address info but missing the mandatory `addressType`.
**Expected Result:** `400 Bad Request`

```bash
curl --location --request POST 'http://localhost:8081/api/registration/register' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "firstName": "Salatiel",
    "lastName": "Livenja",
    "email": "salatiel.livenja@example.cm",
    "phone": "+237696666666",
    "externalId": "external-id-006",
    "stateProvince": "North-West",
    "country": "Cameroon"
}'
```

### Successful Response

A successful registration will return a `201 Created` status with a JSON body similar to the following, indicating the new Fineract Client ID and Savings Account ID.

```json
{
  "success": true,
  "status": "success",
  "fineractClientId": 13,
  "savingsAccountId": 26
}
```

## 9. Post-Registration State

Upon successful registration, the immediate result is the creation of a **Client** record in Fineract with its `active` status set to `true`, and a new **Savings Account** associated with that client.
