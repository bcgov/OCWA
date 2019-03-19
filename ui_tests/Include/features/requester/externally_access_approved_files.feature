Feature: Access approved output files outside of the secure environment
  As an requester I want to be able to access approved output files outside of the secure environment so that I can share my results with others

  Background: 
    Given requester has logged in
    And requester has a request of status "awaiting review"
    Given output checker has logged in
    And output checker tries to claim an unclaimed request
    And the output checker marks the request as approved
    And the output checker should see the status of the request updated to 'Approved'

  Scenario: Access approved requests outside of the SRE
    When requester has logged into download interface
    Then the approved files are available for download outside of the secure environment
