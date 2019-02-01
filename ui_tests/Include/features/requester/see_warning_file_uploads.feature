Feature: see blocked file uploads
	As an requester I want to be able to see file uploads with warnings so that I can adjust my uploads to be compliant with what can be taken out of the secure environment
	Background:
		Given requester has logged in
		And requester has started a request
		And the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge		
	Scenario Outline: A request violates warning rule
		Given request violates given warning rule <warning_rule> 
		When requester submits their request 
		Then the requester should be able to submit the request
		And requester should be informed that given warning rule <warning_rule> has been violated
			
		Examples:
			| warning_rule |
			| A request that has a file that exceeds the file size warning threshold | 
			| The summation of all output file sizes exceeds the request file size warning threshold |
			| An output file has a warning file extension |
			