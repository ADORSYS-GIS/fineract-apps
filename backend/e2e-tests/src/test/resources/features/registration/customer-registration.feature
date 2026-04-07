@e2e @registration
Feature: Customer Registration (Stage 1)

  As a KYC manager
  I want to register a new customer
  So that a client and a pending savings account are created in Fineract.

  Background:
    Given Fineract is initialized for registration tests
    And a KYC manager is authenticated

  Scenario: Successful Stage 1 Registration creates a client
    When a new customer is registered with the following details:
      | externalId | stage-1-client-001  |
      | fullName   | Alan Turing         |
      | email      | alan.t@e2e.test     |
      | phone      | +237691234567       |
    Then the registration should be successful and return a clientId
    And a corresponding client with id "stage-1-client-001" should exist in Fineract

  Scenario: Successful Stage 1 Registration with only required details creates a client
    When a new customer is registered with the following details:
      | externalId    | stage-1-client-003    |
      | fullName      | Ada Lovelace          |
      | phone         | +237691234569         |
    Then the registration should be successful and return a clientId
    And a corresponding client with id "stage-1-client-003" should exist in Fineract
