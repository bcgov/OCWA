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
     

    static {
        def allVariables = [:]        
        allVariables.put('default', ['OCWA_URL' : 'http://ocwa-cddi-dlt-dev.pathfinder.gov.bc.ca'])
        allVariables.put('Travis', allVariables['default'] + ['OCWA_URL' : 'http://localhost:8000'])
        
        String profileName = RunConfiguration.getExecutionProfile()
        
        def selectedVariables = allVariables[profileName]
        OCWA_URL = selectedVariables['OCWA_URL']
        
    }
}
