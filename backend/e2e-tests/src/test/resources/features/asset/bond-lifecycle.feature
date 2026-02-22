@e2e @bonds
Feature: Bond Asset Lifecycle (E2E)
  As the asset platform
  I want bonds to support coupon payments, maturity, and principal redemption
  So that bond investors receive interest and principal through real Fineract transfers

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Bond Creation
  # -----------------------------------------------------------------

  Scenario: Create and activate a bond asset
    When the admin creates a bond asset:
      | name                  | E2E Test Bond |
      | symbol                | EBD           |
      | initialPrice          | 10000         |
      | totalSupply           | 1000          |
      | issuer                | Test Corp     |
      | interestRate          | 5.80          |
      | couponFrequencyMonths | 6             |
      | maturityDate          | +5y           |
      | nextCouponDate        | +6m           |
    Then the response status should be 201
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    And the asset should be in ACTIVE status

  # -----------------------------------------------------------------
  # Buy Bond
  # -----------------------------------------------------------------

  Scenario: Buy bond units
    Given an active bond asset "BND" priced at 10000 with supply 100 and interest rate 5.80
    When the user buys 2 units of "BND"
    Then the response status should be 200
    And the trade should be FILLED
    And the user's XAF balance in Fineract should have decreased by approximately 20000
    And the asset circulating supply should be 2

  # -----------------------------------------------------------------
  # Coupon Payment
  # -----------------------------------------------------------------

  Scenario: Trigger coupon payment for bond holders
    Given an active bond asset "CPN" priced at 10000 with supply 100 and interest rate 5.80
    And the user holds 5 units of bond "CPN"
    When the admin triggers coupon payment for bond "CPN"
    Then the response status should be 200
    And the coupon trigger should succeed with 1 payments
    And the user's XAF balance should have increased after coupon
    And coupon payment records should exist for the bond

  # -----------------------------------------------------------------
  # Maturity & Redemption
  # -----------------------------------------------------------------

  Scenario: Redeem matured bond principal
    Given an active bond asset "MAT" priced at 10000 with supply 100 and interest rate 5.80
    And the user holds 3 units of bond "MAT"
    When the maturity scheduler runs
    Then the bond should be in MATURED status
    When the admin triggers bond redemption for "MAT"
    Then the redemption should succeed
    And the user's XAF balance should have increased after redemption
    And the user should no longer hold units of bond "MAT"
    And redemption records should exist for the bond
