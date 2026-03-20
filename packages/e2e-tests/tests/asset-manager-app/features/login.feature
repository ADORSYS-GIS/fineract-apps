Feature: Asset Manager Login

  Scenario: User logs in successfully
    Given I am on the login page
    When I enter my credentials
    Then I should be redirected to the dashboard
