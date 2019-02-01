Feature: Import files into research environment
As an importer I want to be able to bring files into the research environment so that I can use the imported files to help with my research
	Scenario: Importer imports a valid file
		Given importer has logged in 
		And importer uploads a file that does not trigger any warnings or blocking
		When importer submits their import request
		Then importer should see that their request has been succesfully imported
		And importer should be able to access their imported file from within the research environment
					
					