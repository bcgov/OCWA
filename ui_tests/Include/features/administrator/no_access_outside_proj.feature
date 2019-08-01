Feature: No access allowed to requests if not logged in
As an administrator of a research environment I need the ability to make sure requests in one project are not accessible by requesters in other projects

Background:
	Given requester has logged in

Scenario Outline: Access to requests without being logged into OCWA is not allowed
	Given requester has a request of status "<status>"
	When the requester logs out
	And the requester tries to navigate to the request directly
	Then the request should not be accessible

	Examples:
	| status 						|
	| awaiting review 	|
	| draft 						|
	| review in progress|
	| work in progress 	|
	| cancelled 				|
	| approved 					|
	
Scenario Outline: Access to a request by a requester in a different project is not allowed
	Given requester has a request of status "<status>"
	When the requester logs out
	When requester in another project has logged in
	And a requester in another project tries to navigate to the request directly
	Then the request should not be accessible

	Examples:
	| status 						|
	| awaiting review 	|
	| draft 						|
	| review in progress|
	| work in progress 	|
	| cancelled 				|
	| approved 					|