Feature: Project specific auto approval of requests 
  As an project principal investigator I want to be have my output file auto approved so that I can share my results with others outside the environment faster

   Background:
    Given requester in auto approve project has logged in
    And requester has started a request
    And the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge
    And requester adds an output file that does not violate any blocking or warning rules
    When requester submits their request
    Then the request status is changed to "Approved"
