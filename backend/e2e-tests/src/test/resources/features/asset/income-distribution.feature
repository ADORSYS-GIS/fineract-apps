@e2e @income
Feature: Income Distribution (E2E)
  As the platform
  I want non-bond assets to show income projections to users
  So that users can see expected income before buying

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 5000000

  # -----------------------------------------------------------------
  # Income benefit projections in preview
  # -----------------------------------------------------------------

  Scenario: BUY preview includes income benefit projections for income asset
    Given an active income asset "RNT" with price 5000, supply 1000, income type "RENT", rate 8.0, frequency 1
    When the user previews a BUY of 10 units of "RNT"
    Then the response status should be 200
    And the preview should be feasible
    And the preview should include income benefit projections
    And the income benefit income type should be "RENT"
    And the income benefit should be variable income

  Scenario: BUY preview does not include income projections for non-income asset
    Given an active stock asset "NIN" with price 1000 and supply 1000
    When the user previews a BUY of 10 units of "NIN"
    Then the response status should be 200
    And the preview should be feasible
    And the preview should not include income benefit projections
