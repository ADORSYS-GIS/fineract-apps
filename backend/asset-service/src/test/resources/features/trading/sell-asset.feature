@trading @sell
Feature: Sell Asset
  As an authenticated user who holds asset units
  I want to sell units back to the marketplace
  So that I can realize profits or rebalance my portfolio

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Successful sell order
    Given user 42 holds 20 units of asset "asset-001" at average price 100
    When the user submits a SELL order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"
    And the trade response side should be "SELL"
    And the trade response units should be "5"
    And the response conforms to the OpenAPI schema

  Scenario: Sell more units than held
    Given user 42 holds 3 units of asset "asset-001" at average price 100
    When the user submits a SELL order for "10" units of asset "asset-001"
    Then the response status should be 422
    And the response error code should be "INSUFFICIENT_UNITS"
