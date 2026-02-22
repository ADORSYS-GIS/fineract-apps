@e2e @trades
Feature: Trade Preview & Order History
  As a user, I want to preview trades before executing and view my order history.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  @smoke
  Scenario: Preview a BUY trade
    Given an active stock asset "TP1" with price 2000 and supply 100
    When the user previews a BUY of 5 units of "TP1"
    Then the response status should be 200
    And the preview should be feasible
    And the preview should show side "BUY"
    And the preview should show a positive gross amount

  Scenario: Preview a SELL trade without holdings returns infeasible
    Given an active stock asset "TP2" with price 2000 and supply 100
    When the user previews a SELL of 5 units of "TP2"
    Then the response status should be 200
    And the preview should not be feasible

  Scenario: List order history after a buy
    Given an active stock asset "TP3" with price 2000 and supply 100
    When the user buys 3 units of "TP3"
    Then the trade should be FILLED
    When the user requests their order history
    Then the response status should be 200
    And the order history should contain at least 1 order

  Scenario: Get single order detail
    Given an active stock asset "TP4" with price 2000 and supply 100
    When the user buys 2 units of "TP4"
    Then the trade should be FILLED
    When the user requests the detail of the last order
    Then the response status should be 200
    And the order detail should show status "FILLED"

  Scenario: Filter orders by asset
    Given an active stock asset "TP5" with price 2000 and supply 100
    When the user buys 1 units of "TP5"
    Then the trade should be FILLED
    When the user requests their order history for asset "TP5"
    Then the response status should be 200
    And the order history should contain at least 1 order
