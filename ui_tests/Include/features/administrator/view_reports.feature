Feature: View reports of project report activity
As an operational manager of a research environment I need the ability to see a summary of requests and be able to drill into specific requests so that I can better understand how OCWA is being used

Scenario: View report of activity
	Given requester has logged in
	And requester has a request of status "Approved"
	When operations manager logs in
	And operational manager views the request in the reporting interface
	Then the approved request should have a milestones for each status change