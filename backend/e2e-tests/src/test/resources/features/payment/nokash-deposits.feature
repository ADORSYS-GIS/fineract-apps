@e2e @payment @nokash @deposit
Feature: NOKASH Deposits
  As a customer, I want to deposit money into my Fineract account via NOKASH,
  so that my savings balance increases after the provider confirms the payment.

  Background:
    Given the NOKASH provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Successful NOKASH deposit — full flow with callback
    When the user initiates a NOKASH deposit of 5000 XAF
    Then the deposit should be in PENDING status
    And the deposit transaction should exist with provider NOKASH
    When the NOKASH collection callback reports SUCCESSFUL for the deposit
    Then the transaction status should be "SUCCESSFUL"
    And the user's Fineract XAF balance should have increased by 5000

  Scenario: Failed NOKASH deposit — provider rejects
    When the user initiates a NOKASH deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When the NOKASH collection callback reports FAILED for the deposit
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
