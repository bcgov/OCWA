Feature: Draft requests
As an requester I want to be able to save a draft of my request so that I can don't have to fill out the request form all at once
	Background:
		Given requester has logged in
		And requester has started a request
	Scenario: Save a draft request (no files)
		When the requester saves their request
		Then the requester should see their saved request including 0 output file 0 supporting file
		And requester should be able to make changes to the request
	Scenario: Save a draft request (1 output file)
		And requester adds 1 output file that does not violate any blocking or warning rules
		When the requester saves their request
		Then the requester should see their saved request including 1 output file 0 supporting file
		And requester should be able to make changes to the request
	Scenario: Save a draft request (1 output file, 1 supporting file)
		And requester adds 1 output file that does not violate any blocking or warning rules
		And requester adds 1 supporting files
		When the requester saves their request
		Then the requester should see their saved request including 1 output file 1 supporting file 
		And requester should be able to make changes to the request
