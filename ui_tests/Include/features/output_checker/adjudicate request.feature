Feature: Adjudicate request
As an output checker I need the ability to change the status of a request to "Revisions required" so that I can allow the requester to tweak their request without having deny the request and forcing the requester to create a new request
As an output checker I need the ability to change the status of a request to "Approved" so that I can allow the requester to take their outputs out of the SRE

	Scenario: Request is worthy of approval
	Given an unclaimed request exists
	And output checker has logged in 
	When output checker tries to claim an unclaimed request
	And the output checker marks the request as approved
	Then the output checker should see the status of the request updated to "Approved"
	
	Scenario: Request is needs revisions
	Given an unclaimed request exists
	And output checker has logged in 
	When output checker tries to claim an unclaimed request
	And the output checker marks the request as needs revisions
	Then the output checker should see the status of the request updated to "Work in progress"