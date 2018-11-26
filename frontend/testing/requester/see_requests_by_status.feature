Feature: See requester's requests by status
As an requester I want to be able to see a history of my requests so that I can have a record of what I submitted for review
	Scenario Outline: View <status> requests
		Given requester has logged in 
		And the requester has an <status> request
		And request was last updated within the last month
		When requester views <filter> requests
		Then <status> requests should be displayed
		But requests with updates older than a month should not be displayed
		
		Examples:
			| status | filter |
			| Approved | Approved |
			| Revisions required | Draft |
			| Awaiting review | Submitted |
			| Review in progress | Submitted |
			| Draft | Draft |
			| Work in progress | Draft |