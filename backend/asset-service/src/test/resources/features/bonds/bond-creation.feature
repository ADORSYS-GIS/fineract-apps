@bonds @create
Feature: Bond Asset Creation
  As an asset manager
  I want to create bond-type assets with coupon parameters
  So that fixed-income products can be offered on the marketplace

  Background:
    Given Fineract provisioning is mocked to succeed

  Scenario: Successfully create a bond with all required fields
    When the admin creates a bond asset with:
      | name                  | Senegal Bond 2030 |
      | symbol                | SN8               |
      | currencyCode          | SN8               |
      | category              | BONDS             |
      | initialPrice          | 10000             |
      | totalSupply           | 500               |
      | decimalPlaces         | 0                 |
      | issuer                | Etat du Senegal   |
      | isinCode              | SN0000038741      |
      | maturityDate          | +5y               |
      | interestRate          | 5.80              |
      | couponFrequencyMonths | 6                 |
      | nextCouponDate        | +6m               |
      | subscriptionStartDate | -1m               |
      | subscriptionEndDate   | +1y               |
    Then the response status should be 201
    And the response body should contain field "category" with value "BONDS"
    And the response body should contain field "issuer" with value "Etat du Senegal"

  Scenario: Bond creation fails without issuer
    When the admin creates a bond asset without an issuer
    Then the response status should be 400
    And the response body should contain "Issuer is required"

  Scenario: Bond creation fails with past maturity date
    When the admin creates a bond asset with maturity date in the past
    Then the response status should be 400
    And the response body should contain "Maturity date must be in the future"

  Scenario: Bond creation fails with invalid coupon frequency
    When the admin creates a bond asset with coupon frequency 5
    Then the response status should be 400
    And the response body should contain "must be"
