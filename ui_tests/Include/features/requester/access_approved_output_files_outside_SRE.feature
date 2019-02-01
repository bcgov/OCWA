Feature: Access approved output files outside of the secure environment
As an requester I want to be able to access approved output files outside of the secure environment so that I can share my results with others
	Scenario: Access approved request outside of the SRE
		Given requester has a request of status "Approved"
		And requester has logged in (outside of SRE)
		When requester views their request's approved files
		Then requester can copy their approved files to their local computer