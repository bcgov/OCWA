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


public class CheckerStep extends Step {
	@When("output checker tries to claim an unclaimed request")
	def checker_tries_to_claim_unclaimed_request() {
		WebUI.waitForPageLoad(30)
		// TODO: Un-hard code this string mess
		WebUI.click(Utils.get_test_object_by_id("oc-dashboard-filters-select"))

		String desiredString = "Show All Requests"
		TestObject desiredOption = new TestObject(desiredString)
		desiredOption.addProperty("text", ConditionType.EQUALS, desiredString, true)
		WebUI.waitForElementPresent(desiredOption, 10)
		WebUI.scrollToElement(desiredOption, 10)
		WebUI.click(desiredOption)

		TestObject linkToRequest = Utils.get_test_object_by_text(G_REQUESTNAME)
		WebUI.waitForElementVisible(linkToRequest, 20)
		WebUI.waitForElementClickable(linkToRequest, 20)

		WebUI.click(linkToRequest)
		WebUI.comment("found and clicked the request link")
		WebUI.waitForPageLoad(20)
		WebUI.comment("should be on the individual request page.")

		TestObject assignToMeButtonObject = Utils.get_test_object_by_id(Constant.Checker.ASSIGN_REQUEST_TO_ME_ID)

		WebUI.waitForPageLoad(30)
		WebUI.waitForElementPresent(assignToMeButtonObject, 10)
		WebUI.waitForElementNotHasAttribute(assignToMeButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(assignToMeButtonObject, 20)
		WebUI.waitForElementClickable(assignToMeButtonObject, 30)
		WebUI.click(assignToMeButtonObject)
		WebUI.comment("found and clicked the Assign to Me button")

	}

	@When("the output checker marks the request as approved")
	def checker_marks_request_as_approved() {
		TestObject approveButtonObject = Utils.get_test_object_by_id(Constant.Checker.APPROVE_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(approveButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(approveButtonObject, 20)
		WebUI.waitForElementClickable(approveButtonObject, 30)
		WebUI.click(approveButtonObject)
		WebUI.comment("found and clicked the approve button")
	}

	@When("the output checker marks the request as needs revisions")
	def checker_marks_request_as_needs_revisions() {
		TestObject revisionsButtonObject = Utils.get_test_object_by_id(Constant.Checker.REVISIONS_NEEDED_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(revisionsButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(revisionsButtonObject, 20)
		WebUI.waitForElementClickable(revisionsButtonObject, 30)
		WebUI.click(revisionsButtonObject)
		WebUI.comment("found and clicked the needs revisions button")
	}

	@Then("the output checker should be able to see that they're now assigned the request")
	def checker_should_see_they_are_assigned_to_request(){
		TestObject assigneeTextObject = Utils.get_test_object_by_id(Constant.Checker.REQUEST_ASSIGNED_TO_ID)
		WebUI.waitForElementPresent(assigneeTextObject, 10)
		WebUI.verifyTextPresent(GlobalVariable.OCWA_USER_CHECKER1, false)
		WebUI.closeBrowser()
	}

	@Then("the approved files are available for download outside of the secure environment")
	def requester_should_see_files_available_for_download() {
		WebUI.waitForPageLoad(10)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)
		WebUI.closeBrowser()
	}
}
