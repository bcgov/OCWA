Feature: import code merge fail
As a requester I need the ability to know what issues are preventing me from importing my code 

Scenario: Requester tries to import code which fails scanning
Given requester has logged into the import interface
And requester has started destined to fail code import request
When the requester saves their request
And the merge request finishes
And requester submits their request
Then the requester should be informed that the merge request failed