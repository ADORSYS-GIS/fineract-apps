@trading @cancellation
Feature: Order Cancellation
  As a user
  I want to cancel my pending or queued orders
  So that I can change my mind before execution

  Background:
    Given the test database is seeded with standard data
    And Fineract resolves user "bdd-user-ext-123" with client ID 42 and XAF balance "100000"
    And Fineract batch transfers succeed

  Scenario: Cancel a PENDING order
    Given a PENDING order exists for user 42 on asset "asset-001"
    When the user cancels the order
    Then the response status should be 200
    And the trade response should have status "CANCELLED"

  Scenario: Cancel a QUEUED order
    Given a QUEUED order exists for user 42 on asset "asset-001"
    When the user cancels the order
    Then the response status should be 200
    And the trade response should have status "CANCELLED"

  Scenario: Cannot cancel a FILLED order
    Given a FILLED order exists for user 42 on asset "asset-001"
    When the user cancels the order
    Then the response status should be 400
    And the response body should contain "Only PENDING or QUEUED"

  Scenario: Cannot cancel another user's order
    Given a PENDING order exists for user 99 on asset "asset-001"
    When the user cancels the order
    Then the response status should be 404
