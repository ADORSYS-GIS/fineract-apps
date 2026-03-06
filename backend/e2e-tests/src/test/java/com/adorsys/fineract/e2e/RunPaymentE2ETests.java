package com.adorsys.fineract.e2e;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.*;

/**
 * Entry point for running payment-gateway-service E2E Cucumber tests.
 *
 * <p>Run with: {@code mvn test -Pe2e-payment} or {@code mvn test -Pe2e}
 */
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features/payment")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME,
        value = "com.adorsys.fineract.e2e.payment")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME,
        value = "pretty,html:target/cucumber-reports/payment-cucumber.html,"
                + "json:target/cucumber-reports/payment-cucumber.json")
@ConfigurationParameter(key = JUNIT_PLATFORM_NAMING_STRATEGY_PROPERTY_NAME,
        value = "long")
public class RunPaymentE2ETests {
}
