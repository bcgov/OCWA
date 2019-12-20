package test.ocwa.features

import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import org.openqa.selenium.Keys as Keys

import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.kms.katalon.core.util.KeywordUtil

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

	@Given("requester has started (.+) request")
	def requester_starts_new_request(String requestType) {
		G_REQUESTNAME = Utils.generateRequestNameDate()


		TestObject newRequestButtonObject = Utils.getTestObjectByText(Constant.Requester.NEW_REQUEST_BTN_TXT)

		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotHasAttribute(newRequestButtonObject, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(newRequestButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(newRequestButtonObject, Constant.DEFAULT_TIMEOUT)
		WebUI.click(newRequestButtonObject)


		switch (requestType) {
			case "a":
				WebUI.setText(Utils.getTestObjectByName(Constant.Requester.REQUEST_CONFIDENTIALITY_TXT_ID, 'textarea'), Constant.Requester.CONFIDENTIALITY_TEXT)
				WebUI.setText(Utils.getTestObjectByName(Constant.Requester.REQUEST_VARIABLE_TXT_ID, 'textarea'), Constant.Requester.REQUEST_VARIABLE_TEXT)
				WebUI.setText(Utils.getTestObjectByName(Constant.Requester.REQUEST_SUBPOP_TXT_ID, 'textarea'), Constant.Requester.REQUEST_SUBPOP_TEXT)
				break
			case "import":
				WebUI.setText(Utils.getTestObjectByName(Constant.Requester.REQUEST_GENERAL_COMMENTS_TXT_ID, 'textarea'), Constant.Requester.GENERAL_COMMENTS_TEXT)
				break
			case "code import":
				fillOutCommonCodeRequestFields(false)
				WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_BRANCH_TXT_ID), Constant.CodeRequests.MERGE_BRANCH_HAPPY_PATH_TEXT) //the branch name is the trigger for the GitLab simulator to return a successful or unsuccessful merge result
				break
			case "code export":
				fillOutCommonCodeRequestFields(true)
				WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_BRANCH_TXT_ID), Constant.CodeRequests.MERGE_BRANCH_HAPPY_PATH_TEXT) //the branch name is the trigger for the GitLab simulator to return a successful or unsuccessful merge result
				break
			case "missing repository code import":
				fillOutCommonCodeRequestFields(false)
				WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_BRANCH_TXT_ID), Constant.CodeRequests.MERGE_BRANCH_MISSING_REPO_TEXT)  //the branch name is the trigger for the GitLab simulator to return a successful or unsuccessful merge result
				break
			case "missing repository code export":
				fillOutCommonCodeRequestFields(true)
				WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_BRANCH_TXT_ID), Constant.CodeRequests.MERGE_BRANCH_MISSING_REPO_TEXT)  //the branch name is the trigger for the GitLab simulator to return a successful or unsuccessful merge result
				break
			case 'fails scanning code import':
				fillOutCommonCodeRequestFields(false)
				WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_BRANCH_TXT_ID), Constant.CodeRequests.MERGE_BRANCH_FAILED_SCAN)  //the branch name is the trigger for the GitLab simulator to return a successful or unsuccessful merge result
				break
			case 'fails scanning code export':
				fillOutCommonCodeRequestFields(true)
				WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_BRANCH_TXT_ID), Constant.CodeRequests.MERGE_BRANCH_FAILED_SCAN)  //the branch name is the trigger for the GitLab simulator to return a successful or unsuccessful merge result
				break
			default:
				throw new Exception("Request type $requestType is unknown")
		}
		WebUI.setText(Utils.getTestObjectByName(Constant.Requester.REQUEST_NAME_TXT_ID), G_REQUESTNAME)
		WebUI.setText(Utils.getTestObjectByName(Constant.Requester.REQUEST_PHONE_TXT_ID), Constant.Requester.REQUEST_PHONE_TEXT)

		TestObject requestFormSaveFilesButton = Utils.getTestObjectById(Constant.Requester.REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, Constant.DEFAULT_TIMEOUT)
		WebUI.click(requestFormSaveFilesButton)
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		G_REQUESTURL = WebUI.getUrl()
	}

	/**
	 * Selects code request as the request type and fills out the common import/export code request fields
	 * @param isExport boolean true if export, false if import
	 */
	def fillOutCommonCodeRequestFields(boolean isExport) {
		TestObject requestTypeDropDown = Utils.getTestObjectById(Constant.CodeRequests.REQUEST_REQUEST_TYPE_DD_ID)
		TestObject requestTypeCode = null
		if (isExport) {
			requestTypeCode = Utils.getTestObjectByText(Constant.CodeRequests.REQUEST_CODE_EXPORT_DD_VALUE, null)
		}
		else {
			requestTypeCode = Utils.getTestObjectByText(Constant.CodeRequests.REQUEST_CODE_IMPORT_DD_VALUE, null)
		}
		WebUI.click(requestTypeDropDown)
		WebUI.click(requestTypeCode)
		WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_CODE_DESCRIPTION_TXT_ID, 'textarea'), Constant.CodeRequests.REQUEST_CODE_DESCRIPTION_TEXT)
		WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_REMOTE_REPO_TXT_ID), Constant.CodeRequests.REQUEST_REMOTE_REPO_TEXT)
		WebUI.setText(Utils.getTestObjectByName(Constant.CodeRequests.REQUEST_LOCAL_REPO_TXT_ID), Constant.CodeRequests.REQUEST_LOCAL_REPO_TEXT)
	}

	@Given("has not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	/**
	 * Uploads each file specified in the files array
	 * @param files String array of filenames to be used for uploading
	 * @param isSupportingFile Optional Boolean regarding whether the file is an output or supporting file. Defaults to false if not specified.
	 */
	def requester_uploads_files(String[] files, boolean isSupportingFile = false) {
		// Upload files
		TestObject uploadFileButton
		if (isSupportingFile) {
			uploadFileButton = Utils.getTestObjectByXPath(Constant.Requester.REQUEST_SUPPORT_FILES_UPLOAD_BTN_XPATH)
		}
		else {
			uploadFileButton = Utils.getTestObjectByXPath(Constant.Requester.REQUEST_OUTPUT_FILES_UPLOAD_BTN_XPATH)
		}
		files.each { file ->
			WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", Constant.DEFAULT_TIMEOUT)
			WebUI.waitForElementClickable(uploadFileButton, Constant.DEFAULT_TIMEOUT)
			WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$file")

			TestObject errorAlert = Utils.getTestObjectByText(Constant.Alerts.ERROR_TEXT, null)
			if (WebUI.waitForElementPresent(errorAlert, Constant.FILE_UPLOAD_TIMEOUT, FailureHandling.OPTIONAL)) {
				WebUI.takeScreenshot()
				KeywordUtil.markFailed('An error alert displayed upon file upload.')
			}
			WebUI.comment("File uploaded without error.")
		}
	}

	@Given("requester adds (.+) output file that does not violate any blocking or warning rules")
	def requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules(String numOutputFilesToUpload) {
		String[] files = [GlobalVariable.ValidFileName]
		if(numOutputFilesToUpload == "2") files << GlobalVariable.ValidFileName2

		requester_uploads_files(files)
	}

	@Given("requester adds (.+) input file that does not violate any blocking or warning rules")
	def requester_adds_input_file_that_does_not_violate_blocking_or_warning_rules(String numInputFilesToUpload) {
		String[] files = [
			GlobalVariable.ValidImportFileName
		]
		if(numInputFilesToUpload == "2") files << GlobalVariable.ValidImportFileName2

		requester_uploads_files(files)
	}

	@Given("requester adds (.+) supporting files")
	def requester_adds_supporting_files(String numSupportingFilesToUpload) {
		String[] files = [
			GlobalVariable.SupportingFileName
		]
		if (numSupportingFilesToUpload == "2") files << GlobalVariable.SupportingFileName2

		requester_uploads_files(files, true)
	}

	@Given("request violates given warning rule (.+)")
	def request_violates_warning_rule(String warningRule) {
		switch (warningRule.toLowerCase()) {
			case "an output file has a warning file extension":
				requester_uploads_files([
					GlobalVariable.WarningExtensionFileName] as String[])
				break
			case "a request that has a file that exceeds the file size warning threshold":
				requester_uploads_files([
					GlobalVariable.WarningMaxSizeLimitFileName] as String[])
				break
			case "the summation of all output file sizes exceeds the request file size warning threshold":
			// need to add output files that pass the warning limit individually but together surpass the combined size threshold
				requester_uploads_files([
					GlobalVariable.ValidFileName,
					GlobalVariable.ValidFileName2,
					GlobalVariable.ValidFileName3
				] as String[])
				break
			case "an import request input file has a warning file extension":
				requester_uploads_files([
					GlobalVariable.WarningExtensionFileName] as String[])
				break
			case "an import request that has a input file that exceeds the file size warning threshold":
				requester_uploads_files([
					GlobalVariable.WarningImportFileName] as String[])
				break
			case "the summation of all input file sizes exceeds the import request file size warning threshold":
			// need to add input files that pass the warning limit individually but together surpass the combined size threshold
				requester_uploads_files([
					GlobalVariable.ValidImportFileName,
					GlobalVariable.ValidImportFileName2,
					GlobalVariable.ValidImportFileName3
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
				requester_uploads_files([
					GlobalVariable.BlockedExtensionFileName] as String[])
				break
			case "an import request input file has a blocked file extension":
				requester_uploads_files([
					GlobalVariable.BlockedExtensionFileName] as String[])
				break
			case "a request that has a file that is too big":
				requester_uploads_files([
					GlobalVariable.BlockedMaxSizeLimitFileName] as String[])
				break
			case "an import request input file is too big":
				requester_uploads_files([
					GlobalVariable.BlockedMaxImportSizeLimitFileName] as String[])
				break
			case "the summation of all output file sizes exceeds the request file size limit":
			//need to add output files that pass the blocked limit individually but together surpass the combined size threshold
				requester_uploads_files([
					GlobalVariable.ValidFileName,
					GlobalVariable.ValidFileName2,
					GlobalVariable.WarningMaxSizeLimitFileName
				] as String[])
				break
			case "the summation of all input file sizes exceeds the import request file size limit":
			//need to add input files that pass the blocked limit individually but together surpass the combined size threshold
				requester_uploads_files([
					GlobalVariable.WarningImportFileName,
					GlobalVariable.WarningImportFileName2,
					GlobalVariable.WarningImportFileName3
				] as String[])
				break
			case "a request has a file with a studyid in it":
				requester_uploads_files([
					GlobalVariable.BlockedStudyIDFileName] as String[])
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

	@Given("requester's project allows for editing of team member's requests")
	def project_allows_for_team_sharing() {
	}

	@Given("requester's project does not allow for editing of team member's requests")
	def project_does_not_allow_for_team_sharing() {
	}

	@When("the requester saves their request")
	def requester_saves_new_request() {
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_EDIT_BTN_ID))
		TestObject successAlert = Utils.getTestObjectByText(Constant.Alerts.SUCCESS_UPDATED_TEXT, null)
		WebUI.waitForElementPresent(successAlert, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)
		WebUI.waitForElementNotPresent(successAlert, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)
	}

	@When("requester submits their request")
	def requester_submits_request() {
		TestObject requestSubmitBtn = Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID)
		TestObject successAlert = Utils.getTestObjectByText(Constant.Alerts.SUCCESS_UPDATED_TEXT, null)
		TestObject errorAlert = Utils.getTestObjectByText(Constant.Alerts.ERROR_TEXT, null)

		if (WebUI.verifyElementNotClickable(requestSubmitBtn, FailureHandling.OPTIONAL)) {
			WebUI.comment('Submit button is disabled so try clicking the "Done editing" link')
			WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_EDIT_BTN_ID))
			WebUI.waitForElementPresent(successAlert, Constant.DEFAULT_TIMEOUT)
			WebUI.waitForElementNotPresent(successAlert, Constant.DEFAULT_TIMEOUT)
			WebUI.delay(Constant.DEFAULT_TIMEOUT) //need to give more time to run validation rules on files
		}
		WebUI.waitForElementNotHasAttribute(requestSubmitBtn, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(requestSubmitBtn, Constant.DEFAULT_TIMEOUT)
		WebUI.comment('Clicking the submit button')
		WebUI.click(requestSubmitBtn)

		//test if an error alert displays when request is submitted.
		//		if (WebUI.waitForElementPresent(errorAlert, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)) {
		//			WebUI.takeScreenshot()
		//			KeywordUtil.markFailed('An error alert displayed upon submission.')
		//		}
		//		WebUI.comment('No error message displayed so submission looks good.')
	}

	@When("requester writes and submits a new comment")
	def requester_creates_a_new_comment() {
		requester_views_request_they_created(" ")

		TestObject discussionTab = Utils.getTestObjectById(Constant.Requester.REQUEST_DISCUSSION_TAB_ID)
		WebUI.waitForElementPresent(discussionTab, Constant.DEFAULT_TIMEOUT)
		WebUI.click(discussionTab)

		TestObject discussionForm = Utils.getTestObjectById(Constant.Requester.REQUEST_DISCUSSION_FORM_ID)
		WebUI.waitForElementPresent(discussionForm, Constant.DEFAULT_TIMEOUT)
		WebUI.click(discussionForm)

		TestObject contentEditable = findTestObject('Object Repository/OCWA/div_discussion_form_contenteditable')
		WebUI.waitForElementPresent(contentEditable, Constant.DEFAULT_TIMEOUT)
		WebUI.sendKeys(contentEditable, Constant.Requester.TEST_COMMENT)

		TestObject saveCommentButton = findTestObject('Object Repository/OCWA/span_save_comment')
		WebUI.waitForElementClickable(saveCommentButton, Constant.DEFAULT_TIMEOUT)
		WebUI.click(saveCommentButton)
	}

	@When("the requester views the(.+)request")
	def requester_views_request_they_created(String requestType) {
		switch (requestType) {
			case " ":
				if (WebUI.getUrl() != GlobalVariable.OCWA_URL) {
					WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
				}
				break
			case " import ":
				if (WebUI.getUrl() != GlobalVariable.OCWA_DL_URL) {
					WebUI.navigateToUrl(GlobalVariable.OCWA_DL_URL)
				}
				break
			default:
				throw new Exception("Request type $requestType is unknown")
		}
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		TestObject searchBox = Utils.getTestObjectById(Constant.Requester.SEARCH_BOX_ID)
		WebUI.waitForElementClickable(searchBox, Constant.DEFAULT_TIMEOUT)
		WebUI.setText(searchBox, G_REQUESTNAME)
		WebUI.sendKeys(searchBox, Keys.chord(Keys.ENTER))

		WebUI.waitForElementNotPresent(Utils.getTestObjectByText(Constant.Alerts.LOADING_TEXT, 'span'), Constant.DEFAULT_TIMEOUT)
		TestObject linkToRequest = Utils.getTestObjectByText(G_REQUESTNAME)
		WebUI.waitForElementNotHasAttribute(linkToRequest, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(linkToRequest, Constant.DEFAULT_TIMEOUT)

		WebUI.click(linkToRequest)
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
	}

	@When("the requester tries to navigate to the request directly")
	def navigate_to_request_directly() {
		WebUI.comment("Request URL:$G_REQUESTURL")
		WebUI.navigateToUrl(G_REQUESTURL)
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.comment("Current url is:${WebUI.getUrl()}")
	}

	@When("a requester in another project tries to navigate to the request directly")
	def navigate_to_other_project_request_directly() {
		navigate_to_request_directly()
	}

	@When("the requester cancels the request")
	def requester_cancels_request() {
		requester_views_request_they_created(" ")
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_CANCEL_BTN_ID))
	}

	@When("the requester withdraws the request")
	def requester_withdraws_request() {
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForElementClickable(Utils.getTestObjectById(Constant.Requester.REQUEST_WITHDRAW_BTN_ID), Constant.DEFAULT_TIMEOUT)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_WITHDRAW_BTN_ID))
		WebUI.acceptAlert()
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

	@When("the requester refreshes page")
	def requester_refreshes_page() {
		WebUI.refresh()
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_EDIT_BTN_ID))

	}

	@When("the merge request finishes")
	def wait_for_merge_request_to_finish() {
		TestObject mergeInProgressMessage = Utils.getTestObjectByText(Constant.CodeRequests.MERGE_INPROGRESS_TEXT, Constant.CodeRequests.MERGE_INPROGRESS_TAG)
		if (!WebUI.waitForElementNotPresent(mergeInProgressMessage, Constant.CodeRequests.MERGE_TIMEOUT, FailureHandling.OPTIONAL)) {
			WebUI.takeScreenshot()
			KeywordUtil.markFailed('Merge request timed out.')
		}
	}

	@When("requester waits for scan to complete")
	def requester_waits_for_code_scan_to_complete() {
		//this is the case for auto approving code requests.  Extra time is needed for the scan of the code to finish before status is updated.
		TestObject isApprovingObject = Utils.getTestObjectByText(Constant.CodeRequests.MERGE_REQUEST_APPROVING_TEXT, null)
		WebUI.waitForElementPresent(isApprovingObject,Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotPresent(isApprovingObject,Constant.DEFAULT_TIMEOUT)
	}

	@Then("the requester should see their saved request including (.+) output file (.+) supporting file")
	def confirm_draft_save_was_successful(String numOutputFiles, String numSupportingFiles) {
		requester_views_request_they_created(" ")

		// We need to stall here to give time for the inline ajax to finish
		WebUI.waitForElementNotPresent(Utils.getTestObjectByText('', 'circle'), Constant.DEFAULT_TIMEOUT)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)

		if ((numOutputFiles as Integer) > 0) WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		if ((numOutputFiles as Integer) > 1) WebUI.verifyTextPresent(GlobalVariable.ValidFileName2, false)

		if ((numSupportingFiles as Integer) > 0) WebUI.verifyTextPresent(GlobalVariable.SupportingFileName, false)
		if ((numSupportingFiles as Integer) > 1) WebUI.verifyTextPresent(GlobalVariable.SupportingFileName2, false)
	}

	@Then("the requester should not be able to submit the request")
	def requester_is_not_able_to_submit_request() {
		WebUI.verifyElementHasAttribute(Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID), "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.closeBrowser()
	}

	@Then("the requester should be able to submit the request")
	def requester_is_able_to_submit_request() {
		WebUI.verifyElementNotHasAttribute(Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID),"disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.closeBrowser()
	}

	@Then("the requester should see the complete record of the request including export files, supporting content, discussion, and status changes")
	def submitted_request_info_matches_what_was_submitted() {
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		WebUI.verifyTextPresent(G_REQUESTNAME, false)
		WebUI.verifyTextPresent(Constant.Requester.CONFIDENTIALITY_TEXT, false)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_DISCUSSION_TAB_ID))
		requester_should_see_their_new_comment_displayed()
		WebUI.closeBrowser()
	}

	@Then('the request status is changed to "(.+)"')
	def request_should_be_in_given_status(String statusTxt) {
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		TestObject statusObj = Utils.getTestObjectById(Constant.Status.REQUEST_STATUS_ID)
		WebUI.waitForElementPresent(statusObj, Constant.DEFAULT_TIMEOUT)
		WebUI.delay(1) //wait a second for the status to update
		String actualStatusTxt = WebUI.getText(statusObj)
		if (!actualStatusTxt.equals(statusTxt)) {
			WebUI.takeScreenshot()
			WebUI.comment("Request status is in unexpected state.  Expected: $statusTxt  Actual: $actualStatusTxt")
			KeywordUtil.markFailed('Failing scenario because request is unexpected state.')
		}
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
		WebUI.waitForElementPresent(Utils.getTestObjectById(Constant.Requester.REQUEST_CONFIDENTIALITY_LBL_TXT_ID), Constant.DEFAULT_TIMEOUT)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_CONFIDENTIALITY_LBL_TXT_ID))

		TestObject confidentialityField = Utils.getTestObjectById(Constant.Requester.REQUEST_CONFIDENTIALITY_EDT_TXT_ID)
		WebUI.setText(confidentialityField, Constant.Requester.EDITED_CONFIDENTIALITY_TEXT)
		WebUI.sendKeys(confidentialityField, Keys.chord(Keys.TAB, Keys.ENTER))

		TestObject successAlert = Utils.getTestObjectByText(Constant.Alerts.SUCCESS_UPDATED_TEXT, null)
		WebUI.waitForElementPresent(successAlert, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)
		WebUI.waitForElementNotPresent(successAlert, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)
		WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_EDIT_BTN_ID)) //need to click "done editing" to save changes
		WebUI.closeBrowser()
	}

	@Then("requester should be able to re-submit the request")
	def requester_should_be_able_to_resubmit_request() {
		//WebUI.click(Utils.getTestObjectById(Constant.Requester.REQUEST_EDIT_BTN_ID)) //need to click "done editing" to enable submit button

		TestObject requestSubmitBtn = Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID)
		WebUI.waitForElementNotHasAttribute(requestSubmitBtn, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(requestSubmitBtn, Constant.DEFAULT_TIMEOUT)
		WebUI.click(requestSubmitBtn)

		request_should_be_in_given_status(Constant.Status.AWAITING_REVIEW)
		WebUI.closeBrowser()
	}

	@Then("requester should be informed that given blocking rule (.+) has been violated")
	def request_should_be_informed_of_blocking_rule_violation(String rule) {
		if(!rule.contains("summation")) {
			WebUI.comment("checking that file was successfully blocked")
			WebUI.waitForElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.ERROR), Constant.DEFAULT_TIMEOUT)
			WebUI.verifyElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.ERROR), Constant.DEFAULT_TIMEOUT)
		}
	}

	@Then("requester should be informed that given warning rule (.+) has been violated")
	def request_should_be_informed_of_warning_rule_violation(String rule) {
		WebUI.comment("checking that file successfully triggered warning")
		WebUI.waitForElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.WARNING), Constant.DEFAULT_TIMEOUT)
		WebUI.verifyElementPresent(Utils.getTestObjectByClass(Constant.FileIcon.WARNING), Constant.DEFAULT_TIMEOUT)
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
		WebUI.waitForElementNotHasAttribute(submitBtn, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(submitBtn, Constant.DEFAULT_TIMEOUT)
		WebUI.click(submitBtn)
		WebUI.comment("Clicked the submit link")
		request_should_be_in_given_status(Constant.Status.WORK_IN_PROGRESS)
	}

	@Then("the request can be successfully submitted")
	def request_can_be_successfully_submitted() {
		TestObject submitBtn = Utils.getTestObjectById(Constant.Requester.REQUEST_SUBMIT_BTN_ID)
		WebUI.waitForElementNotHasAttribute(submitBtn, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(submitBtn, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(submitBtn, Constant.DEFAULT_TIMEOUT)
		WebUI.click(submitBtn)
		WebUI.comment('Clicked the submit link')
		//request_should_be_in_given_status(Constant.Status.AWAITING_REVIEW)
	}
	@Then("the request should not be accessible")
	def request_is_not_accessible() {
		if(!WebUI.verifyTextNotPresent(G_REQUESTNAME, false)) {
			WebUI.comment('Request is accessible when it should not be.')
		}
	}
	@Then("the requester should be informed that the merge request failed (.+)")
	def requester_informed_of_merge_request_failure(String failType) {
		switch(failType) {
			case 'due to project repo not found':
				TestObject failedMergeText = Utils.getTestObjectByText(Constant.CodeRequests.MERGE_CANNOT_MERGE_TEXT_MISSING_PROJECT_REPO, null)
				if (!WebUI.waitForElementPresent(failedMergeText, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)) {
					WebUI.takeScreenshot()
					KeywordUtil.markFailed('Merge failure message did not display (but it should have displayed).')
				}
				break
			case 'due to failed scan':
				TestObject failedMergeText = Utils.getTestObjectByText(Constant.CodeRequests.MERGE_BRANCH_FAILED_SCAN, null)
				if (!WebUI.waitForElementPresent(failedMergeText, Constant.DEFAULT_TIMEOUT, FailureHandling.OPTIONAL)) {
					WebUI.takeScreenshot()
					KeywordUtil.markFailed('Merge failure message did not display (but it should have displayed).')
				}
				break
			default:
				break
		}

	}
}
