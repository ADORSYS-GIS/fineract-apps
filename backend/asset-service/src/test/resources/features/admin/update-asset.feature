@admin @update
Feature: Update Asset Metadata
  As an asset manager
  I want to update asset properties
  So that I can correct information or adjust trading parameters

  Background:
    Given the test database is seeded with standard data

  Scenario: Partial update changes only specified fields
    When the admin updates asset "asset-001" with name "Updated Name"
    Then the response status should be 200
    And the response body should contain field "name" with value "Updated Name"
    And the response body should contain field "symbol" with value "TST"

  Scenario: Update trading fee
    When the admin updates asset "asset-001" with tradingFeePercent "0.010"
    Then the response status should be 200

  Scenario: Update non-existent asset
    When the admin updates asset "nonexistent" with name "Foo"
    Then the response status should be 400

  Scenario: Update core fields on PENDING asset
    Given asset "asset-001" is in status "PENDING"
    When the admin updates asset "asset-001" with issuerPrice "6000"
    Then the response status should be 200
    And the response body should contain field "issuerPrice" with value "6000"

  Scenario: Update issuer name on PENDING asset
    Given asset "asset-001" is in status "PENDING"
    When the admin updates asset "asset-001" with issuerName "New Issuer Corp"
    Then the response status should be 200

  Scenario: Reject core field update on ACTIVE asset
    Given asset "asset-001" is in status "ACTIVE"
    When the admin updates asset "asset-001" with issuerPrice "6000"
    Then the response status should be 400
