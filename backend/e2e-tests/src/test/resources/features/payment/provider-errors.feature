@e2e @payment @errors
Feature: Payment Provider Error Handling
  As the payment gateway, I must handle provider failures, duplicate callbacks,
  and late callbacks gracefully to protect customer balances.

  Background:
    Given the user has a Fineract XAF account with sufficient balance

  Scenario: MTN deposit when collection API returns 500 — error returned, balance unchanged
    Given the MTN collection API is returning errors
    When the user attempts an MTN deposit of 5000 XAF expecting failure
    Then the deposit response should indicate an error
    And the user's Fineract XAF balance should not have changed

  Scenario: MTN withdrawal when disbursement API returns 500 — error returned, balance unchanged
    Given the MTN disbursement API is returning errors
    When the user attempts an MTN withdrawal of 5000 XAF expecting failure
    Then the withdrawal response should indicate an error
    And the user's Fineract XAF balance should not have changed

  Scenario: Duplicate callback — balance only changes once
    Given the MTN provider is available for collections
    When the user initiates an MTN deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When the MTN collection callback reports SUCCESSFUL for the deposit
    And the same MTN collection callback reports SUCCESSFUL again
    Then the transaction status should be "SUCCESSFUL"
    And the user's Fineract XAF balance should have increased by 5000

  Scenario: Late callback after terminal FAILED state — ignored
    Given the MTN provider is available for collections
    When the user initiates an MTN deposit of 5000 XAF
    Then the deposit should be in PENDING status
    When the MTN collection callback reports FAILED for the deposit
    Then the transaction status should be "FAILED"
    When a late MTN collection callback reports SUCCESSFUL for the same deposit
    Then the transaction status should be "FAILED"
    And the user's Fineract XAF balance should not have changed
