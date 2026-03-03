@trading @lp-adequacy
Feature: LP Capital Adequacy
  As a platform operator
  I want sell orders rejected when the LP has insufficient funds
  So that investors are protected from failed payouts

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed
    And user 42 holds 20 units of asset "asset-001" at average price 100

  Scenario: Sell rejected when LP cash insufficient
    Given the LP cash account for asset "asset-001" has balance "100"
    When the user submits a SELL order for "5" units of asset "asset-001"
    Then the response status should be 400
    And the response error code should be "INSUFFICIENT_LP_FUNDS"

  Scenario: Sell succeeds when LP has sufficient cash
    Given the LP cash account for asset "asset-001" has balance "1000000"
    When the user submits a SELL order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"
