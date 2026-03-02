@e2e @scheduled-payments
Feature: Scheduled Payment Workflow (E2E)
  As the asset platform
  I want payments to require manual admin confirmation
  So that admins can review and optionally adjust amounts before execution

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Bond coupon: scheduler creates pending, admin confirms
  # -----------------------------------------------------------------

  Scenario: Bond coupon creates pending schedule and admin confirms
    Given an active bond asset "SCH" priced at 10000 with supply 100 and interest rate 5.80
    And the user holds 5 units of bond "SCH"
    When the scheduler creates a pending coupon schedule for "SCH"
    Then a PENDING scheduled payment should exist for "SCH" with type "COUPON"
    And the estimated amount per unit should be greater than 0
    And the scheduled payment holder count should be 1
    When the admin confirms the scheduled payment
    Then the scheduled payment status should be "CONFIRMED"
    And the confirmed payment should have 1 holders paid
    And the user's XAF balance should have increased after coupon

  # -----------------------------------------------------------------
  # Income distribution: confirm with custom amount per unit
  # -----------------------------------------------------------------

  Scenario: Income distribution with custom amount per unit
    Given an active income asset "SCR" with price 5000, supply 1000, income type "RENT", rate 8.0, frequency 1
    And the user holds 10 units of income asset "SCR"
    When the scheduler creates a pending income schedule for "SCR"
    Then a PENDING scheduled payment should exist for "SCR" with type "INCOME"
    When the admin confirms the scheduled payment with amount per unit 150
    Then the scheduled payment status should be "CONFIRMED"
    And the actual amount per unit should be 150

  # -----------------------------------------------------------------
  # Cancel a pending payment
  # -----------------------------------------------------------------

  Scenario: Admin cancels a pending payment
    Given an active income asset "SCC" with price 2000, supply 500, income type "DIVIDEND", rate 5.0, frequency 3
    And the user holds 20 units of income asset "SCC"
    When the scheduler creates a pending income schedule for "SCC"
    And the admin cancels the scheduled payment with reason "Postponed to next quarter"
    Then the scheduled payment status should be "CANCELLED"

  # -----------------------------------------------------------------
  # List and filter
  # -----------------------------------------------------------------

  Scenario: List and filter scheduled payments
    Given an active bond asset "SLF" priced at 10000 with supply 100 and interest rate 5.80
    And the user holds 2 units of bond "SLF"
    When the scheduler creates a pending coupon schedule for "SLF"
    And the admin lists scheduled payments with status "PENDING"
    Then the listed payments should all have status "PENDING"
    When the admin lists scheduled payments with type "COUPON"
    Then the listed payments should all have payment type "COUPON"
