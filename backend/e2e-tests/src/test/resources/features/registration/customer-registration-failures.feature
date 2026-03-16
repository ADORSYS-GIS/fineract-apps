@e2e @registration @registration-failure
Feature: Customer Registration (Stage 1) - Failure Scenarios

  As a KYC manager
  I want to ensure that the system prevents duplicate registrations
  So that we maintain data integrity.

  Background:
    Given Fineract is initialized for registration tests
    And a KYC manager is authenticated

  Scenario: Attempt to register with a duplicate externalId
    Given a customer has already been registered with the following details:
      | externalId | duplicate-external-id-001 |
      | firstName  | John                      |
      | lastName   | Doe                       |
      | phone      | +237691234570             |
    When a new customer is registered with the following details:
      | externalId | duplicate-external-id-001 |
      | firstName  | Jane                      |
      | lastName   | Doe                       |
      | phone      | +237691234571             |
    Then the registration should fail with a 409 Conflict status code

  Scenario: Attempt to register with a missing firstName
    When a new customer is registered with the following details:
      | externalId | missing-firstname-001 |
      | lastName   | Doe                     |
      | phone      | +237691234572           |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to register with a missing lastName
    When a new customer is registered with the following details:
      | externalId | missing-lastname-001 |
      | firstName  | John                    |
      | phone      | +237691234573           |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to register with a missing phone number
    When a new customer is registered with the following details:
      | externalId | missing-phone-001 |
      | firstName  | John              |
      | lastName   | Doe               |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to register with a missing externalId
    When a new customer is registered with the following details:
      | firstName | John              |
      | lastName  | Doe               |
      | phone     | +237691234574     |
    Then the registration should fail with a 400 Bad Request status code
