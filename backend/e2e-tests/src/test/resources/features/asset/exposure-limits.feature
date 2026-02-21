@e2e @limits
Feature: Exposure Limits (E2E)
  As the platform
  I want to enforce per-asset trading limits
  So that no single user can dominate an asset

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 5000000

  # -----------------------------------------------------------------
  # Max Order Size
  # -----------------------------------------------------------------

  Scenario: BUY rejected when order exceeds max order size
    Given an active stock asset "MOS" with price 100, supply 10000, and max order size 50
    When the user previews a BUY of 100 units of "MOS"
    Then the response status should be 200
    And the preview should not be feasible
    And the preview blockers should contain "MAX_ORDER_SIZE_EXCEEDED"

  Scenario: BUY within max order size succeeds
    Given an active stock asset "MSO" with price 100, supply 10000, and max order size 50
    When the user previews a BUY of 30 units of "MSO"
    Then the response status should be 200
    And the preview should be feasible

  # -----------------------------------------------------------------
  # Max Position Percent
  # -----------------------------------------------------------------

  Scenario: BUY rejected when position would exceed max position percent
    Given an active stock asset "MPP" with price 100, supply 100, and max position percent 5
    When the user previews a BUY of 10 units of "MPP"
    Then the response status should be 200
    And the preview should not be feasible
    And the preview blockers should contain "MAX_POSITION_EXCEEDED"
