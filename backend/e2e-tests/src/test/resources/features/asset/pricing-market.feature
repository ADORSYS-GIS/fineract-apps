@e2e @pricing
Feature: Pricing & Market Status
  As a user, I want to see current prices, OHLC data, price history, and market status.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract

  @smoke
  Scenario: Get current price for an asset
    Given an active stock asset "PR1" with price 3000 and supply 100
    When I request the current price of asset "PR1"
    Then the response status should be 200
    And the price response should include a positive price

  Scenario: Get OHLC data for an asset
    Given an active stock asset "PR2" with price 3000 and supply 100
    When I request the OHLC data for asset "PR2"
    Then the response status should be 200

  Scenario: Get price history for an asset
    Given an active stock asset "PR3" with price 3000 and supply 100
    When I request the price history for asset "PR3" with period "1M"
    Then the response status should be 200

  Scenario: Market status returns schedule info
    When I request the market status
    Then the response status should be 200
    And the market status should include a schedule
    And the market status should include a timezone
