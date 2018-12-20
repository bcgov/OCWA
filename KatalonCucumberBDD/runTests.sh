echo "Starting tests"

katalon -noSplash  -runMode=console -projectPath="/home/travis/build/bcgov/OCWA/KatalonCucumberBDD/KatalonCucumber.prj" -retry=0 -testSuitePath="Test Suites/TestSuite1" -executionProfile="default" -browserType="Chrome (headless)"