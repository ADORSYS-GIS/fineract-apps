@security @authorization
Feature: Role-Based Access Control
  As the API security system
  I want admin endpoints to require the ASSET_MANAGER role
  So that regular users cannot manage assets

  Background:
    Given the test database is seeded with standard data

  Scenario: Regular user cannot access admin list endpoint
    When a user with role "ROLE_USER" calls "GET" "/api/admin/assets"
    Then the response status should be 403

  Scenario: Asset manager can access admin list endpoint
    When a user with role "ROLE_ASSET_MANAGER" calls "GET" "/api/admin/assets"
    Then the response status should be 200

  Scenario Outline: Admin endpoints require ASSET_MANAGER role
    When a user with role "ROLE_USER" calls "<method>" "<path>"
    Then the response status should be 403

    Examples:
      | method | path                                 |
      | GET    | /api/admin/assets                    |
      | GET    | /api/admin/assets/asset-001          |
      | POST   | /api/admin/assets/asset-001/activate |
      | POST   | /api/admin/assets/asset-001/halt     |
      | POST   | /api/admin/assets/asset-001/resume   |
      | GET    | /api/admin/inventory                 |
