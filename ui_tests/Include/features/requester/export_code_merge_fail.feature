Feature: export code
As a requester I need the ability to export code from the research environment so that I can re-use my code for outside of the research environment 

Scenario: Requester exports code
Given requester has logged in
And requester has started code export request
When the requester saves their request
And the merge request finishes
Then the requester should be informed that the merge request failed