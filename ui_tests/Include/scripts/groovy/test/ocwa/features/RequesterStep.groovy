package test.ocwa.features

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import org.openqa.selenium.Keys as Keys

import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI

import cucumber.api.java.en.Given
import cucumber.api.java.en.Then
import cucumber.api.java.en.When
import internal.GlobalVariable
import test.ocwa.common.Constant
import test.ocwa.common.Step
import test.ocwa.common.Utils

/**
 * OCWA Requester steps for Katalon
 * @author Jeremy Ho, Paul Ripley
 */
public class RequesterStep extends Step {
	@Then("the output checker should see the status of the request updated to '(.+)'")
	def checker_should_see_request_is_in_given_status(String status) {
		//TODO: placeholder until status is displayed on individual requests in the oc interface
		WebUI.closeBrowser()
	}

	@Given("requester has started a request")
	def requester_starts_new_request() {
		G_REQUESTNAME = Utils.generateRequestNameDate()

		TestObject newRequestButtonObject = Utils.getTestObjectById(Constant.Requester.NEW_REQUEST_BTN_ID)
		WebUI.waitForPageLoad(10)
		WebUI.waitForElementNotHasAttribute(newRequestButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(newRequestButtonObject, 10)
		WebUI.waitForElementClickable(newRequestButtonObject, 10)
		WebUI.click(newRequestButtonObject)

		WebUI.setText(Utils.getTestObjectById(Constant.Requester.REQUEST_NAME_TXT_ID), G_REQUESTNAME)
		WebUI.setText(Utils.getTestObjectById(Constant.Requester.REQUEST_PURPOSE_TXT_ID), Constant.Requester.PURPOSE_TEXT)
	}

	@Given("has not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	/**
	 * Uploads each file specified in the files array
	 * @param files String array of filenames to be used for uploading
	 * @param isUploadScreenAlreadyOpen Optional Boolean regarding the state of upload screen. Defaults to false if not specified.
	 */
	def requester_uploads_files(String[] files, boolean isUploadScreenAlreadyOpen = false) {
		if (!isUploadScreenAlreadyOpen) {
			TestObject requestFormSaveFilesButton = Utils.getTestObjectById(Constant.Requester.REQUEST_SAVE_FILES_BTN_ID)
			WebUI.waitForElementClickable(requestFormSaveFilesButton, 10)
			WebUI.click(requestFormSaveFilesButton)
		}

		// Upload files
		TestObject uploadFileButton = Utils.getTestObjectById(Constant.Requester.REQUEST_FILES_UPLOAD_BTN_ID)
		files.each { file ->
			WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", 10)
			WebUI.waitForElementClickable(uploadFileButton, 10)
			WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$file")

			TestObject successAlert = Utils.getTestObjectByText(Constant.Alerts.SUCCESS_UPDATED_TEXT, null)
			WebUI.waitForElementPresent(successAlert, 10)
			WebUI.waitForElementNotPresent(successAlert, 10)
		}
	}

	@Given("requester adds (.+) output file that does not violate any blocking or warning rules")
	def requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules(String numOutputFilesToUpload) {
		String[] files = [GlobalVariable.ValidFileName]
		if(numOutputFilesToUpload == "2") files << GlobalVariable.ValidFileName2

		requester_uploads_files(files)
	}

	@Given("requester adds (.+) supporting files")
	def requester_adds_supporting_files(String numSupportingFilesToUpload) {
		String[] files = [GlobalVariable.SupportingFileName]
		if (numSupportingFilesToUpload == "2") files << GlobalVariable.SupportingFileName2

		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_UPLOAD_TAB_SUPPORT_ID))
		requester_uploads_files(files, true)
	}

