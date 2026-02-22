@e2e @payment @orange @deposit
Feature: Orange Money Deposits
  As a customer, I want to deposit money via Orange Money,
  so that my savings balance increases after the provider confirms.

  Background:
    Given the Orange provider is available for payments
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Successful Orange deposit — full flow with callback
    When the user initiates an Orange deposit of 10000 XAF
    Then the deposit should be in PENDING status
    And the deposit should include a payment URL
    When the Orange payment callback reports SUCCESS for the deposit
    Then the transaction status should be "SUCCESSFUL"
    And the user's Fineract XAF balance should have increased by 10000

  Scenario: Failed Orange deposit — user cancels
    When the user initiates an Orange deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When the Orange payment callback reports CANCELLED for the deposit
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
