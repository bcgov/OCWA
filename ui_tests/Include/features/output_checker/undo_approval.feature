Feature: Undo request approval
As an output checker I need the ability to undo a request approval so that I can appropriately update requests to fix requests that were accidently approved or need to be made unavailable to an requester

Scenario: Undo an approved request
Given output checker has logged in
	And at least one approved request exists
When output checker submits an approved request to undo  
Then the output checker should see that the request is now has a status of "Work in progress"
And the status of "Accepted" and the transition to "Work in progress" should be recorded in the information about the request