	@Given("request violates given warning rule (.+)")
	def request_violates_warning_rule(String warningRule) {
		switch (warningRule.toLowerCase()) {
			case "an output file has a warning file extension":
				requester_uploads_files([GlobalVariable.WarningExtensionFileName] as String[])
				break
			case "a request that has a file that exceeds the file size warning threshold":
				requester_uploads_files([GlobalVariable.WarningMaxSizeLimitFileName] as String[])
				break
			case "the summation of all output file sizes exceeds the request file size warning threshold":
			// need to add output files that pass the warning limit individually but together surpass the combined size threshold
				requester_uploads_files([
					GlobalVariable.ValidFileName,
					GlobalVariable.ValidFileName2,
					GlobalVariable.ValidFileName3
				] as String[])
				break
			default:
				throw new Exception("warning rule $warningRule not found")
				break
		}
	}
	@Given("request violates given blocking rule (.+)")
	def request_violates_blocking_rule(String blockingRule) {
		switch (blockingRule.toLowerCase()) {
			case "an output file has a blocked file extension":
				requester_uploads_files([GlobalVariable.BlockedExtensionFileName] as String[])
				break
			case "a request that has a file that is too big":
				requester_uploads_files([GlobalVariable.BlockedMaxSizeLimitFileName] as String[])
				break
			case "the summation of all output file sizes exceeds the request file size limit":
			//need to add output files that pass the blocked limit individually but together surpass the combined size threshold
				requester_uploads_files([
					GlobalVariable.ValidFileName,
					GlobalVariable.ValidFileName2,
					GlobalVariable.WarningMaxSizeLimitFileName
				] as String[])
				break
			case "a request has a file with a studyid in it":
				requester_uploads_files([GlobalVariable.BlockedStudyIDFileName] as String[])
				break
			default:
				throw new Exception("block rule $blockingRule not found")
				break
		}
	}

	@Given("the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge")
	def requester_affirms_output_is_safe() {
		//stubbed in case we need to check a box in the UI to support this
	}

	@Given("request was last updated within the last month")
	def request_updated_within_last_month() {
		//stubbed because newly created requests will always have an update date within the last month
	}

	@Given("the request has been claimed by an output checker")
	def request_has_been_claimed_by_a_oc() {
		//request_is_review_in_progress()
		requester_has_a_request_of_status("Review in progress")
	}

	// TODO: Refactor this into a new "StateStep" class or similar
	// This new class would extend Step and instantiate CheckerStep and RequesterStep on constructor
	@Given('requester has a request of status "(.+)"')
	def requester_has_a_request_of_status(String status) {
		requester_starts_new_request()
		requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules("1")

		switch (status.toLowerCase()) {
			case "draft":
				requester_saves_new_request()
				break
			case "awaiting review":
				requester_submits_request()
				break
			case "review in progress":
				requester_submits_request()
				//output checker needs to claim
				break
			case "work in progress":
				requester_submits_request()
				//output checker needs to claim
				//output checker needs to request revisions OR requester has submitted and withdrawn
				break
			case "cancelled":
				requester_submits_request()
				requester_cancels_request()
				break
			case "approved":
				requester_submits_request()
				//output checker needs to claim
				//output checker needs to approve
				break
			default:
				throw new Exception("status $status not found")
				break
		}
	}

	@Given("a project team member has created a request")
	def project_team_member_has_created_request() {
		requester_has_a_request_of_status(Constant.Status.DRAFT)
		WebUI.closeBrowser()
	}

	@Given("requester's project allows for editing of team member's requests")
	def project_allows_for_team_sharing() {
	}

	@Given("requester's project does not allow for editing of team member's requests")
	def project_does_not_allow_for_team_sharing() {
	}

	@When("the requester saves their request")
	def requester_saves_new_request() {
		TestObject successAlert = Utils.getTestObjectByText(Constant.Alerts.SUCCESS_UPDATED_TEXT, null)
		WebUI.waitForElementPresent(successAlert, 10)
		WebUI.waitForElementNotPresent(successAlert, 10)

		TestObject saveCloseBtn = findTestObject('Object Repository/OCWA/button_save_close_request')
		WebUI.waitForElementNotHasAttribute(saveCloseBtn, "disabled", 10)
		WebUI.waitForElementVisible(saveCloseBtn, 10)
		WebUI.waitForElementClickable(saveCloseBtn, 10)
		WebUI.click(saveCloseBtn)
		WebUI.waitForElementNotPresent(saveCloseBtn, 10) //wait for the modal window to close
	}

	@When("requester submits their request")
	def requester_submits_request() {
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/OCWA/button_save_request'), "disabled", 10)
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/OCWA/span_Submit for Review'), "disabled", 10)
		WebUI.waitForElementClickable(findTestObject('Object Repository/OCWA/span_Submit for Review'), 10)

		WebUI.delay(3) // Stopgap related to https://github.com/bcgov/OCWA/issues/89
		WebUI.click(findTestObject('Object Repository/OCWA/span_Submit for Review'))
		if(!WebUI.waitForElementNotPresent(findTestObject('Object Repository/OCWA/button_save_request'), 10)) {
			throw new com.kms.katalon.core.exception.StepFailedException("Submission failed - modal window still present")
		}
	}

