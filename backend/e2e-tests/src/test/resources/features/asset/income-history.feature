@e2e @portfolio @income-history
Feature: Income History
  As an investor, I want to view my past coupon/income payments and upcoming scheduled events
  So that I can track what I have earned and what is projected from my bond portfolio

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 2000000

  # -----------------------------------------------------------------
  # Paid coupon events appear after confirmation + execution
  # -----------------------------------------------------------------

  @smoke
  Scenario: Paid coupon event appears in income history after confirmation
    Given an active bond asset "IHA" priced at 10000 with supply 100 and interest rate 7.00
    And the user holds 2 units of bond "IHA"
    When the scheduler creates a pending coupon schedule for "IHA"
    And the admin confirms the scheduled payment
    And the user requests their income history
    Then the response status should be 200
    And the income history should contain at least 1 paid event
    And the income history paid events should have positive net amounts

  Scenario: Income history summary total paid reflects confirmed coupon
    Given an active bond asset "IHB" priced at 10000 with supply 100 and interest rate 7.00
    And the user holds 3 units of bond "IHB"
    When the scheduler creates a pending coupon schedule for "IHB"
    And the admin confirms the scheduled payment
    And the user requests their income history
    Then the income history summary total paid should be greater than 0

  # -----------------------------------------------------------------
  # IRCM withholding in income history events
  # -----------------------------------------------------------------

  Scenario: IRCM withholding appears in income history for taxable bond
    Given an active taxable coupon bond "IHC" priced at 10000 with supply 100 and interest rate 7.00 and IRCM rate 16.5
    And the user holds 1 units of bond "IHC"
    When the scheduler creates a pending coupon schedule for "IHC"
    And the admin confirms the scheduled payment
    And the user requests their income history
    Then the income history should contain at least 1 paid event
    And the first paid event should have IRCM withheld greater than 0
    And the first paid event net amount should be less than gross amount

  # -----------------------------------------------------------------
  # Scheduled future events
  # -----------------------------------------------------------------

  Scenario: Upcoming scheduled coupons appear in income history
    Given an active bond asset "IHD" priced at 10000 with supply 100 and interest rate 7.00
    And the user holds 2 units of bond "IHD"
    When the user requests their income history with status "SCHEDULED"
    Then the response status should be 200
    And the income history should contain at least 1 scheduled event

  # -----------------------------------------------------------------
  # Status filter
  # -----------------------------------------------------------------

  Scenario: Income history can be filtered to show only PAID events
    Given an active bond asset "IHE" priced at 10000 with supply 100 and interest rate 7.00
    And the user holds 1 units of bond "IHE"
    When the scheduler creates a pending coupon schedule for "IHE"
    And the admin confirms the scheduled payment
    And the user requests their income history with status "PAID"
    Then the response status should be 200
    And all income history events should have status "PAID"
