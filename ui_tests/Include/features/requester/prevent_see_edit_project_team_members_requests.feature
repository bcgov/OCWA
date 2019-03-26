#This feature is contingent on a project being configured to disallow team sharing
Feature: prevent seeing / editing project team members requests
  As an requester I need the ability to have my requests hidden from my other team members so that keep my files private until I am ready to share

  Scenario: View / edit a team member's request in a project that does not allow editing of team member's requests
    Given team member has logged in
    And a project team member has created a request
    Given requester has logged in
    And requester's project does not allow for editing of team member's requests
    When requester views their requests
    Then the team member's request should not be visible
