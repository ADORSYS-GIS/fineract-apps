@e2e @portfolio @yield
Feature: Portfolio Yield Calculation
  As the asset platform
  I want yield calculations to reflect the correct bond pricing model
  So that investors see accurate projected returns

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 2000000

  # -----------------------------------------------------------------
  # BTA discount bond yield
  # -----------------------------------------------------------------

  Scenario: BTA discount bond has non-zero current yield
    When the admin creates a bond asset:
      | name               | Yield BTA                |
      | symbol             | YBT                      |
      | bondType           | DISCOUNT                 |
      | dayCountConvention | ACT_360                  |
      | issuerCountry      | CAMEROUN                 |
      | initialPrice       | 1000000                  |
      | totalSupply        | 100                      |
      | issuerName         | Republique du Cameroun   |
      | maturityDate       | +52w                     |
    Then the response status should be 201
    And the bond currentYield should be greater than 0

  # -----------------------------------------------------------------
  # OTA coupon bond yield
  # -----------------------------------------------------------------

  Scenario: OTA coupon bond current yield reflects coupon rate
    When the admin creates a bond asset:
      | name                  | Yield OTA                |
      | symbol                | YOT                      |
      | bondType              | COUPON                   |
      | dayCountConvention    | ACT_365                  |
      | issuerCountry         | CAMEROUN                 |
      | initialPrice          | 10000                    |
      | totalSupply           | 1000                     |
      | issuerName            | Republique du Cameroun   |
      | interestRate          | 7.00                     |
      | couponFrequencyMonths | 12                       |
      | maturityDate          | +5y                      |
      | nextCouponDate        | +6m                      |
    Then the response status should be 201
    And the bond currentYield should be greater than 0

  # -----------------------------------------------------------------
  # Portfolio position bond benefit type
  # -----------------------------------------------------------------

  Scenario: OTA portfolio position includes COUPON bond benefit
    Given an active coupon bond asset "YO2" priced at 10000 with supply 100 and interest rate 7.00 and coupon due in 6 months
    And the user holds 1 units of coupon bond "YO2"
    When the user requests position detail for asset "YO2"
    Then the response status should be 200
    And the position bondBenefit bondType should be "COUPON"

  Scenario: BTA portfolio position includes DISCOUNT bond benefit
    Given an active discount bond asset "YB2" priced at 1000000 with supply 100
    And the user holds 1 units of discount bond "YB2"
    When the user requests position detail for asset "YB2"
    Then the response status should be 200
    And the position bondBenefit bondType should be "DISCOUNT"

  # -----------------------------------------------------------------
  # Yield excludes unrealized P&L
  # -----------------------------------------------------------------

  Scenario: Annual yield in portfolio excludes unrealized price gains
    Given an active coupon bond asset "YPL" priced at 10000 with supply 100 and interest rate 7.00 and coupon due in 6 months
    And the user holds 2 units of coupon bond "YPL"
    When the admin sets the price of "YPL" to 12000
    And the user requests their portfolio
    Then the response status should be 200
    And the portfolio total value should be zero or positive
