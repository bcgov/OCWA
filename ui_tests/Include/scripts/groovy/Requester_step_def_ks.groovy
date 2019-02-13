import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.checkpoint.Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.testcase.TestCase
import com.kms.katalon.core.testcase.TestCaseFactory
import com.kms.katalon.core.testdata.TestData
import com.kms.katalon.core.testdata.TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository
import com.kms.katalon.core.testobject.TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords

import internal.GlobalVariable

import MobileBuiltInKeywords as Mobile
import WSBuiltInKeywords as WS
import WebUiBuiltInKeywords as WebUI

import org.openqa.selenium.WebElement
import org.openqa.selenium.WebDriver
import org.openqa.selenium.By

import com.kms.katalon.core.mobile.keyword.internal.MobileDriverFactory
import com.kms.katalon.core.webui.driver.DriverFactory

import com.kms.katalon.core.testobject.RequestObject
import com.kms.katalon.core.testobject.ResponseObject
import com.kms.katalon.core.testobject.ConditionType
import com.kms.katalon.core.testobject.TestObjectProperty

import com.kms.katalon.core.mobile.helper.MobileElementCommonHelper
import com.kms.katalon.core.util.KeywordUtil

import com.kms.katalon.core.webui.exception.WebElementNotFoundException

import cucumber.api.java.en.And
import cucumber.api.java.en.Given
import cucumber.api.java.en.Then
import cucumber.api.java.en.When


class Requester_step_def_ks {
	String TEST_COMMENT = "test"
	String PURPOSE_TEXT = "The purpose of my project is X"
	String EDITED_PURPOSE_TEXT = "Edited the purpose to be Y"
	String REQUEST_PATH = "/requests/"
	String LOGIN_BTN_ID = "app-auth-login-button"
	String LOGIN_USERNAME = "pripley"
	String LOGIN_PWD = "EUKVYWz2orI="
	String NEW_REQUEST_BTN_ID = "new-request-button"
	String REQUEST_SAVE_FILES_BTN_ID = "request-form-save-files-button"
	String REQUEST_FILES_UPLOAD_BTN_ID = "file-uploader-input"
	String REQUEST_SAVE_BTN_ID = "request-form-save-button"
	String REQUEST_SAVE_CLOSE_BTN_ID = "request-form-save-close-button"
	String REQUEST_EDIT_BTN_ID = "request-sidebar-edit-button"
	String REQUEST_PURPOSE_TXT_ID = "purpose"
	String REQUEST_WITHDRAW_BTN_ID = "request-sidebar-withdraw-button"
	String REQUEST_CANCEL_BTN_ID = "request-sidebar-cancel-button"
	String REQUEST_SUBMIT_BTN_ID = "request-sidebar-submit-button" //submit button on the request page
	String LOGOUT_URL = "/auth/logout"
	//String NEW_REQUEST_DIALOG_HEADER_TEXT = "Initiate a New Request"
	String NEW_REQUEST_DIALOG_ID = "request-form"
	String SEARCH_BOX_ID = "requests-list-search"
	String VALID_FILE_ICON = "file-table-item-passing-icon"
	String WARNING_FILE_ICON = "file-table-item-warning-icon"
	String ERROR_FILE_ICON = "file-table-item-error-icon"
	String WORK_IN_PROGRESS_STATUS = "Work in Progress"
	String AWAITING_REVIEW_STATUS = "Awaiting Review"
	String DRAFT_STATUS = "Draft"

	//Output checker interface
	String ASSIGN_REQUEST_TO_ME_ID = "request-sidebar-pickup-button"
	String APPROVE_REQUEST_BTN_ID = "request-sidebar-approve-button"
	String REVISIONS_NEEDED_REQUEST_BTN_ID = "request-sidebar-request-revisions-button"

	String g_requestName = ""

	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */

	@Given("requester has logged in")
	def requester_login() {
		login(GlobalVariable.OCWA_USER_RESEARCHER, GlobalVariable.OCWA_USER_RESEARCHER_PSWD)
	}

