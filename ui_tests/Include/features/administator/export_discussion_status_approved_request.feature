Feature: export discussion and status log of a request
As an administrator I need the ability to export a discussion / status log to a pdf file upon request approval so that I have a file-based log of the conversation independent of the database

	Scenario: generate an export log of a newly approved request
	Given a request has a status of "Review in Progress"
	When an output checker approves the request
	Then a pdf file should be generates that chronologically lists the discussion about the request as well as status changes