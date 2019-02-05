Feature: see blocked file uploads
	As an requester I want to be able to see blocked file uploads so that I can adjust my uploads to be compliant with what can be taken out of the secure environment
	Background:
		Given requester has logged in
		And requester has started a request
		And the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge		
	Scenario Outline: A request violates blocking rule
		Given request violates given blocking rule <blocking_rule> 
		When requester submits their request 
		Then the requester should not be able to submit the request
		And requester should be informed that given blocking rule <blocking_rule> has been violated
		
		Examples:
			| blocking_rule |
			| A request that has a file that is too big | 
			| The summation of all output file sizes exceeds the request file size limit |
			| An output file has a blocked file extension |
			| A request has a file with a StudyID in it |
			