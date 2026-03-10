@e2e @payment @callbacks
Feature: Callback Validation
  Callbacks with invalid credentials should be silently accepted (200)
  but should not update transaction state.

  Background:
    Given the MTN provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  Scenario: MTN callback with wrong subscription key does not update transaction
    When the user initiates an MTN deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When an MTN collection callback with wrong subscription key is sent
    Then the callback response status should be 200
    And the transaction status should be "PENDING"

  Scenario: MTN callback for non-existent transaction is silently accepted
    When an MTN collection callback for a non-existent transaction is sent
    Then the callback response status should be 200

  Scenario: Duplicate successful callback is handled idempotently
    When the user initiates an MTN deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When the MTN collection callback reports SUCCESSFUL for the deposit
    Then the transaction status should be "SUCCESSFUL"
    When the MTN collection callback reports SUCCESSFUL for the deposit
    Then the transaction status should be "SUCCESSFUL"
