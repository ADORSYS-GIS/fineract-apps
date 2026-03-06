@bonds @validity
Feature: Subscription Period Enforcement
  As the trading system
  I want to block BUY quotes for assets outside their subscription period
  So that expired offers cannot be purchased

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"

  Scenario: BUY quote is rejected when subscription end date has passed
    Given asset "asset-001" has a subscription end date of yesterday
    When the user creates a BUY quote for "5" units of asset "asset-001"
    Then the response status should be 400
    And the response error code should be "SUBSCRIPTION_ENDED"

  Scenario: SELL quote is allowed even after subscription end date passes
    Given asset "asset-001" has a subscription end date of yesterday
    And user 42 holds 10 units of asset "asset-001" at average price 100
    And Fineract batch transfers succeed
    When the user creates a SELL quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"
