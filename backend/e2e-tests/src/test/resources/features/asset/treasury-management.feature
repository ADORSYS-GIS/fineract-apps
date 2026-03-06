@e2e @lp
Feature: LP Account Management (E2E)
  As the platform administrator
  I want LP balances in Fineract to match asset-service state
  So that we maintain correct accounting across both systems

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # GL Account Verification
  # -----------------------------------------------------------------

  Scenario: Fineract GL accounts are properly provisioned
    Then the Fineract GL accounts should include codes "47,42,65,48,87,91"

  # -----------------------------------------------------------------
  # LP Balance After Trades
  # -----------------------------------------------------------------

  Scenario: LP balance matches after stock purchase
    Given an active stock asset "TRS" with price 1000 and supply 100
    When the user buys 10 units of "TRS"
    Then the trade should be FILLED
    And the LP asset account balance in Fineract should match the asset-service inventory
    And the LP should have received XAF for 10 units at price 1000

  # -----------------------------------------------------------------
  # Client Account Verification
  # -----------------------------------------------------------------

  Scenario: LP and test user have savings accounts in Fineract
    Then the LP client should have savings accounts in Fineract
    And the test user should have a savings account for currency "XAF" in Fineract
