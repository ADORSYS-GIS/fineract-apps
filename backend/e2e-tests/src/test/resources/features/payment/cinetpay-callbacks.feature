@e2e @payment @cinetpay-callbacks
Feature: CinetPay Callback Processing
  As the platform, I want to process CinetPay payment and transfer callbacks
  so that transaction statuses are correctly updated.
  CinetPay callbacks always return 200 (errors are never exposed to the provider).

  Background:
    Given the MTN provider is available for collections
    And the user has a Fineract XAF account with sufficient balance

  # -----------------------------------------------------------------
  # Payment callbacks (JSON + Form) - unknown transactions
  # -----------------------------------------------------------------

  Scenario: CinetPay payment callback (JSON) for unknown transaction is silently accepted
    When a CinetPay payment callback is sent as JSON for a non-existent transaction
    Then the CinetPay callback response status should be 200

  Scenario: CinetPay payment callback (Form) for unknown transaction is silently accepted
    When a CinetPay payment callback is sent as form data for a non-existent transaction
    Then the CinetPay callback response status should be 200

  # -----------------------------------------------------------------
  # Transfer callbacks (JSON + Form) - unknown transactions
  # -----------------------------------------------------------------

  Scenario: CinetPay transfer callback (JSON) for unknown transaction is silently accepted
    When a CinetPay transfer callback is sent as JSON for a non-existent transaction
    Then the CinetPay callback response status should be 200

  Scenario: CinetPay transfer callback (Form) for unknown transaction is silently accepted
    When a CinetPay transfer callback is sent as form data for a non-existent transaction
    Then the CinetPay callback response status should be 200

  # -----------------------------------------------------------------
  # Callbacks for seeded PENDING transactions
  # -----------------------------------------------------------------

  Scenario: CinetPay payment callback (JSON) processes a PENDING deposit
    Given a pending CinetPay deposit transaction exists in the database
    When a CinetPay payment callback is sent as JSON with success status for the pending deposit
    Then the CinetPay callback response status should be 200

  Scenario: CinetPay transfer callback (JSON) processes a PENDING withdrawal
    Given a pending CinetPay withdrawal transaction exists in the database
    When a CinetPay transfer callback is sent as JSON with success status for the pending withdrawal
    Then the CinetPay callback response status should be 200
