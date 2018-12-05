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


class Cucumber_requester {
	String request_name = ''

	/**
	 * The step definitions below match with Katalon sample Gherkin steps
	 */
	@Given("requester has logged in")
	def requester_login() {
		WebUI.openBrowser('')

		WebUI.navigateToUrl('http://ocwa-cddi-dlt-dev.pathfinder.gov.bc.ca/')

		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Login'))

		WebUI.setText(findTestObject('Object Repository/Page_Log in to ocwa/input_Username or email_userna'), 'pripley')

		WebUI.setEncryptedText(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_password'), 'EUKVYWz2orI=')

		WebUI.click(findTestObject('Object Repository/Page_Log in to ocwa/input_Password_login'))
	}

	@Given("requester has started a request")
	def requester_starts_new_request() {
		//WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_New Request'))
		//WebUI.click(findTestObject('new-request-button'))
		//WebUI.click(findTestObject('id("new-request-button")/span[1]/span[2]'))
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_New Request_1'))
		request_name = CustomKeywords.'test_OCWA_keywords.random_test_request_name.gen_random_test_request_name'()
		WebUI.setText(findTestObject('Object Repository/Page_OCWA Development Version/input_Request Name_name'), request_name)
	}

	@Given("has not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	@When("the requester saves their request")
	def requester_saves_new_request() {
		WebUI.click(findTestObject('Object Repository/Page_OCWA Development Version/span_Save  Close'))
	}

	@Then("the requester should be able to re-open the request and pick up where they left off")
	def confirm_draft_save_was_successful() {
		WebUI.verifyTextPresent(request_name, false)
	}
}