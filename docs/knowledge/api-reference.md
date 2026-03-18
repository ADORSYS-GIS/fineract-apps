# API Reference — fineract-apps

## Overview
The API is a set of RESTful microservices that follow standard HTTP conventions.

- **Base URL:** Each service has its own base URL, but they are all exposed under a common domain. For example, `https://api.your-domain.com/asset-service/api/v1`.
- **Versioning:** The API is versioned via the URL path (e.g., `/api/v1`).
- **Content-Type:** The API uses `application/json` for all requests and responses.
- **Character Encoding:** UTF-8

## Authentication
The API uses OAuth 2.0 with JWT Bearer tokens for authentication. All requests must include an `Authorization` header with a valid JWT.

| Method | Header | Format |
|--------------|-----------------|----------------|
| Bearer Token | `Authorization` | `Bearer <token>` |

### Obtaining a Token
Tokens are obtained from Keycloak by completing an OIDC login flow. The frontend applications handle this process automatically.

## Endpoints

### Resource: Asset Catalog
Endpoints for browsing the asset marketplace.

| Method | Path | Description | Auth Required |
|--------|-----------------------------|---------------------------------------------------------|---------------|
| GET | `/assets` | List active assets (paginated, with filtering and search). | No |
| GET | `/assets/{id}` | Get full details for a single asset. | No |
| GET | `/assets/{id}/recent-trades`| Get the last 20 executed trades for an asset. | No |
| GET | `/assets/discover` | Discover upcoming assets. | No |

### Resource: Trading
Endpoints for buying and selling assets.

| Method | Path | Description | Auth Required |
|--------|-----------------------------|---------------------------------------------------------|---------------|
| POST | `/trades/quote` | Create a trade quote to lock in a price for a short time. | Yes |
| POST | `/trades/orders/{id}/confirm`| Confirm a quoted order to execute the trade. | Yes |
| GET | `/trades/orders/{id}/stream`| Stream the status of an order using SSE. | Yes |
| GET | `/trades/orders` | Get the user's order history (paginated). | Yes |
| GET | `/trades/orders/{id}` | Get the status of a single order. | Yes |
| POST | `/trades/orders/{id}/cancel` | Cancel an order. | Yes |

The Asset Service also contains other controllers for admin operations, portfolio management, and notifications. These are not documented here for brevity.

### Resource: Payment Gateway
Endpoints for handling payments.

| Method | Path | Description | Auth Required |
|--------|-----------------------------------|---------------------------------------|---------------|
| POST | `/api/payments/deposit` | Initiate a deposit. | Yes |
| POST | `/api/payments/withdraw` | Initiate a withdrawal. | Yes |
| GET | `/api/payments/status/{transactionId}`| Get the status of a transaction. | Yes |

### Resource: Customer Self-Service
Endpoints for customer registration and account management.

| Method | Path | Description | Auth Required |
|--------|-----------------------------------|---------------------------------------|---------------|
| POST | `/api/registration/register` | Register a new customer. | Yes |
| POST | `/api/registration/approve-and-deposit`| Approve and deposit funds. | Yes |

## Error Codes
The API uses standard HTTP status codes to indicate the success or failure of a request.

| HTTP Status | Error Code | Description |
|-------------|----------------------|--------------------------------------------------------------------------------|
| 400 | `VALIDATION_ERROR` | The request was malformed or contained invalid parameters. |
| 401 | `UNAUTHORIZED` | The request requires authentication, but no valid token was provided. |
| 403 | `FORBIDDEN` | The authenticated user does not have permission to perform the requested action. |
| 404 | `NOT_FOUND` | The requested resource could not be found. |
| 409 | `CONFLICT` | The request could not be completed due to a conflict with the current state of the resource. |
| 422 | `UNPROCESSABLE_ENTITY` | The request was well-formed but could not be processed due to semantic errors. |
| 429 | `RATE_LIMITED` | The user has sent too many requests in a given amount of time. |
| 500 | `INTERNAL_ERROR` | An unexpected error occurred on the server. |

### Error Response Format
All error responses follow a standard format:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A human-readable message describing the error.",
    "details": [
      {
        "field": "fieldName",
        "message": "Specific error message for the field."
      }
    ]
  }
}
```

## Rate Limiting
The API employs rate limiting to prevent abuse and ensure service stability. The limits are applied per user.

| Tier | Limit | Window |
|---------|--------------------|------------|
| Trading | 10 requests | per minute |
| General | 100 requests | per minute |

When the rate limit is exceeded, the API will return a `429 Too Many Requests` status code. The following headers are included in the response to provide more information about the rate limit:

- `X-RateLimit-Limit`: The maximum number of requests allowed in the current window.
- `X-RateLimit-Remaining`: The number of requests remaining in the current window.
- `X-RateLimit-Reset`: The time at which the current window will reset, in UTC epoch seconds.

## Pagination
The API uses offset-based pagination for all list endpoints. The following query parameters can be used to control the pagination:

- `page`: The page number to retrieve (0-indexed). Defaults to `0`.
- `size`: The number of items per page. Defaults to `20`.
- `sort`: A comma-separated list of properties to sort by, with an optional direction (e.g., `name,asc`).

The response for a paginated endpoint is a JSON object with the following structure:

```json
{
  "content": [
    // ... list of items for the current page
  ],
  "pageable": {
    "sort": {
      "sorted": true,
      "unsorted": false,
      "empty": false
    },
    "offset": 0,
    "pageNumber": 0,
    "pageSize": 20,
    "paged": true,
    "unpaged": false
  },
  "totalPages": 10,
  "totalElements": 198,
  "last": false,
  "size": 20,
  "number": 0,
  "sort": {
    "sorted": true,
    "unsorted": false,
    "empty": false
  },
  "numberOfElements": 20,
  "first": true,
  "empty": false
}
```