	@Given("output checker has logged in")
	def checker_login() {
		login(GlobalVariable.OCWA_USER_CHECKER1, GlobalVariable.OCWA_USER_CHECKER1_PSWD)
	}
	@Given("an unclaimed request exists")
	def checker_unclaimed_request_exists() {
		requester_login()
		requester_has_submitted_a_request()
	}
	@When("output checker tries to claim an unclaimed request")
	def checker_tries_to_claim_unclaimed_request() {
		WebUI.waitForPageLoad(30)
		TestObject linkToRequest = get_test_object_by_text(g_requestName)
		WebUI.waitForElementVisible(linkToRequest, 20)
		WebUI.waitForElementClickable(linkToRequest, 20)

		WebUI.click(linkToRequest)
		WebUI.comment("found and clicked the request link")
		WebUI.waitForPageLoad(20)
		WebUI.comment("should be on the individual request page.")

		TestObject assignToMeButtonObject = get_test_object_by_id(ASSIGN_REQUEST_TO_ME_ID)

		WebUI.waitForPageLoad(30)
		WebUI.waitForElementNotHasAttribute(assignToMeButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(assignToMeButtonObject, 20)
		WebUI.waitForElementClickable(assignToMeButtonObject, 30)
		WebUI.click(assignToMeButtonObject)
		WebUI.comment("found and clicked the Assign to Me button")

	}
	
	@When("the output checker marks the request as approved")
	def checker_marks_request_as_approved() {
		TestObject approveButtonObject = get_test_object_by_id(APPROVE_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(approveButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(approveButtonObject, 20)
		WebUI.waitForElementClickable(approveButtonObject, 30)
		WebUI.click(approveButtonObject)
		WebUI.comment("found and clicked the approve button")
	}
	
	@When("the output checker marks the request as needs revisions")
	def checker_marks_request_as_needs_revisions() {
		TestObject revisionsButtonObject = get_test_object_by_id(REVISIONS_NEEDED_REQUEST_BTN_ID)
		WebUI.waitForElementNotHasAttribute(revisionsButtonObject, "disabled", 10)
		WebUI.waitForElementVisible(revisionsButtonObject, 20)
		WebUI.waitForElementClickable(revisionsButtonObject, 30)
		WebUI.click(revisionsButtonObject)
		WebUI.comment("found and clicked the needs revisions button")
	}

	@Then("the output checker should be able to see that they're now assigned the request")
	def checker_should_see_they_are_assigned_to_request(){
		WebUI.verifyTextPresent(GlobalVariable.OCWA_USER_CHECKER1, false)
		WebUI.closeBrowser()
	}

	def login(String username, String password){
		WebUI.openBrowser('')
		WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		TestObject loginButton = get_test_object_by_id(LOGIN_BTN_ID)
		WebUI.waitForElementClickable(loginButton, 30)
		WebUI.click(loginButton)

		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Username or email_userna'), username)

		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_password'), password)

		WebUI.click(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_login'))

	}

	@Given("requester has started a request")
	def requester_starts_new_request() {

		TestObject newRequestButtonObject = get_test_object_by_id(NEW_REQUEST_BTN_ID)

		WebUI.waitForPageLoad(30)
		WebUI.waitForElementNotHasAttribute(newRequestButtonObject, "disabled", 10)

		WebUI.waitForElementVisible(newRequestButtonObject, 20)
		WebUI.waitForElementClickable(newRequestButtonObject, 30)
		WebUI.click(newRequestButtonObject)
		WebUI.setText(get_test_object_by_id(REQUEST_PURPOSE_TXT_ID), PURPOSE_TEXT)
		g_requestName = CustomKeywords.'test_OCWA_keywords.random_test_request_name.gen_random_test_request_name'()
		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/input_Request Name_name'), g_requestName)
	}

	@Given("has not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	// parameterized function for uploading 1 to 3 output or supporting files
	def requester_uploads_files(String fileToUpload, boolean isUploadScreenAlreadyOpen = false, String secondFile="", String thirdFile="") {

		if (!isUploadScreenAlreadyOpen) {
			TestObject requestFormSaveFilesButton = get_test_object_by_id(REQUEST_SAVE_FILES_BTN_ID)
			WebUI.waitForElementClickable(requestFormSaveFilesButton, 30)
			WebUI.click(requestFormSaveFilesButton)
		}

		//Upload files
		TestObject uploadFileButton = get_test_object_by_id(REQUEST_FILES_UPLOAD_BTN_ID)
		WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", 10)
		WebUI.waitForElementClickable(uploadFileButton, 30)
		WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$fileToUpload")
		WebUI.delay(10)
		if (secondFile != "") {
			WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", 10)
			WebUI.waitForElementClickable(uploadFileButton, 30)
			WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$secondFile")
		}

		if (thirdFile != "") {
			WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", 10)
			WebUI.waitForElementClickable(uploadFileButton, 30)
			WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$thirdFile")
		}
	}

	@Given("requester adds (.+) output file that does not violate any blocking or warning rules")
	def requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules(String numOutputFilesToUpload){
		if (numOutputFilesToUpload == "2") { //add 2 valid output files
			requester_uploads_files(GlobalVariable.ValidFileName, false, GlobalVariable.ValidFileName2)
		}
		else { //add 1 valid output file
			//requester_uploads_files(GlobalVariable.ValidFileName, false)
			requester_uploads_files(GlobalVariable.BlockedStudyIDFileName, false) //temporary stop gap 
		}
	}

	@Given("requester adds (.+) supporting files")
	def requester_adds_supporting_files(String numSupportingFilesToUpload){
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/div_Supporting Files'))
		if (numSupportingFilesToUpload == "1") {
			requester_uploads_files(GlobalVariable.SupportingFileName, true)
		}
		else { //add 2 supporting files
			requester_uploads_files(GlobalVariable.SupportingFileName, true, GlobalVariable.SupportingFileName2)
		}
	}

	@Given("request violates given warning rule (.+)")
	def request_violates_warning_rule(String warningRule){
		//requester_starts_new_request()
		switch (warningRule.toLowerCase()) {
			case "an output file has a warning file extension":
				requester_uploads_files(GlobalVariable.WarningExtensionFileName)
				break
			case "a request that has a file that exceeds the file size warning threshold":
				requester_uploads_files(GlobalVariable.WarningMaxSizeLimitFileName)
				break
			case "the summation of all output file sizes exceeds the request file size warning threshold":
			//need to add output files that pass the warning limit individually but together surpass the combined size threshold
				requester_uploads_files(GlobalVariable.ValidFileName, false, GlobalVariable.ValidFileName2, GlobalVariable.ValidFileName3)
				break
			default:
				throw new Exception("warning rule $warningRule not found")
				break
		}
	}
	@Given("request violates given blocking rule (.+)")
	def request_violates_blocking_rule(String blockingRule){
		//requester_starts_new_request()
		switch (blockingRule.toLowerCase()) {
			case "an output file has a blocked file extension":
				requester_uploads_files(GlobalVariable.BlockedExtensionFileName)
				break
			case "a request that has a file that is too big":
				requester_uploads_files(GlobalVariable.BlockedMaxSizeLimitFileName)
				break
			case "the summation of all output file sizes exceeds the request file size limit":
			//need to add output files that pass the blocked limit individually but together surpass the combined size threshold
				requester_uploads_files(GlobalVariable.ValidFileName, false, GlobalVariable.ValidFileName2, GlobalVariable.WarningMaxSizeLimitFileName)
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

	@Given("requester has submitted a request")
	def requester_has_submitted_a_request(){
		requester_starts_new_request()
		requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules("1")
		requester_submits_request()
	}

	@Given("request was last updated within the last month")
	def request_updated_within_last_month() {
		//stubbed because newly created requests will always have an update date within the last month
	}

	@Given("the request has been claimed by an output checker")
	def request_has_been_claimed_by_a_oc(){
		//request_is_review_in_progress()
		requester_has_a_request_of_status("Review in progress")
	}

	@Given('requester has a request of status "(.+)"')
	def requester_has_a_request_of_status(String status) {
		switch (status.toLowerCase()) {
			case "draft":
				requester_starts_new_request()
				requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules("1")
				requester_saves_new_request()
				break
			case "awaiting review":
				requester_has_submitted_a_request()
				break
			case "review in progress":
				requester_has_submitted_a_request()
			//output checker needs to claim
				break
			case "work in progress":
				requester_has_submitted_a_request()
				requester_withdraws_request()
				break
			case "cancelled":
				requester_has_submitted_a_request()
				requester_cancels_request()
				break
			case "approved":
				requester_has_submitted_a_request()
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
		login(GlobalVariable.OCWA_USER_TEAM_MEMBER, GlobalVariable.OCWA_USER_TEAM_MEMBER_PSWD)
		requester_has_a_request_of_status(DRAFT_STATUS)
		WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$LOGOUT_URL")
	}

	@Given("requester's project allows for editing of team member's requests")
	def project_allows_for_team_sharing(){}

	@Given("requester's project does not allow for editing of team member's requests")
	def project_does_not_allow_for_team_sharing(){}

	@When("the requester saves their request")
	def requester_saves_new_request() {
		TestObject saveCloseBtn = get_test_object_by_id(REQUEST_SAVE_CLOSE_BTN_ID)
		WebUI.waitForElementNotHasAttribute(saveCloseBtn, "disabled", 10)
		WebUI.waitForElementVisible(saveCloseBtn, 10)
		if (!WebUI.waitForElementClickable(saveCloseBtn, 30)) {
			WebUI.comment("waiting for Save and Close button to be clickable timed out")
		}
		WebUI.click(saveCloseBtn)
		//WebUI.waitForElementNotHasAttribute(saveCloseBtn, "disabled", 10) // may not be necessary
		WebUI.waitForElementNotPresent(saveCloseBtn, 10) //wait for the modal window to close
	}

	@When("requester submits their request")
	def requester_submits_request() {
		TestObject saveBtn = get_test_object_by_id(REQUEST_SAVE_BTN_ID)
		WebUI.waitForElementNotHasAttribute(saveBtn, "disabled", 10)
		WebUI.waitForElementClickable(saveBtn, 30)
		WebUI.click(saveBtn)
		WebUI.waitForElementNotHasAttribute(saveBtn, "disabled", 10)
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), "disabled", 10)
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), 30)

		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'))

		WebUI.waitForElementNotPresent(saveBtn, 10) //wait for the modal window to close
	}

	@When("requester writes and submits a new comment")
	def requester_creates_a_new_comment(){
		requester_views_request_they_created()
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_Discussion'))
		//WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/div_'), TEST_COMMENT)
		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/div_Normal text_ak-editor-cont'), TEST_COMMENT)
		//WebUI.setText(get_test_object_by_id("discussion-form"), TEST_COMMENT)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Save (1)'))
	}

	@When("the requester views the request")
	def requester_views_request_they_created(){
		if (WebUI.getUrl() != GlobalVariable.OCWA_URL) {
			WebUI.navigateToUrl(GlobalVariable.OCWA_URL)

		}
		WebUI.waitForPageLoad(20)
		TestObject searchBox = get_test_object_by_id(SEARCH_BOX_ID)
		WebUI.setText(searchBox, g_requestName)

		TestObject linkToRequest = get_test_object_by_text(g_requestName)
		WebUI.waitForElementVisible(linkToRequest, 20)

		if (!WebUI.waitForElementClickable(linkToRequest, 20)) {
			WebUI.comment("waiting for request link to be clickable timed out")
		}
		WebUI.click(linkToRequest)
		WebUI.waitForPageLoad(20)
	}

	@When("the requester cancels the request")
	def requester_cancels_request(){
		requester_views_request_they_created()
		WebUI.click(get_test_object_by_id(REQUEST_CANCEL_BTN_ID))
	}

	@When("the requester withdraws the request")
	def requester_withdraws_request(){
		requester_views_request_they_created()
		WebUI.click(get_test_object_by_id(REQUEST_WITHDRAW_BTN_ID))
	}

	@When("requester views (.+) requests")
	def requester_views_requests_of_given_status(String status){
		WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		switch (status.toLowerCase()) {
			case "draft":
				WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Draft'))
				break
			case "submitted":
				WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_QueuedIn Review'))
				break
			case "approved":
			//stub for when a filter for approved requests is added to UI
				break
			case "cancelled":
				WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Cancelled'))
				break
			case "their": //essentially viewing all their requests
				break
			default:
				throw new Exception("status $status not found")
				break
		}
	}

	@Then("the requester should see their saved request including (.+) output file (.+) supporting file")
	def confirm_draft_save_was_successful(String numOutputFiles, String numSupportingFiles){
		//requester_views_request_they_created()
		WebUI.comment("current page (should be main page):${WebUI.getUrl()}")
		TestObject searchBox = get_test_object_by_id(SEARCH_BOX_ID)
		WebUI.setText(searchBox, g_requestName)

		if (!WebUI.verifyTextPresent(g_requestName, false)) {
			WebUI.comment("unable to find the text:$g_requestName on the page.  This text is used to find the request link")
		}
		TestObject linkToRequest = get_test_object_by_text(g_requestName)
		WebUI.waitForElementNotHasAttribute(linkToRequest, "disabled", 10)
		if (!WebUI.waitForElementClickable(linkToRequest, 20)) {
			WebUI.comment("waiting for the link to the request to be clickable on the main page timed out")
		}
		WebUI.click(linkToRequest)
		WebUI.comment("clicked on the request link that contains text: $g_requestName")

		WebUI.waitForPageLoad(20)
		WebUI.comment("current page (should be request page):${WebUI.getUrl()}")


		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.delay(5) // we need to do a hard delay here to give time for the inline ajax to finish

		if (numOutputFiles == "1") {
			WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		}
		if (numOutputFiles == "2") {
			WebUI.verifyTextPresent(GlobalVariable.ValidFileName2, false)
			WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		}
		if (numSupportingFiles == "1") {
			WebUI.verifyTextPresent(GlobalVariable.SupportingFileName, false)
		}
		if (numSupportingFiles == "2") {
			WebUI.verifyTextPresent(GlobalVariable.SupportingFileName2, false)
			WebUI.verifyTextPresent(GlobalVariable.SupportingFileName, false)
		}
	}

	@Then("the requester should not be able to submit the request")
	def requester_is_not_able_to_submit_request(){
		TestObject requestFormSaveFilesButton = get_test_object_by_id(REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 30)
		WebUI.click(requestFormSaveFilesButton)

		WebUI.verifyElementNotHasAttribute(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), "disabled", 10)

		WebUI.closeBrowser()
	}

	@Then("the requester should be able to submit the request")
	def requester_is_able_to_submit_request(){
		WebUI.verifyElementHasAttribute(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'),"disabled", 10)
		WebUI.closeBrowser()
	}

	@Then("the requester should see the complete record of the request including export files, supporting files/text, discussion, and status changes")
	def submitted_request_info_matches_what_was_submitted(){
		WebUI.comment("current page (should be request page):${WebUI.getUrl()}")
		WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.verifyTextPresent(PURPOSE_TEXT, false)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_Discussion'))
		//WebUI.delay(2)
		requester_should_see_their_new_comment_displayed()
		//WebUI.delay(5)
		WebUI.closeBrowser()
	}

	@Then('the request status is changed to "(.+)"')
	def request_should_be_in_given_status(String statusTxt){
		requester_views_request_they_created()
		WebUI.comment("current page (should be request page):${WebUI.getUrl()}")
		WebUI.verifyTextPresent(statusTxt, false)
		WebUI.closeBrowser()
	}

	@Then('requests of status "(.+)" should be displayed')
	def requests_of_given_status_should_be_displayed(String status){
		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.closeBrowser()
	}

	@Then("requests with updates older than a month should not be displayed")
	def no_old_requests_should_be_displayed(){}

	@Then("requester should see their new comment displayed")
	def requester_should_see_their_new_comment_displayed(){
		WebUI.verifyTextPresent(TEST_COMMENT, false)
	}

	@Then("requester should be able to make changes to the request")
	def requester_should_be_able_to_make_changes_to_the_request(){
		//requester_views_request_they_created()
		WebUI.comment("current page (should be request page):${WebUI.getUrl()}")
		WebUI.click(get_test_object_by_id(REQUEST_EDIT_BTN_ID))
		WebUI.setText(get_test_object_by_id(REQUEST_PURPOSE_TXT_ID), EDITED_PURPOSE_TEXT)

		// click Add Files button
		TestObject requestFormSaveFilesButton = get_test_object_by_id(REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 30)
		WebUI.click(requestFormSaveFilesButton)
	}
	@Then("requester should be able to re-submit the request")
	def requester_should_be_able_to_resubmit_request(){
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), "disabled", 10)
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), 30)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'))
		request_should_be_in_given_status(AWAITING_REVIEW_STATUS)
		WebUI.closeBrowser()
	}

