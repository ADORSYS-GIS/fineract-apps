@e2e @errors
Feature: Error Scenarios (E2E)
  As the asset platform
  I want trades to be properly rejected when preconditions are not met
  So that the system prevents invalid operations and maintains integrity

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Halted Trading
  # -----------------------------------------------------------------

  Scenario: Cannot buy a halted asset
    Given an active stock asset "ERR" with price 500 and supply 100
    And the asset "ERR" is halted
    When the user tries to buy 1 units of halted asset "ERR"
    Then the trade should be rejected

  # -----------------------------------------------------------------
  # Insufficient Inventory
  # -----------------------------------------------------------------

  Scenario: Cannot buy more units than available supply
    Given an active stock asset "INV" with price 100 and supply 5
    When the user buys more units than available supply of "INV"
    Then the trade should be rejected

  # -----------------------------------------------------------------
  # Sell Without Holdings
  # -----------------------------------------------------------------

  Scenario: Cannot sell without holding units
    Given an active stock asset "NSL" with price 1000 and supply 100
    When the user tries to sell 1 units of "NSL" without holding any
    Then the trade should be rejected

  # -----------------------------------------------------------------
  # Idempotency
  # -----------------------------------------------------------------

  Scenario: Duplicate buy order with same idempotency key is idempotent
    Given an active stock asset "IDP" with price 500 and supply 100
    When the user sends two identical buy orders for 1 units of "IDP"
    Then the idempotent order should return the same result
    And only one trade should be recorded in the trade log
