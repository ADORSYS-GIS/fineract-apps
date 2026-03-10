@trading @sell
Feature: Sell Asset via Quote Flow
  As an authenticated user who holds asset units
  I want to create a sell quote and confirm it
  So that I can realize profits or rebalance my portfolio

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Successful sell quote and confirm
    Given user 42 holds 20 units of asset "asset-001" at average price 100
    When the user creates a SELL quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"
    And the quote response side should be "SELL"
    And the quote response units should be "5"
    When the user confirms the quoted order
    Then the response status should be 202
    And the order response should have status "PENDING"

  Scenario: Sell more units than held
    Given user 42 holds 3 units of asset "asset-001" at average price 100
    When the user creates a SELL quote for "10" units of asset "asset-001"
    Then the response status should be 422
    And the response error code should be "INSUFFICIENT_UNITS"
