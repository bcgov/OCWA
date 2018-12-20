package com.ea.steps


import org.junit.runner.RunWith;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;



@RunWith(Cucumber.class)
@CucumberOptions(features="KatalonCucumberBDD/Include/features", glue="", plugin=["pretty", "html:ReportFolder", "json:ReportFolder/cucumber.json"])
public class CucumberEARunner {
}
