Feature: Draft requests
As an requester I want to be able to save a draft of my request so that I can don't have to fill out the request form all at once
	Background:
		Given requester has logged in
	Scenario: Save a draft request (with files)
		And requester has started a request
		And requester adds an output file that does not violate any blocking or warning rules
		And requester adds supporting files
		But has not submitted the request
		When the requester saves their request
		Then the requester should see their saved request including files 
		And requester should be able to make changes to the request
		
	Scenario: Save a draft request (no files)
		And requester has started a request
		But has not submitted the request
		When the requester saves their request
		Then the requester should see their saved request
		And requester should be able to make changes to the request