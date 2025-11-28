# Fineract GL Accounts API Documentation

This document outlines the key API endpoints for managing General Ledger (GL) accounts in Fineract.

---

## 1. Retrieve All GL Accounts

- **Endpoint:** `GET /v1/glaccounts`
- **Description:** Retrieves a list of all GL accounts. This can be used to populate the "View GL Accounts" screen in your application.
- **Query Parameters:**
    - `type` (Integer, Optional): Filter by account type (1: Asset, 2: Liability, 3: Equity, 4: Income, 5: Expense).
    - `manualEntriesAllowed` (Boolean, Optional): Filter accounts based on whether manual journal entries are permitted.
    - `usage` (Integer, Optional): Filter by account usage (e.g., 1 for Detail, 2 for Header).
    - `disabled` (Boolean, Optional): Filter to retrieve active or inactive accounts.
    - `fetchRunningBalance` (Boolean, Optional): Set to `true` to include the running balance for each account.
- **Sample Response:**
  ```json
  [
      {
          "id": 1,
          "name": "Office Equipment",
          "parentId": null,
          "glCode": "1001",
          "disabled": false,
          "manualEntriesAllowed": true,
          "type": {
              "id": 1,
              "value": "ASSET"
          },
          "usage": {
              "id": 1,
              "value": "DETAIL"
          },
          "tagId": {},
          "organizationRunningBalance": 5000.00
      }
  ]
  ```

---

## 2. Retrieve a Single GL Account

- **Endpoint:** `GET /v1/glaccounts/{glAccountId}`
- **Description:** Fetches the details of a specific GL account by its ID.
- **Path Parameter:**
    - `glAccountId` (Long): The ID of the GL account.
- **Sample Response:**
  ```json
  {
      "id": 1,
      "name": "Office Equipment",
      "parentId": null,
      "glCode": "1001",
      "disabled": false,
      "manualEntriesAllowed": true,
      "type": {
          "id": 1,
          "value": "ASSET"
      },
      "usage": {
          "id": 1,
          "value": "DETAIL"
      },
      "tagId": {},
      "organizationRunningBalance": 5000.00
  }
  ```

---

## 3. Create a GL Account

- **Endpoint:** `POST /v1/glaccounts`
- **Description:** Creates a new GL account.
- **Mandatory Fields:** `name`, `glCode`, `type`, `usage`, `manualEntriesAllowed`.
- **Sample Request:**
  ```json
  {
      "name": "Petty Cash",
      "glCode": "1002",
      "type": "ASSET",
      "usage": "DETAIL",
      "manualEntriesAllowed": true,
      "description": "Petty cash for daily expenses."
  }
  ```

---

## 4. Update a GL Account

- **Endpoint:** `PUT /v1/glaccounts/{glAccountId}`
- **Description:** Updates the details of an existing GL account.
- **Path Parameter:**
    - `glAccountId` (Long): The ID of the GL account to update.
- **Sample Request:**
  ```json
  {
      "name": "Petty Cash on Hand",
      "description": "Updated description for petty cash."
  }
  ```

---

## 5. Delete a GL Account

- **Endpoint:** `DELETE /v1/glaccounts/{glAccountId}`
- **Description:** Deletes a GL account.
- **Path Parameter:**
    - `glAccountId` (Long): The ID of the GL account to delete.# Fineract GL Closures API Documentation

This document outlines the key API endpoints for managing General Ledger (GL) closures in Fineract.

---

## 1. Retrieve All Closures

- **Endpoint:** `GET /v1/glclosures`
- **Description:** Retrieves a list of all GL closures.
- **Query Parameters:**
    - `officeId` (Long, Optional): Filter closures by a specific office.
- **Sample Response:**
  ```json
  [
      {
          "id": 1,
          "officeId": 1,
          "officeName": "Head Office",
          "closingDate": "2023-12-31",
          "comments": "End of year closure."
      }
  ]
  ```

---

## 2. Retrieve a Single Closure

- **Endpoint:** `GET /v1/glclosures/{glClosureId}`
- **Description:** Fetches the details of a specific GL closure by its ID.
- **Path Parameter:**
    - `glClosureId` (Long): The ID of the GL closure.
- **Sample Response:**
  ```json
  {
      "id": 1,
      "officeId": 1,
      "officeName": "Head Office",
      "closingDate": "2023-12-31",
      "comments": "End of year closure."
  }
  ```

---

## 3. Create a Closure

- **Endpoint:** `POST /v1/glclosures`
- **Description:** Creates a new GL closure.
- **Mandatory Fields:** `officeId`, `closingDate`.
- **Sample Request:**
  ```json
  {
      "officeId": 1,
      "closingDate": "2024-01-31",
      "comments": "End of month closure for January."
  }
  ```

---

## 4. Update a Closure

