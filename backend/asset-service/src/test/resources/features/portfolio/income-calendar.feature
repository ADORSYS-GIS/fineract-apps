@portfolio @income
Feature: Portfolio Income Calendar
  As an authenticated user
  I want to see projected income events for my portfolio
  So that I can plan around expected coupons, dividends, and other payments

  Background:
    Given the test database is seeded with standard data

  Scenario: User with no positions sees empty calendar
    When the user requests the income calendar for 12 months
    Then the response status should be 200
    And the income calendar should have 0 events
    And the income calendar totalExpectedIncome should be 0

  Scenario: Bond holder sees coupon projections
    Given an active bond "bond-cal" with:
      | interestRate          | 6.00  |
      | couponFrequencyMonths | 6     |
      | nextCouponDate        | +3m   |
      | manualPrice           | 10000 |
    And user 42 holds 10 units of bond "bond-cal"
    When the user requests the income calendar for 12 months
    Then the response status should be 200
    And the income calendar should contain events of type "COUPON"
    And the income calendar totalExpectedIncome should be positive

  Scenario: Income-bearing asset shows projected distributions
    Given an active asset "rent-cal" with income distribution:
      | incomeType                  | RENT  |
      | incomeRate                  | 4.00  |
      | distributionFrequencyMonths | 3     |
      | nextDistributionDate        | +2m   |
      | price                       | 5000  |
    And user 42 holds 10 units of asset "rent-cal"
    When the user requests the income calendar for 12 months
    Then the response status should be 200
    And the income calendar should contain events of type "RENT"

  Scenario: Asset without income fields produces no events
    Given user 42 holds 10 units of asset "asset-001"
    When the user requests the income calendar for 12 months
    Then the income calendar should have 0 events

  Scenario: Invalid months parameter rejected
    When the user requests the income calendar for 0 months
    Then the response status should be 500
