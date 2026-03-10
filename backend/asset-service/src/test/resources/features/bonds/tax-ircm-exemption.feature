@bonds @tax @ircm
Feature: IRCM Withholding on Income Distributions
  As the system scheduler
  I want IRCM to be withheld from coupon and income payments
  So that the platform complies with Cameroon IRCM regulations

  Background:
    Given Fineract transfer is mocked to succeed

  Scenario: Government bond coupon has zero IRCM withholding
    Given an active bond "gov-bond-001" with:
      | interestRate          | 5.80  |
      | couponFrequencyMonths | 6     |
      | nextCouponDate        | today |
      | issuerPrice           | 10000 |
      | isGovernmentBond      | true  |
      | ircmExempt            | true  |
    And user 42 holds 10 units of bond "gov-bond-001"
    When the interest payment scheduler runs
    And the admin confirms the scheduled payment for bond "gov-bond-001"
    Then the IRCM withholding for bond "gov-bond-001" should be 0

  Scenario: Corporate bond coupon has 5.5% IRCM for 5yr+ maturity
    Given an active bond "corp-bond-001" with:
      | interestRate          | 5.80  |
      | couponFrequencyMonths | 6     |
      | nextCouponDate        | today |
      | issuerPrice           | 10000 |
      | isGovernmentBond      | false |
    And user 42 holds 10 units of bond "corp-bond-001"
    When the interest payment scheduler runs
    And the admin confirms the scheduled payment for bond "corp-bond-001"
    Then the IRCM withholding for bond "corp-bond-001" should be greater than 0
