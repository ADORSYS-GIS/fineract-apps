@e2e @registration @approve-and-deposit
Feature: Customer Registration (Stage 2) - Approve and Deposit

  As a KYC manager
  I want to approve, activate, and deposit into a customer's newly created savings account
  So that they can start using their account.

  Background:
    Given Fineract is initialized for registration tests
    And a KYC manager is authenticated

  Scenario: Successful approval, activation, and deposit
    Given a new customer has been registered with the following details:
      | externalId | approve-deposit-001 |
      | firstName  | Alice               |
      | lastName   | Smith               |
      | phone      | +237691234575       |
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | 1000        |
      | paymentType   | Orange Money        |
    Then the approval and deposit should be successful and return a transactionId

  Scenario: Successful approval and activation only
    Given a new customer has been registered with the following details:
      | externalId | approve-only-001 |
      | firstName  | Bob                |
      | lastName   | Brown              |
      | phone      | +237691234576      |
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | 0           |
      | paymentType   | Orange Money        |
    Then the approval and deposit should be successful and not return a transactionId

  Scenario: Idempotency check for approve and deposit
    Given a new customer has been registered with the following details:
      | externalId | idempotency-001 |
      | firstName  | Carol             |
      | lastName   | Danvers           |
      | phone      | +237691234577     |
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | 1500        |
      | paymentType   | Orange Money        |
    Then the approval and deposit should be successful and return a transactionId
    And the same request is sent again
    Then the approval and deposit should be successful and return the same transactionId

  Scenario: Attempt to approve with non-existent savings account
    Given a new customer has been registered with the following details:
      | externalId | non-existent-account-001 |
      | firstName  | Eve                      |
      | lastName   | Frollo                   |
      | phone      | +237691234578            |
    When the KYC manager attempts to approve and deposit for a non-existent account with details:
      | depositAmount | 1000         |
      | paymentType   | Orange Money |
    Then the registration should fail with a 404 Not Found status code

  Scenario: Attempt to approve with missing idempotency key
    Given a new customer has been registered with the following details:
      | externalId | missing-idempotency-key-001 |
      | firstName  | Gaston                   |
      | lastName   | Tremaine                 |
      | phone      | +237691234579            |
    When the KYC manager attempts to approve and deposit without an idempotency key with details:
      | depositAmount | 1000         |
      | paymentType   | Orange Money |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to approve with invalid payment type
    Given a new customer has been registered with the following details:
      | externalId | invalid-payment-type-001 |
      | firstName  | Hades                    |
      | lastName   | Horned-King              |
      | phone      | +237691234580            |
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | 1000                  |
      | paymentType   | Invalid-Payment-Type  |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to approve with negative deposit amount
    Given a new customer has been registered with the following details:
      | externalId | negative-deposit-001 |
      | firstName  | Jafar                |
      | lastName   | Maleficent           |
      | phone      | +237691234581        |
    When the KYC manager approves, activates, and deposits into the account with the following details:
      | depositAmount | -1000        |
      | paymentType   | Orange Money |
    Then the registration should fail with a 400 Bad Request status code
