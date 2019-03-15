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


class RequesterStep {
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
	String REQUEST_ASSIGNED_TO_ID = "request-assigned-oc"


	String g_requestName = ""

	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */

	@Given("requester has logged in")
	def requester_login() {
		login(GlobalVariable.OCWA_USER_RESEARCHER, GlobalVariable.OCWA_USER_RESEARCHER_PSWD, GlobalVariable.OCWA_URL)
	}

	@Given("output checker has logged in")
	def checker_login() {
		login(GlobalVariable.OCWA_USER_CHECKER1, GlobalVariable.OCWA_USER_CHECKER1_PSWD, GlobalVariable.OCWA_URL)
	}
	@Given("an unclaimed request exists")
	def checker_unclaimed_request_exists() {
		requester_login()
		requester_has_submitted_a_request()
	}
	@When("output checker tries to claim an unclaimed request")
	def checker_tries_to_claim_unclaimed_request() {
		WebUI.waitForPageLoad(30)
		// TODO: Un-hard code this string mess
		WebUI.click(get_test_object_by_id("oc-dashboard-filters-select"))

		String desiredString = "Show All Requests"
		TestObject desiredOption = new TestObject(desiredString)
		desiredOption.addProperty("text", ConditionType.EQUALS, desiredString, true)
		WebUI.waitForElementPresent(desiredOption, 10)
		WebUI.scrollToElement(desiredOption, 10)
		WebUI.click(desiredOption)

		TestObject linkToRequest = get_test_object_by_text(g_requestName)
		WebUI.waitForElementVisible(linkToRequest, 20)
		WebUI.waitForElementClickable(linkToRequest, 20)

		WebUI.click(linkToRequest)
		WebUI.comment("found and clicked the request link")
		WebUI.waitForPageLoad(20)
		WebUI.comment("should be on the individual request page.")

		TestObject assignToMeButtonObject = get_test_object_by_id(ASSIGN_REQUEST_TO_ME_ID)

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
		TestObject assigneeTextObject = get_test_object_by_id(REQUEST_ASSIGNED_TO_ID)
		WebUI.waitForElementPresent(assigneeTextObject, 10)
		WebUI.verifyTextPresent(GlobalVariable.OCWA_USER_CHECKER1, false)
		WebUI.closeBrowser()
	}

	@Then("the output checker should see the status of the request updated to '(.+)'")
	def checker_should_see_request_is_in_given_status(String status){
		//placeholder until status is displayed on individual requests in the oc interface
	}
	@Then("the approved files are available for download outside of the secure environment")
	def requester_should_see_files_available_for_download() {
		download_interface_login(GlobalVariable.OCWA_USER_RESEARCHER, GlobalVariable.OCWA_USER_RESEARCHER_PSWD)
		WebUI.waitForPageLoad(10)
		WebUI.verifyTextPresent(g_requestName, false)
	}

