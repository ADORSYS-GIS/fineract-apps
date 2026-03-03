@bonds @accrued-interest @wip
Feature: Bond Accrued Interest
  As a bond holder
  I want my accrued interest tracked daily
  So that I can see my earned but unpaid interest

  # Note: These scenarios are @wip because the AccruedInterestScheduler
  # is tested via unit tests. Integration testing requires direct scheduler
  # invocation which is better covered in AccruedInterestSchedulerTest.

  Background:
    Given the test database is seeded with standard data

  Scenario: Daily interest accrual for bond position
    Given a bond "bond-bdd" exists with issuer price 10000 and interest rate 5 percent
    And user 42 holds 100 units of bond "bond-bdd"
    When the daily accrued interest scheduler runs
    Then user 42 should have accrued interest greater than 0 for bond "bond-bdd"

  Scenario: Accrued interest resets on coupon payment
    Given a bond "bond-bdd" exists with issuer price 10000 and interest rate 5 percent
    And user 42 holds 100 units of bond "bond-bdd"
    And user 42 has accrued interest of 5000 for bond "bond-bdd"
    When accrued interest is reset for bond "bond-bdd"
    Then user 42 should have accrued interest of 0 for bond "bond-bdd"
