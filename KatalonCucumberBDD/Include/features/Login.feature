#Author: your.email@your.domain.com
#Keywords Summary :
#Feature: List of scenarios.
#Scenario: Business rule through list of steps with arguments.
#Given: Some precondition step
#When: Some key actions
#Then: To observe outcomes or validation
#And,But: To enumerate more Given,When,Then steps
#Scenario Outline: List of steps for data-driven as an Examples and <placeholder>
#Examples: Container for s table
#Background: List of steps run before each of the scenarios
#""" (Doc Strings)
#| (Data Tables)
#@ (Tags/Labels):To group Scenarios
#<> (placeholder)
#""
## (Comments)
#Sample Feature Definition Template


@loginFeature
Feature: Login
  Test the login functionality of the application

  @smoke
  Scenario: Test the login functionality of EA application
  	Given I navigate to the login page
    And I enter the following for Login
      | username | password      |
      | admin    | adminpassword |
  	And I click the login button
  	Then I should see the home page