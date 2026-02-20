# Customer Profile Management: Technical Documentation

## 1. Overview

The Customer Profile Management service is a feature within the Customer Registration microservice that allows for the modification and retrieval of existing customer data. It provides secure endpoints for updating a customer's basic profile information and managing their addresses on the Fineract core banking platform. This functionality is essential for maintaining accurate and up-to-date customer records.

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

#### `GET /api/profile/addresses`

This endpoint retrieves a list of all addresses associated with the authenticated Fineract client.

### 3.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token.
-   **Authorization:** Access is restricted by method-level security. The caller must have a valid JWT containing the `ROLE_KYC_MANAGER` authority. The service determines the Fineract client ID from a `fineract_client_id` or `fineract_external_id` claim in the JWT. Requests from authenticated users without this role will be rejected with a `403 Forbidden` error.

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

#### `POST /api/profile/addresses`

This endpoint creates a new address for the authenticated Fineract client.

### 4.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token.
-   **Authorization:** Access is restricted by method-level security. The caller must have a valid JWT containing the `ROLE_KYC_MANAGER` authority. The service determines the Fineract client ID from a `fineract_client_id` or `fineract_external_id` claim in the JWT.

### 4.3. Request Payload

The endpoint expects a `Content-Type: application/json` body.

| Field | Type | Required | Description |
|---|---|---|---|
| `street` | `String` | Yes | The street name. |
| `addressLine1` | `String` | No | Additional address line 1. |
| `addressLine2` | `String` | No | Additional address line 2. |
| `addressLine3` | `String` | No | Additional address line 3. |
| `city` | `String` | Yes | The city. |
| `stateProvince` | `String` | Yes | The name of the state or province. See "Address Field Values" for allowed values. |
| `country` | `String` | Yes | The name of the country. See "Address Field Values" for allowed values. |
| `postalCode` | `String` | No | The postal code. |
| `addressType` | `String` | Yes | The type of address. See "Address Field Values" for allowed values. |

#### Address Field Values

The `addressType`, `stateProvince`, and `country` fields are not free-form strings. They are mapped to pre-configured values in Fineract. Providing a value that is not configured in Fineract will result in an error.

*   **`addressType`**:
    *   `Residential`
    *   `Business`
    *   `Other`
*   **`country`**:
    *   `Cameroon`
*   **`stateProvince`**:
    *   `Adamaoua`
    *   `Centre`
    *   `East`
    *   `Far North`
    *   `Littoral`
    *   `North`
    *   `North-West`
    *   `South`
    *   `South-West`
    *   `West`

#### Sample Request

```json
{
  "street": "Rue Deido",
  "addressLine1": "B.P. 1234",
  "city": "Douala",
  "stateProvince": "Littoral",
  "country": "Cameroon",
  "postalCode": "00237",
  "addressType": "Residential"
}
```

### 4.4. API Responses

-   **Success (`200 OK`):** A JSON object with the `resourceId` of the newly created address is returned.
-   **Error (`400 Bad Request`):** Returned for validation errors or if an invalid value is provided for `addressType`, `stateProvince`, or `country`.
-   **Error (`401 Unauthorized`):** Returned if the request lacks a valid JWT.
-   **Error (`403 Forbidden`):** Returned if the user does not have the `ROLE_KYC_MANAGER` authority.

#### Sample Success Response

```json
{
    "resourceId": 15
}
```

---

## 5. Update Client Address

### 5.1. API Endpoint

#### `PUT /api/profile/addresses`

This endpoint updates an existing address for the authenticated Fineract client. It supports partial updates, so you only need to provide the fields you want to change.

### 5.2. Security Model

-   **Authentication:** Requires a valid JWT `Bearer` token.
-   **Authorization:** Access is restricted by method-level security. The caller must have a valid JWT containing the `ROLE_KYC_MANAGER` authority. The service determines the Fineract client ID from a `fineract_client_id` or `fineract_external_id` claim in the JWT.

### 5.3. Request Payload

The endpoint expects a `Content-Type: application/json` body.

| Field | Type | Required | Description |
|---|---|---|---|
| `addressId` | `Long` | Yes | The ID of the address in Fineract to update. |
| `street` | `String` | No | The new street name. |
| `addressLine1` | `String` | No | Additional address line 1. |
| `addressLine2` | `String` | No | Additional address line 2. |
| `addressLine3` | `String` | No | Additional address line 3. |
| `city` | `String` | No | The new city. |
| `stateProvince` | `String` | No | The new name of the state or province. See "Address Field Values" for allowed values. |
| `country` | `String` | No | The new name of the country. See "Address Field Values" for allowed values. |
| `postalCode` | `String` | No | The new postal code. |
| `addressType` | `String` | Yes | The type of address. See "Address Field Values" for allowed values. |

**Note on `addressType`, `stateProvince`, and `country`:** As with creating an address, these fields are sent as strings (e.g., "Business", "Littoral", "Cameroon") and are converted to their corresponding IDs on the backend.

#### Sample Request

```json
{
  "addressId": 15,
  "street": "Avenue Deido",
  "addressType": "Business"
}
```

### 5.4. API Responses

-   **Success (`200 OK`):** A JSON object with the `resourceId` of the updated address is returned.
-   **Error (`400 Bad Request`):** Returned for validation errors or if an invalid value is provided for `addressType`, `stateProvince`, or `country`.
-   **Error (`401 Unauthorized`):** Returned if the request lacks a valid JWT.
-   **Error (`403 Forbidden`):** Returned if the user does not have the `ROLE_KYC_MANAGER` authority.

#### Sample Success Response

```json
{
    "resourceId": 15
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
**Objective:** Verify that a KYC Manager can retrieve the addresses for the authenticated client.
**Expected Result:** `200 OK`

```bash
curl --location --request GET 'http://localhost:8081/api/profile/addresses' \
--header "Authorization: Bearer $TOKEN"
```

### 6.5. Test Case: Get Client Addresses (FAILURE)
**Objective:** Verify that a user without the `ROLE_KYC_MANAGER` authority cannot retrieve addresses.
**Expected Result:** `403 Forbidden`

*Note: This test requires generating a token for a user that does **not** have the `ROLE_KYC_MANAGER` authority.*

```bash
# Assuming $USER_TOKEN is a token for a non-manager user
curl --location --request GET 'http://localhost:8081/api/profile/addresses' \
--header "Authorization: Bearer $USER_TOKEN"
```
### 6.6. Test Case: Create Client Address (SUCCESS)
**Objective:** Verify that a new address can be created for the authenticated client.
**Expected Result:** `200 OK`

```bash
curl --location --request POST 'http://localhost:8081/api/profile/addresses' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
    "street": "Rue Deido",
    "addressLine1": "B.P. 1234",
    "city": "Douala",
    "stateProvince": "Littoral",
    "country": "Cameroon",
    "postalCode": "00237",
    "addressType": "Residential"
}'
```

### 6.7. Test Case: Update Client Address (SUCCESS)
**Objective:** Verify that an existing address can be updated for the authenticated client.
**Expected Result:** `200 OK`



```bash
curl --location --request PUT 'http://localhost:8081/api/profile/addresses' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $TOKEN" \
--data-raw '{
        
    "addressType": "Residential",
    "street": "Avenue Deido",
    "addressType": "Business"
}'
```
