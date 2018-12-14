echo "Starting tests"

katalon -noSplash  -runMode=console -projectPath="/home/travis/build/bcgov/OCWA/ui-tests/OCWA.prj" -retry=0 -testSuitePath="Test Suites/TestingTestSuite" -executionProfile="Travis" -browserType="Chrome (headless)"