- **Endpoint:** `PUT /v1/glclosures/{glClosureId}`
- **Description:** Updates the comments of an existing GL closure.
- **Path Parameter:**
    - `glClosureId` (Long): The ID of the GL closure to update.
- **Sample Request:**
  ```json
  {
      "comments": "Updated comments for the closure."
  }
  ```

---

## 5. Delete a Closure

- **Endpoint:** `DELETE /v1/glclosures/{glClosureId}`
- **Description:** Deletes the latest GL closure for a branch.
- **Path Parameter:**
    - `glClosureId` (Long): The ID of the GL closure to delete.# Fineract Journal Entries API Documentation

This document outlines the key API endpoints for managing Journal Entries in Fineract.

---

## 1. Retrieve Journal Entries

- **Endpoint:** `GET /v1/journalentries`
- **Description:** Retrieves a list of all journal entries, with optional filters.
- **Query Parameters:**
    - `officeId` (Long, Optional): Filter by a specific office.
    - `glAccountId` (Long, Optional): Filter by a specific GL account.
    - `onlyManualEntries` (Boolean, Optional): Filter for manual entries only.
    - `fromDate` (Date, Optional): The start date for the search. **Requires `locale` and `dateFormat`.**
    - `toDate` (Date, Optional): The end date for the search. **Requires `locale` and `dateFormat`.**
    - `locale` (String, **Required**): The locale for date parsing (e.g., `en`).
    - `dateFormat` (String, **Required**): The format of the date (e.g., `yyyy-MM-dd`).
    - `transactionId` (String, Optional): Filter by a specific transaction ID.
    - `offset` (Integer, Optional): The number of records to skip for pagination.
    - `limit` (Integer, Optional): The number of records to return for pagination.
- **Sample Response (Paginated):**
  ```json
  {
      "totalFilteredRecords": 1,
      "pageItems": [
          {
              "id": 1,
              "officeId": 1,
              "officeName": "Head Office",
              "glAccountName": "Office Equipment",
              "glAccountId": 1,
              "glAccountCode": "1001",
              "glAccountType": {
                  "id": 1,
                  "value": "ASSET"
              },
              "transactionDate": "2024-01-15",
              "entryType": {
                  "id": 2,
                  "value": "DEBIT"
              },
              "amount": 500.00,
              "transactionId": "J001",
              "manualEntry": true
          }
      ]
  }
  ```

---

## 2. Retrieve a Single Journal Entry

- **Endpoint:** `GET /v1/journalentries/{journalEntryId}`
- **Description:** Fetches the details of a specific journal entry by its ID.
- **Path Parameter:**
    - `journalEntryId` (Long): The ID of the journal entry.
- **Sample Response:**
  ```json
  {
      "id": 1,
      "officeId": 1,
      "officeName": "Head Office",
      "glAccountName": "Office Equipment",
      "glAccountId": 1,
      "glAccountCode": "1001",
      "glAccountType": {
          "id": 1,
          "value": "ASSET"
      },
      "transactionDate": "2024-01-15",
      "entryType": {
          "id": 2,
          "value": "DEBIT"
      },
      "amount": 500.00,
      "transactionId": "J001",
      "manualEntry": true,
      "transactionDetails": {
          ...
      }
  }
  ```

---

## 3. Create a Journal Entry

- **Endpoint:** `POST /v1/journalentries`
- **Description:** Creates a new journal entry. The entry must be balanced (total debits must equal total credits).
- **Mandatory Fields:** `officeId`, `transactionDate`, `locale`, `dateFormat`, `credits` (at least one), `debits` (at least one).
- **Sample Request:**
  ```json
  {
      "officeId": 1,
      "transactionDate": "2024-01-16",
      "locale": "en",
      "dateFormat": "yyyy-MM-dd",
      "comments": "Purchase of new office chairs",
      "credits": [
          {
              "glAccountId": 2,
              "amount": 250.00
          }
      ],
      "debits": [
          {
              "glAccountId": 1,
              "amount": 250.00
          }
      ]
  }
  ```

---

## 4. Reverse a Journal Entry

- **Endpoint:** `POST /v1/journalentries/{transactionId}?command=reverse`
- **Description:** Reverses a previously created journal entry.
- **Path Parameter:**
    - `transactionId` (String): The ID of the transaction to reverse.
- **Sample Request:** (The body can be empty)
  ```json
  {}
```

---

## Pagination

For endpoints that support pagination (like Retrieve Journal Entries), Fineract uses `offset` and `limit` query parameters to control the result set.

- `offset` (Integer, Optional): The number of records to skip. Used for pagination.
- `limit` (Integer, Optional): The number of records to return. Used for pagination. The default and maximum values are determined by system settings.

Paginated responses are wrapped in an object that includes the total number of records and the list of items for the current page.

**Sample Paginated Response Structure:**
```json
{
    "totalFilteredRecords": 100,
    "pageItems": [
        { ... record 1 ... },
        { ... record 2 ... },
        ...
    ]
}
```