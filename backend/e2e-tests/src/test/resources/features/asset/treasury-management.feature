@e2e @treasury
Feature: Treasury Management (E2E)
  As the platform administrator
  I want treasury balances in Fineract to match asset-service state
  So that we maintain correct accounting across both systems

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # GL Account Verification
  # -----------------------------------------------------------------

  Scenario: Fineract GL accounts are properly provisioned
    Then the Fineract GL accounts should include codes "47,42,65,48,87,91"

  # -----------------------------------------------------------------
  # Treasury Balance After Trades
  # -----------------------------------------------------------------

  Scenario: Treasury balance matches after stock purchase
    Given an active stock asset "TRS" with price 1000 and supply 100
    When the user buys 10 units of "TRS"
    Then the trade should be FILLED
    And the treasury asset account balance in Fineract should match the asset-service inventory
    And the treasury should have received XAF for 10 units at price 1000

  # -----------------------------------------------------------------
  # Client Account Verification
  # -----------------------------------------------------------------

  Scenario: Treasury and test user have savings accounts in Fineract
    Then the treasury client should have savings accounts in Fineract
    And the test user should have a savings account for currency "XAF" in Fineract
