@e2e @reconciliation
Feature: Fineract Reconciliation (E2E)
  As the platform administrator
  I want to verify that asset-service state is consistent with Fineract
  So that we can trust the accounting integrity of the platform

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Balance Reconciliation After Multiple Trades
  # -----------------------------------------------------------------

  Scenario: User XAF balance reconciles after buy and sell
    Given an active stock asset "REC" with price 2000 and supply 100
    When the user buys 5 units of "REC"
    Then the trade should be FILLED
    And the user's XAF balance in Fineract should have decreased by approximately 10000
    When the user sells 3 units of "REC"
    Then the trade should be FILLED
    And the user's XAF balance in Fineract should have increased
    And the asset circulating supply should be 2

  # -----------------------------------------------------------------
  # Asset Provisioning Creates Fineract Resources
  # -----------------------------------------------------------------

  Scenario: Activated asset creates savings product and treasury accounts in Fineract
    When the admin creates a stock asset:
      | name         | Reconciliation Stock |
      | symbol       | RCST                 |
      | initialPrice | 3000                 |
      | totalSupply  | 500                  |
    Then the response status should be 201
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    And the treasury should have a RCST account with balance 500 in Fineract
