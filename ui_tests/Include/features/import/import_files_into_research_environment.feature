Feature: Import files into research environment
As an importer I want to be able to bring files into the research environment so that I can use the imported files to help with my research
	Scenario: Importer imports a valid file
		Given requester has logged into the import interface
		And requester has started import request
    And requester adds an input file that does not violate any blocking or warning rules
    When requester submits their request
		And requester has logged into the import download interface
 		Then the approved files are available for download inside the secure environment
					
					