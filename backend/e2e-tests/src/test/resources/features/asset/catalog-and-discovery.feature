@e2e @catalog
Feature: Asset Catalog & Discovery
  As a user browsing the marketplace, I want to list, search, and filter assets
  so that I can find investment opportunities.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract

  @smoke
  Scenario: List all active assets
    Given an active stock asset "CA1" with price 5000 and supply 100
    When I request the asset catalog
    Then the response status should be 200
    And the catalog should contain asset "CA1"

  Scenario: Get asset detail by ID
    Given an active stock asset "CA2" with price 5000 and supply 100
    When I request the detail of asset "CA2"
    Then the response status should be 200
    And the asset detail should include symbol "CA2"
    And the asset detail should include category "STOCKS"

  Scenario: Filter assets by category STOCKS
    Given an active stock asset "CA3" with price 5000 and supply 100
    When I request the asset catalog filtered by category "STOCKS"
    Then the response status should be 200
    And the catalog should contain asset "CA3"

  Scenario: Search assets by keyword
    Given an active stock asset "CA4" with price 5000 and supply 100
    When I search the asset catalog for "Stock CA4"
    Then the response status should be 200
    And the catalog should contain asset "CA4"

  Scenario: Get recent trades for an asset after a buy
    Given a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000
    And an active stock asset "CA5" with price 1000 and supply 100
    When the user buys 1 units of "CA5"
    Then the trade should be FILLED
    When I request recent trades for asset "CA5"
    Then the response status should be 200
    And the recent trades list should not be empty
