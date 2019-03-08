Feature: edit a previously submitted request
  As an requester I want to be able to edit a request with a status of "Work in Progress" so that I can tweak my request to address my or an output checker's concerns about a request

  Background:
    Given requester has logged in
    And requester has a request of status "awaiting review"

  Scenario: Edit a request that has been reviewed by an output checker and needs revisions
    When the requester views the request
    And the requester withdraws the request
    Then requester should be able to re-submit the request
