@e2e @preview @amount
Feature: Amount-Based Trade Preview (E2E)
  As a user
  I want to preview a BUY trade by specifying an XAF amount
  So that the system computes how many units I can purchase for that budget

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Amount-based preview: BUY
  # -----------------------------------------------------------------

  Scenario: Preview BUY with XAF amount computes units and remainder
    Given an active stock asset "AMT" with price 1000 and supply 10000
    When the user previews a BUY with amount 50000 XAF for asset "AMT"
    Then the response status should be 200
    And the preview should be feasible
    And the preview units should be greater than 0
    And the preview should include computedFromAmount equal to 50000
    And the preview should include a non-negative remainder
    And the preview netAmount plus remainder should approximately equal the amount

  Scenario: Preview BUY with amount too small for 1 unit
    Given an active stock asset "BIG" with price 999999 and supply 100
    When the user previews a BUY with amount 100 XAF for asset "BIG"
    Then the response status should be 200
    And the preview should not be feasible
    And the preview blockers should contain "AMOUNT_TOO_SMALL"

  # -----------------------------------------------------------------
  # Unit-based preview still works
  # -----------------------------------------------------------------

  Scenario: Preview BUY with units still works as before
    Given an active stock asset "UNT" with price 1000 and supply 10000
    When the user previews a BUY of 10 units of "UNT"
    Then the response status should be 200
    And the preview should be feasible
    And the preview should not include computedFromAmount
