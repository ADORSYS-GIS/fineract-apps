@trading @min-order
Feature: Minimum Order Size
  As a platform operator
  I want to enforce minimum order sizes on assets
  So that micro-orders don't clog the system

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Buy order below minimum unit size is rejected
    Given asset "asset-001" has a minimum order size of 5 units
    When the user submits a BUY order for "3" units of asset "asset-001"
    Then the response status should be 400
    And the response error code should be "MIN_ORDER_SIZE_NOT_MET"

  Scenario: Buy order at minimum unit size succeeds
    Given asset "asset-001" has a minimum order size of 5 units
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"

  Scenario: Buy order above minimum unit size succeeds
    Given asset "asset-001" has a minimum order size of 5 units
    When the user submits a BUY order for "10" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"

  Scenario: Buy order below minimum cash amount is rejected
    Given asset "asset-001" has a minimum order cash amount of 10000 XAF
    When the user submits a BUY order for "5" units of asset "asset-001"
    Then the response status should be 400
    And the response error code should be "MIN_ORDER_CASH_NOT_MET"

  Scenario: Sell order below minimum unit size is also rejected
    Given asset "asset-001" has a minimum order size of 5 units
    And user 42 holds 20 units of asset "asset-001" at average price 100
    When the user submits a SELL order for "2" units of asset "asset-001"
    Then the response status should be 400
    And the response error code should be "MIN_ORDER_SIZE_NOT_MET"

  Scenario: No minimum configured allows any size
    When the user submits a BUY order for "1" units of asset "asset-001"
    Then the response status should be 200
    And the trade response should have status "FILLED"
