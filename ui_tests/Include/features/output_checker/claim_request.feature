Feature: Claim a request
As an output checker I need the ability to claim a request so that I can let my fellow output checker know that I'm going to be working on a particular request

Scenario: Claim an unclaimed request
Given output checker has logged in 
When output checker tries to claim an unclaimed request 
Then the output checker should be able to see that they're now assigned the request

Scenario: Claim a request already claimed by another output checker
Given output checker has logged in
	And at least on other output checker exists
	And the other output checker is assigned to a request
When output checker tries to claim the already assigned request 
Then the output checker should be able to see that they're now assigned the request