	@When("requester writes and submits a new comment")
	def requester_creates_a_new_comment() {
		requester_views_request_they_created()

		TestObject discussionTab = Utils.getTestObjectById(Constant.Requester.REQUEST_DISCUSSION_TAB_ID)
		WebUI.waitForElementPresent(discussionTab, 10)
		WebUI.click(discussionTab)

		TestObject discussionForm = Utils.getTestObjectById(Constant.Requester.REQUEST_DISCUSSION_FORM_ID)
		WebUI.waitForElementPresent(discussionForm, 10)
		WebUI.click(discussionForm)

		TestObject contentEditable = findTestObject('Object Repository/OCWA/div_discussion_form_contenteditable')
		WebUI.waitForElementPresent(contentEditable, 10)
		WebUI.sendKeys(contentEditable, Constant.Requester.TEST_COMMENT)

		TestObject saveCommentButton = findTestObject('Object Repository/OCWA/span_save_comment')
		WebUI.waitForElementClickable(saveCommentButton, 10)
		WebUI.click(saveCommentButton)
	}

	@When("the requester views the request")
	def requester_views_request_they_created() {
		if (WebUI.getUrl() != GlobalVariable.OCWA_URL) {
			WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		}
		WebUI.waitForPageLoad(10)
		TestObject searchBox = Utils.getTestObjectById(Constant.Requester.SEARCH_BOX_ID)
		WebUI.waitForElementClickable(searchBox, 10)
		WebUI.setText(searchBox, G_REQUESTNAME)
		WebUI.sendKeys(searchBox, Keys.chord(Keys.ENTER))

		WebUI.waitForElementNotPresent(Utils.getTestObjectByText(Constant.Alerts.LOADING_TEXT, 'span'), 10)
		TestObject linkToRequest = Utils.getTestObjectByText(G_REQUESTNAME)
		WebUI.waitForElementNotHasAttribute(linkToRequest, "disabled", 10)
		WebUI.waitForElementClickable(linkToRequest, 10)

		WebUI.click(linkToRequest)
		WebUI.waitForPageLoad(10)
	}

