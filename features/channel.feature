Feature: Backplane channel implementation (http://backplanespec.googlegroups.com/web/backplane-20101101.pdf?hl=en)
  In order to allow communication between javascript clients and server applications
  As a javascript widget server
  I want to securely post messages and anonymously consume messages on a randomly generated channel

  Scenario: Post a message
    Given a valid api key
    When I post a valid message to a random channel
    Then I should receive an HTTP Response code of "200"
    Then when I get messages from that channel
    Then I should receive an HTTP Response code of "200"
    And receive the same message back
    Then post another valid message to the same channel
    Then when I get messages from that channel
    Then I should receive an HTTP Response code of "200"
    And receive both message back

  Scenario: Get messages over jsonp
    Given a valid api key
    And two messages already in the channel
    When I get the messages from the channel with a callback set
    Then I should receive an HTTP Response code of "200"
    And I should receive the messages as a jsonp response

  Scenario: Use an invalid key
    Given an invalid api key
    When I post a valid message to a random channel
    Then I should receive an HTTP Response code of "401"
    And the message "Wrong username and/or password."