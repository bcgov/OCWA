Feature: export code merge fail
As a requester I need the ability to know what issues are preventing me from exporting my code 

Scenario: Requester tries to export code which fails scanning
Given requester has logged in
And requester has started destined to fail code export request
When the requester saves their request
And the merge request finishes
Then the requester should be informed that the merge request failed