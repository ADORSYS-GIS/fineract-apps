# Customer Profile Management: Technical Documentation

## 1. Overview

The Customer Profile Management service is a feature within the Customer Registration microservice that allows for the modification and retrieval of existing customer data. It provides secure endpoints for updating a customer's basic profile information and fetching their addresses from the Fineract core banking platform. This functionality is essential for maintaining accurate and up-to-date customer records.

---

## 2. Update Customer Profile

### 2.1. API Endpoint

#### `PATCH /api/profile`

This endpoint is used to initiate an update to the authenticated customer's profile. It supports partial updates, meaning that only the fields provided in the request body will be modified.

### 2.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token for an authenticated user.
-   **Authorization:** The service determines the Fineract client ID from a `fineract_client_id` or `fineract_external_id` claim in the JWT, ensuring that a user can only update their own profile.

### 2.3. Request Payload

The endpoint expects a `Content-Type: application/json` body. Any combination of the following fields can be provided.

| Field | Type | Required | Description |
|---|---|---|---|
| `firstName` | `String` | No | The customer's first name. |
| `lastName` | `String` | No | The customer's last name. |
| `emailAddress` | `String` | No | The customer's email address. |
| `mobileNo` | `String` | No | The customer's mobile phone number. |

#### Sample Request

```json
{
  "firstName": "Fatima",
  "lastName": "Diallo-Kante"
}
```

### 2.4. API Responses

-   **Success (`200 OK`):** A JSON object detailing the changes is returned on a successful update.
-   **Error (`400 Bad Request`):** Returned for validation errors.
-   **Error (`401 Unauthorized`):** Returned if the request lacks a valid JWT.

#### Sample Success Response

```json
{
    "officeId": 1,
    "clientId": 123,
    "resourceId": 123,
    "changes": {
        "mobileNo": "+237677889900"
    }
}
```

---

## 3. Get Client Addresses

### 3.1. API Endpoint

#### `GET /api/profile/clients/{clientId}/addresses`

This endpoint retrieves a list of all addresses associated with a specific Fineract client.

### 3.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token.
-   **Authorization:** Access is restricted by method-level security. The caller must have a valid JWT containing the `ROLE_KYC_MANAGER` authority. Requests from authenticated users without this role will be rejected with a `403 Forbidden` error.

### 3.3. Success Response (`200 OK`)

A successful request returns a JSON object containing a list of addresses.

#### Sample Response

```json
{
    "addresses": [
        {
            "addressType": "Residential",
            "addressLine1": "Rue Drouot",
            "addressLine2": "4.1585",
            "addressLine3": "9.2435",
            "city": "Douala",
            "stateProvince": "Littoral",
            "country": "Cameroon",
            "postalCode": "00237"
        }
    ]
}
```

---

## 4. Create Client Address

### 4.1. API Endpoint

#### `POST /api/profile/clients/{clientId}/addresses`

This endpoint creates a new address for a specific Fineract client.

### 4.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token.
-   **Authorization:** No specific role is required. Any authenticated user can create an address for a client.

### 4.3. Request Payload

The endpoint expects a `Content-Type: application/json` body.

| Field | Type | Required | Description |
|---|---|---|---|
| `street` | `String` | Yes | The street name. |
| `addressLine1` | `String` | No | Additional address line 1. |
| `addressLine2` | `String` | No | Additional address line 2. |
| `addressLine3` | `String` | No | Additional address line 3. |
| `city` | `String` | Yes | The city. |
| `stateProvince` | `String` | Yes | The name of the state or province. |
| `country` | `String` | Yes | The name of the country. |
| `postalCode` | `String` | No | The postal code. |
| `addressType` | `String` | Yes | The type of address (e.g., "Home", "Work"). |

#### Sample Request

```json
{
  "street": "Ipca",
  "addressLine1": "Kandivali",
  "addressLine2": "plot47",
  "addressLine3": "charkop",
  "city": "Mumbai",
  "stateProvince": "Maharashtra",
  "country": "India",
  "postalCode": "400064",
  "addressType": "Home"
}
```

### 4.4. API Responses

-   **Success (`200 OK`):** A JSON object with the `resourceId` of the newly created address is returned.
-   **Error (`400 Bad Request`):** Returned for validation errors.
-   **Error (`401 Unauthorized`):** Returned if the request lacks a valid JWT.

#### Sample Success Response

```json
{
    "resourceId": 15
}
```

---

## 5. Update Client Address

### 5.1. API Endpoint

#### `PUT /api/profile/clients/{clientId}/addresses`

This endpoint updates an existing address for a specific Fineract client.

