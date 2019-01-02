Feature: edit a previously submitted request
As an requester I want to be able to edit a request with a status of "Work in Progress" so that I can tweak my request to address my or an output checker's concerns about a request 
	Scenario: Edit a request that has been reviewed by an output checker and needs revisions
		Given requester has logged in
		And requester has a request of status "Work in progress"
		When the requester views the request
		Then requester should be able to make changes to the request
		And requester should be able to re-submit the request