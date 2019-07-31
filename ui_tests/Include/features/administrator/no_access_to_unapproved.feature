Feature: No access to requests outside the research environment unless the requests are approved
As an administrator of a research environment I need the ability to make sure project member do not have access to files and request that have not been approved.


Scenario Outline: Access to a requester's unapproved request outside the research environment is not allowed
	Given requester has logged in
	And requester has a request of status "<status>"
	When requester has logged into download interface
	Then the request should not be accessible
	
	Examples:
	| status 						|
	| awaiting review 	|
	| draft 						|
	| review in progress|
	| work in progress 	|
	| cancelled 				|