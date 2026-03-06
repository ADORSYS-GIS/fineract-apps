package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Then;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Common step definitions for HTTP response assertions used across all feature files.
 */
public class CommonSteps {

    @Autowired
    private E2EScenarioContext context;

    @Then("the response status should be {int}")
    public void responseStatusShouldBe(int expectedStatus) {
        assertThat(context.getStatusCode())
                .as("HTTP status code — body: %s", context.getBody())
                .isEqualTo(expectedStatus);
    }

    @Then("the response body should contain field {string} with value {string}")
    public void responseFieldShouldHaveValue(String field, String expectedValue) {
        String actual = JsonPath.read(context.getBody(), "$." + field).toString();
        assertThat(actual).isEqualTo(expectedValue);
    }

    @Then("the response body should contain {string}")
    public void responseBodyShouldContain(String expectedText) {
        assertThat(context.getBody()).contains(expectedText);
    }

    @Then("the response error code should be {string}")
    public void responseErrorCodeShouldBe(String expectedCode) {
        String code = JsonPath.read(context.getBody(), "$.code");
        assertThat(code).isEqualTo(expectedCode);
    }
}
