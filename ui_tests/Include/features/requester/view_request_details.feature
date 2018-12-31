Feature: View request details
As an requester I want to be able to see the contents of request I've made so that I have a record of my submissions 
	Scenario: View details of a request
		Given requester has logged in
		And the requester has submitted a request
		When the requester views the request
		Then the requester should see the complete record of the request including export files, supporting files/text, discussion, and status changes