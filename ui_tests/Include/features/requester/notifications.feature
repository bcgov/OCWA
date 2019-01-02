Feature: Notifications
As an requester / output checker I want to be notified when events related to my requests occur so that I know I need to take action

	Scenario Outline: requester notifications
		Given requester has submitted a request
		When <event> occurs
		Then the requester should receive an email notifying them of the <event>
		But the email should not contain specifics of the request
		Examples:
			| event |
			| output checker makes a comment on the request |
			| output checker approves the request |
			| output checker requests revisions the request |
			
	Scenario Outline: output checker notifications
		Given an output checker has currently claimed a request
		When <event> occurs
		Then the output checker should receive an email notifying them of the <event>
		But the email should not contain specifics of the request
		Examples:
			| event |
			| requester makes a comment on the request |
			| requester re-submits a request |