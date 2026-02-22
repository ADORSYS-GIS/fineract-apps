@security @authentication
Feature: Authentication Enforcement
  As the API security system
  I want unauthenticated requests to protected endpoints to be rejected
  So that only authenticated users can access sensitive operations

  Background:
    Given the test database is seeded with standard data

  Scenario Outline: Protected endpoints return 401 without JWT
    When an unauthenticated user calls "<method>" "<path>"
    Then the response status should be 401

    Examples:
      | method | path                              |
      | POST   | /api/trades/preview               |
      | POST   | /api/trades/buy                   |
      | POST   | /api/trades/sell                  |
      | GET    | /api/trades/orders                |
      | GET    | /api/portfolio                    |
      | GET    | /api/portfolio/positions/asset-001 |
      | GET    | /api/favorites                    |
      | POST   | /api/favorites/asset-001          |
      | DELETE | /api/favorites/asset-001          |

  Scenario Outline: Public endpoints return 200 without JWT
    When an unauthenticated user calls "GET" "<path>"
    Then the response status should be 200

    Examples:
      | path                      |
      | /api/assets               |
      | /api/assets/asset-001     |
      | /api/prices/asset-001     |
      | /api/market/status        |
