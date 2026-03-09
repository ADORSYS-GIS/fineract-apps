@e2e @journey
Feature: Full User Journey (E2E)
  As a new customer
  I want to register, deposit funds, buy an asset, and verify my balance
  So that the entire platform works end-to-end across all components

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract

  # -----------------------------------------------------------------
  # Complete user journey: Register → Deposit → Buy → Check Balance
  # -----------------------------------------------------------------

  Scenario: New user registers, deposits XAF, buys stock, and verifies balances
    # Step 1: Customer registration (simulated via Fineract client creation)
    Given a new customer "Journey" "User" is registered in Fineract with external ID "e2e-journey-user-001"
    And the customer has an XAF savings account

    # Step 2: Customer deposits funds (simulated via Fineract deposit)
    When the customer deposits 500000 XAF into their account
    Then the customer's XAF balance should be 500000

    # Step 3: Asset is available for purchase
    Given an active stock asset "JNY" with price 10000 and supply 1000

    # Step 4: Customer buys asset
    When the journey user buys 5 units of "JNY"
    Then the trade should be FILLED

    # Step 5: Verify balances after purchase
    Then the customer's XAF balance should have decreased
    And the journey user's portfolio should contain "JNY" with 5 units

  Scenario: New user registers, deposits, buys bond, and checks income projection
    # Step 1: Customer setup
    Given a new customer "Bond" "Investor" is registered in Fineract with external ID "e2e-journey-user-002"
    And the customer has an XAF savings account

    # Step 2: Deposit
    When the customer deposits 1000000 XAF into their account
    Then the customer's XAF balance should be 1000000

    # Step 3: Bond available
    Given an active bond asset "JBD" priced at 50000 with supply 100 and interest rate 8.0

    # Step 4: Buy bond
    When the journey user buys 3 units of "JBD"
    Then the trade should be FILLED

    # Step 5: Verify portfolio and income projection
    Then the journey user's portfolio should contain "JBD" with 3 units
    When the journey user requests their income calendar for 12 months
    Then the income calendar should contain at least 1 projected event
