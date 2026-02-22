@portfolio
Feature: Portfolio Tracking
  As an authenticated user
  I want to view my portfolio positions and P&L
  So that I can track my investment performance

  Background:
    Given the test database is seeded with standard data

  Scenario: User with no positions sees empty portfolio
    When the user requests their portfolio
    Then the response status should be 200
    And the portfolio should have 0 positions
    And the response conforms to the OpenAPI schema

  Scenario: User sees positions after data setup
    Given user 42 holds 10 units of asset "asset-001" at average price 100
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    When the user requests their portfolio
    Then the response status should be 200
    And the portfolio should have 1 positions

  Scenario: Single position detail
    Given user 42 holds 10 units of asset "asset-001" at average price 100
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    When the user requests the position for asset "asset-001"
    Then the response status should be 200
    And the position should show unrealized P&L
