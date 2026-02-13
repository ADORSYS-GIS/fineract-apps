@admin @mint
Feature: Mint Additional Supply
  As an asset manager
  I want to increase an asset's total supply
  So that more units are available for trading

  Background:
    Given the test database is seeded with standard data
    And Fineract deposit is mocked to succeed

  Scenario: Successfully mint additional supply
    When the admin mints 500 additional units for asset "asset-001"
    Then the response status should be 200
    And asset "asset-001" total supply should be 1500

  Scenario: Mint for non-existent asset
    When the admin mints 500 additional units for asset "nonexistent"
    Then the response status should be 400
