# Customer Registration API Testing Guide (with curl)

This document provides `curl` commands to test the entire Customer Registration Service API flow.

---

## Step 1: Register a New Customer and Store the externalId

This command will register a new user and then automatically extract the `externalId` from the JSON response and store it in a shell variable called `EXTERNAL_ID`.

### Command

```bash
EXTERNAL_ID=$(curl -s --location --request POST "http://localhost:8081/api/registration/register" \
--header "Content-Type: application/json" \
--data '{
    "firstName": "John1",
    "lastName": "Doe1",
    "email": "johndoe1@example.com",
    "phone": "+12345678903",
    "dateOfBirth": "1990-01-15",
    "nationalId": "123456789",
    "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "postalCode": "12345",
        "country": "USA"
    }
}' | jq -r '.externalId')
```

You can check that the ID is stored by running `echo $EXTERNAL_ID`.

---

## Step 2: Get an Authentication Token

The other endpoints are protected. You need an authentication token from Keycloak to call them.

### Command to Get and Store the Token

The following command will get the token and save it to a shell variable named `TOKEN`. This avoids having to copy and paste it. This command requires you to have `jq` installed (`sudo apt-get install jq`).

Replace the username, password, and client secret with your values.

```bash
TOKEN=$(curl -s --location --request POST "http://localhost:9000/realms/fineract/protocol/openid-connect/token" \
--header "Content-Type: application/x-www-form-urlencoded" \
--data-urlencode "client_id=setup-app-client" \
--data-urlencode "client_secret=**********" \
--data-urlencode "username=johndoe1@example.com" \
--data-urlencode "password=password" \
--data-urlencode "grant_type=password" | jq -r '.access_token')
```

You can check that the token is stored by running `echo $TOKEN`.

---

## Step 3: Test the Protected Endpoints

Now you can use the `$TOKEN` and `$EXTERNAL_ID` shell variables in your requests.

### Get Registration Status

**Command:**

```bash
curl --location --request GET "http://localhost:8081/api/registration/status/$EXTERNAL_ID" \
--header "Authorization: Bearer $TOKEN"
```

### Get KYC Status

**Command:**

```bash
curl --location --request GET "http://localhost:8081/api/registration/kyc/status" \
--header "X-External-Id: $EXTERNAL_ID" \
--header "Authorization: Bearer $TOKEN"
```

### Get Transaction Limits

**Command:**

```bash
curl --location --request GET "http://localhost:8081/api/registration/limits" \
--header "X-External-Id: $EXTERNAL_ID" \
--header "Authorization: Bearer $TOKEN"
```

### Upload KYC Document

**Command:**
Update the path to your document (`@/path/to/your/id_front.jpg`).

```bash
curl --location --request POST "http://localhost:8081/api/registration/kyc/documents" \
--header "Authorization: Bearer $TOKEN" \
--form "documentType=id_front" \
--form "file=@/path/to/your/id_front.jpg"
```
