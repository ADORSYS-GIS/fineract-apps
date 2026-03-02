@e2e @admin-notifications
Feature: Admin Notification Management
  As an admin, I want to view and manage broadcast notifications
  triggered by system events like reconciliation discrepancies.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-admin-notif-user"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Reconciliation-triggered admin alerts
  # -----------------------------------------------------------------

  Scenario: Reconciliation discrepancy generates an admin notification
    Given an active stock asset "AN1" with price 1000 and supply 100
    When the user buys 5 units of "AN1"
    Then the trade should be FILLED
    Given the user position for asset "AN1" is tampered to 99 units
    When the admin triggers reconciliation for asset "AN1"
    Then the response status should be 200
    When the admin lists admin notifications
    Then the response status should be 200
    And the admin notification list should have at least 1 entry

  Scenario: Admin unread count reflects reconciliation alerts
    Given an active stock asset "AN2" with price 1000 and supply 100
    When the user buys 3 units of "AN2"
    Then the trade should be FILLED
    Given the user position for asset "AN2" is tampered to 99 units
    When the admin triggers reconciliation for asset "AN2"
    Then the response status should be 200
    When the admin gets the admin unread notification count
    Then the admin unread count should be at least 1

  # -----------------------------------------------------------------
  # Notification management
  # -----------------------------------------------------------------

  Scenario: Admin can mark a notification as read
    Given an active stock asset "AN3" with price 1000 and supply 50
    When the user buys 5 units of "AN3"
    Then the trade should be FILLED
    Given the user position for asset "AN3" is tampered to 99 units
    When the admin triggers reconciliation for asset "AN3"
    Then the response status should be 200
    When the admin lists admin notifications
    Then the admin notification list should have at least 1 entry
    When the admin marks the first admin notification as read
    Then the response status should be 200

  Scenario: Admin can mark all notifications as read
    Given an active stock asset "AN4" with price 1000 and supply 100
    When the user buys 5 units of "AN4"
    Then the trade should be FILLED
    Given the user position for asset "AN4" is tampered to 99 units
    When the admin triggers reconciliation for asset "AN4"
    Then the response status should be 200
    Given an active stock asset "AN5" with price 2000 and supply 100
    When the user buys 3 units of "AN5"
    Then the trade should be FILLED
    Given the user position for asset "AN5" is tampered to 99 units
    When the admin triggers reconciliation for asset "AN5"
    Then the response status should be 200
    When the admin marks all admin notifications as read
    Then the response status should be 200
    When the admin gets the admin unread notification count
    Then the admin unread count should be 0

  # -----------------------------------------------------------------
  # Pagination
  # -----------------------------------------------------------------

  Scenario: Admin notification list is paginated
    Given there are 25 admin notifications seeded in the database
    When the admin lists admin notifications
    Then the response status should be 200
    And the admin notification page size should be 20
    When the admin lists admin notifications on page 1
    Then the response status should be 200
    And the admin notification list should have 5 entries

  # -----------------------------------------------------------------
  # Notification content
  # -----------------------------------------------------------------

  Scenario: Admin notification includes reference details
    Given an active stock asset "AN6" with price 1000 and supply 50
    When the user buys 5 units of "AN6"
    Then the trade should be FILLED
    Given the user position for asset "AN6" is tampered to 99 units
    When the admin triggers reconciliation for asset "AN6"
    Then the response status should be 200
    When the admin lists admin notifications
    Then the first admin notification should have an event type
    And the first admin notification should have a title
