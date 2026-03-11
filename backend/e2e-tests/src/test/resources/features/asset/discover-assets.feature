@e2e @discover
Feature: Discover Pending Assets (E2E)
  As a user
  I want to browse upcoming assets before they launch
  So that I can plan my investments

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract

  Scenario: Discover returns pending assets with launch dates
    When the admin creates a stock asset:
      | name         | Discover Test Stock |
      | symbol       | DSC                 |
      | initialPrice | 5000                |
      | totalSupply  | 100                 |
    Then the response status should be 201
    When I request the discover page
    Then the response status should be 200
    And the discover results should contain asset "DSC"

  Scenario: Active assets are excluded from discover
    Given an active stock asset "DAC" with price 5000 and supply 100
    When I request the discover page
    Then the response status should be 200
    And the discover results should not contain asset "DAC"
