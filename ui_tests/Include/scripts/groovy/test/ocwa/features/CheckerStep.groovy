package test.ocwa.features

import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.util.KeywordUtil
import com.kms.katalon.core.model.FailureHandling

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
		WebUI.waitForElementPresent(linkToRequest, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(linkToRequest, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(linkToRequest, Constant.DEFAULT_TIMEOUT)

		WebUI.click(linkToRequest)
		WebUI.comment("found and clicked the request link")
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.comment("should be on the individual request page.")

		TestObject assignToMeButtonObject = Utils.getTestObjectById(Constant.Checker.ASSIGN_REQUEST_TO_ME_ID)

		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementPresent(assignToMeButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotHasAttribute(assignToMeButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(assignToMeButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(assignToMeButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.delay(Constant.ASSIGN_TO_ME_TIMEOUT)
		WebUI.click(assignToMeButtonObject)
		WebUI.comment("found and clicked the Assign to Me button")
		//test if an error alert displays when request is assigned.
		TestObject errorAlert = Utils.getTestObjectByText(Constant.Alerts.ERROR_TEXT, null)
		if (WebUI.waitForElementPresent(errorAlert, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)) {
			WebUI.takeScreenshot()
			KeywordUtil.markFailed('An error alert displayed upon assignment.')
		}
		WebUI.comment('No error message displayed so assignment looks good.')
	}

	@When("the output checker marks the request as approved")
	def checker_marks_request_as_approved() {
		TestObject approveButtonObject = Utils.getTestObjectById(Constant.Checker.APPROVE_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(approveButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(approveButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(approveButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.click(approveButtonObject)
		WebUI.comment("found and clicked the approve button")
	}

	@When("the output checker marks the request as needs revisions")
	def checker_marks_request_as_needs_revisions() {
		TestObject revisionsButtonObject = Utils.getTestObjectById(Constant.Checker.REVISIONS_NEEDED_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(revisionsButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(revisionsButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(revisionsButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.click(revisionsButtonObject)
		WebUI.comment("found and clicked the needs revisions button")
	}

	@When("the output checker marks the code request as approved")
	def output_checker_approves_code_request() {
		TestObject hasReviewedObject = Utils.getTestObjectByName(Constant.CodeRequests.HAVE_REVIEWED_CODE_CB_ID)
		WebUI.waitForElementClickable(hasReviewedObject, Constant.DEFAULT_TIMEOUT)
		WebUI.click(hasReviewedObject)
		checker_marks_request_as_approved()
		TestObject isApprovingObject = Utils.getTestObjectByText(Constant.CodeRequests.MERGE_REQUEST_APPROVING_TEXT, null)
		WebUI.waitForElementPresent(isApprovingObject,Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotPresent(isApprovingObject,Constant.DEFAULT_TIMEOUT)
	}

	@Then("the output checker should be able to see that they're now assigned the request")
	def checker_should_see_they_are_assigned_to_request(){
		TestObject assigneeTextObject = Utils.getTestObjectById(Constant.Checker.REQUEST_ASSIGNED_TO_ID)
		WebUI.waitForElementPresent(assigneeTextObject, Constant.DEFAULT_TIMEOUT)
		WebUI.verifyTextPresent(GlobalVariable.OCWA_USER_CHECKER1, false)
		WebUI.closeBrowser()
	}

	@Then("the output checker should see the status of the request updated to '(.+)'")
	def checker_should_see_request_is_in_given_status(String statusTxt) {
		TestObject statusObj = Utils.getTestObjectByIdPart(Constant.Status.CHECKER_UI_REQUEST_STATUS_ID_PART, 'div')
		WebUI.waitForElementPresent(statusObj, Constant.DEFAULT_TIMEOUT)
		WebUI.delay(Constant.STATUS_CHECK_WAIT)
		String actualStatusTxt = WebUI.getText(statusObj)
		if (!actualStatusTxt.equals(statusTxt)) {
			WebUI.takeScreenshot()
			WebUI.comment("Request status is in unexpected state.  Expected: $statusTxt  Actual: $actualStatusTxt")
			KeywordUtil.markFailed('Failing scenario because request is unexpected state.')
		}
		//WebUI.closeBrowser()
	}

	@Then("the approved files are available for download outside of the secure environment")
	def requester_should_see_files_available_for_download() {
		verify_approved_files_are_available_for_download(GlobalVariable.OCWA_DL_URL + Constant.Requester.DOWNLOAD_URL)
	}
	@Then("the approved files are available for download inside the secure environment")
	def requester_should_see_their_approved_import_files() {
		verify_approved_files_are_available_for_download(GlobalVariable.OCWA_URL + Constant.Requester.DOWNLOAD_URL)
	}


	/**
	 * Verifies that the approved files are available for download
	 * @param url String of download page (which is different for import vs exports)
	 */
	def verify_approved_files_are_available_for_download(String url) {
		WebUI.navigateToUrl(url)
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		TestObject newRequestButtonObject = Utils.getTestObjectByText(Constant.Requester.NEW_REQUEST_BTN_TXT)

		// use the Request button as a proxy for ensuring that the page has loaded
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotHasAttribute(newRequestButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(newRequestButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.delay(Constant.DOWNLOAD_INTERFACE_TIMEOUT)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)
		WebUI.closeBrowser()
	}
}
