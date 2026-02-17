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

## 4. Local Testing via cURL

To test the service logic, use the following `curl` commands.

### 4.1. Obtain an Access Token

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

### 4.2. Test Case: Update Customer Profile (SUCCESS)
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

### 4.3. Test Case: Update a Single Field (SUCCESS)
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

### 4.4. Test Case: Get Client Addresses (SUCCESS)
**Objective:** Verify that a KYC Manager can retrieve the addresses for a specific client.
**Expected Result:** `200 OK`

*Note: Replace `123` with an actual Fineract Client ID.*

```bash
curl --location --request GET 'http://localhost:8081/api/profile/clients/123/addresses' \
--header "Authorization: Bearer $TOKEN"
```

### 4.5. Test Case: Get Client Addresses (FAILURE)
**Objective:** Verify that a user without the `ROLE_KYC_MANAGER` authority cannot retrieve addresses.
**Expected Result:** `403 Forbidden`

*Note: This test requires generating a token for a user that does **not** have the `ROLE_KYC_MANAGER` authority.*

```bash
# Assuming $USER_TOKEN is a token for a non-manager user
curl --location --request GET 'http://localhost:8081/api/profile/clients/123/addresses' \
--header "Authorization: Bearer $USER_TOKEN"
```
