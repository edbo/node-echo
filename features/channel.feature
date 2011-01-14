Feature: Backplane channel implementation (http://backplanespec.googlegroups.com/web/backplane-20101101.pdf?hl=en)
  In order to allow communication between javascript clients and server applications
  As a javascript widget server
  I want to securely post messages and anonymously consume messages on a randomly generated channel

  Scenario: Post a message
    Given the api key "valid_key"
    When I post a valid message to a random channel
    Then I should receive an HTTP Response code of "200"

  Scenario: Use an invalid key
    Given the api key "invalid_key"
    When I post a valid message to a random channel
    Then I should receive response code "401" with message "Wrong username and/or password"