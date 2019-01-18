Feature: create a new request
	As an requester I want to be able to submit my output (and associated metadata) for review so that I can start the process of getting my outputs out of the secure environment
	Background:
		Given requester has logged in
		And requester has started a request
		And the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge
	Scenario: A valid request
		Given requester adds an output file that does not violate any blocking or warning rules
		When requester submits their request 
		Then the request status is changed to "Awaiting Review"
	Scenario: A request has no data
		Then the requester should not be able to submit the request