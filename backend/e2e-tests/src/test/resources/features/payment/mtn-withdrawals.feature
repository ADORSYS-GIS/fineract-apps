@e2e @payment @mtn @withdrawal
Feature: MTN MoMo Withdrawals
  As a customer, I want to withdraw money from my Fineract account to my MTN MoMo wallet,
  so that I receive cash on my mobile phone.

  Background:
    Given the MTN provider is available for disbursements
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Successful MTN withdrawal — full flow with callback
    When the user initiates an MTN withdrawal of 5000 XAF
    Then the withdrawal should be in PROCESSING status
    When the MTN disbursement callback reports SUCCESSFUL for the withdrawal
    Then the transaction status should be "SUCCESSFUL"
    And the user's Fineract XAF balance should have decreased by 5000

  Scenario: Failed MTN withdrawal — provider rejects, balance reversed
    When the user initiates an MTN withdrawal of 5000 XAF
    Then the withdrawal should be in PROCESSING status
    When the MTN disbursement callback reports FAILED for the withdrawal
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
