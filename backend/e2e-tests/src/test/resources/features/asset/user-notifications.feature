@e2e @user-notifications
Feature: User Notifications and Preferences
  As a user, I want to see notifications for my trades and manage my notification preferences.

  Background:
    Given Fineract is initialized with GL accounts and payment types
    And an LP client exists in Fineract
    And a test user exists in Fineract with external ID "e2e-notif-user"
    And the test user has an XAF account with balance 1000000

  # -----------------------------------------------------------------
  # Trade-triggered notifications
  # -----------------------------------------------------------------

  Scenario: Buying an asset generates a TRADE_EXECUTED notification
    Given an active stock asset "NT1" with price 1000 and supply 100
    When the user buys 5 units of "NT1"
    Then the trade should be FILLED
    When the user lists their notifications
    Then the response status should be 200
    And the notification list should contain a "TRADE_EXECUTED" event for asset "NT1"

  Scenario: Unread count increments with each trade
    Given an active stock asset "NT2" with price 1000 and supply 100
    When the user buys 3 units of "NT2"
    Then the trade should be FILLED
    When the user gets their unread notification count
    Then the user unread count should be at least 1
    When the user buys 2 units of "NT2"
    Then the trade should be FILLED
    When the user gets their unread notification count
    Then the user unread count should be at least 2

  # -----------------------------------------------------------------
  # Notification management
  # -----------------------------------------------------------------

  Scenario: User can mark a notification as read
    Given an active stock asset "NT3" with price 1000 and supply 50
    When the user buys 5 units of "NT3"
    Then the trade should be FILLED
    When the user lists their notifications
    Then the notification list should have at least 1 entry
    When the user marks the first notification as read
    Then the response status should be 200
    When the user lists their notifications
    Then the first notification should be marked as read

  Scenario: User can mark all notifications as read
    Given an active stock asset "NT4" with price 1000 and supply 100
    When the user buys 3 units of "NT4"
    Then the trade should be FILLED
    When the user buys 2 units of "NT4"
    Then the trade should be FILLED
    When the user marks all notifications as read
    Then the response status should be 200
    And the response body should contain "marked"
    When the user gets their unread notification count
    Then the user unread count should be 0

  # -----------------------------------------------------------------
  # Notification preferences
  # -----------------------------------------------------------------

  Scenario: Default notification preferences are all enabled
    When the user gets their notification preferences
    Then the response status should be 200
    And all notification preferences should be enabled

  Scenario: Disabling tradeExecuted preference suppresses trade notifications
    When the user updates notification preferences with tradeExecuted disabled
    Then the response status should be 200
    And the tradeExecuted preference should be false
    Given an active stock asset "NT5" with price 1000 and supply 100
    When the user buys 5 units of "NT5"
    Then the trade should be FILLED
    When the user lists their notifications
    Then the notification list should not contain a "TRADE_EXECUTED" event for asset "NT5"

  Scenario: Re-enabling tradeExecuted preference restores notifications
    When the user updates notification preferences with tradeExecuted disabled
    Then the response status should be 200
    Given an active stock asset "NT6" with price 1000 and supply 100
    When the user buys 3 units of "NT6"
    Then the trade should be FILLED
    When the user updates notification preferences with tradeExecuted enabled
    Then the response status should be 200
    Given an active stock asset "NT7" with price 1000 and supply 100
    When the user buys 3 units of "NT7"
    Then the trade should be FILLED
    When the user lists their notifications
    Then the notification list should contain a "TRADE_EXECUTED" event for asset "NT7"

  # -----------------------------------------------------------------
  # Delisting notification
  # -----------------------------------------------------------------

  Scenario: Delisting generates a notification for the position holder
    Given an active stock asset "NT8" with price 1000 and supply 100
    When the user buys 5 units of "NT8"
    Then the trade should be FILLED
    When the admin initiates delisting of asset "NT8" on date 30 days from now
    Then the response status should be 200
    When the user lists their notifications
    Then the notification list should contain a "DELISTING_ANNOUNCED" event for asset "NT8"

  Scenario: A failed trade does not generate a notification
    Given an active stock asset "NT9" with price 1000 and supply 5
    When the user buys more units than available supply of "NT9"
    Then the trade should be rejected
    When the user lists their notifications
    Then the notification list should not contain a "TRADE_EXECUTED" event for asset "NT9"
