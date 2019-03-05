package internal

import com.kms.katalon.core.configuration.RunConfiguration
import com.kms.katalon.core.main.TestCaseMain


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
     
    /**
     * <p></p>
     */
    public static Object OCWA_DL_URL
     

    static {
        try {
            def selectedVariables = TestCaseMain.getGlobalVariables("default")
			selectedVariables += TestCaseMain.getGlobalVariables(RunConfiguration.getExecutionProfile())
            selectedVariables += RunConfiguration.getOverridingParameters()
    
            OCWA_URL = selectedVariables['OCWA_URL']
            OCWA_USER_RESEARCHER = selectedVariables['OCWA_USER_RESEARCHER']
            OCWA_USER_RESEARCHER_PSWD = selectedVariables['OCWA_USER_RESEARCHER_PSWD']
            TestFilePath = selectedVariables['TestFilePath']
            ValidFileName = selectedVariables['ValidFileName']
            WarningExtensionFileName = selectedVariables['WarningExtensionFileName']
            BlockedExtensionFileName = selectedVariables['BlockedExtensionFileName']
            MinSizeLimitFileName = selectedVariables['MinSizeLimitFileName']
            WarningMaxSizeLimitFileName = selectedVariables['WarningMaxSizeLimitFileName']
            BlockedMaxSizeLimitFileName = selectedVariables['BlockedMaxSizeLimitFileName']
            BlockedStudyIDFileName = selectedVariables['BlockedStudyIDFileName']
            ValidFileName2 = selectedVariables['ValidFileName2']
            SupportingFileName = selectedVariables['SupportingFileName']
            SupportingFileName2 = selectedVariables['SupportingFileName2']
            OCWA_USER_TEAM_MEMBER = selectedVariables['OCWA_USER_TEAM_MEMBER']
            OCWA_USER_TEAM_MEMBER_PSWD = selectedVariables['OCWA_USER_TEAM_MEMBER_PSWD']
            ValidFileName3 = selectedVariables['ValidFileName3']
            OCWA_USER_CHECKER1 = selectedVariables['OCWA_USER_CHECKER1']
            OCWA_USER_CHECKER1_PSWD = selectedVariables['OCWA_USER_CHECKER1_PSWD']
            OCWA_DL_URL = selectedVariables['OCWA_DL_URL']
            
        } catch (Exception e) {
            TestCaseMain.logGlobalVariableError(e)
        }
    }
}
