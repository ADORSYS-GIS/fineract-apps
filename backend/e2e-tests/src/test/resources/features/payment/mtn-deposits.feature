@e2e @payment @mtn @deposit
Feature: MTN MoMo Deposits
  As a customer, I want to deposit money into my Fineract account via MTN Mobile Money,
  so that my savings balance increases after the provider confirms the payment.

  Background:
    Given the MTN provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Successful MTN deposit — full flow with callback
    When the user initiates an MTN deposit of 5000 XAF
    Then the deposit should be in PENDING status
    And the deposit transaction should exist with provider MTN_MOMO
    When the MTN collection callback reports SUCCESSFUL for the deposit
    Then the transaction status should be "SUCCESSFUL"
    And the user's Fineract XAF balance should have increased by 5000

  Scenario: Failed MTN deposit — provider rejects
    When the user initiates an MTN deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When the MTN collection callback reports FAILED for the deposit
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
