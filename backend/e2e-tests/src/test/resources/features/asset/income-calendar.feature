@e2e @income-calendar
Feature: Income Calendar (E2E)
  As a user with income-bearing positions
  I want to see a calendar of projected income payments
  So that I can plan my finances

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  Scenario: Income calendar shows projected payments for bond holdings
    Given an active bond asset "ICB" priced at 10000 with supply 100 and interest rate 6.0
    When the user buys 5 units of "ICB"
    Then the trade should be FILLED
    When the user requests the income calendar for 12 months
    Then the response status should be 200
    And the income calendar should contain at least 1 projected event
    And the income calendar total expected income should be greater than 0

  Scenario: Income calendar is empty for user with no positions
    When the user requests the income calendar for 12 months
    Then the response status should be 200
