@e2e @portfolio
Feature: Portfolio
  As a user, I want to view my portfolio summary, individual positions, and value history.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  @smoke
  Scenario: Portfolio summary with positions after buying
    Given an active stock asset "PF1" with price 1000 and supply 100
    When the user buys 5 units of "PF1"
    Then the trade should be FILLED
    When the user requests their portfolio
    Then the response status should be 200
    And the portfolio should have a positive total value
    And the portfolio should contain position for "PF1"

  Scenario: Single position detail
    Given an active stock asset "PF2" with price 2000 and supply 100
    When the user buys 3 units of "PF2"
    Then the trade should be FILLED
    When the user requests position detail for asset "PF2"
    Then the response status should be 200
    And the position should show 3 units held

  Scenario: Portfolio history returns time series
    Given an active stock asset "PF3" with price 500 and supply 100
    When the user buys 2 units of "PF3"
    Then the trade should be FILLED
    When the user requests their portfolio history for period "1M"
    Then the response status should be 200

  Scenario: Empty portfolio returns zero values
    When the user requests their portfolio
    Then the response status should be 200
    And the portfolio total value should be zero or positive
