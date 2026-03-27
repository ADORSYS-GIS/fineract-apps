@e2e @registration @authorization
Feature: Customer Registration - Authorization Scenarios

  As a user with incorrect permissions
  I want to ensure that I cannot perform unauthorized actions
  So that the system remains secure.

  Background:
    Given Fineract is initialized for registration tests

  Scenario: Attempt to register a customer with an unauthorized user
    Given a user is authenticated with the role "ROLE_INSUFFICIENT"
    When the user attempts to register a new customer with the following details:
      | externalId | auth-fail-001 |
      | firstName  | Auth              |
      | lastName   | Fail              |
      | phone      | +237691234590     |
    Then the registration should fail with a 403 Forbidden status code

  Scenario: Attempt to approve and deposit with an unauthorized user
    Given a KYC manager is authenticated
    And a new customer has been registered with the following details:
      | externalId | auth-fail-002 |
      | firstName  | Auth              |
      | lastName   | FailTwo           |
      | phone      | +237691234591     |
    And a user is authenticated with the role "ROLE_INSUFFICIENT"
    When the user attempts to approve and deposit for the account with details:
      | depositAmount | 1000         |
      | paymentType   | Orange Money |
    Then the approval and deposit should fail with a 403 Forbidden status code

  Scenario: Attempt to register a customer without any roles
    Given a user is authenticated with no roles
    When the user attempts to register a new customer with the following details:
      | externalId | auth-fail-003 |
      | firstName  | NoRole            |
      | lastName   | User              |
      | phone      | +237691234592     |
    Then the registration should fail with a 403 Forbidden status code

  Scenario: Attempt to approve and deposit without any roles
    Given a KYC manager is authenticated
    And a new customer has been registered with the following details:
      | externalId | auth-fail-004 |
      | firstName  | NoRole            |
      | lastName   | UserTwo           |
      | phone      | +237691234593     |
    And a user is authenticated with no roles
    When the user attempts to approve and deposit for the account with details:
      | depositAmount | 1000         |
      | paymentType   | Orange Money |
    Then the approval and deposit should fail with a 403 Forbidden status code
