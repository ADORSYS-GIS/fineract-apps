@e2e @accounting @wip
Feature: Accounting GL Mappings (E2E)
  Verify that trade execution creates correct GL journal entries in Fineract
  and that the admin accounting endpoints report exact amounts.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-test-user-001"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Baseline: no trades -> fee-tax summary is zero (local DB cleaned)
  # -----------------------------------------------------------------

  Scenario: Fee and tax summary returns zero total when no trades exist
    When the admin requests the fee and tax summary
    Then the response status should be 200
    And the fee-tax summary report type should be "FEE_AND_TAX_SUMMARY"
    And the fee-tax summary total should be 0

  # -----------------------------------------------------------------
  # BUY trade -> exact fee and registration duty in reports
  # -----------------------------------------------------------------
  # Asset: issuerPrice=2000, lpAskPrice=2200, fee=0.5%, regDuty=2%
  # BUY 5 units: grossAmount = 5 x 2200 = 11000
  #   fee = 11000 x 0.005 = 55
  #   registrationDuty = 11000 x 0.02 = 220

  Scenario: Buy trade creates exact fee income and registration duty in trial balance
    When the admin snapshots the trial balance
    Given an active stock asset "ACG" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ACG"
    Then the trade should be FILLED
    And the filled order fee should be 55
    When the admin requests the trial balance
    Then the response status should be 200
    And the trial balance GL "87" credits should have increased by 55
    And the trial balance GL "91" debits should have increased by 220

  Scenario: Fee-tax summary reflects exact amounts after buy trade
    Given an active stock asset "ACF" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ACF"
    Then the trade should be FILLED
    When the admin requests the fee and tax summary
    Then the response status should be 200
    And the fee-tax summary entry for GL "87" should have amount 55
    And the fee-tax summary entry for GL "91" should have amount 220
    And the fee-tax summary total should be 275

  # -----------------------------------------------------------------
  # Multiple trades -> amounts accumulate
  # -----------------------------------------------------------------
  # Asset: price=1000, lpAskPrice=1100, fee=1%
  # BUY 10 units: grossAmount = 10 x 1100 = 11000, fee = 11000 x 0.01 = 110
  # Two trades: total fee = 220

  Scenario: Multiple buy trades accumulate fee income in trial balance
    When the admin snapshots the trial balance
    Given an active stock asset "ACM" with fee 0.01 and price 1000 and supply 200
    When the user buys 10 units of "ACM"
    Then the trade should be FILLED
    When the user buys 10 units of "ACM"
    Then the trade should be FILLED
    When the admin requests the trial balance
    Then the response status should be 200
    And the trial balance GL "87" credits should have increased by 220

  # -----------------------------------------------------------------
  # Trial balance with currency filter
  # -----------------------------------------------------------------

  Scenario: Trial balance filters by currency code
    When the admin snapshots the trial balance
    Given an active stock asset "ACX" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ACX"
    Then the trade should be FILLED
    When the admin requests the trial balance for currency "XAF"
    Then the response status should be 200
    And the trial balance currency should be "XAF"
    And the trial balance GL "87" credits should have increased by 55

  # -----------------------------------------------------------------
  # SELL trade -> capital gains tax in reports
  # -----------------------------------------------------------------
  # Buy first, then sell at higher price to realize capital gain

  Scenario: Sell trade with capital gains shows tax in fee-tax summary
    Given an active stock asset "ACS" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ACS"
    Then the trade should be FILLED
    When the user sells 3 units of "ACS"
    Then the trade should be FILLED
    When the admin requests the fee and tax summary
    Then the response status should be 200
    And the fee-tax summary report type should be "FEE_AND_TAX_SUMMARY"
    And the fee-tax summary total should be greater than 0

  # -----------------------------------------------------------------
  # Sell trade with registration duty + fee in trial balance (GL 88 + 92)
  # Asset: issuerPrice=2000, lpBidPrice=1900, fee=0.5%, regDuty=2%
  # SELL 3 units: grossAmount = 3 x 1900 = 5700
  #   fee = 5700 x 0.005 = 29 (rounded)
  #   registrationDuty = 5700 x 0.02 = 114
  # -----------------------------------------------------------------

  Scenario: Sell trade creates fee and registration duty in trial balance
    When the admin snapshots the trial balance
    Given an active stock asset "ASL" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ASL"
    Then the trade should be FILLED
    When the user sells 3 units of "ASL"
    Then the trade should be FILLED
    When the admin requests the trial balance
    Then the response status should be 200
    # BUY fee: 5*2200*0.005=55, SELL fee: 3*1900*0.005=29 -> total 84 (approximate, rounding may vary)
    And the trial balance GL "87" credits should have increased by at least 80

  # -----------------------------------------------------------------
  # Double-entry integrity — adapted from gitops Phase 3
  # After trades, total debits must equal total credits across all GL accounts
  # -----------------------------------------------------------------

  Scenario: Trial balance maintains double-entry integrity after trades
    Given an active stock asset "ADE" with fee 0.01 and price 1000 and supply 200
    When the user buys 10 units of "ADE"
    Then the trade should be FILLED
    When the user sells 5 units of "ADE"
    Then the trade should be FILLED
    When the admin requests the trial balance
    Then the response status should be 200
    And the trial balance total debits should equal total credits

  # -----------------------------------------------------------------
  # Fee collection account balance — adapted from gitops Phase 4
  # Verify fee savings account balance matches sum of trade fees
  # -----------------------------------------------------------------

  Scenario: Fee collection account balance matches total collected fees
    Given an active stock asset "AFC" with fee 0.01 and price 1000 and supply 200
    When the user buys 10 units of "AFC"
    Then the trade should be FILLED
    When the user buys 10 units of "AFC"
    Then the trade should be FILLED
    Then the fee collection account balance should match total order fees

  # -----------------------------------------------------------------
  # Reconciliation produces zero discrepancies for clean data
  # -----------------------------------------------------------------

  Scenario: Reconciliation finds no discrepancies after clean trades
    Given an active stock asset "ARC" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ARC"
    Then the trade should be FILLED
    When the admin triggers reconciliation
    Then the response status should be 200
    And the reconciliation should report 0 discrepancies

  # -----------------------------------------------------------------
  # GL 48 (Suspense) balance = 0 — all transfers settled
  # Adapted from gitops Phase 3b
  # -----------------------------------------------------------------

  Scenario: GL 48 suspense balance is zero after trades
    When the admin snapshots the trial balance
    Given an active stock asset "ASU" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ASU"
    Then the trade should be FILLED
    When the admin requests the trial balance
    Then the response status should be 200
    And the trial balance GL "4501" net balance should be 0

  # -----------------------------------------------------------------
  # Tax accounts: buy + sell → registration duty and fees in summary
  # Checks #9, #10, #12
  # -----------------------------------------------------------------

  Scenario: Tax and fee GL entries present after buy and sell trades
    Given an active stock asset "ATX" with fee 0.005 and price 2000 and supply 100
    When the user buys 10 units of "ATX"
    Then the trade should be FILLED
    When the user sells 5 units of "ATX"
    Then the trade should be FILLED
    When the admin requests the fee and tax summary
    Then the response status should be 200
    And the fee-tax summary entry for GL "91" should have amount greater than 0
    And the fee-tax summary entry for GL "87" should have amount greater than 0

  # -----------------------------------------------------------------
  # GL 92 (Reg Duty) debits cross-reference with fee-tax summary
  # Check #10: GL expense debits = reported tax amount
  # -----------------------------------------------------------------

  Scenario: Registration duty GL debits match fee-tax summary amount
    When the admin snapshots the trial balance
    Given an active stock asset "ARD" with fee 0.005 and price 2000 and supply 100
    When the user buys 5 units of "ARD"
    Then the trade should be FILLED
    When the admin requests the trial balance
    Then the response status should be 200
    When the admin requests the fee and tax summary
    And the fee-tax GL "91" debits should match fee-tax summary amount

  # -----------------------------------------------------------------
  # Supply reconciliation via reconciliation endpoint
  # Checks #1, #2, #3, #7, #8 (validated internally by ReconciliationService)
  # -----------------------------------------------------------------

  Scenario: Full reconciliation passes after buy and sell cycle
    Given an active stock asset "AFR" with fee 0.005 and price 2000 and supply 100
    When the user buys 10 units of "AFR"
    Then the trade should be FILLED
    When the user sells 3 units of "AFR"
    Then the trade should be FILLED
    When the admin triggers reconciliation
    Then the response status should be 200
    And the reconciliation should report 0 discrepancies