	@When("the requester cancels the request")
	def requester_cancels_request() {
		requester_views_request_they_created()
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_CANCEL_BTN_ID))
	}

	@When("the requester withdraws the request")
	def requester_withdraws_request() {
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForElementClickable(Utils.getTestObjectById(Constant.Requester.REQUEST_WITHDRAW_BTN_ID), 10)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_WITHDRAW_BTN_ID))
		WebUI.acceptAlert()

		// Click Add Files button
		TestObject requestFormSaveFilesButton = Utils.getTestObjectById(Constant.Requester.REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 10)
		WebUI.click(requestFormSaveFilesButton)
	}

	@When("requester views (.+) requests")
	def requester_views_requests_of_given_status(String status) {
		WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		switch (status.toLowerCase()) {
			case "draft":
				WebUI.click(Utils.getTestObjectByText(Constant.Status.DRAFT, 'span'))
				break
			case "submitted":
				WebUI.click(Utils.getTestObjectByText(Constant.Status.SUBMITTED, 'span'))
				break
			case "approved":
				WebUI.click(Utils.getTestObjectByText(Constant.Status.APPROVED, 'span'))
				break
			case "cancelled":
				WebUI.click(Utils.getTestObjectByText(Constant.Status.CANCELLED, 'span'))
				break
			case "their": //essentially viewing all their requests
				break
			default:
				throw new Exception("status $status not found")
				break
		}
	}

	@Then("the requester should see their saved request including (.+) output file (.+) supporting file")
	def confirm_draft_save_was_successful(String numOutputFiles, String numSupportingFiles) {
		requester_views_request_they_created()

		// We need to stall here to give time for the inline ajax to finish
		WebUI.waitForElementNotPresent(Utils.getTestObjectByText('', 'circle'), 10)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)

		if ((numOutputFiles as Integer) > 0) WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		if ((numOutputFiles as Integer) > 1) WebUI.verifyTextPresent(GlobalVariable.ValidFileName2, false)

		if ((numSupportingFiles as Integer) > 0) WebUI.verifyTextPresent(GlobalVariable.SupportingFileName, false)
		if ((numSupportingFiles as Integer) > 1) WebUI.verifyTextPresent(GlobalVariable.SupportingFileName2, false)
	}

	@Then("the requester should not be able to submit the request")
	def requester_is_not_able_to_submit_request() {
		TestObject requestFormSaveFilesButton = Utils.getTestObjectById(Constant.Requester.REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 30)
		WebUI.click(requestFormSaveFilesButton)

		WebUI.verifyElementNotHasAttribute(findTestObject('Object Repository/OCWA/span_Submit for Review'), "disabled", 10)
		WebUI.closeBrowser()
	}

	@Then("the requester should be able to submit the request")
	def requester_is_able_to_submit_request() {
		WebUI.verifyElementHasAttribute(findTestObject('Object Repository/OCWA/span_Submit for Review'),"disabled", 10)
		WebUI.closeBrowser()
	}

	@Then("the requester should see the complete record of the request including export files, supporting content, discussion, and status changes")
	def submitted_request_info_matches_what_was_submitted() {
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForPageLoad(10)
		WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)
		WebUI.verifyTextPresent(Constant.Requester.PURPOSE_TEXT, false)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_DISCUSSION_TAB_ID))
		requester_should_see_their_new_comment_displayed()
		WebUI.closeBrowser()
	}

	@Then('the request status is changed to "(.+)"')
	def request_should_be_in_given_status(String statusTxt) {
		requester_views_request_they_created()
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForPageLoad(10)
		WebUI.verifyTextPresent(statusTxt, false)
		WebUI.closeBrowser()
	}

	@Then('requests of status "(.+)" should be displayed')
	def requests_of_given_status_should_be_displayed(String status) {
		WebUI.verifyTextPresent(G_REQUESTNAME, false)
		WebUI.closeBrowser()
	}

	@Then("requests with updates older than a month should not be displayed")
	def no_old_requests_should_be_displayed() {

	}

	@Then("requester should see their new comment displayed")
	def requester_should_see_their_new_comment_displayed() {
		WebUI.verifyTextPresent(Constant.Requester.TEST_COMMENT, false)
	}

	@Then("requester should be able to make changes to the request")
	def requester_should_be_able_to_make_changes_to_the_request() {
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_EDIT_BTN_ID))
		WebUI.setText(Utils.getTestObjectById(Constant.Requester.REQUEST_PURPOSE_TXT_ID), Constant.Requester.EDITED_PURPOSE_TEXT)

		// Click Add Files button
		TestObject requestFormSaveFilesButton = Utils.getTestObjectById(Constant.Requester.REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 10)
		WebUI.click(requestFormSaveFilesButton)
		WebUI.closeBrowser()
	}

	@Then("requester should be able to re-submit the request")
	def requester_should_be_able_to_resubmit_request() {
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/OCWA/span_Submit for Review'), "disabled", 10)
		WebUI.waitForElementClickable(findTestObject('Object Repository/OCWA/span_Submit for Review'), 30)
		WebUI.click(findTestObject('Object Repository/OCWA/span_Submit for Review'))
		request_should_be_in_given_status(Constant.Status.AWAITING_REVIEW)
		WebUI.closeBrowser()
	}

	@Then("requester should be informed that given blocking rule (.+) has been violated")
	def request_should_be_informed_of_blocking_rule_violation(String rule) {
		if(!rule.equals("The summation of all output file sizes exceeds the request file size limit")) {
			WebUI.comment("checking that file was successfully blocked")
			WebUI.waitForElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.ERROR), 10)
			WebUI.verifyElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.ERROR), 10)
		}
	}

	@Then("requester should be informed that given warning rule (.+) has been violated")
	def request_should_be_informed_of_warning_rule_violation(String rule) {
		WebUI.comment("checking that file successfully triggered warning")
		WebUI.waitForElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.WARNING), 10)
		WebUI.verifyElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.WARNING), 10)
	}

	@Then("the team member's request should be visible and editable")
	def team_members_request_should_be_editable() {
		requester_should_be_able_to_make_changes_to_the_request()
	}

	@Then("the team member's request should not be visible")
	def team_members_request_should_not_be_visible() {
		WebUI.verifyTextNotPresent(G_REQUESTNAME, false)
		WebUI.closeBrowser()
	}
	@Then("the request cannot be successfully submitted")
	def request_cannot_be_successfully_submitted() {
		TestObject submitBtn = Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID)
		WebUI.waitForElementNotHasAttribute(submitBtn, "disabled", 10)
		WebUI.waitForElementClickable(submitBtn, 10)
		WebUI.click(submitBtn)
		WebUI.comment("Clicked the submit link")
		request_should_be_in_given_status(Constant.Status.WORK_IN_PROGRESS)
	}

	@Then("the request can be successfully submitted")
	def request_can_be_successfully_submitted() {
		TestObject submitBtn = Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID)
		WebUI.waitForElementNotHasAttribute(submitBtn, "disabled", 10)
		WebUI.waitForElementVisible(submitBtn, 20)
		WebUI.waitForElementClickable(submitBtn, 30)
		WebUI.click(submitBtn)
		WebUI.comment("Clicked the submit link")
		request_should_be_in_given_status(Constant.Status.AWAITING_REVIEW)
	}
}