@e2e @payment @admin-dlq
Feature: Admin Reversal Dead Letter Queue
  As an admin, I want to view and resolve failed reversal entries
  so that I can ensure all failed reversals are properly handled.

  Background:
    Given the MTN provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  # -----------------------------------------------------------------
  # DLQ count and list
  # -----------------------------------------------------------------

  Scenario: DLQ count is zero when no failed reversals exist
    When the admin gets the DLQ count
    Then the admin DLQ response status should be 200
    And the DLQ count should be 0

  Scenario: DLQ reflects seeded dead letter entries
    Given there are 3 unresolved reversal dead letter entries in the database
    When the admin gets the DLQ count
    Then the admin DLQ response status should be 200
    And the DLQ count should be 3
    When the admin lists unresolved DLQ entries
    Then the admin DLQ response status should be 200
    And the DLQ list should have 3 entries
    And each DLQ entry should have a transaction ID and failure reason

  # -----------------------------------------------------------------
  # DLQ resolution
  # -----------------------------------------------------------------

  Scenario: Admin can resolve a DLQ entry
    Given there are 2 unresolved reversal dead letter entries in the database
    When the admin resolves the first DLQ entry with notes "Manually refunded via bank transfer"
    Then the admin DLQ response status should be 200
    And the resolved DLQ entry should have resolvedBy "e2e-admin"
    And the resolved DLQ entry should have notes "Manually refunded via bank transfer"
    When the admin gets the DLQ count
    Then the DLQ count should be 1

  Scenario: Resolved entry no longer appears in unresolved list
    Given there are 1 unresolved reversal dead letter entries in the database
    When the admin resolves the first DLQ entry with notes "Verified and closed"
    Then the admin DLQ response status should be 200
    When the admin lists unresolved DLQ entries
    Then the DLQ list should be empty

  # -----------------------------------------------------------------
  # Security
  # -----------------------------------------------------------------

  Scenario: DLQ endpoints require ADMIN role
    When an unauthenticated request is sent to the DLQ count endpoint
    Then the unauthenticated DLQ response status should be 401
