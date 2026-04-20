@e2e @bonds @ota
Feature: OTA Accrued Interest on Trade (E2E)
  As the asset platform
  I want OTA (coupon bond) trades to include accrued interest ("pied du coupon")
  So that buyers compensate sellers for interest accrued since the last coupon

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 5000000

  # -----------------------------------------------------------------
  # OTA Creation with day count convention
  # -----------------------------------------------------------------

  Scenario: Create OTA bond with explicit day count convention
    When the admin creates a bond asset:
      | name                  | Cameroun OTA 5Y    |
      | symbol                | OTA                |
      | bondType              | COUPON             |
      | dayCountConvention    | ACT_365            |
      | issuerCountry         | CAMEROUN           |
      | initialPrice          | 10000              |
      | totalSupply           | 1000               |
      | issuerName            | Republique du Cameroun |
      | interestRate          | 7.00               |
      | couponFrequencyMonths | 12                 |
      | maturityDate          | +5y                |
      | nextCouponDate        | +6m                |
    Then the response status should be 201
    And the response body should contain "COUPON"
    And the response body should contain "ACT_365"

  # -----------------------------------------------------------------
  # Accrued interest in BUY quote
  # -----------------------------------------------------------------

  Scenario: BUY quote includes accrued interest for OTA bond
    Given an active coupon bond asset "OTB" priced at 10000 with supply 100 and interest rate 7.00 and coupon due in 6 months
    When the user previews a BUY of 1 units of "OTB"
    Then the response status should be 201
    And the quote response should contain "accruedInterestAmount"
    And the accrued interest in the quote should be greater than 0

  # -----------------------------------------------------------------
  # Accrued interest in SELL proceeds
  # -----------------------------------------------------------------

  Scenario: SELL proceeds include accrued interest for OTA bond
    Given an active coupon bond asset "OTC" priced at 10000 with supply 100 and interest rate 7.00 and coupon due in 6 months
    And the user holds 2 units of coupon bond "OTC"
    When the user previews a SELL of 1 units of "OTC"
    Then the response status should be 201
    And the quote response should contain "accruedInterestAmount"
    And the accrued interest in the quote should be greater than 0
