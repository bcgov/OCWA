Feature: See a list of all output checking requests
As an output checker I need the ability to see all requests so that I can quickly see what is in the queue

Scenario Outline: View <filter> requests
	Given output checker has logged in 
	When output checker selects a filter
	Then the output checker should only see requests of type <filter_condition>
	Examples:
		| filter | filter_condition |
		| My requests | requests claimed by the output checker |
		| Unassigned | requests not claimed by an output checker |
		| All | all requests |