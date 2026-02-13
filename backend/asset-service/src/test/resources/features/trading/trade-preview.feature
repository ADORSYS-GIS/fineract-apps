@trading @preview
Feature: Trade Preview
  As an authenticated user
  I want to preview a trade before executing it
  So that I can see the price quote, fees, and feasibility

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"

  Scenario: Preview a feasible BUY
    When the user previews a "BUY" of "5" units of asset "asset-001"
    Then the response status should be 200
    And the preview should be feasible
    And the preview should include a positive executionPrice
    And the preview should include a positive fee
    And the preview should include a positive netAmount

  Scenario: Preview an infeasible BUY - insufficient funds
    Given Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "10"
    When the user previews a "BUY" of "5" units of asset "asset-001"
    Then the response status should be 200
    And the preview should not be feasible with blocker "INSUFFICIENT_FUNDS"

  Scenario: Preview an infeasible BUY - insufficient inventory
    When the user previews a "BUY" of "9999" units of asset "asset-001"
    Then the response status should be 200
    And the preview should not be feasible with blocker "INSUFFICIENT_INVENTORY"

  Scenario: Preview a SELL with no position
    When the user previews a "SELL" of "5" units of asset "asset-001"
    Then the response status should be 200
    And the preview should not be feasible with blocker "NO_POSITION"
