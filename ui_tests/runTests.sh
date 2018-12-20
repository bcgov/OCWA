echo "Starting tests"

katalon -noSplash  -runMode=console -projectPath="/home/travis/build/bcgov/OCWA/ui_tests/OCWA.prj" -retry=0 -testSuitePath="Test Suites/TestSuite1" -executionProfile="Travis" -browserType="Chrome (headless)"