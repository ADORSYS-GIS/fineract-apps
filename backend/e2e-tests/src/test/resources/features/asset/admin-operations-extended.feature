@e2e @admin-extended
Feature: Extended Admin Operations (E2E)
  As an admin
  I want to manage assets, view inventory, LP performance, and order summaries
  So that I can monitor and operate the platform effectively

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract

  # -----------------------------------------------------------------
  # Delete Pending Asset
  # -----------------------------------------------------------------

  Scenario: Admin deletes a pending asset
    When the admin creates a stock asset:
      | name         | Delete Test Stock |
      | symbol       | DEL               |
      | initialPrice | 5000              |
      | totalSupply  | 100               |
    Then the response status should be 201
    When the admin deletes the pending asset
    Then the response status should be 200

  Scenario: Admin cannot delete an active asset
    Given an active stock asset "NDE" with price 5000 and supply 50
    When the admin deletes asset "lastCreated"
    Then the response status should be 400

  # -----------------------------------------------------------------
  # LP Performance
  # -----------------------------------------------------------------

  Scenario: Admin gets LP performance summary
    When the admin requests LP performance summary
    Then the response status should be 200
    And the response body should contain field "totalTrades"

  # -----------------------------------------------------------------
  # Asset Inventory
  # -----------------------------------------------------------------

  Scenario: Admin gets asset inventory stats
    Given an active stock asset "IVT" with price 5000 and supply 200
    When the admin requests asset inventory
    Then the response status should be 200
    And the inventory should contain asset "IVT"

  # -----------------------------------------------------------------
  # Order Summary
  # -----------------------------------------------------------------

  Scenario: Admin gets order status summary
    When the admin requests order summary
    Then the response status should be 200
    And the response body should contain field "needsReconciliation"
    And the response body should contain field "failed"

  # -----------------------------------------------------------------
  # Income Summary
  # -----------------------------------------------------------------

  Scenario: Admin gets income summary for an asset
    Given an active stock asset "ISM" with price 1000 and supply 100
    When the admin requests income summary for asset "lastCreated"
    Then the response status should be 200

  # -----------------------------------------------------------------
  # Redemption History
  # -----------------------------------------------------------------

  Scenario: Admin gets redemption history (empty for new asset)
    Given an active stock asset "RDH" with price 1000 and supply 100
    When the admin requests redemption history for asset "lastCreated"
    Then the response status should be 200
