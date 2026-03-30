@e2e @registration @registration-edge-cases
Feature: Customer Registration - Edge Case Scenarios

  As a KYC manager
  I want to ensure the system handles various edge cases gracefully
  So that the registration process is robust and secure.

  Background:
    Given Fineract is initialized for registration tests
    And a KYC manager is authenticated

  Scenario: Idempotency with different payload
    Given a new customer has been registered with the following details:
      | externalId | idempotency-payload-001 |
      | fullName   | Iden Potent         |
      | phone      | +237691234582      |
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | 2000        |
      | paymentType   | Orange Money|
    Then the approval and deposit should be successful and return a transactionId
    When the KYC manager attempts to approve and deposit with the same idempotency key but a different deposit amount:
      | depositAmount | 5000        |
      | paymentType   | Orange Money|
    Then the approval and deposit should be successful and return the same transactionId

  Scenario: Attempt to deposit to an already active account
    Given a new customer has been registered with the following details:
      | externalId | already-active-001 |
      | fullName   | Active User         |
      | phone      | +237691234583      |
    And the account is already active
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | 1000        |
      | paymentType   | Orange Money|
    Then the approval and deposit should be successful and return a transactionId

  Scenario: Attempt to approve with blank idempotency key
    Given a new customer has been registered with the following details:
      | externalId | blank-key-001   |
      | fullName   | Blank Key       |
      | phone      | +237691234584   |
    When the KYC manager attempts to approve and deposit with a malformed idempotency key " " and details:
      | depositAmount | 1000         |
      | paymentType   | Orange Money |
    Then the response status should be 400
