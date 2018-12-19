Feature: team sharing of requests
As an administrator I need the ability to enable / disable the ability for requesters to view / edit their team member's request on a per project basis so that multiple types of project sharing models can be accommodated

	Scenario outline: Team sharing enabled
	Given team sharing has been marked as enabled
	And requester A is logged in
	And requester B on the same project exists
	And requester B has a <status> request
	When requester A views team's requests 
	Then requester B's request status should be visible
	Example:
	| status |
	| Draft | 
	| Awaiting review |
	| Review in progress |
	| Approved |
	| Work in progress |
	| Archived |
	Scenario: Team sharing disabled
	Given team sharing has been marked as disabled
	When a request is submitted
	Then the request status should be "Awaiting review"