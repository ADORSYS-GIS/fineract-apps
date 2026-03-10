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
      | POST   | /trades/quote                 |
      | GET    | /trades/orders                |
      | GET    | /portfolio                    |
      | GET    | /portfolio/positions/asset-001 |
      | GET    | /favorites                    |
      | POST   | /favorites/asset-001          |
      | DELETE | /favorites/asset-001          |

  Scenario Outline: Public endpoints return 200 without JWT
    When an unauthenticated user calls "GET" "<path>"
    Then the response status should be 200

    Examples:
      | path                      |
      | /assets               |
      | /assets/asset-001     |
      | /prices/asset-001     |
      | /market/status        |
