@e2e @payment @idempotency
Feature: Payment Idempotency
  Duplicate requests with the same idempotency key should return the same result.

  Background:
    Given the MTN provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  @smoke
  Scenario: Duplicate deposit request returns same transaction
    When the user initiates an MTN deposit of 5000 XAF with idempotency key "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    Then the deposit should be in PENDING status
    When the user initiates an MTN deposit of 5000 XAF with idempotency key "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
    Then the deposit should be in PENDING status
    And the transaction ID should be the same as the first request