	@Then("requester should be informed that given blocking rule (.+) has been violated")
	def request_should_be_informed_of_blocking_rule_violation(String rule){
		WebUI.comment("checking that file was successfully blocked")
		WebUI.verifyElementPresent(get_test_object_by_class(ERROR_FILE_ICON), 10)
	}

	@Then("requester should be informed that given warning rule (.+) has been violated")
	def request_should_be_informed_of_warning_rule_violation(String rule){
		WebUI.comment("checking that file successfully triggered warning")
		WebUI.verifyElementPresent(get_test_object_by_class(WARNING_FILE_ICON), 10)
	}

	@Then("the team member's request should be visible and editable")
	def team_members_request_should_be_editable() {
		requester_should_be_able_to_make_changes_to_the_request()
	}

	@Then("the team member's request should not be visible")
	def team_members_request_should_not_be_visible(){
		WebUI.verifyTextNotPresent(g_requestName, false)
		WebUI.closeBrowser()
	}
	@Then("the request cannot be successfully submitted")
	def request_cannot_be_successfully_submitted(){
		TestObject submitBtn = get_test_object_by_id(REQUEST_SUBMIT_BTN_ID)
		WebUI.waitForElementNotHasAttribute(submitBtn, "disabled", 10)
		WebUI.waitForElementVisible(submitBtn, 20)
		WebUI.waitForElementClickable(submitBtn, 30)
		WebUI.click(submitBtn)
		WebUI.comment("Clicked the submit link")
		request_should_be_in_given_status(WORK_IN_PROGRESS_STATUS)
	}

