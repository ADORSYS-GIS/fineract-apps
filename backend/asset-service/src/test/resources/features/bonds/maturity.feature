@bonds @maturity
Feature: Bond Maturity Transition
  As the system scheduler
  I want bonds to transition to MATURED when their maturity date passes
  So that expired bonds stop trading

  Scenario: Bond past maturity date transitions to MATURED
    Given an active bond "bond-001" with maturity date yesterday
    When the maturity scheduler runs
    Then asset "bond-001" should have status "MATURED"

  Scenario: Bond before maturity date remains ACTIVE
    Given an active bond "bond-002" with maturity date in 1 year
    When the maturity scheduler runs
    Then asset "bond-002" should have status "ACTIVE"
