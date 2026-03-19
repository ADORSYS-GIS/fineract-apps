@e2e @delisting
Feature: Asset Delisting (E2E)
  As an admin
  I want to delist an asset with a grace period
  So that users can sell before forced buyback

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 100000

  # -----------------------------------------------------------------
  # Initiate and cancel delisting
  # -----------------------------------------------------------------

  Scenario: Initiate delisting blocks BUY preview
    Given an active stock asset "DLS" with price 1000 and supply 1000
    When the admin initiates delisting of asset "DLS" on date 30 days from now
    Then the response status should be 200
    And the asset should be in DELISTING status
    When the user previews a BUY of 5 units of "DLS"
    Then the preview should not be feasible
    And the preview blockers should contain "ASSET_DELISTING"

  Scenario: Cancel delisting returns asset to ACTIVE
    Given an active stock asset "DCL" with price 1000 and supply 1000
    When the admin initiates delisting of asset "DCL" on date 30 days from now
    Then the asset should be in DELISTING status
    When the admin cancels delisting of asset "DCL"
    Then the response status should be 200
    And the asset should be in ACTIVE status

  Scenario: Selling a delisted asset is allowed during the grace period
    Given an active stock asset "DLS2" with price 1000 and supply 1000
    And the user holds 10 units of "DLS2"
    When the admin initiates delisting of asset "DLS2" on date 30 days from now
    Then the asset should be in DELISTING status
    When the user previews a SELL of 5 units of "DLS2"
    Then the preview should be feasible
