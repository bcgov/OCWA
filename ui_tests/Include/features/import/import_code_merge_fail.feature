Feature: import code merge fail
As a requester I need the ability to know what issues are preventing me from importing my code 

Background:
Given requester has logged into the import interface

Scenario: Requester tries to import code which fails scanning
And requester has started fails scanning code import request
When the requester saves their request
And the merge request finishes
And requester submits their request
Then the requester should be informed that the merge request failed due to failed scan

Scenario: Requester tries to import code which fails merge request because cannot find repository
And requester has started missing repository code import request
When the requester saves their request
And the merge request finishes
Then the requester should be informed that the merge request failed due to project repo not found