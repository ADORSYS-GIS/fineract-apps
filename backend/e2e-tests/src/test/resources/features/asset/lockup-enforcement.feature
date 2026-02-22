@e2e @lockup
Feature: Lock-up Period Enforcement (E2E)
  As the platform
  I want to enforce lock-up periods on assets
  So that users cannot immediately sell after buying

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 100000

  # -----------------------------------------------------------------
  # Lock-up prevents immediate sell
  # -----------------------------------------------------------------

  Scenario: SELL preview blocked during lock-up period
    Given an active stock asset "LCK" with price 1000, supply 1000, and lockup days 30
    When the user buys 5 units of "LCK"
    Then the trade should be FILLED
    When the user previews a SELL of 5 units of "LCK"
    Then the response status should be 200
    And the preview should not be feasible
    And the preview blockers should contain "LOCKUP_PERIOD_ACTIVE"

  # -----------------------------------------------------------------
  # No lock-up allows immediate sell
  # -----------------------------------------------------------------

  Scenario: SELL preview allowed when no lock-up is set
    Given an active stock asset "NLK" with price 1000 and supply 1000
    When the user buys 5 units of "NLK"
    Then the trade should be FILLED
    When the user previews a SELL of 5 units of "NLK"
    Then the response status should be 200
    And the preview should be feasible
