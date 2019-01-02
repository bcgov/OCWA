Feature: Draft requests
As an requester I want to be able to save a draft of my request so that I can don't have to fill out the request form all at once
	Background:
		Given requester has logged in
	Scenario: Save a draft request (with files)
		And requester has started a request
		And requester add output files to the request
		But has not submitted the request
		When the requester saves their request
		Then the requester should be able to re-open the request and pick up where they left off
		
	Scenario: Save a draft request (no files)
		And requester has started a request
		But has not submitted the request
		When the requester saves their request
		Then the requester should be able to re-open the request and pick up where they left off