#This feature is contingent on a project being configured to allow team sharing
Feature: seeing / editing project team members requests
As an requester I need the ability to see / edit my team member's requests so that I can more easily collaborate with my fellow team members
	Scenario: View / edit a team member's request in a project that allows editing of team member's requests
		Given a project team member has created a request
		And requester has logged in
		And requester's project allows for editing of team member's requests
		When requester views their requests
		Then the team member's request should be visible and editable