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
      | fullName   | John Doe                  |
      | phone      | +237691234570             |
    When a new customer is registered with the following details:
      | externalId | duplicate-external-id-001 |
      | fullName   | Jane Doe                  |
      | phone      | +237691234571             |
    Then the registration should fail with a 409 Conflict status code

  Scenario: Attempt to register with a missing fullName
    When a new customer is registered with the following details:
      | externalId | missing-fullName-001 |
      | phone      | +237691234572           |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to register with a missing phone number
    When a new customer is registered with the following details:
      | externalId | missing-phone-001 |
      | fullName   | John Doe          |
    Then the registration should fail with a 400 Bad Request status code

  Scenario: Attempt to register with a missing externalId
    When a new customer is registered with the following details:
      | fullName  | John Doe          |
      | phone     | +237691234574     |
    Then the registration should fail with a 400 Bad Request status code
