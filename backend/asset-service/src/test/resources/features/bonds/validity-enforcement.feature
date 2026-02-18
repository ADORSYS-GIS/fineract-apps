@bonds @validity
Feature: Subscription Period Enforcement
  As the trading system
  I want to block BUY orders for assets outside their subscription period
  So that expired offers cannot be purchased

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"

  Scenario: BUY is rejected when subscription end date has passed
    Given asset "asset-001" has a subscription end date of yesterday
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 400
    And the response error code should be "SUBSCRIPTION_ENDED"

  Scenario: SELL is allowed even after subscription end date passes
    Given asset "asset-001" has a subscription end date of yesterday
    And user 42 holds 10 units of asset "asset-001" at average price 100
    And Fineract batch transfers succeed
    When the user submits a SELL order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"

  Scenario: Preview shows SUBSCRIPTION_ENDED blocker for expired BUY
    Given asset "asset-001" has a subscription end date of yesterday
    When the user previews a "BUY" of "5" units of asset "asset-001"
    Then the response status should be 200
    And the preview should not be feasible with blocker "SUBSCRIPTION_ENDED"
