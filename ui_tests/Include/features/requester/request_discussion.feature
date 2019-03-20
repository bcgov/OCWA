Feature: Discussion about a request
  As an requester I want to be able to discuss my outputs with output checkers so that I can answer questions the output checker may have about my request
  As an output checker I want to be able to discuss a request with the requester that submitted it so that I can better understand how to adjudicate the request

  Scenario: requester adds a new comment about request
    Given requester has logged in
    And requester has a request of status "awaiting review"
    And the request has been claimed by an output checker
    When requester writes and submits a new comment
    Then requester should see their new comment displayed
    And output checker assigned to the request should be notified of the new comment
    And output checker should be able to see the new comment

  Scenario: Output checker adds a new comment about request
    Given output checker has logged in
    When output checker writes and submits a new comment
    Then output checker should see their new comment displayed
    And requester associated to the request should be notified of the new comment
    And requester should be able to see the new comment
