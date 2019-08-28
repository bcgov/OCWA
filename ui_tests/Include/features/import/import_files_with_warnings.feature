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
    And the request status is changed to "Approved"
		
		Examples:
					| warning_rule |
					| an import request that has a input file that exceeds the file size warning threshold | 
					| an import request input file has a warning file extension |
