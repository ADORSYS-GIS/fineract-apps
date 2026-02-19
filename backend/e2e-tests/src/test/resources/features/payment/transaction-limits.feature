@e2e @payment @limits
Feature: Transaction Limits
  Daily deposit and withdrawal limits should be enforced.

  Background:
    Given the MTN provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  Scenario: Daily deposit limit exceeded
    When the user initiates an MTN deposit of 60000 XAF
    Then the deposit should be in PENDING status
    When the user initiates a second MTN deposit of 60000 XAF
    Then the response status should be 400
    And the response body should contain "DAILY_LIMIT_EXCEEDED"
