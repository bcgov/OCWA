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
    public static Object TestFile1Path
     
    /**
     * <p></p>
     */
    public static Object TestFile2Path
     

    static {
        def allVariables = [:]        
        allVariables.put('default', ['OCWA_URL' : 'http://ocwa-cddi-dlt-dev.pathfinder.gov.bc.ca', 'TestFile1Path' : 'C:\\\\\\\\Users\\\\PaulR\\\\\\\\Documents\\\\\\\\2 - Metadata\\\\\\\\HAS project\\\\\\\\hospital_visits_bc_2017.csv', 'TestFile2Path' : 'C:\\\\\\\\Users\\\\PaulR\\\\\\\\Documents\\\\\\\\2 - Metadata\\\\\\\\HAS project\\\\\\\\sports_accidents_bc_2017.csv'])
        allVariables.put('Travis', allVariables['default'] + ['OCWA_URL' : 'http://localhost:8000', 'TestFile1Path' : '/home/travis/build/bcgov/OCWA/ui_tests/testfile1.csv', 'TestFile2Path' : '/home/travis/build/bcgov/OCWA/ui_tests/testfile2.csv'])
        
        String profileName = RunConfiguration.getExecutionProfile()
        
        def selectedVariables = allVariables[profileName]
        OCWA_URL = selectedVariables['OCWA_URL']
        TestFile1Path = selectedVariables['TestFile1Path']
        TestFile2Path = selectedVariables['TestFile2Path']
        
    }
}
