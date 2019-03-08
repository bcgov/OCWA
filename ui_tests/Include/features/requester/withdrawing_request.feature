Feature: Withdrawing a request
  As an requester I want to be able to withdraw my request so that I can let checkers know that my request is no longer something I want reviewed

	Background:
		Given requester has logged in

  Scenario: Withdraw a request that is awaiting review
    And requester has a request of status "Awaiting review"
    When the requester views the request
    And the requester withdraws the request
    Then the request status is changed to "Work in Progress"

  Scenario: Withdraw a request that is in the process of being reviewed
    And requester has a request of status "Review in progress"
    When the requester views the request
    And the requester withdraws the request
    Then the request status is changed to "Work in Progress"
