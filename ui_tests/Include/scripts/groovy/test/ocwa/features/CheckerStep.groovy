package test.ocwa.features

import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

import cucumber.api.java.en.Then
import cucumber.api.java.en.When
import internal.GlobalVariable
import test.ocwa.common.Constant
import test.ocwa.common.Step
import test.ocwa.common.Utils

/**
 * OCWA Checker steps for Katalon
 * @author Jeremy Ho, Paul Ripley
 */
public class CheckerStep extends Step {
	@When("output checker tries to claim an unclaimed request")
	def checker_tries_to_claim_unclaimed_request() {
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.click(Utils.getTestObjectById(Constant.Checker.OC_DASHBOARD_FILTERS_ID))

		TestObject showAll = Utils.getTestObjectByText(Constant.Checker.OC_DASHBOARD_SHOW_ALL_REQUESTS, null)
		WebUI.waitForElementPresent(showAll, Constant.DEFAULT_TIMEOUT)
		WebUI.scrollToElement(showAll, Constant.DEFAULT_TIMEOUT)
		WebUI.click(showAll)

		TestObject linkToRequest = Utils.getTestObjectByText(G_REQUESTNAME)
		WebUI.waitForElementVisible(linkToRequest, 20)
		WebUI.waitForElementClickable(linkToRequest, 20)

		WebUI.click(linkToRequest)
		WebUI.comment("found and clicked the request link")
		WebUI.waitForPageLoad(20)
		WebUI.comment("should be on the individual request page.")

		TestObject assignToMeButtonObject = Utils.getTestObjectById(Constant.Checker.ASSIGN_REQUEST_TO_ME_ID)

		WebUI.waitForPageLoad(30)
		WebUI.waitForElementPresent(assignToMeButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotHasAttribute(assignToMeButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(assignToMeButtonObject, 20)
		WebUI.waitForElementClickable(assignToMeButtonObject, 30)
		WebUI.click(assignToMeButtonObject)
		WebUI.comment("found and clicked the Assign to Me button")

	}

	@When("the output checker marks the request as approved")
	def checker_marks_request_as_approved() {
		TestObject approveButtonObject = Utils.getTestObjectById(Constant.Checker.APPROVE_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(approveButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(approveButtonObject, 20)
		WebUI.waitForElementClickable(approveButtonObject, 30)
		WebUI.click(approveButtonObject)
		WebUI.comment("found and clicked the approve button")
	}

	@When("the output checker marks the request as needs revisions")
	def checker_marks_request_as_needs_revisions() {
		TestObject revisionsButtonObject = Utils.getTestObjectById(Constant.Checker.REVISIONS_NEEDED_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(revisionsButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(revisionsButtonObject, 20)
		WebUI.waitForElementClickable(revisionsButtonObject, 30)
		WebUI.click(revisionsButtonObject)
		WebUI.comment("found and clicked the needs revisions button")
	}

	@Then("the output checker should be able to see that they're now assigned the request")
	def checker_should_see_they_are_assigned_to_request(){
		TestObject assigneeTextObject = Utils.getTestObjectById(Constant.Checker.REQUEST_ASSIGNED_TO_ID)
		WebUI.waitForElementPresent(assigneeTextObject, Constant.DEFAULT_TIMEOUT)
		WebUI.verifyTextPresent(GlobalVariable.OCWA_USER_CHECKER1, false)
		WebUI.closeBrowser()
	}

	@Then("the approved files are available for download outside of the secure environment")
	def requester_should_see_files_available_for_download() {
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)
		WebUI.closeBrowser()
	}
}
