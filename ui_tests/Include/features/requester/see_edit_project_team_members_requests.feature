Feature: seeing / editing project team members requests
As an requester I need the ability to see / edit my team member's requests so that I can more easily collaborate with my fellow team members
	Background:
		Given a project team member has created a request
		And requester has logged in
	Scenario: View / edit a team member's request in a project that allows editing of team member's requests
		Given requester's project allows for editing of team member's requests
		When requester views their requests
		Then the team member's request should be visible and editable
	Scenario: View / edit a team member's request in a project that does not allow editing of team member's requests
		Given requester's project does not allow for editing of team member's requests
		When requester views their requests
		Then the team member's request should not be visible