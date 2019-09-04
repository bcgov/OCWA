package test.ocwa.features
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

import test.ocwa.common.Constant
import test.ocwa.common.Step
import test.ocwa.common.Utils

class ReportStep extends Step {
	
	@When("operational manager views the request in the reporting interface")
	def view_request_milestones() {
		//find the request in the reporting interface UI
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		TestObject linkToRequest = Utils.getTestObjectByText(G_REQUESTNAME)
		WebUI.waitForElementPresent(linkToRequest, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementNotHasAttribute(linkToRequest, "disabled", Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementVisible(linkToRequest, Constant.DEFAULT_TIMEOUT)
		WebUI.waitForElementClickable(linkToRequest, Constant.DEFAULT_TIMEOUT)
		WebUI.click(linkToRequest)
	}

	@Then("the approved request should have a milestones for each status change")
	def check_milestones_present() {
		WebUI.waitForPageLoad(Constant.DEFAULT_TIMEOUT)
		
		//check that all status changes are present (assume it's an approved request)
		TestObject statusObj = Utils.getTestObjectByIdPart(Constant.Status.REPORTS_UI_REQUEST_STATUS_ID_PART, 'div')
		String statusTxt = Constant.Status.APPROVED
		WebUI.waitForElementPresent(statusObj, Constant.DEFAULT_TIMEOUT)
		String actualStatusTxt = WebUI.getText(statusObj)
		if (!actualStatusTxt.equals(statusTxt)) {
			WebUI.takeScreenshot()
			WebUI.comment("Request status is in unexpected state.  Expected: $statusTxt  Actual: $actualStatusTxt")
			KeywordUtil.markFailed('Failing scenario because request is unexpected state.')
		}
		//check that the variable description field is populated
		String varDesc = WebUI.getText(Utils.getTestObjectById(Constant.Reports.REPORTS_VARIABLE_TXT_ID))
		String expectedVariableDesc = Constant.Requester.REQUEST_VARIABLE_TEXT
		if (!varDesc.equals(expectedVariableDesc )) {
			WebUI.takeScreenshot()
			WebUI.comment("Request variable description is unexpected value.  Expected: $expectedVariableDesc   Actual: $varDesc")
			KeywordUtil.markFailed('Failing scenario because request has unexpected value.')
		}
		//check the status changes
		//id is on the div
		//check if each state change is present
		WebUI.comment('checking the request chronology')
		WebUI.verifyElementPresent(Utils.getTestObjectById(Constant.Reports.REQUEST_CHRONOLOGY_ID_PREFIX + Constant.Reports.REQUEST_CHRONOLOGY_DRAFT_STATE_NUMBER), Constant.DEFAULT_TIMEOUT)
		WebUI.verifyElementPresent(Utils.getTestObjectById(Constant.Reports.REQUEST_CHRONOLOGY_ID_PREFIX + Constant.Reports.REQUEST_CHRONOLOGY_WIP_STATE_NUMBER), Constant.DEFAULT_TIMEOUT)
		WebUI.verifyElementPresent(Utils.getTestObjectById(Constant.Reports.REQUEST_CHRONOLOGY_ID_PREFIX + Constant.Reports.REQUEST_CHRONOLOGY_AWAITING_REVIEW_STATE_NUMBER), Constant.DEFAULT_TIMEOUT)
		WebUI.verifyElementPresent(Utils.getTestObjectById(Constant.Reports.REQUEST_CHRONOLOGY_ID_PREFIX + Constant.Reports.REQUEST_CHRONOLOGY_IN_REVIEW_STATE_NUMBER), Constant.DEFAULT_TIMEOUT)
		WebUI.verifyElementPresent(Utils.getTestObjectById(Constant.Reports.REQUEST_CHRONOLOGY_ID_PREFIX + Constant.Reports.REQUEST_CHRONOLOGY_APPROVED_STATE_NUMBER), Constant.DEFAULT_TIMEOUT)
	}
}