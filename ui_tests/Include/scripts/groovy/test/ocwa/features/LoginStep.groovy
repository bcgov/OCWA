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
 * OCWA Login steps for Katalon
 * @author Jeremy Ho, Paul Ripley
 */
public class LoginStep extends Step {
	@Given("(.+) has logged in")
	def user_login(String user) {
		def username = ''
		def password = ''

		switch (user.toLowerCase()) {
			case 'requester':
				username = GlobalVariable.OCWA_USER_RESEARCHER
				password = GlobalVariable.OCWA_USER_RESEARCHER_PSWD
				break
			case 'team member':
				username = GlobalVariable.OCWA_USER_TEAM_MEMBER
				password = GlobalVariable.OCWA_USER_TEAM_MEMBER_PSWD
				break
			case 'output checker':
				username = GlobalVariable.OCWA_USER_CHECKER1
				password = GlobalVariable.OCWA_USER_CHECKER1_PSWD
				break
			default:
				throw new Exception("User ${user} is not defined")
				break
		}

		login(username, password)
	}

	@Given("requester has logged into download interface")
	def download_interface_login() {
		login(GlobalVariable.OCWA_USER_RESEARCHER, GlobalVariable.OCWA_USER_RESEARCHER_PSWD, GlobalVariable.OCWA_DL_URL)
	}

	/**
	 * Logs a user into the system with the specified parameters
	 * @param username String 
	 * @param password String (unencoded)
	 * @param url String of login page endpoint. Defaults to OCWA_URL global variable.
	 */
	def login(String username, String password, String url = GlobalVariable.OCWA_URL) {
		WebUI.openBrowser(null)
		WebUI.navigateToUrl(url)
		WebUI.waitForPageLoad(10)

		TestObject loginButton = Utils.getTestObjectById(Constant.Login.LOGIN_BTN_ID)
		WebUI.waitForElementClickable(loginButton, 10)
		WebUI.click(loginButton)
		WebUI.waitForPageLoad(10)

		TestObject kcLoginButton = Utils.getTestObjectById('kc-login')
		WebUI.setText(Utils.getTestObjectById('username'), username)
		WebUI.setText(Utils.getTestObjectById('password'), password)
		WebUI.waitForElementClickable(kcLoginButton, 10)
		WebUI.click(kcLoginButton)
		WebUI.waitForPageLoad(10)
	}
	
	/**
	 * Logs a user out of the system with the specified parameters
	 * @param url String of login page endpoint. Defaults to OCWA_URL global variable.
	 */
	def logout(String url = GlobalVariable.OCWA_URL) {
		WebUI.navigateToUrl("$url$Constant.Login.LOGOUT_URL")
		WebUI.waitForPageLoad(10)
	}
}
