package com.adorsys.fineract.e2e;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.*;

/**
 * Entry point for running all E2E Cucumber tests.
 *
 * <p>Run with: {@code mvn test -Pe2e}
 */
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features/e2e")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME,
        value = "com.adorsys.fineract.e2e")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME,
        value = "pretty,html:target/cucumber-reports/cucumber.html,"
                + "json:target/cucumber-reports/cucumber.json")
@ConfigurationParameter(key = JUNIT_PLATFORM_NAMING_STRATEGY_PROPERTY_NAME,
        value = "long")
public class RunE2ETests {
}
