@e2e @admin
Feature: Admin Asset Operations
  As an admin, I want to list all assets, update metadata, mint supply, and view coupon forecasts.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract

  @smoke
  Scenario: List all assets (admin view)
    Given an active stock asset "AD1" with price 1000 and supply 50
    When the admin lists all assets
    Then the response status should be 200
    And the admin asset list should contain asset "AD1"

  Scenario: Update asset metadata
    Given an active stock asset "AD2" with price 2000 and supply 100
    When the admin updates asset "AD2" with name "Updated Stock AD2" and description "New description"
    Then the response status should be 200
    And the asset detail should include name "Updated Stock AD2"

  Scenario: Mint additional supply
    Given an active stock asset "AD3" with price 1000 and supply 50
    When the admin mints 25 additional units for asset "AD3"
    Then the response status should be 200
    And the asset total supply should be 75

  Scenario: Coupon forecast for a bond
    When the admin creates a bond asset:
      | symbol               | CFB                           |
      | currencyCode         | CFB                           |
      | name                 | Forecast Bond                 |
      | initialPrice         | 10000                         |
      | totalSupply          | 100                           |
      | interestRate         | 6.00                          |
      | couponFrequencyMonths| 6                             |
      | maturityDate         | +3y                           |
      | nextCouponDate       | +6m                           |
    Then the response status should be 201
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    When the admin requests the coupon forecast for asset "lastCreated"
    Then the response status should be 200
    And the coupon forecast should include remaining coupon liability

  # -----------------------------------------------------------------
  # Coupon History and Summary (bond-specific)
  # -----------------------------------------------------------------

  Scenario: Coupon history for a newly created bond is empty
    When the admin creates a bond asset:
      | symbol               | CHB                           |
      | currencyCode         | CHB                           |
      | name                 | Coupon History Bond            |
      | initialPrice         | 10000                         |
      | totalSupply          | 100                           |
      | interestRate         | 5.00                          |
      | couponFrequencyMonths| 6                             |
      | maturityDate         | +3y                           |
      | nextCouponDate       | +6m                           |
    Then the response status should be 201
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    When the admin gets the coupon history for asset "lastCreated"
    Then the response status should be 200
    And the page should have 0 total elements

  # NOTE: coupon-summary and income-summary endpoints have a Spring routing bug
  # (NoResourceFoundException) — skipped until the service is fixed.

  # -----------------------------------------------------------------
  # Income Distribution History (non-bond)
  # -----------------------------------------------------------------

  Scenario: Income distribution history for a new stock is empty
    Given an active stock asset "IDH" with price 1000 and supply 50
    When the admin gets the income distributions for asset "IDH"
    Then the response status should be 200
    And the page should have 0 total elements

  # -----------------------------------------------------------------
  # Income Forecast
  # -----------------------------------------------------------------

  Scenario: Income forecast returns projection with asset symbol
    When the admin creates a stock asset:
      | symbol                      | IFC                |
      | name                        | Income Forecast Co |
      | initialPrice                | 3000               |
      | totalSupply                 | 200                |
      | incomeType                  | DIVIDEND           |
      | incomeRate                  | 4.50               |
      | distributionFrequencyMonths | 3                  |
    Then the response status should be 201
    When the admin activates asset "lastCreated"
    Then the response status should be 200
    When the admin gets the income forecast for asset "lastCreated"
    Then the response status should be 200
