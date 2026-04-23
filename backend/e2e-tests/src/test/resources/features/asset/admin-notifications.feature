@e2e @admin-notifications
Feature: Admin Notification Management
  As an admin, I want to view and manage broadcast notifications.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-admin-notif-user"
    And the test user has an XAF account with balance 1000000

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
