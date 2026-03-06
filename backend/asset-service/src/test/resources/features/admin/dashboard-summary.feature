@admin @dashboard
Feature: Admin Dashboard Summary
  As an admin
  I want to see aggregated platform metrics at a glance
  So that I can monitor the overall health of the asset trading platform

  Background:
    Given the test database is seeded with standard data

  Scenario: Seeded platform returns correct asset counts
    When the admin requests the dashboard summary
    Then the response status should be 200
    And the response body should contain field "assets.total" with value "2"
    And the response body should contain field "assets.active" with value "1"
    And the response body should contain field "assets.pending" with value "1"
    And the response body should contain field "trading.tradeCount24h" with value "0"
    And the response body should contain field "activeInvestors" with value "0"

  Scenario: Dashboard reflects recent trading activity
    Given 3 trades executed within the last 24 hours
    And 2 distinct users hold positions
    When the admin requests the dashboard summary
    Then the response status should be 200
    And the response body should contain field "trading.tradeCount24h" with value "3"
    And the response body should contain field "activeInvestors" with value "2"

  Scenario: Dashboard shows order health issues
    Given an order with status "NEEDS_RECONCILIATION" exists
    And an order with status "FAILED" exists
    When the admin requests the dashboard summary
    Then the response status should be 200
    And the response body should contain field "orders.needsReconciliation" with value "1"
    And the response body should contain field "orders.failed" with value "1"

  Scenario: Unauthenticated user cannot access dashboard
    When an unauthenticated user calls "GET" "/api/admin/dashboard/summary"
    Then the response status should be 401
