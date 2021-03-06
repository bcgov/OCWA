Feature: Claim a request
  As an output checker I need the ability to claim a request so that I can let my fellow output checker know that I'm going to be working on a particular request

	Background:
		Given requester has logged in
    And requester has a request of status "awaiting review"

  Scenario: Claim an unclaimed request
		Given output checker has logged in
    When output checker tries to claim an unclaimed request
    Then the output checker should be able to see that they're now assigned the request
