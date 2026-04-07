@e2e @payment @orange @withdrawal
Feature: Orange Money Withdrawals
  As a customer, I want to withdraw money from my Fineract account to my Orange Money wallet,
  so that I receive cash on my mobile phone.

  Background:
    Given the Orange provider is available for cashouts
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Successful Orange withdrawal — full flow with callback
    When the user initiates an Orange withdrawal of 5000 XAF
    Then the withdrawal should be in PROCESSING status
    When the Orange cashout callback reports SUCCESSFUL for the withdrawal
    Then the transaction status should be "SUCCESSFUL"
    And the user's Fineract XAF balance should have decreased by 5000

  Scenario: Failed Orange withdrawal — user cancels, balance reversed
    When the user initiates an Orange withdrawal of 5000 XAF
    Then the withdrawal should be in PROCESSING status
    When the Orange cashout callback reports CANCELLED for the withdrawal
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
