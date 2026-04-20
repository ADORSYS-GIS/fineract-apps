@e2e @payment @nokash @withdrawal
Feature: NOKASH Withdrawals
  As a customer, I want to withdraw money from my Fineract account to my NOKASH wallet,
  so that I receive cash on my mobile phone.

  Background:
    Given the NOKASH provider is available for disbursements
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Successful NOKASH withdrawal — full flow with callback
    When the user initiates a NOKASH withdrawal of 5000 XAF
    Then the NOKASH withdrawal should be in PROCESSING status
    When the NOKASH disbursement callback reports SUCCESSFUL for the withdrawal
    Then the transaction status should be "SUCCESSFUL"
    And for NOKASH the user's Fineract XAF balance should have decreased by 5000

  Scenario: Failed NOKASH withdrawal — provider rejects, balance reversed
    When the user initiates a NOKASH withdrawal of 5000 XAF
    Then the NOKASH withdrawal should be in PROCESSING status
    When the NOKASH disbursement callback reports FAILED for the withdrawal
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
