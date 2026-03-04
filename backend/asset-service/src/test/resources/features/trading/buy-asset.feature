@trading @buy
Feature: Buy Asset via Quote Flow
  As an authenticated user
  I want to create a buy quote and confirm it
  So that I can build my portfolio

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Successful buy quote and confirm
    When the user creates a BUY quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"
    And the quote response side should be "BUY"
    And the quote response units should be "5"
    And the quote response should include a non-null orderId
    And the quote response should include a positive fee
    When the user confirms the quoted order
    Then the response status should be 202
    And the order response should have status "PENDING"

  Scenario: Buy against a halted asset
    Given asset "asset-001" has been halted by an admin
    When the user creates a BUY quote for "5" units of asset "asset-001"
    Then the response status should be 409
    And the response error code should be "TRADING_HALTED"

  Scenario: Buy quote missing X-Idempotency-Key header
    When the user creates a BUY quote without an idempotency key for asset "asset-001"
    Then the response status should be 400
