Feature: Assign output checker to a request
As an output checker I need the ability to assign a request to one of my fellow output checkers so that I can let my fellow output checker that I am expecting them to be working on a particular request

Background:
Given output checker has logged in 

Scenario: Assign an unclaimed request
Given an unclaimed request exists
When output checker tries to assign an unclaimed request to another output checker 
Then the output checker should be able to see that the request has been assigned to the output checker they specified

Scenario: Assign a claimed request to another output checker
Given a claimed request exists
When output checker tries to assign an unclaimed request to another output checker 
Then the output checker should be able to see that the request has been assigned to the output checker they specified
 
