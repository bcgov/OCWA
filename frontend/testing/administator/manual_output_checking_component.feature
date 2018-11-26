Feature: Enable / Disable manual output checker component
As an administrator I need the ability to disable the manual output checker components so that stakeholders that do not have a manual output checking step in their export process can still utilize the application

	Scenario: Manual output checking component turned off and passes all policy tests
	Given the manual output checking component has been marked as disabled
		And the request passes all policy tests
	When a request is submitted
	Then the request status should be "Approved"
	
	Scenario: Manual output checking component turned off and fails a policy test
	Given the manual output checking component has been marked as disabled
		And the request fails at least one policy test
	When a request is submitted
	Then the request status should be "Work in progress"
	
	Scenario: Manual output checking component is turned on
	Given the manual output checking component has been marked as enabled
	When a request is submitted
	Then the request status should be "Awaiting review"