	def login(String username, String password, String url){
		WebUI.openBrowser(null)
		WebUI.navigateToUrl(url)
		WebUI.waitForPageLoad(10)

		TestObject loginButton = get_test_object_by_id(LOGIN_BTN_ID)
		WebUI.waitForElementClickable(loginButton, 10)
		WebUI.click(loginButton)
		WebUI.waitForPageLoad(10)

		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Username or email_userna'), username)
		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_password'), password)
		WebUI.click(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_login'))
		WebUI.waitForPageLoad(30)
	}

	def download_interface_login(String username, String password){
		login(username, password, GlobalVariable.OCWA_DL_URL)
	}

	@Given("requester has started a request")
	def requester_starts_new_request() {
		TestObject newRequestButtonObject = get_test_object_by_id(NEW_REQUEST_BTN_ID)

		WebUI.waitForPageLoad(10)
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
		WebUI.delay(3)

		if (secondFile != "") {
			WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", 10)
			WebUI.waitForElementClickable(uploadFileButton, 30)
			WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$secondFile")
			WebUI.delay(3)
		}

		if (thirdFile != "") {
			WebUI.waitForElementNotHasAttribute(uploadFileButton, "disabled", 10)
			WebUI.waitForElementClickable(uploadFileButton, 30)
			WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$thirdFile")
			WebUI.delay(3)
		}
	}

	@Given("requester adds (.+) output file that does not violate any blocking or warning rules")
	def requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules(String numOutputFilesToUpload){
		if (numOutputFilesToUpload == "2") { //add 2 valid output files
			requester_uploads_files(GlobalVariable.ValidFileName, false, GlobalVariable.ValidFileName2)
		}
		else { //add 1 valid output file
			requester_uploads_files(GlobalVariable.ValidFileName, false)
			//requester_uploads_files(GlobalVariable.BlockedStudyIDFileName, false) //temporary stop gap
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
			case "a request has a file with a studyid in it":
				requester_uploads_files(GlobalVariable.BlockedStudyIDFileName)
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
		WebUI.delay(3)
		TestObject saveCloseBtn = findTestObject('Object Repository/Page_OCWA Development Version/button_save_close_request')
		WebUI.waitForElementNotHasAttribute(saveCloseBtn, "disabled", 10)
		WebUI.waitForElementVisible(saveCloseBtn, 10)
		WebUI.waitForElementClickable(saveCloseBtn, 10)
		WebUI.click(saveCloseBtn)
		WebUI.waitForElementNotPresent(saveCloseBtn, 10) //wait for the modal window to close
	}

	@When("requester submits their request")
	def requester_submits_request() {
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/Page_OCWA Development Version/button_save_request'), "disabled", 10)
		WebUI.waitForElementNotHasAttribute(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), "disabled", 10)
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), 10)
		WebUI.delay(3) // Stopgap related to https://github.com/bcgov/OCWA/issues/89
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'))
		if(!WebUI.waitForElementNotPresent(findTestObject('Object Repository/Page_OCWA Development Version/button_save_request'), 10)) {
			throw new com.kms.katalon.core.exception.StepFailedException("Submission failed - modal window still present")
		}
	}

	@When("requester writes and submits a new comment")
	def requester_creates_a_new_comment(){
		requester_views_request_they_created()
		WebUI.waitForElementPresent(findTestObject('Object Repository/Page_OCWA Development Version/a_request_discussion_tab'), 10)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_request_discussion_tab'))
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/div_discussion_form'))

		WebUI.waitForElementPresent(findTestObject('Object Repository/Page_OCWA Development Version/div_discussion_form_contenteditable'), 10)
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_save_comment'), 10)
		WebUI.sendKeys(findTestObject('Object Repository/Page_OCWA Development Version/div_discussion_form_contenteditable'), TEST_COMMENT)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_save_comment'))
	}

	@When("the requester views the request")
	def requester_views_request_they_created(){
		if (WebUI.getUrl() != GlobalVariable.OCWA_URL) {
			WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		}
		WebUI.waitForPageLoad(10)
		TestObject searchBox = get_test_object_by_id(SEARCH_BOX_ID)
		WebUI.waitForElementClickable(searchBox, 10, FailureHandling.STOP_ON_FAILURE)
		WebUI.setText(searchBox, g_requestName)
		WebUI.sendKeys(searchBox, Keys.chord(Keys.ENTER))

		WebUI.delay(3) // TODO: Resolve searching delay with proper element check
		TestObject linkToRequest = get_test_object_by_text(g_requestName)
		WebUI.waitForElementNotHasAttribute(linkToRequest, "disabled", 10)
		WebUI.waitForElementClickable(linkToRequest, 10)

		WebUI.click(linkToRequest)
		WebUI.waitForPageLoad(10)
	}

	@When("the requester cancels the request")
	def requester_cancels_request(){
		requester_views_request_they_created()
		WebUI.click(get_test_object_by_id(REQUEST_CANCEL_BTN_ID))
	}

	@When("the requester withdraws the request")
	def requester_withdraws_request(){
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForElementClickable(get_test_object_by_id(REQUEST_WITHDRAW_BTN_ID), 10)
		WebUI.click(get_test_object_by_id(REQUEST_WITHDRAW_BTN_ID))
		WebUI.acceptAlert()

		// Click Add Files button
		TestObject requestFormSaveFilesButton = get_test_object_by_id(REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 10)
		WebUI.click(requestFormSaveFilesButton)
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
		WebUI.waitForPageLoad(10)
		WebUI.comment("current page (should be main page): ${WebUI.getUrl()}")
		TestObject searchBox = get_test_object_by_id(SEARCH_BOX_ID)
		WebUI.waitForElementClickable(searchBox, 10, FailureHandling.STOP_ON_FAILURE)
		WebUI.setText(searchBox, g_requestName)
		WebUI.sendKeys(searchBox, Keys.chord(Keys.ENTER))

		TestObject linkToRequest = get_test_object_by_text(g_requestName)
		WebUI.waitForElementPresent(linkToRequest, 10)
		if (!WebUI.verifyTextPresent(g_requestName, false)) {
			WebUI.comment("unable to find the text:$g_requestName on the page. This text is used to find the request link")
		}

		WebUI.waitForElementNotHasAttribute(linkToRequest, "disabled", 10)
		WebUI.waitForElementVisible(linkToRequest, 10)
		WebUI.waitForElementClickable(linkToRequest, 10)
		WebUI.delay(1) // Need to wait for the loading wheel to disappear
		WebUI.click(linkToRequest)
		WebUI.comment("clicked on the request link that contains text: $g_requestName")

		WebUI.waitForPageLoad(20)
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")

		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.delay(3) // we need to do a hard delay here to give time for the inline ajax to finish

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

	@Then("the requester should see the complete record of the request including export files, supporting content, discussion, and status changes")
	def submitted_request_info_matches_what_was_submitted(){
		WebUI.delay(3)
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForPageLoad(10)
		WebUI.verifyTextPresent(GlobalVariable.ValidFileName, false)
		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.verifyTextPresent(PURPOSE_TEXT, false)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_request_discussion_tab'))
		requester_should_see_their_new_comment_displayed()
		WebUI.closeBrowser()
	}

	@Then('the request status is changed to "(.+)"')
	def request_should_be_in_given_status(String statusTxt){
		requester_views_request_they_created()
		WebUI.delay(3)
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.waitForPageLoad(10)
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
		WebUI.comment("current page (should be request page): ${WebUI.getUrl()}")
		WebUI.click(get_test_object_by_id(REQUEST_EDIT_BTN_ID))
		WebUI.setText(get_test_object_by_id(REQUEST_PURPOSE_TXT_ID), EDITED_PURPOSE_TEXT)

		// Click Add Files button
		TestObject requestFormSaveFilesButton = get_test_object_by_id(REQUEST_SAVE_FILES_BTN_ID)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 10)
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
		if(!rule.equals("The summation of all output file sizes exceeds the request file size limit")) {
			WebUI.comment("checking that file was successfully blocked")
			WebUI.waitForElementPresent(get_test_object_by_class(ERROR_FILE_ICON), 10)
			WebUI.verifyElementPresent(get_test_object_by_class(ERROR_FILE_ICON), 10)
		}
	}

	@Then("requester should be informed that given warning rule (.+) has been violated")
	def request_should_be_informed_of_warning_rule_violation(String rule){
		WebUI.comment("checking that file successfully triggered warning")
		WebUI.waitForElementPresent(get_test_object_by_class(WARNING_FILE_ICON), 10)
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
		WebUI.waitForElementClickable(submitBtn, 10)
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
		tObject.addProperty("tag", ConditionType.EQUALS, "a", true)
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