# Customer Registration API Documentation

## 1. Overview

This document provides a detailed description of the Customer Registration Service API. The service is responsible for registering new customers by creating a corresponding client entry in Fineract. It is a Fineract-only process, with all dependencies on Keycloak removed.

## 2. API Endpoint

### `POST /api/registration/register`

This is the primary endpoint for registering a new customer. It orchestrates the entire registration process, which involves validating the incoming data and creating a new client in Fineract.

---

## 3. Request Payload

The request payload must be a JSON object with the following fields.

| Field         | Type     | Compulsory | Description                                                                                      |
| :------------ | :------- | :--------- | :----------------------------------------------------------------------------------------------- |
| `externalId`  | `String` | **Yes**    | A unique identifier for the customer. This ID is provided by the client.                         |
| `firstName`   | `String` | **Yes**    | The customer's first name.                                                                       |
| `lastName`    | `String` | **Yes**    | The customer's last name.                                                                        |
| `email`       | `String` | **Yes**    | The customer's email address. It must be a valid email format (e.g., `user@example.com`).        |
| `phone`       | `String` | **Yes**    | The customer's phone number. It must match the regex `^\\+?[0-9]{9,15}$`.                       |
| `nationalId`  | `String` | No         | The customer's national identification number.                                                   |
| `dateOfBirth` | `String` | No         | The customer's date of birth in `YYYY-MM-DD` format.                                             |
| `gender`      | `String` | No         | The customer's gender. **Note: This field is not currently sent to Fineract.**                  |
| `address`     | `Object` | No         | An object containing the customer's address details. **Note: This field is not currently sent to Fineract.** |
| `address.street`    | `String` | No         | The street name and number.                                                                      |
| `address.city`      | `String` | No         | The city name.                                                                                   |
| `address.postalCode`| `String` | No         | The postal or ZIP code.                                                                          |
| `address.country`   | `String` | No         | The country name.                                                                                |

**Example Request:**

```json
{
  "externalId": "c7a9a7a7-8f5b-4f5a-b5a7-a7a7a7a7a7a7",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "postalCode": "12345",
    "country": "USA"
  }
}
```

---

## 4. Response Payload

If the registration is successful, the API will return a `201 Created` status code with a JSON object containing the following fields:

| Field              | Type      | Description                                                 |
| :----------------- | :-------- | :---------------------------------------------------------- |
| `success`          | `boolean` | Indicates whether the registration was successful.         |
| `status`           | `String`  | A status message, which will be "success" on completion.    |
| `fineractClientId` | `Long`    | The unique identifier for the newly created client in Fineract. |

**Example Response:**

```json
{
  "success": true,
  "status": "success",
  "fineractClientId": 12345
}
```

---

## 5. Orchestration and Fineract Integration

The registration process is orchestrated by the `RegistrationService`, which uses the `FineractService` to interact with the Fineract API.

1.  **Receive Request**: The `RegistrationController` receives the `POST` request and passes the `RegistrationRequest` payload to the `RegistrationService`.
2.  **Create Fineract Client**: The `RegistrationService` calls the `FineractService` to create a new client in Fineract, mapping the fields from the request to the Fineract client API as follows:

| Fineract Field   | Source                            | Notes                                                               |
| :--------------- | :-------------------------------- | :------------------------------------------------------------------ |
| `officeId`       | Configuration                     | A hardcoded value from the service's configuration.                 |
| `firstname`      | `RegistrationRequest.firstName`   | Direct mapping.                                                     |
| `lastname`       | `RegistrationRequest.lastName`    | Direct mapping.                                                     |
| `externalId`     | `RegistrationRequest.externalId`  | The unique ID for the client.                                       |
| `mobileNo`       | `RegistrationRequest.phone`       | Direct mapping.                                                     |
| `emailAddress`   | `RegistrationRequest.email`       | Direct mapping.                                                     |
| `active`         | Hardcoded                         | Always set to `false` initially.                                    |
| `legalFormId`    | Hardcoded                         | Always set to `1` (Person).                                         |
| `locale`         | Hardcoded                         | Always set to `en`.                                                 |
| `dateFormat`     | Hardcoded                         | Always set to `dd MMMM yyyy`.                                       |
| `dateOfBirth`    | `RegistrationRequest.dateOfBirth` | Sent only if provided in the request, formatted to `dd MMMM yyyy`. |

3.  **Return Response**: Once the Fineract client is successfully created, the `RegistrationService` constructs the `RegistrationResponse` and returns it to the controller, which then sends it to the client.

**Note on Address and Gender Fields:** The `address` and `gender` fields are not currently sent to Fineract due to complexities in mapping the string values from the request to the numeric IDs required by the Fineract API. This functionality will be implemented once a clear mapping strategy is defined.

---

## 6. How to Test

You can test the registration endpoint using a `curl` command. Make sure the service is running and replace the placeholder values in the example below with your test data.

```bash
curl -X POST 'http://localhost:8080/api/registration/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "externalId": "c7a9a7a7-8f5b-4f5a-b5a7-a7a7a7a7a7a7",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "postalCode": "12345",
    "country": "USA"
  }
}'
```

A successful request will return a `201 Created` status code and a JSON response body as described in the "Response Payload" section.
