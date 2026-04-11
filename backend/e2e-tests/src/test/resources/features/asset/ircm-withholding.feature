@e2e @bonds @ircm
Feature: IRCM Withholding on Coupon Payments (E2E)
  As the asset platform
  I want IRCM (Impôt sur les Revenus des Capitaux Mobiliers) to be withheld
  on non-exempt corporate bond coupon payments
  So that investors receive correct net amounts and the tax authority is credited

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 2000000

  # -----------------------------------------------------------------
  # Taxable bond: IRCM fields present in schedule detail
  # -----------------------------------------------------------------

  @smoke
  Scenario: IRCM is withheld from taxable OTA coupon — schedule detail has IRCM fields
    Given an active taxable coupon bond "IRC" priced at 10000 with supply 100 and interest rate 7.00 and IRCM rate 16.5
    And the user holds 1 units of bond "IRC"
    When the scheduler creates a pending coupon schedule for "IRC"
    Then a PENDING scheduled payment should exist for "IRC" with type "COUPON"
    And the scheduled payment detail should include IRCM fields
    And the gross amount per unit should be greater than 0
    And the IRCM withheld per unit should be greater than 0
    And the net amount per unit should be less than gross amount per unit

  Scenario: IRCM withheld per unit equals gross times IRCM rate
    Given an active taxable coupon bond "IRR" priced at 10000 with supply 100 and interest rate 7.00 and IRCM rate 16.5
    And the user holds 1 units of bond "IRR"
    When the scheduler creates a pending coupon schedule for "IRR"
    Then the IRCM withheld per unit should be approximately 16.5 percent of gross per unit

  Scenario: IRCM: net plus withheld equals gross (no leakage)
    Given an active taxable coupon bond "IRL" priced at 10000 with supply 100 and interest rate 7.00 and IRCM rate 16.5
    And the user holds 1 units of bond "IRL"
    When the scheduler creates a pending coupon schedule for "IRL"
    Then the IRCM net plus withheld should equal gross amount per unit

  # -----------------------------------------------------------------
  # Taxable bond: investor receives net after confirmation
  # -----------------------------------------------------------------

  Scenario: Investor receives net amount (not gross) after IRCM deduction
    Given an active taxable coupon bond "IRN" priced at 10000 with supply 100 and interest rate 7.00 and IRCM rate 16.5
    And the user holds 1 units of bond "IRN"
    When the scheduler creates a pending coupon schedule for "IRN"
    And the admin confirms the scheduled payment
    Then the scheduled payment status should be "CONFIRMED"
    And the user's XAF balance should have increased after coupon
    And the net increase should be less than the gross coupon amount

  # -----------------------------------------------------------------
  # Government bond: IRCM-exempt
  # -----------------------------------------------------------------

  Scenario: Government bond coupon has no IRCM withholding
    Given an active government bond "IRG" priced at 10000 with supply 100 and interest rate 7.00
    And the user holds 1 units of bond "IRG"
    When the scheduler creates a pending coupon schedule for "IRG"
    Then a PENDING scheduled payment should exist for "IRG" with type "COUPON"
    And the scheduled payment should have ircmExempt equal to true
    And the IRCM withheld per unit should be 0
    When the admin confirms the scheduled payment
    Then the user's XAF balance should have increased after coupon

  # -----------------------------------------------------------------
  # BVMAC-listed bond: 11% IRCM rate
  # -----------------------------------------------------------------

  Scenario: BVMAC-listed bond with long maturity uses 5.5% bond IRCM rate
    Given an active BVMAC-listed bond "BVM" priced at 10000 with supply 100 and interest rate 8.00
    And the user holds 1 units of bond "BVM"
    When the scheduler creates a pending coupon schedule for "BVM"
    Then a PENDING scheduled payment should exist for "BVM" with type "COUPON"
    And the scheduled payment should have ircmExempt equal to false
    And the IRCM withheld per unit should be approximately 5.5 percent of gross per unit