### 5.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token.
-   **Authorization:** No specific role is required. Any authenticated user can update an address for a client.

### 5.3. Request Payload

The endpoint expects a `Content-Type: application/json` body.

| Field | Type | Required | Description |
|---|---|---|---|
| `addressId` | `Long` | Yes | The ID of the address to update. |
| `street` | `String` | No | The new street name. |
| `addressLine1` | `String` | No | Additional address line 1. |
| `addressLine2` | `String` | No | Additional address line 2. |
| `addressLine3` | `String` | No | Additional address line 3. |
| `city` | `String` | No | The new city. |
| `stateProvince` | `String` | No | The new name of the state or province. |
| `country` | `String` | No | The new name of the country. |
| `postalCode` | `String` | No | The new postal code. |
| `addressType` | `String` | Yes | The type of address (e.g., "Home", "Work"). |

#### Sample Request

```json
{
  "addressId": 67,
  "street": "goldensource",
  "addressType": "Work"
}
```

### 5.4. API Responses

-   **Success (`200 OK`):** A JSON object with the `resourceId` of the updated address is returned.
-   **Error (`400 Bad Request`):** Returned for validation errors.
-   **Error (`401 Unauthorized`):** Returned if the request lacks a valid JWT.

#### Sample Success Response

```json
{
    "resourceId": 67
}
```

---

## 6. Local Testing via cURL

### 6.1. Obtain an Access Token

First, obtain a token from Keycloak. This token is required in the `Authorization` header for all subsequent requests. The user (`mifos`) has the `ROLE_KYC_MANAGER` authority required for testing the get addresses endpoint.

```bash
export TOKEN=$(curl -s --location --request POST "http://localhost:9000/realms/fineract/protocol/openid-connect/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=setup-app-client" \
--data-urlencode "client_secret=**********" \
--data-urlencode "username=mifos" \
--data-urlencode "password=password" \
--data-urlencode "grant_type=password" | jq -r '.access_token')
```

### 6.2. Test Case: Update Customer Profile (SUCCESS)
**Objective:** Verify that a customer can successfully update their profile information.
**Expected Result:** `200 OK`

```bash
curl --location --request PATCH 'http://localhost:8081/api/profile' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "emailAddress": "new.email@example.com",
    "mobileNo": "+237655443322"
}'
```

### 6.3. Test Case: Update a Single Field (SUCCESS)
**Objective:** Verify that a customer can update just one piece of their profile information.
**Expected Result:** `200 OK`

```bash
curl --location --request PATCH 'http://localhost:8081/api/profile' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "mobileNo": "+237677889900"
}'
```

### 6.4. Test Case: Get Client Addresses (SUCCESS)
**Objective:** Verify that a KYC Manager can retrieve the addresses for a specific client.
**Expected Result:** `200 OK`

*Note: Replace `123` with an actual Fineract Client ID.*

```bash
curl --location --request GET 'http://localhost:8081/api/profile/clients/123/addresses' \
--header "Authorization: Bearer $TOKEN"
```

### 6.5. Test Case: Get Client Addresses (FAILURE)
**Objective:** Verify that a user without the `ROLE_KYC_MANAGER` authority cannot retrieve addresses.
**Expected Result:** `403 Forbidden`

*Note: This test requires generating a token for a user that does **not** have the `ROLE_KYC_MANAGER` authority.*

```bash
# Assuming $USER_TOKEN is a token for a non-manager user
curl --location --request GET 'http://localhost:8081/api/profile/clients/123/addresses' \
--header "Authorization: Bearer $USER_TOKEN"
```
### 6.6. Test Case: Create Client Address (SUCCESS)
**Objective:** Verify that a new address can be created for a client.
**Expected Result:** `200 OK`

*Note: Replace `123` with an actual Fineract Client ID.*

```bash
curl --location --request POST 'http://localhost:8081/api/profile/clients/123/addresses' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "street":"Ipca",
    "addressLine1":"Kandivali",
    "addressLine2":"plot47",
    "addressLine3":"charkop",
    "city":"Mumbai",
    "stateProvince":"Maharashtra",
    "country":"India",
    "postalCode":"400064",
    "addressType":"Home"
}'
```

### 6.7. Test Case: Update Client Address (SUCCESS)
**Objective:** Verify that an existing address can be updated for a client.
**Expected Result:** `200 OK`

*Note: Replace `123` with an actual Fineract Client ID and `67` with a valid address ID.*

```bash
curl --location --request PUT 'http://localhost:8081/api/profile/clients/123/addresses' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "addressId":67,
    "street":"goldensource",
    "addressType":"Work"
}'
```
