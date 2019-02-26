package internal

import com.kms.katalon.core.configuration.RunConfiguration
import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository
import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory
import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory
import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject
import static com.kms.katalon.core.testdata.TestDataFactory.findTestData
import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase

/**
 * This class is generated automatically by Katalon Studio and should not be modified or deleted.
 */
public class GlobalVariable {
     
    /**
     * <p></p>
     */
    public static Object OCWA_URL
     
    /**
     * <p></p>
     */
    public static Object OCWA_USER_RESEARCHER
     
    /**
     * <p></p>
     */
    public static Object OCWA_USER_RESEARCHER_PSWD
     
    /**
     * <p></p>
     */
    public static Object TestFilePath
     
    /**
     * <p></p>
     */
    public static Object ValidFileName
     
    /**
     * <p></p>
     */
    public static Object WarningExtensionFileName
     
    /**
     * <p></p>
     */
    public static Object BlockedExtensionFileName
     
    /**
     * <p></p>
     */
    public static Object MinSizeLimitFileName
     
    /**
     * <p></p>
     */
    public static Object WarningMaxSizeLimitFileName
     
    /**
     * <p></p>
     */
    public static Object BlockedMaxSizeLimitFileName
     
    /**
     * <p></p>
     */
    public static Object BlockedStudyIDFileName
     
    /**
     * <p></p>
     */
    public static Object ValidFileName2
     
    /**
     * <p></p>
     */
    public static Object SupportingFileName
     
    /**
     * <p></p>
     */
    public static Object SupportingFileName2
     
    /**
     * <p></p>
     */
    public static Object OCWA_USER_TEAM_MEMBER
     
    /**
     * <p></p>
     */
    public static Object OCWA_USER_TEAM_MEMBER_PSWD
     
    /**
     * <p></p>
     */
    public static Object ValidFileName3
     
    /**
     * <p></p>
     */
    public static Object OCWA_USER_CHECKER1
     
    /**
     * <p></p>
     */
    public static Object OCWA_USER_CHECKER1_PSWD
     

    static {
        def allVariables = [:]        
        allVariables.put('default', ['OCWA_URL' : 'http://localhost:8000', 'OCWA_USER_RESEARCHER' : 'researcher_1', 'OCWA_USER_RESEARCHER_PSWD' : 'researcher_1_password', 'TestFilePath' : '/home/travis/build/bcgov/OCWA/ui_tests/test_files/', 'ValidFileName' : 'test_valid_file_upload.txt', 'WarningExtensionFileName' : 'test_warning_extension.csv', 'BlockedExtensionFileName' : 'test_blocked_file_extension.zip', 'MinSizeLimitFileName' : 'test_min_file_size_limit.txt', 'WarningMaxSizeLimitFileName' : 'test_warning_max_file_size_limit.txt', 'BlockedMaxSizeLimitFileName' : 'test_blocked_max_file_size_limit.txt', 'BlockedStudyIDFileName' : 'test_study_ids_in_file.txt', 'ValidFileName2' : 'test_valid_file_upload2.txt', 'SupportingFileName' : 'test_supporting_file.txt', 'SupportingFileName2' : 'test_supporting_file2.txt', 'OCWA_USER_TEAM_MEMBER' : 'groucho', 'OCWA_USER_TEAM_MEMBER_PSWD' : 'groucho1234', 'ValidFileName3' : 'test_valid_file_upload3.txt', 'OCWA_USER_CHECKER1' : 'ocuser_1', 'OCWA_USER_CHECKER1_PSWD' : 'ocuser_1_password'])
        allVariables.put('Travis', allVariables['default'] + ['OCWA_URL' : 'https://ocwa.example.demo', 'TestFilePath' : '/home/travis/build/bcgov/OCWA/ui_tests/test_files/'])
        allVariables.put('local', allVariables['default'] + ['OCWA_URL' : 'http://ocwa-cddi-dlt-test.pathfinder.gov.bc.ca/', 'TestFilePath' : 'C:\\\\\\\\Users\\\\PaulR\\\\\\\\Documents\\\\\\\\OCWA\\\\\\\\OCWA\\\\\\\\ui_tests\\\\\\\\test_files\\\\\\\\', 'OCWA_USER_RESEARCHER' : 'pripley', 'OCWA_USER_RESEARCHER_PSWD' : '2Strong', 'OCWA_USER_CHECKER1' : 'hodor', 'OCWA_USER_CHECKER1_PSWD' : 'hodor1234'])
        
        String profileName = RunConfiguration.getExecutionProfile()
        def selectedVariables = allVariables[profileName]
		
		for(object in selectedVariables){
			String overridingGlobalVariable = RunConfiguration.getOverridingGlobalVariable(object.key)
			if(overridingGlobalVariable != null){
				selectedVariables.put(object.key, overridingGlobalVariable)
			}
		}

        OCWA_URL = selectedVariables["OCWA_URL"]
        OCWA_USER_RESEARCHER = selectedVariables["OCWA_USER_RESEARCHER"]
        OCWA_USER_RESEARCHER_PSWD = selectedVariables["OCWA_USER_RESEARCHER_PSWD"]
        TestFilePath = selectedVariables["TestFilePath"]
        ValidFileName = selectedVariables["ValidFileName"]
        WarningExtensionFileName = selectedVariables["WarningExtensionFileName"]
        BlockedExtensionFileName = selectedVariables["BlockedExtensionFileName"]
        MinSizeLimitFileName = selectedVariables["MinSizeLimitFileName"]
        WarningMaxSizeLimitFileName = selectedVariables["WarningMaxSizeLimitFileName"]
        BlockedMaxSizeLimitFileName = selectedVariables["BlockedMaxSizeLimitFileName"]
        BlockedStudyIDFileName = selectedVariables["BlockedStudyIDFileName"]
        ValidFileName2 = selectedVariables["ValidFileName2"]
        SupportingFileName = selectedVariables["SupportingFileName"]
        SupportingFileName2 = selectedVariables["SupportingFileName2"]
        OCWA_USER_TEAM_MEMBER = selectedVariables["OCWA_USER_TEAM_MEMBER"]
        OCWA_USER_TEAM_MEMBER_PSWD = selectedVariables["OCWA_USER_TEAM_MEMBER_PSWD"]
        ValidFileName3 = selectedVariables["ValidFileName3"]
        OCWA_USER_CHECKER1 = selectedVariables["OCWA_USER_CHECKER1"]
        OCWA_USER_CHECKER1_PSWD = selectedVariables["OCWA_USER_CHECKER1_PSWD"]
        
    }
}
