@e2e @order-resolution
Feature: Order Resolution (E2E)
  As an admin, I want to manage and filter orders
  So that I can investigate and resolve stuck or failed orders

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-recon-user"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Order Filtering
  # -----------------------------------------------------------------

  Scenario: Admin can list orders with status filter
    Given an active stock asset "ORD" with price 2000 and supply 100
    When the user buys 5 units of "ORD"
    Then the trade should be FILLED
    When the admin lists orders with status "FILLED"
    Then the response status should be 200
    And the response body should contain "FILLED"

  # -----------------------------------------------------------------
  # Order Detail
  # -----------------------------------------------------------------

  Scenario: Admin can view order detail with Fineract batch ID
    Given an active stock asset "OD2" with price 1000 and supply 50
    When the user buys 3 units of "OD2"
    Then the trade should be FILLED
    When the admin gets the detail for the last order
    Then the response status should be 200
    And the order detail should include fineractBatchId
    And the order detail should include asset symbol "OD2"

  # -----------------------------------------------------------------
  # Asset Filter Options
  # -----------------------------------------------------------------

  Scenario: Admin can get asset options for order filter
    Given an active stock asset "AO1" with price 2000 and supply 100
    When the user buys 2 units of "AO1"
    Then the trade should be FILLED
    When the admin gets order asset options
    Then the response status should be 200

  # -----------------------------------------------------------------
  # Single-Asset Reconciliation
  # -----------------------------------------------------------------

  Scenario: Admin can trigger single-asset reconciliation
    Given an active stock asset "SR1" with price 2000 and supply 100
    When the user buys 5 units of "SR1"
    Then the trade should be FILLED
    When the admin triggers reconciliation for asset "SR1"
    Then the response status should be 200
    And the reconciliation result should have 0 discrepancies

  Scenario: Reconciliation confirms consistent state after trades
    Given an active stock asset "SM1" with price 1000 and supply 50
    When the user buys 10 units of "SM1"
    Then the trade should be FILLED
    When the user sells 3 units of "SM1"
    Then the trade should be FILLED
    When the admin triggers reconciliation for asset "SM1"
    Then the response status should be 200
    And the reconciliation result should have 0 discrepancies
