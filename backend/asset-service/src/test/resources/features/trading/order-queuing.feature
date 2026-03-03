@trading @queuing @wip
Feature: Out-of-Hours Order Queuing
  As a user
  I want to place orders outside market hours
  So that they are queued and processed at market open

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Order placed during market hours executes immediately
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"

  # Note: Market hours scenarios marked @wip because the test profile
  # opens the market 24/7. Verifying queuing behavior requires
  # a more sophisticated MarketHoursService mock or config override.

  Scenario: Order placed outside market hours is queued
    Given the market is currently closed
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "QUEUED"
