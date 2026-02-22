@pricing
Feature: Pricing Endpoints
  As a public API consumer
  I want to query asset prices and OHLC data
  So that I can make informed trading decisions

  Background:
    Given the test database is seeded with standard data

  Scenario: Get current price without authentication
    When an unauthenticated user calls "GET" "/api/prices/asset-001"
    Then the response status should be 200
    And the response body should contain field "currentPrice"
    And the response conforms to the OpenAPI schema

  Scenario: Get OHLC data
    When an unauthenticated user calls "GET" "/api/prices/asset-001/ohlc"
    Then the response status should be 200
    And the response conforms to the OpenAPI schema

  Scenario: Get price history
    When an unauthenticated user calls "GET" "/api/prices/asset-001/history?period=1Y"
    Then the response status should be 200
    And the response conforms to the OpenAPI schema

  Scenario: Price for non-existent asset
    When an unauthenticated user calls "GET" "/api/prices/nonexistent"
    Then the response status should be 400
