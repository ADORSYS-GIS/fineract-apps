@trading @market-hours
Feature: Market Hours Enforcement
  As the trading system
  I want to reject trades when the market is closed
  So that trading only occurs during allowed hours

  Background:
    Given the test database is seeded with standard data

  Scenario: Market status endpoint returns current state
    When an unauthenticated user calls "GET" "/api/market/status"
    Then the response status should be 200
    And the response body should contain field "isOpen" with value "true"
