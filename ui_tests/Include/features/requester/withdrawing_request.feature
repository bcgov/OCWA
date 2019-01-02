Feature: Withdrawing a request
As an requester I want to be able to withdraw my request so that I can let checkers know that my request is no longer something I want reviewed
	Scenario: Withdraw a request that is awaiting review
		Given requester has logged in
		And requester has a request of status "Awaiting review"
		When the requester withdraws the request
		Then the request status is changed to "Work in Progress"
	Scenario: Withdraw a request that is in the process of being reviewed
		Given requester has logged in
		And requester has a request of status "Review in progress"
		When the requester withdraws the request
		Then the request status is changed to "Work in Progress"