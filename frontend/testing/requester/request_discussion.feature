Feature: Discussion about a request
	As an requester I want to be able to discuss my outputs with output checkers so that I can answer questions the output checker may have about my request
	As an output checker I want to be able to discuss a request with the requester that submitted it so that I can better understand how to adjudicate the request
	Scenario: requester adds a new comment about request
		Given requester has logged in
		And requester has a submitted request
		And the request has been claimed by an output checker
		When requester writes and submits a new comment
		Then the requester should see their new comment displayed
		And the output checker assigned to the request should be notified of the new comment
	Scenario: Output checker adds a new comment about request
		Given output checker has logged in
		When output checker writes and submits a new comment
		Then the output checker should see their new comment displayed
		And the requester(s) associated to the request should be notified of the new comment