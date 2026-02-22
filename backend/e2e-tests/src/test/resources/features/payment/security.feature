@e2e @payment @security
Feature: Payment Security
  Unauthenticated and unauthorized requests should be rejected.

  Background:
    Given the MTN provider is available for collections

  Scenario: Deposit without JWT returns 401
    When a deposit request is sent without authentication
    Then the response status should be 401

  Scenario: Status check without JWT returns 401
    When a status check is sent without authentication
    Then the response status should be 401

  Scenario: Callbacks are accessible without authentication
    When a callback is sent without authentication to the MTN collection endpoint
    Then the callback response status should be 200
