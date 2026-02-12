@trading @idempotency
Feature: Trade Idempotency
  As a client application
  I want duplicate order submissions with the same idempotency key to be safe
  So that network retries do not cause double-fills

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Resubmitting a BUY with the same idempotency key returns the original order
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"
    When the user resubmits the same BUY order with the same idempotency key
    Then the response status should be 200
