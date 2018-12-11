Feature: seeing / editing project team members requests
As an requester I need the ability to see / edit my team member's requests so that I can more easily collaborate with my fellow team members
	Background:
		Given requester has logged in
		And the requester is a member of a project team
		And another project team member has created a request
		And the project has team sharing enabled
	Scenario: View / edit a team member's request in a project that allows editing of team member's requests
		Given the requester's project allows for editing of team member's requests
		When the requester views their requests
		Then the team member's request should be visible and editable
	Scenario: View / edit a team member's request in a project that does not allow editing of team member's requests
		Given the requester's project does not allow for editing of team member's requests
		When the requester views their requests
		Then the team member's request should not be visible or editable