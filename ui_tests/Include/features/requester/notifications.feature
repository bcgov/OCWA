# Notifications have two parts the notices under the "bell" icon and emails.  It's hard to automate testing whether people receive emails so the focus will be on "bell" notices
Feature: Notifications
  As an requester / output checker I want to be notified when events related to my requests occur so that I know I need to take action

  Scenario Outline: requester notifications
    Given requester has a request of status "awaiting review"
    When <event> occurs
    Then the requester see a notification notifying them of the <event>

    Examples:
      | event                                         |
      | output checker makes a comment on the request |
      | output checker approves the request           |
      | output checker requests revisions the request |

  Scenario Outline: output checker notifications
    Given an output checker has currently claimed a request
    When <event> occurs
    Then the output checker should see a notification notifying them of the <event>

    Examples:
      | event                                    |
      | requester makes a comment on the request |
      | requester re-submits a request           |
