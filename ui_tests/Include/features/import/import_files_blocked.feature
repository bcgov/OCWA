Feature: Import files blocking rules
As an importer I want to be able to see if files I upload are blocked so that I can be aware of problematic files

Scenario Outline: Importer imports a file that triggers blocking
 		Given requester has logged into the import interface
 		And requester has started import request
 		And request violates given blocking rule <blocking_rule>
 		When the requester saves their request
		And the requester views the import request
 		Then requester should be informed that given blocking rule <blocking_rule> has been violated
    And the request cannot be successfully submitted
    
    Examples:
 			| blocking_rule |
			| A request that has a file that is too big | 
			| The summation of all output file sizes exceeds the request file size limit |
 			| An output file has a blocked file extension |
 			| A request has a file with a StudyID in it                                  |