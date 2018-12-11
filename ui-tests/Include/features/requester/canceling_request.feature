Feature: Canceling a request
As an requester I want to be able to cancel my request so that I can let checkers know that my request is no longer something I want reviewed
	Scenario: Cancel a request
		Given requester has logged in
		And requester has a request that is "Awaiting review" or "Review in progress"
		When the requester cancels the request
		Then the request status is changed to "Work in Progress"