@e2e @bonds @bta
Feature: BTA (Discount Bond) Lifecycle (E2E)
  As the asset platform
  I want to support BTA (Bons du Tresor Assimilables) discount bonds
  So that the LP can resell BEAC treasury bills to retail investors

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 5000000

  # -----------------------------------------------------------------
  # BTA Creation
  # -----------------------------------------------------------------

  Scenario: Create and activate a BTA (discount bond) asset
    When the admin creates a bond asset:
      | name                  | Cameroun BTA 52W   |
      | symbol                | BTA                |
      | bondType              | DISCOUNT           |
      | dayCountConvention    | ACT_360            |
      | issuerCountry         | CAMEROUN           |
      | initialPrice          | 1000000            |
      | totalSupply           | 100                |
      | issuerName            | Republique du Cameroun |
      | maturityDate          | +52w               |
    Then the response status should be 201
    And the response body should contain "DISCOUNT"
    And the response body should contain "currentYield"
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    And the asset should be in ACTIVE status

  # -----------------------------------------------------------------
  # BTA Purchase
  # -----------------------------------------------------------------

  Scenario: Buy BTA units from LP
    Given an active discount bond asset "BTB" priced at 1000000 with supply 50
    When the user buys 1 unit of "BTB"
    Then the response status should be 200
    And the trade should be FILLED
    And the asset circulating supply should be 1

  # -----------------------------------------------------------------
  # BTA has no coupon scheduling
  # -----------------------------------------------------------------

  Scenario: BTA has no coupon payments scheduled
    Given an active discount bond asset "BTC" priced at 1000000 with supply 50
    And the user holds 2 units of discount bond "BTC"
    When the interest payment scheduler runs for "BTC"
    Then no pending scheduled payments should exist for "BTC"
    And the accrued interest for the user on "BTC" should be 0

  # -----------------------------------------------------------------
  # BTA Maturity & Redemption
  # -----------------------------------------------------------------

  Scenario: Redeem matured BTA at face value
    Given an active discount bond asset "BTD" priced at 1000000 with supply 50
    And the user holds 1 unit of discount bond "BTD"
    When the maturity scheduler runs
    Then the bond should be in MATURED status
    When the admin triggers bond redemption for "BTD"
    Then the redemption should succeed
    And the user's XAF balance should have increased by approximately 1000000
    And redemption records should exist for the bond
