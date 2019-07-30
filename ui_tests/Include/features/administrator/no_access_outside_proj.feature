Feature: No access allowed to requests outside of a project
As an administrator of a research environment I need the ability to make sure requests in one project are not accessible by requesters in other projects

Background:
	Given requester has logged in

Scenario Outline: Access to requests without being logged into OCWA is not allowed
	Given requester has a request of status "<status>"
	When the requester logs out
	And the requester tries to navigate to the request directly
	Then the request should not be accessible

	Examples:
	| status 					|
	| awaiting review 	|
	| draft 						|
	| review in progress|
	| work in progress 	|
	| cancelled 				|
	| approved 					|