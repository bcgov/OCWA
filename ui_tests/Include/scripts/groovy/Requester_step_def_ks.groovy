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
	String request_name = ''
	TestObject newRequestButtonObject = null
	TestObject requestFormSaveCloseButtonObject = null

	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("requester has logged in")
	def requester_login() {
		WebUI.openBrowser('')
		WebUI.delay(5)

		WebUI.navigateToUrl(GlobalVariable.OCWA_URL)
		//WebUI.navigateToUrl("http://localhost:8000")
		TestObject loginButton = new TestObject("app-auth-login-button")
		loginButton.addProperty("id", ConditionType.EQUALS, "app-auth-login-button", true)
		WebUI.waitForElementClickable(loginButton, 30)
		WebUI.click(loginButton)

		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Username or email_userna'), 'pripley')

		WebUI.setEncryptedText(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_password'), 'EUKVYWz2orI=')

		WebUI.click(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_login'))
	}

	@Given("requester has started a request")
	def requester_starts_new_request() {

		newRequestButtonObject = new TestObject("new-request-button")
		newRequestButtonObject.addProperty("id", ConditionType.EQUALS, "new-request-button", true)

		WebUI.waitForPageLoad(30)
		WebUI.delay(5)

		WebUI.waitForElementClickable(newRequestButtonObject, 30)
		WebUI.click(newRequestButtonObject)
		request_name = CustomKeywords.'test_OCWA_keywords.random_test_request_name.gen_random_test_request_name'()
		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/input_Request Name_name'), request_name)
		WebUI.delay(2)
	}

	@Given("has not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	@Given("requester add output files to the request")
	def requester_adds_output_files() {

		TestObject requestFormSaveFilesButton = new TestObject("request-form-save-files-button")
		requestFormSaveFilesButton.addProperty("id", ConditionType.EQUALS, "request-form-save-files-button", true)
		WebUI.waitForElementClickable(requestFormSaveFilesButton, 30)
		WebUI.click(requestFormSaveFilesButton)
		TestObject uploadFileButton = new TestObject("fileUploadButton")
		uploadFileButton.addProperty("id", ConditionType.EQUALS, "file-uploader-input", true)
		WebUI.sendKeys(uploadFileButton, GlobalVariable.TestFile1Path.toString())

		WebUI.delay(5)

	}

	@Given("the output files do not violate any blocking rules")
	def output_files_do_not_violate_blocking_rules(){}

	@Given("the requester affirms the output is safe for release and protects the confidentiality of data, to the best of their knowledge")
	def requester_affirms_output_is_safe() {
	}

	@Given("the requester has submitted a request")
	def request_has_submitted_a_request(){
		requester_starts_new_request()
		requester_adds_output_files()
		requester_submits_request()
	}

	@Given("the request has been claimed by an output checker")
	def request_has_been_claimed_by_a_oc(){}

	@When("the requester saves their request")
	def requester_saves_new_request() {
		requestFormSaveCloseButtonObject = new TestObject("request-form-save-close-button")
		requestFormSaveCloseButtonObject.addProperty("id", ConditionType.EQUALS, "request-form-save-close-button", true)
		WebUI.click(requestFormSaveCloseButtonObject)
	}

	@When("requester submits their request")
	def requester_submits_request() {
		TestObject requestFormSaveButtonObject = new TestObject("request-form-save-close-button")
		requestFormSaveButtonObject.addProperty("id", ConditionType.EQUALS, "request-form-save-button", true)
		WebUI.click(requestFormSaveButtonObject)
		WebUI.delay(5)
		WebUI.waitForElementClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), 30)
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'))
		WebUI.delay(3)
	}

	@When("requester writes and submits a new comment")
	def requester_creates_a_new_comment(){
		WebUI.navigateToUrl(GlobalVariable.OCWA_URL + "/requests/" + request_name)

		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/a_Discussion'))

		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Save (1)'))

		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/div_'), '<p><span>﻿</span><br></p>')
	}

	@When("the requester views the request")
	def requester_views_request_they_created(){
		WebUI.navigateToUrl(GlobalVariable.OCWA_URL + "/requests/" + request_name)
	}

	@Then("the requester should be able to re-open the request and pick up where they left off")
	def confirm_draft_save_was_successful() {
		WebUI.waitForPageLoad(20)
		WebUI.verifyTextPresent(request_name, false)
		WebUI.closeBrowser()
	}

	@Then("the requester's request is put in awaiting review")
	def confirm_request_is_in_awaiting_review_state(){
		WebUI.verifyTextPresent("Awaiting review", false)
		WebUI.closeBrowser()
	}

	@Then("the requester should not be able to submit the request")
	def requester_is_not_able_to_submit_request(){
		WebUI.verifyElementNotClickable(findTestObject('Object Repository/Page_OCWA Development Version/span_Submit for Review'), FailureHandling.STOP_ON_FAILURE)
		WebUI.closeBrowser()
	}

	@Then("the requester should see the complete record of the request including export files, supporting files/text, discussion, and status changes")
	def submitted_request_info_matches_what_was_submitted(){
		WebUI.delay(5)
		WebUI.closeBrowser()
	}
}