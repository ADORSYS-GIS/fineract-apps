@admin @audit
Feature: Persistent Audit Log
  As an admin
  I want to see a history of all admin actions
  So that I can track who did what and when for compliance

  Background:
    Given the test database is seeded with standard data

  Scenario: Admin action is recorded in audit log
    When the admin activates asset "asset-002"
    And the admin requests the audit log
    Then the response status should be 200
    And the audit log should contain an entry with action "activateAsset"
    And the audit log entry for "activateAsset" should have result "SUCCESS"

  Scenario: Audit log captures target asset symbol
    When the admin activates asset "asset-002"
    And the admin requests the audit log
    Then the first audit log entry should have targetAssetSymbol "PND"

  Scenario: Filter audit log by action
    When the admin activates asset "asset-002"
    And the admin halts asset "asset-002"
    And the admin requests the audit log filtered by action "haltAsset"
    Then the response status should be 200
    And the audit log should have exactly 1 entry

  Scenario: Audit log paginates correctly
    When the admin activates asset "asset-002"
    And the admin requests the audit log with page size 5
    Then the response status should be 200
    And the audit log page size should be 5

  Scenario: Page size over 100 is rejected
    When the admin requests the audit log with page size 200
    Then the response status should be 500
