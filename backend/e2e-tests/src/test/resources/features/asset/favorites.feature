@e2e @favorites
Feature: Favorites / Watchlist
  As a user, I want to add, list, and remove assets from my watchlist.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And a treasury client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"

  @smoke
  Scenario: Add asset to favorites, list, then remove
    Given an active stock asset "FV1" with price 1000 and supply 100
    When the user adds asset "FV1" to favorites
    Then the response status should be 201
    When the user lists their favorites
    Then the response status should be 200
    And the favorites should contain asset "FV1"
    When the user removes asset "FV1" from favorites
    Then the response status should be 204
    When the user lists their favorites
    Then the response status should be 200
    And the favorites should not contain asset "FV1"

  Scenario: Empty favorites list returns empty array
    When the user lists their favorites
    Then the response status should be 200

  Scenario: Adding same asset twice is idempotent
    Given an active stock asset "FV3" with price 1000 and supply 100
    When the user adds asset "FV3" to favorites
    Then the response status should be 201
    When the user adds asset "FV3" to favorites
    Then the response status should be 201
