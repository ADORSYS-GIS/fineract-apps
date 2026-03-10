@trading @idempotency
Feature: Quote Idempotency
  As a client application
  I want duplicate quote requests with the same idempotency key to be safe
  So that network retries do not cause duplicate quotes

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Resubmitting a quote with the same idempotency key returns the original quote
    When the user creates a BUY quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"
    When the user resubmits the same quote with the same idempotency key
    Then the response status should be 201
    And the quote response should have status "QUOTED"
