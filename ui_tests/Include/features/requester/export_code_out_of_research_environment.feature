Feature: export code
As a requester I need the ability to export code from the research environment so that I can re-use my code for outside of the research environment 

Scenario: Requester exports code
Given requester has logged in
And requester has started code export request
When the requester saves their request
And the merge request finishes
And requester submits their request
And output checker has logged in
And output checker tries to claim an unclaimed request
And the output checker marks the code request as approved
Then the output checker should see the status of the request updated to 'Approved'