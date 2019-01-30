Feature: Import files into research environment
As an importer I want to be able to see if files I upload are blocked so that I can be aware of problematic files
Scenario Outline: Importer imports a file that triggers blocking
		Given importer has logged in 
		And importer uploads a file that triggers a blocking <blocking_rule>
		When importer submits their import request
		Then importer should see a blocking message <blocking_rule>
		And importer should not be able to access their imported file from within the research environment
		
		Examples:
			| blocking_rule |
			| A request that has a file that is too big | 
			| The summation of all output file sizes exceeds the request file size limit |
			| An output file has a blocked file extension |