@trading @tax
Feature: Tax Collection on Trades
  As the platform
  I want to collect Cameroon/CEMAC taxes on asset trades
  So that the platform is compliant with DGI regulations

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "1000000"
    And Fineract batch transfers succeed

  Scenario: Buy quote includes registration duty in tax breakdown
    When the user creates a BUY quote for "10" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should have status "QUOTED"
    And the quote response should include a tax breakdown
    And the tax breakdown registration duty should be greater than 0

  Scenario: Sell quote includes registration duty and capital gains estimate
    Given user 42 holds 20 units of asset "asset-001" at average price 100
    When the user creates a SELL quote for "5" units of asset "asset-001"
    Then the response status should be 201
    And the quote response should include a tax breakdown
    And the tax breakdown registration duty should be greater than 0

  Scenario: Registration duty disabled on asset results in zero duty
    Given asset "asset-001" has registration duty disabled
    When the user creates a BUY quote for "10" units of asset "asset-001"
    Then the response status should be 201
    And the tax breakdown registration duty amount should be 0
