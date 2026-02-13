@admin @price
Feature: Manual Price Override
  As an asset manager
  I want to manually set an asset's price
  So that I can adjust pricing when needed

  Background:
    Given the test database is seeded with standard data

  @wip
  Scenario: Set a new manual price
    # Blocked: PricingService.setPrice() has unwrapped Redis call that fails in test env
    When the admin sets the price of asset "asset-001" to 150
    Then the response status should be 200
    And the current price of asset "asset-001" should be 150
