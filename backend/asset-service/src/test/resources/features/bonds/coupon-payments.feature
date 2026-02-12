@bonds @coupon
Feature: Bond Coupon Payments
  As the system scheduler
  I want coupon payments to be distributed to bond holders in XAF
  So that investors receive periodic interest

  Background:
    Given Fineract transfer is mocked to succeed

  Scenario: Coupon payment distributed to holders
    Given an active bond "bond-001" with:
      | interestRate          | 5.80  |
      | couponFrequencyMonths | 6     |
      | nextCouponDate        | today |
      | manualPrice           | 10000 |
    And user 42 holds 10 units of bond "bond-001"
    When the interest payment scheduler runs
    Then 1 coupon payment records should exist for bond "bond-001"
    And the next coupon date for bond "bond-001" should be advanced by 6 months

  Scenario: Coupon payment with no holders advances date only
    Given an active bond "bond-003" with nextCouponDate today and no holders
    When the interest payment scheduler runs
    Then the next coupon date for bond "bond-003" should be advanced
    And 0 coupon payment records should exist for bond "bond-003"
