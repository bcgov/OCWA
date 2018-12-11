Feature: Adjudicate request
As an output checker I need the ability to change the status of a request to "Revisions required" so that I can allow the requester to tweak their request without having deny the request and forcing the requester to create a new request
As an output checker I need the ability to change the status of a request to "Approved" so that I can allow the requester to take their outputs out of the SRE

	Scenario: Request is worthy of approval
	Given A request exists that is in "Review in Progress"
		And the output checker is assigned to the request
	When the output checker marks the request as approved
	Then the output checker should see the status of the request updated to "Approved"
	And the status of "Review in progress" and the transition to "Work in progress" should be recorded in the information about the request
	
	Scenario: Request is needs revisions
	Given A request exists that is in "Review in Progress"
		And the output checker is assigned to the request
	When the output checker marks the request as needs revisions
	Then the output checker should see the status of the request updated to "Work in progress"
	And the status of "Review in progress" and the transition to "Work in progress" should be recorded in the information about the request