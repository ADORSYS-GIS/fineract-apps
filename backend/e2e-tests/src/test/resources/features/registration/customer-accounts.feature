@e2e @accounts
Feature: Customer Account Access (E2E)
  As a registered customer
  I want to view my savings accounts and transaction limits
  So that I can manage my finances

  Background:
    Given Fineract is initialized for registration tests
    And a registered customer exists with a savings account

  Scenario: Customer lists their savings accounts
    When the customer requests their savings accounts
    Then the response status should be 200

