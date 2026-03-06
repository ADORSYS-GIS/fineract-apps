@e2e @admin-dashboard
Feature: Admin Dashboard and Audit Log
  As an admin, I want to view platform-wide metrics and audit history
  so that I can monitor asset performance and track admin actions.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-dashboard-user"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Dashboard metrics
  # -----------------------------------------------------------------

  Scenario: Dashboard reflects active asset count after creation
    Given an active stock asset "DB1" with price 1000 and supply 50
    And an active stock asset "DB2" with price 2000 and supply 100
    When the admin gets the dashboard summary
    Then the response status should be 200
    And the dashboard active asset count should be at least 2
    And the dashboard total asset count should be at least 2

  Scenario: Dashboard reflects trading volume after trades
    Given an active stock asset "DB3" with price 1000 and supply 100
    When the user buys 10 units of "DB3"
    Then the trade should be FILLED
    When the admin gets the dashboard summary
    Then the response status should be 200
    And the dashboard 24h buy volume should be at least 10000
    And the dashboard 24h trade count should be at least 1

  Scenario: Dashboard shows active investor count
    Given an active stock asset "DB4" with price 1000 and supply 100
    When the user buys 5 units of "DB4"
    Then the trade should be FILLED
    When the admin gets the dashboard summary
    Then the response status should be 200
    And the dashboard active investor count should be at least 1

  Scenario: Dashboard shows order health for stuck orders
    Given an active stock asset "DB5" with price 1000 and supply 100
    When the user buys 5 units of "DB5"
    Then the trade should be FILLED
    Given the last order is marked as NEEDS_RECONCILIATION in the database
    When the admin gets the dashboard summary
    Then the response status should be 200
    And the dashboard needs reconciliation count should be at least 1

  # -----------------------------------------------------------------
  # Audit log
  # -----------------------------------------------------------------

  Scenario: Audit log captures asset creation
    Given an active stock asset "AU1" with price 2000 and supply 100
    When the admin gets the audit log
    Then the response status should be 200
    And the audit log should contain an entry with action "createAsset" and result "SUCCESS"
    And the audit log should contain an entry for asset symbol "AU1"

  Scenario: Audit log can be filtered by action
    Given an active stock asset "AU2" with price 3000 and supply 200
    When the admin gets the audit log filtered by action "activateAsset"
    Then the response status should be 200
    And all audit log entries should have action "activateAsset"

  Scenario: Audit log can be filtered by asset ID
    Given an active stock asset "AU3" with price 1000 and supply 50
    And an active stock asset "AU4" with price 2000 and supply 100
    When the admin gets the audit log filtered by asset "AU3"
    Then the response status should be 200
    And all audit log entries should reference asset "AU3"
    And the audit log should not contain entries for asset "AU4"
