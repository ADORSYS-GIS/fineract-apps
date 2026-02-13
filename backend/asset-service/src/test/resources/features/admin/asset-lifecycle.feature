@admin @lifecycle
Feature: Asset Lifecycle Management
  As an asset manager
  I want to transition assets through their lifecycle states
  So that I can control when assets are available for trading

  Background:
    Given the test database is seeded with standard data

  Scenario: Activate a pending asset
    When the admin activates asset "asset-002"
    Then the response status should be 200
    And asset "asset-002" should have status "ACTIVE"

  Scenario: Halt an active asset
    When the admin halts asset "asset-001"
    Then the response status should be 200
    And asset "asset-001" should have status "HALTED"

  Scenario: Resume a halted asset
    Given asset "asset-001" has been halted by an admin
    When the admin resumes asset "asset-001"
    Then the response status should be 200
    And asset "asset-001" should have status "ACTIVE"

  Scenario: Activating an already active asset fails
    When the admin activates asset "asset-001"
    Then the response status should be 400
    And the response body should contain "must be PENDING"

  Scenario: Halting a pending asset fails
    When the admin halts asset "asset-002"
    Then the response status should be 400
    And the response body should contain "must be ACTIVE"

  Scenario Outline: Invalid state transitions are rejected
    Given asset "<assetId>" is in status "<currentStatus>"
    When the admin performs "<action>" on asset "<assetId>"
    Then the response status should be 400

    Examples:
      | assetId   | currentStatus | action   |
      | asset-001 | ACTIVE        | activate |
      | asset-002 | PENDING       | halt     |
      | asset-002 | PENDING       | resume   |
