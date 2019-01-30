Feature: Import files into research environment
As an importer I want to be able to see warnings related to files that I bring into the research environment so that I can be aware of files that may be an issue
Scenario Outline: Importer imports a file that triggers warnings
		Given importer has logged in 
		And importer uploads a file that triggers a warning <warning_rule>
		When importer submits their import request
		Then importer should see a warning message <warning_rule>
		And importer should be able to access their imported file from within the research environment
		
		Examples:
					| warning_rule |
					| A request that has a file that exceeds the file size warning threshold | 
					| The summation of all output file sizes exceeds the request file size warning threshold |
					| An output file has a warning file extension |