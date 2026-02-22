@admin @create-asset
Feature: Create Asset
  As an asset manager
  I want to create new assets via the admin API
  So that new tradeable products are available on the marketplace

  Background:
    Given Fineract provisioning is mocked to succeed

  Scenario: Successfully create a stock asset
    When the admin creates an asset with:
      | name          | Test Stock |
      | symbol        | TSTK       |
      | currencyCode  | TSTK       |
      | category      | STOCKS     |
      | initialPrice  | 500        |
      | totalSupply   | 10000      |
      | decimalPlaces | 0          |
    Then the response status should be 201
    And the response body should contain field "symbol" with value "TSTK"
    And the response body should contain field "status" with value "PENDING"
    And the response conforms to the OpenAPI schema

  Scenario: Duplicate symbol is rejected
    Given an asset with symbol "TST" already exists
    When the admin creates an asset with symbol "TST"
    Then the response status should be 409

  Scenario: Missing required fields are rejected
    When the admin creates an asset with empty name
    Then the response status should be 400
