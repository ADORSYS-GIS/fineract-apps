@bonds @validity
Feature: Subscription Dates Are Informational Only
  As the trading system
  I want subscription dates to be treated as metadata about the original issuance
  So that the LP/reseller can trade assets regardless of the issuer's subscription window

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"

  Scenario: BUY quote succeeds even when subscription end date has passed
    Given asset "asset-001" has a subscription end date of yesterday
    When the user creates a BUY quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"

  Scenario: BUY quote succeeds even when subscription start date is in the future
    Given asset "asset-001" has a subscription start date in the future
    When the user creates a BUY quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"
