import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint
import com.kms.katalon.core.cucumber.keyword.CucumberBuiltinKeywords as CucumberKW
import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile
import com.kms.katalon.core.model.FailureHandling as FailureHandling
import com.kms.katalon.core.testcase.TestCase as TestCase
import com.kms.katalon.core.testdata.TestData as TestData
import com.kms.katalon.core.testobject.TestObject as TestObject
import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable as GlobalVariable



//cucumberRunnerClass c = new MyCucumberRunner()

//CucumberRunnerResult c1 = 
CucumberKW.runWithCucumberRunner(MyCucumberRunner.class)


//CucumberKW.runFeatureFile('Include/features/requester/draft_requests.feature')
//CucumberKW.runFeatureFile('Include/features/requester/draft_requests.feature', FailureHandling.STOP_ON_FAILURE)
//CucumberRunnerResult c1 = CucumberKW.runFeatureFile('Include/features/requester/draft_requests.feature')
//CucumberKW.runFeatureFolder('Include/features/requester')
//println "Status" + c1.getStatus().toString()