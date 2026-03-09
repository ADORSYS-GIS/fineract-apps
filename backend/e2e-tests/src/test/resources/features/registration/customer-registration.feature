@e2e @registration
Feature: Customer Registration (E2E)
  As a new customer
  I want to register for self-service access
  So that I can use the platform

  Background:
    Given Fineract is initialized for registration tests

  # -----------------------------------------------------------------
  # Successful registration
  # -----------------------------------------------------------------

  Scenario: Successful customer registration
    When a customer registers with:
      | firstName | John              |
      | lastName  | Doe               |
      | email     | john.doe@e2e.test |
      | phone     | +237600000001     |
    Then the response status should be 201
    And the registration response should include an externalId
    And the registration response status should be "pending_verification"

  Scenario: Registration with full details including address
    When a customer registers with:
      | firstName | Jane               |
      | lastName  | Smith              |
      | email     | jane.smith@e2e.test |
      | phone     | +237600000002      |
      | city      | Douala             |
      | country   | Cameroon           |
    Then the response status should be 201
    And the registration response should include an externalId

  # -----------------------------------------------------------------
  # Error scenarios
  # -----------------------------------------------------------------

  Scenario: Duplicate email returns error
    When a customer registers with:
      | firstName | Dup1         |
      | lastName  | Test         |
      | email     | dup@e2e.test |
      | phone     | +237600000003 |
    Then the response status should be 201
    When a customer registers with:
      | firstName | Dup2         |
      | lastName  | Test         |
      | email     | dup@e2e.test |
      | phone     | +237600000004 |
    Then the response status should be 400

  Scenario: Registration with missing required fields returns 400
    When a customer registers with:
      | firstName | Missing      |
      | lastName  | Email        |
      | phone     | +237600000005 |
    Then the response status should be 400

