Feature: import code
As a requester I need the ability to import code from the research environment so that I can re-use my code for projects inside of the research environment 

Scenario: Requester imports code
Given requester has logged into the import interface
And requester has started code import request
When the requester saves their request
And the merge request finishes
And requester submits their request
Then the request status is changed to "Approved" 