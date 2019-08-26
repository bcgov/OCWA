Feature: export code merge fail
As a requester I need the ability to know what issues are preventing me from exporting my code 

Background:
Given requester has logged in

Scenario: Requester tries to export code which fails merge request because cannot find repository
And requester has started missing repository code export request
When the requester saves their request
And the merge request finishes
Then the requester should be informed that the merge request failed due to project repo not found

Scenario: Requester tries to export code which fails scanning
And requester has started fails scanning code export request
When the requester saves their request
And the merge request finishes
And requester submits their request
And output checker has logged in
And output checker tries to claim an unclaimed request
And the output checker marks the code request as approved
Then the output checker should see the status of the request updated to 'In Review'