@trading @buy
Feature: Buy Asset
  As an authenticated user
  I want to buy asset units on the marketplace
  So that I can build my portfolio

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Successful buy order
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"
    And the trade response side should be "BUY"
    And the trade response units should be "5"
    And the trade response should include a non-null orderId
    And the trade response should include a positive fee
    And the response conforms to the OpenAPI schema

  Scenario: Buy against a halted asset
    Given asset "asset-001" has been halted by an admin
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 409
    And the response error code should be "TRADING_HALTED"

  Scenario: Buy missing X-Idempotency-Key header
    When the user submits a BUY order without an idempotency key for asset "asset-001"
    Then the response status should be 400
