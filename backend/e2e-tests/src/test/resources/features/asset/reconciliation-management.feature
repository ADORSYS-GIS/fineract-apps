@e2e @reconciliation-management
Feature: Reconciliation Report Management
  As an admin, I want to view, acknowledge, and resolve reconciliation reports
  generated from discrepancy checks on asset positions.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-recon-mgmt-user"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Report generation via real reconciliation
  # -----------------------------------------------------------------

  Scenario: Triggering reconciliation with a discrepancy creates an OPEN report
    Given an active stock asset "RM1" with price 1000 and supply 100
    When the user buys 5 units of "RM1"
    Then the trade should be FILLED
    Given the user position for asset "RM1" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM1"
    Then the response status should be 200
    When the admin lists reconciliation reports
    Then the response status should be 200
    And the reconciliation report list should have at least 1 entry
    And the first reconciliation report should have status "OPEN"

  Scenario: Reconciliation summary reflects open report count
    Given an active stock asset "RM2" with price 2000 and supply 100
    When the user buys 3 units of "RM2"
    Then the trade should be FILLED
    Given the user position for asset "RM2" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM2"
    Then the response status should be 200
    When the admin gets the reconciliation summary
    Then the response status should be 200
    And the open report count should be at least 1

  # -----------------------------------------------------------------
  # Report filtering
  # -----------------------------------------------------------------

  Scenario: Reports can be filtered by status
    Given an active stock asset "RM3" with price 1000 and supply 50
    When the user buys 5 units of "RM3"
    Then the trade should be FILLED
    Given the user position for asset "RM3" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM3"
    Then the response status should be 200
    When the admin lists reconciliation reports with status "OPEN"
    Then the response status should be 200
    And all reconciliation reports should have status "OPEN"

  Scenario: Reports can be filtered by asset ID
    Given an active stock asset "RM4" with price 1000 and supply 100
    When the user buys 5 units of "RM4"
    Then the trade should be FILLED
    Given the user position for asset "RM4" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM4"
    Then the response status should be 200
    When the admin lists reconciliation reports for asset "RM4"
    Then the response status should be 200
    And all reconciliation reports should reference asset "RM4"

  # -----------------------------------------------------------------
  # Report lifecycle: Acknowledge and Resolve
  # -----------------------------------------------------------------

  Scenario: Admin can acknowledge a reconciliation report
    Given an active stock asset "RM5" with price 1000 and supply 50
    When the user buys 5 units of "RM5"
    Then the trade should be FILLED
    Given the user position for asset "RM5" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM5"
    Then the response status should be 200
    When the admin acknowledges the first reconciliation report
    Then the response status should be 200
    When the admin lists reconciliation reports with status "ACKNOWLEDGED"
    Then the reconciliation report list should have at least 1 entry

  Scenario: Admin can resolve a report with notes
    Given an active stock asset "RM6" with price 1000 and supply 50
    When the user buys 5 units of "RM6"
    Then the trade should be FILLED
    Given the user position for asset "RM6" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM6"
    Then the response status should be 200
    When the admin resolves the first reconciliation report with notes "Verified: position corrected manually"
    Then the response status should be 200
    When the admin gets the reconciliation summary
    Then the open report count should be 0

  Scenario: Full lifecycle OPEN to ACKNOWLEDGED to RESOLVED
    Given an active stock asset "RM7" with price 2000 and supply 100
    When the user buys 3 units of "RM7"
    Then the trade should be FILLED
    Given the user position for asset "RM7" is tampered to 99 units
    When the admin triggers reconciliation for asset "RM7"
    Then the response status should be 200
    When the admin acknowledges the first reconciliation report
    Then the response status should be 200
    When the admin resolves the first reconciliation report with notes "All clear after manual review"
    Then the response status should be 200
    When the admin gets the reconciliation summary
    Then the open report count should be 0
