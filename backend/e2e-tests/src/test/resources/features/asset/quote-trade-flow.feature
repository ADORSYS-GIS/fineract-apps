@e2e @quotes
Feature: Quote-Based Trade Flow (E2E)
  As the asset platform
  I want trades to use the async quote-confirm flow
  So that users get locked prices and real-time order status updates

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Quote → Confirm → FILLED (Buy)
  # -----------------------------------------------------------------

  Scenario: Create buy quote, confirm, and verify FILLED
    Given an active stock asset "QBY" with price 1000 and supply 100
    When the user creates a BUY quote for 5 units of "QBY"
    Then the quote should be QUOTED
    And the quote should have an expiry time
    When the user confirms the quote
    Then the order should eventually be FILLED
    And the user's XAF balance in Fineract should have decreased by approximately 5500
    And the asset circulating supply should be 5

  # -----------------------------------------------------------------
  # Quote → Confirm → FILLED (Sell)
  # -----------------------------------------------------------------

  Scenario: Create sell quote after buying
    Given an active stock asset "QSL" with price 2000 and supply 100
    When the user buys 10 units of "QSL"
    Then the trade should be FILLED
    When the user creates a SELL quote for 5 units of "QSL"
    Then the quote should be QUOTED
    When the user confirms the quote
    Then the order should eventually be FILLED
    And the user's XAF balance in Fineract should have increased

  # -----------------------------------------------------------------
  # Quote Expiry
  # -----------------------------------------------------------------

  Scenario: Quote expires when not confirmed
    Given an active stock asset "QEX" with price 500 and supply 100
    When the user creates a BUY quote for 1 units of "QEX"
    Then the quote should be QUOTED
    When the quote TTL expires
    Then the order status should be CANCELLED

  # -----------------------------------------------------------------
  # Cancel Quote
  # -----------------------------------------------------------------

  Scenario: Cancel a quote before confirmation
    Given an active stock asset "QCN" with price 500 and supply 100
    When the user creates a BUY quote for 2 units of "QCN"
    Then the quote should be QUOTED
    When the user cancels the quote
    Then the order status should be CANCELLED

  # -----------------------------------------------------------------
  # Confirm Expired Quote
  # -----------------------------------------------------------------

  Scenario: Cannot confirm expired quote
    Given an active stock asset "QCE" with price 500 and supply 100
    When the user creates a BUY quote for 1 units of "QCE"
    And the quote TTL expires
    When the user tries to confirm the expired quote
    Then the confirmation should be rejected

  # -----------------------------------------------------------------
  # Idempotency
  # -----------------------------------------------------------------

  Scenario: Quote idempotency returns same quote
    Given an active stock asset "QID" with price 500 and supply 100
    When the user creates two BUY quotes for 1 units of "QID" with the same idempotency key
    Then both responses should have the same order ID
