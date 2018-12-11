import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords
import com.kms.katalon.core.webui.driver.DriverFactory as DriverFactory
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable

import org.openqa.selenium.firefox.FirefoxDriver
import org.openqa.selenium.WebDriver
import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium

import cucumber.api.java.en.Given
import cucumber.api.java.en.Then
import cucumber.api.java.en.When

import static org.junit.Assert.*
import java.util.regex.Pattern
import static org.apache.commons.lang3.StringUtils.join



public class Requester_step_def_kr {

	WebDriverBackedSelenium selenium
	String request_name

	@Given("yrequester has logged in")
	def requester_login() {

		WebUI.openBrowser('')
		def driver = DriverFactory.getWebDriver()
		String baseUrl = GlobalVariable.OCWA_URL
		selenium = new WebDriverBackedSelenium(driver, baseUrl)
		selenium.open(GlobalVariable.OCWA_URL)
		selenium.click("id=app-auth-login-button")
		selenium.type("id=username", "xxx")
		selenium.type("id=password", "xxx")
		selenium.click("id=kc-login")
	}

	@Given("yrequester has started a request")
	def requester_starts_new_request() {
		WebUI.waitForPageLoad(0)
		selenium.click("id=new-request-button")

		request_name = randomString()
		selenium.type("id=name", request_name)
	}

	@Given("ythe requester has submitted a request")
	def requester_submits_a_request() {
		requester_starts_new_request()
		//requester saves and add files
		//requester adds output files
		//requester adds supporting files
		//requester add supporting text
		//requester submits request for review
	}

	@Given("yrequester add output files to the request")
	def requester_adds_output_files() {
		// selenium.click("id=request-form-save-files-button")
		// selenium.attachFile("id=fileupload", "C:\\Users\\PaulR\\Documents\\2 - Metadata\\HAS project\\hospital_visits_bc_2017.csv")
	}


	@Given("yhas not submitted the request")
	def requester_has_not_submitted_new_request() {
	}

	@When("ythe requester saves their request")
	def requester_saves_new_request() {
		selenium.click("id=request-form-save-close-button")
	}

	@Then("ythe requester should be able to re-open the request and pick up where they left off")
	def confirm_draft_save_was_successful() {
		WebUI.waitForPageLoad(0)
		WebUI.verifyTextPresent(request_name, false)
	}

	def randomString() {
		Date today = new Date()
		String todaysDate = today.format('MMddyy-hhmm')
		String engagementName = 'auto_eng ' + todaysDate
		return engagementName
	}
}
