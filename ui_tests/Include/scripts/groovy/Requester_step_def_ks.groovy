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
	final String TEST_COMMENT = "test"
	final String PURPOSE_TEXT = "The purpose of my project is X"
	final String EDITED_PURPOSE_TEXT = "Edited the purpose to be Y"
	final String REQUEST_PATH = "/requests/"
	final String LOGIN_BTN_ID = "app-auth-login-button"
	final String LOGIN_USERNAME = "pripley"
	final String LOGIN_PWD = "EUKVYWz2orI="
	final String NEW_REQUEST_BTN_ID = "new-request-button"
	final String REQUEST_SAVE_FILES_BTN_ID = "request-form-save-files-button"
	final String REQUEST_FILES_UPLOAD_BTN_ID = "file-uploader-input"
	final String REQUEST_SAVE_BTN_ID = "request-form-save-button"
	final String REQUEST_SAVE_CLOSE_BTN_ID = "request-form-save-close-button"
	final String REQUEST_EDIT_BTN_ID = "request-sidebar-edit-button"
	final String REQUEST_PURPOSE_TXT_ID = "purpose"
	final String REQUEST_WITHDRAW_BTN_ID = "request-sidebar-withdraw-button"
	final String REQUEST_CANCEL_BTN_ID = "request-sidebar-cancel-button"

	String g_requestName = ""
	TestObject g_newRequestButtonObject = null
	TestObject g_requestFormSaveCloseButtonObject = null
	String g_fileToUpload = "$GlobalVariable.TestFilePath$GlobalVariable.TestFile1Name"

	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("requester has logged in")
	def requester_login() {
		WebUI.openBrowser('')
		WebUI.delay(5)

		WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		//WebUI.navigateToUrl("http://localhost:8000")
		TestObject loginButton = new TestObject(LOGIN_BTN_ID)
		loginButton.addProperty("id", ConditionType.EQUALS, LOGIN_BTN_ID, true)
		WebUI.waitForElementClickable(loginButton, 30)
		WebUI.click(loginButton)

		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Username or email_userna'), LOGIN_USERNAME)

		WebUI.setEncryptedText(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_password'), LOGIN_PWD)

		WebUI.click(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_login'))
	}

	@Given("requester has started a request")
	def requester_starts_new_request() {

		g_newRequestButtonObject = new TestObject(NEW_REQUEST_BTN_ID)
		g_newRequestButtonObject.addProperty("id", ConditionType.EQUALS, NEW_REQUEST_BTN_ID, true)

		TestObject purposeTextbox = new TestObject(REQUEST_PURPOSE_TXT_ID)
		purposeTextbox.addProperty("id", ConditionType.EQUALS, REQUEST_PURPOSE_TXT_ID, true)

		WebUI.waitForPageLoad(30)
		WebUI.delay(5)

		WebUI.waitForElementClickable(g_newRequestButtonObject, 30)
		WebUI.click(g_newRequestButtonObject)
		g_requestName = CustomKeywords.'test_OCWA_keywords.random_test_request_name.gen_random_test_request_name'()
		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/input_Request Name_name'), g_requestName)

		WebUI.setText(purposeTextbox, PURPOSE_TEXT)
		WebUI.delay(2)
	}

	@Given("has not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	@Given("requester add output files to the request")
	def requester_adds_output_files() {

		TestObject requestFormSaveFilesButton = new TestObject(REQUEST_SAVE_FILES_BTN_ID)
		requestFormSaveFilesButton.addProperty("id", ConditionType.EQUALS, REQUEST_SAVE_FILES_BTN_ID, true)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 30)
		WebUI.click(requestFormSaveFilesButton)
		TestObject uploadFileButton = new TestObject(REQUEST_FILES_UPLOAD_BTN_ID)
		uploadFileButton.addProperty("id", ConditionType.EQUALS, REQUEST_FILES_UPLOAD_BTN_ID, true)
		WebUI.sendKeys(uploadFileButton, "$GlobalVariable.TestFilePath$GlobalVariable.TestFile1Name")

		WebUI.delay(5)
	}

	@Given("the output files do not violate any blocking rules")
	def output_files_do_not_violate_blocking_rules(){}

	@Given("request violates given warning rule (.+)")
	def request_violates_warning_rule(String warningRule){
		//		switch (warningRule.toLowerCase()) {
		//			case "":
		//
		//				break
		//		}
	}
	@Given("request violates given blocking rule (.+)")
	def request_violates_blocking_rule(String blockingRule){
		//		switch (blockingRule.toLowerCase()) {
		//			case "":
		//
		//				break
		//		}
	}

	@Given("the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge")
	def requester_affirms_output_is_safe() {
	}

	@Given("requester has submitted a request")
	def requester_has_submitted_a_request(){
		requester_starts_new_request()
		requester_adds_output_files()
		requester_submits_request()
	}

	@Given("request was last updated within the last month")
	def request_updated_within_last_month() {}

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
				requester_adds_output_files()
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

	@When("the requester saves their request")
	def requester_saves_new_request() {
		g_requestFormSaveCloseButtonObject = new TestObject(REQUEST_SAVE_CLOSE_BTN_ID)
		g_requestFormSaveCloseButtonObject.addProperty("id", ConditionType.EQUALS, REQUEST_SAVE_CLOSE_BTN_ID, true)
		WebUI.click(g_requestFormSaveCloseButtonObject)
	}

	@When("requester submits their request")
	def requester_submits_request() {
		TestObject requestFormSaveButtonObject = new TestObject(REQUEST_SAVE_BTN_ID)
		requestFormSaveButtonObject.addProperty("id", ConditionType.EQUALS, REQUEST_SAVE_BTN_ID, true)
		WebUI.click(requestFormSaveButtonObject)
		WebUI.delay(15)
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), 30)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'))
		WebUI.delay(3)
	}

	@When("requester writes and submits a new comment")
	def requester_creates_a_new_comment(){
		WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$REQUEST_PATH$g_requestName")
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_Discussion'))
		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/div_'), TEST_COMMENT)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Save (1)'))
	}

	@When("the requester views the request")
	def requester_views_request_they_created(){
		WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$REQUEST_PATH$g_requestName")
	}

	@When("the requester cancels the request")
	def requester_cancels_request(){
		WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$REQUEST_PATH$g_requestName")
		TestObject cancelButtonObject = new TestObject(REQUEST_CANCEL_BTN_ID)
		cancelButtonObject.addProperty("id", ConditionType.EQUALS, REQUEST_CANCEL_BTN_ID, true)
		WebUI.click(cancelButtonObject)
	}

	@When("the requester withdraws the request")
	def requester_withdraws_request(){
		WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$REQUEST_PATH$g_requestName")
		TestObject withdrawButtonObject = new TestObject(REQUEST_WITHDRAW_BTN_ID)
		withdrawButtonObject.addProperty("id", ConditionType.EQUALS, REQUEST_WITHDRAW_BTN_ID, true)
		WebUI.click(withdrawButtonObject)
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
			default: 
				throw new Exception("status $status not found")
				break
		}
	}


	@Then("the requester should be able to re-open the request and pick up where they left off")
	def confirm_draft_save_was_successful() {
		WebUI.waitForPageLoad(20)
		WebUI.delay(5)
		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.closeBrowser()
	}

	@Then("the requester should not be able to submit the request")
	def requester_is_not_able_to_submit_request(){
		WebUI.verifyElementNotClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), FailureHandling.STOP_ON_FAILURE)
		WebUI.closeBrowser()
	}

	@Then("the requester should be able to submit the request")
	def requester_is_able_to_submit_request(){
		WebUI.verifyElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), FailureHandling.STOP_ON_FAILURE)
		WebUI.closeBrowser()
	}

	@Then("the requester should see the complete record of the request including export files, supporting files/text, discussion, and status changes")
	def submitted_request_info_matches_what_was_submitted(){
		WebUI.verifyTextPresent(GlobalVariable.TestFile1Path.toString(), false)
		WebUI.verifyTextPresent(g_requestName, false)
		WebUI.verifyTextPresent(g_purpose, false)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_Discussion'))
		WebUI.delay(2)
		//WebUI.verifyTextPresent(TEST_COMMENT, false)
		requester_should_see_their_new_comment_displayed()
		WebUI.delay(5)
		WebUI.closeBrowser()
	}

	@Then('the request status is changed to "(.+)"')
	def request_should_be_in_given_status(String status){
		//WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$REQUEST_PATH$g_requestName")
		WebUI.verifyTextPresent(status, false)
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
		WebUI.navigateToUrl("$GlobalVariable.OCWA_URL$REQUEST_PATH$g_requestName")
		TestObject editButtonObject = new TestObject("edit-button")
		editButtonObject.addProperty("id", ConditionType.EQUALS, REQUEST_EDIT_BTN_ID, true)
		WebUI.click(editButtonObject)
		TestObject purposeTextbox = new TestObject(REQUEST_PURPOSE_TXT_ID)
		purposeTextbox.addProperty("id", ConditionType.EQUALS, REQUEST_PURPOSE_TXT_ID, true)
		WebUI.setText(purposeTextbox, EDITED_PURPOSE_TEXT)
	}
	@Then("requester should be able to re-submit the request")
	def requester_should_be_able_to_resubmit_request(){
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), 30)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'))
		WebUI.delay(5)
		request_should_be_in_given_status("Review in progress")
		WebUI.closeBrowser()
	}

	@Then("requester should be informed that given blocking rule (.+) has been violated")
	def request_should_be_informed_of_blocking_rule_violation(){
		//unclear how this is displayed in the UI
	}

	@Then("requester should be informed that given warning rule (.+) has been violated")
	def request_should_be_informed_of_warning_rule_violation(){
		//unclear how this is displayed in the UI
	}
}