Feature: create a new request
	As an requester I want to be able to submit my output (and associated metadata) for review so that I can start the process of getting my outputs out of the secure environment
	Background:
		Given requester has logged in
		And requester has started a request
		And the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge
	Scenario: A valid request
		Given the output files do not violate any blocking rules
		When requester submits their request 
		Then the request status is changed to "Awaiting review"
	Scenario: A request has no data
		Then the requester should not be able to submit the request
		
	Scenario Outline: A request violates blocking rule
		Given request violates given blocking rule <blocking_rule> 
		When requester submits their request 
		Then the requester should not be able to submit the request
		And requester should be informed that given blocking rule <blocking_rule> has been violated
		
		Examples:
			| blocking_rule |
			| A request that has a file that is too big | 
			| The summation of all export file sizes exceeds the request file size limit |
			| An export file has a blocked file extension |
			| A request has a file with a StudyID in it |
			
	Scenario Outline: A request violates warning rule
		Given request violates given warning rule <warning_rule> 
		When requester submits their request 
		Then the requester should be able to submit the request
		And requester should be informed that given warning rule <warning_rule> has been violated
			
		Examples:
			| warning_rule |
			| A request that has a file that exceeds the file size warning threshold | 
			| The summation of all export file sizes exceeds the request file size warning threshold |
			| An export file has a warning file extension |