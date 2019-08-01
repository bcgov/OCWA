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
import test.ocwa.common.Step
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

/**
 * OCWA State steps for Katalon
 * Purpose is abstract request state to assist in writing test cases e.g., Given I have a request in state X (without having to write out all the steps every time to get a request to state X)
 * @author Paul Ripley
 */
public class StateStep extends Step {	
	@Delegate RequesterStep rs
	@Delegate CheckerStep cs
	@Delegate LoginStep ls
	
	public StateStep() {
		rs = new RequesterStep()
		cs = new CheckerStep()
		ls = new LoginStep()
	}
	
	
	@Given('requester has a request of status "(.+)"')
	def requester_has_a_request_of_status(String status) {
		rs.requester_starts_new_request()
		rs.requester_adds_output_file_that_does_not_violate_blocking_or_warning_rules("1")

		switch (status.toLowerCase()) {
			case "draft":
				rs.requester_saves_new_request()
				WebUI.verifyTextPresent(Constant.Status.WORK_IN_PROGRESS, false) //the draft state has evolved a bit; this is effectively a scenario where a request has not been submitted yet
				break
			case "awaiting review":
				rs.requester_submits_request()
				WebUI.verifyTextPresent(Constant.Status.AWAITING_REVIEW, false)
				break
			case "review in progress":
				rs.requester_submits_request()
				ls.user_login('output checker')
				cs.checker_tries_to_claim_unclaimed_request()
				WebUI.verifyTextPresent(Constant.Status.IN_REVIEW, false)
				break
			case "work in progress":
				rs.requester_submits_request()
				ls.user_login('output checker')
				cs.checker_tries_to_claim_unclaimed_request()
				cs.checker_marks_request_as_needs_revisions()
			//alternative path to WIP we are not doing here is requester has submitted and withdrawn. 
				WebUI.verifyTextPresent(Constant.Status.WORK_IN_PROGRESS, false)
				break
			case "cancelled":
				rs.requester_submits_request()
				rs.requester_cancels_request()
				WebUI.verifyTextPresent(Constant.Status.CANCELLED, false)
				break
			case "approved":
				rs.requester_submits_request()
				ls.user_login('output checker')
				cs.checker_tries_to_claim_unclaimed_request()
				cs.checker_marks_request_as_approved()
				WebUI.verifyTextPresent(Constant.Status.APPROVED, false)
				break
			default:
				throw new Exception("status $status not found")
				break
		}
	}

}