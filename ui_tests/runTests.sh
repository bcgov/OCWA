echo "Starting tests"

katalon -noSplash  -runMode=console -projectPath="/home/travis/build/bcgov/OCWA/ui_tests/OCWA.prj" -retry=0 -testSuitePath="Test Suites/CucumberSuites" -executionProfile="Travis" -browserType="Chrome (headless)"