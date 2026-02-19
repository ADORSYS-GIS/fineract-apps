@e2e @stocks
Feature: Stock Asset Lifecycle (E2E)
  As the asset platform
  I want the full stock lifecycle to work end-to-end
  So that assets are correctly provisioned in Fineract and trades settle properly

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Asset Creation & Fineract Provisioning
  # -----------------------------------------------------------------

  Scenario: Create and activate a stock asset with Fineract provisioning
    When the admin creates a stock asset:
      | name         | E2E Test Stock |
      | symbol       | TST            |
      | initialPrice | 5000           |
      | totalSupply  | 10000          |
    Then the response status should be 201
    And the response body should contain field "status" with value "PENDING"
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    And the asset should be in ACTIVE status

  # -----------------------------------------------------------------
  # Buy Flow with Fineract Balance Verification
  # -----------------------------------------------------------------

  Scenario: Buy stock and verify Fineract balances
    Given an active stock asset "STK" with price 1000 and supply 100
    When the user buys 5 units of "STK"
    Then the response status should be 200
    And the trade should be FILLED
    And the user's XAF balance in Fineract should have decreased by approximately 5000
    And the asset circulating supply should be 5

  # -----------------------------------------------------------------
  # Sell Flow with P&L
  # -----------------------------------------------------------------

  Scenario: Sell stock and verify Fineract credit
    Given an active stock asset "SLL" with price 2000 and supply 100
    When the user buys 10 units of "SLL"
    Then the trade should be FILLED
    When the user sells 5 units of "SLL"
    Then the trade should be FILLED
    And the trade should include realized PnL
    And the user's XAF balance in Fineract should have increased
    And the asset circulating supply should be 5

  # -----------------------------------------------------------------
  # Asset Lifecycle: Halt & Resume
  # -----------------------------------------------------------------

  Scenario: Halt and resume trading
    Given an active stock asset "HLT" with price 500 and supply 50
    When the admin halts asset "lastCreated"
    Then the response status should be 200
    And the asset should be in HALTED status
    When the admin resumes asset "lastCreated"
    Then the response status should be 200
    And the asset should be in ACTIVE status

  # -----------------------------------------------------------------
  # Price Update
  # -----------------------------------------------------------------

  Scenario: Admin sets a new price
    Given an active stock asset "PRC" with price 1000 and supply 100
    When the admin sets the price of "lastCreated" to 1500
    Then the response status should be 200
