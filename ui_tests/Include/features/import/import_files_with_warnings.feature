Feature: Import files warning rules
As an importer I want to be able to see warnings related to files that I bring into the research environment so that I can be aware of files that may be an issue
Scenario Outline: Importer imports a file that triggers warnings
		Given requester has logged into the import interface
		And requester has started import request
		And request violates given warning rule <warning_rule>
		When the requester saves their request
		And the requester views the import request
		Then requester should be informed that given warning rule <warning_rule> has been violated
    And the request can be successfully submitted
		
		Examples:
					| warning_rule |
					| A request that has a file that exceeds the file size warning threshold | 
					| The summation of all output file sizes exceeds the request file size warning threshold |
					| An output file has a warning file extension |