	@Then("the request can be successfully submitted")
	def request_can_be_successfully_submitted(){
		TestObject submitBtn = get_test_object_by_id(REQUEST_SUBMIT_BTN_ID)
		WebUI.waitForElementNotHasAttribute(submitBtn, "disabled", 10)
		WebUI.waitForElementVisible(submitBtn, 20)
		WebUI.waitForElementClickable(submitBtn, 30)
		WebUI.click(submitBtn)
		WebUI.comment("Clicked the submit link")
		request_should_be_in_given_status(AWAITING_REVIEW_STATUS)
	}

	//Helper function for getting TestObject from the id of an html element
	def get_test_object_by_id(String id) {
		TestObject tObject = new TestObject(id)
		tObject.addProperty("id", ConditionType.EQUALS, id, true)
		return tObject
	}
	//Helper function for getting TestObject from the text of an html element
	def get_test_object_by_text(String t) {
		TestObject tObject = new TestObject(t)
		tObject.addProperty("text", ConditionType.EQUALS, t, true)
		return tObject
	}
	//Helper function for getting TestObject from the class of an html element
	def get_test_object_by_class(String t) {
		TestObject tObject = new TestObject(t)
		tObject.addProperty("class", ConditionType.EQUALS, t, true)
		return tObject
	}

}