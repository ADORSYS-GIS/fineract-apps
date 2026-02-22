package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

/**
 * Shared step definitions reused across all feature files.
 */
public class CommonStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private DataSource dataSource;
    @Autowired private ScenarioContext context;

    @Given("the test database is seeded with standard data")
    public void seedStandardData() throws Exception {
        try (Connection conn = dataSource.getConnection()) {
            ScriptUtils.executeSqlScript(conn, new ClassPathResource("test-data.sql"));
        }
    }

    @When("an unauthenticated user calls {string} {string}")
    public void unauthenticatedUserCalls(String method, String path) throws Exception {
        MvcResult result = switch (method.toUpperCase()) {
            case "GET" -> mockMvc.perform(get(path)).andReturn();
            case "POST" -> mockMvc.perform(post(path)).andReturn();
            case "PUT" -> mockMvc.perform(put(path)).andReturn();
            case "DELETE" -> mockMvc.perform(delete(path)).andReturn();
            default -> throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        };
        context.setLastResult(result);
    }

    @When("a user with role {string} calls {string} {string}")
    public void userWithRoleCalls(String role, String method, String path) throws Exception {
        var jwtProcessor = jwt().authorities(
                new org.springframework.security.core.authority.SimpleGrantedAuthority(role));

        MvcResult result = switch (method.toUpperCase()) {
            case "GET" -> mockMvc.perform(get(path).with(jwtProcessor)).andReturn();
            case "POST" -> mockMvc.perform(post(path).with(jwtProcessor)).andReturn();
            case "PUT" -> mockMvc.perform(put(path).with(jwtProcessor)).andReturn();
            case "DELETE" -> mockMvc.perform(delete(path).with(jwtProcessor)).andReturn();
            default -> throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        };
        context.setLastResult(result);
    }

    // -------------------------------------------------------------------------
    // Response assertions
    // -------------------------------------------------------------------------

    @Then("the response status should be {int}")
    public void responseStatusShouldBe(int expectedStatus) {
        assertThat(context.getLastStatusCode()).isEqualTo(expectedStatus);
    }

    @Then("the response body should contain field {string} with value {string}")
    public void responseFieldEquals(String jsonPath, String expectedValue) {
        Object actual = JsonPath.read(context.getLastResponseBody(), "$." + jsonPath);
        assertThat(String.valueOf(actual)).isEqualTo(expectedValue);
    }

    @Then("the response body should contain field {string}")
    public void responseBodyContainsField(String fieldName) {
        Object actual = JsonPath.read(context.getLastResponseBody(), "$." + fieldName);
        assertThat(actual).isNotNull();
    }

    @Then("the response body should contain {string}")
    public void responseBodyContains(String text) {
        assertThat(context.getLastResponseBody()).contains(text);
    }

    @Then("the response error code should be {string}")
    public void responseErrorCodeShouldBe(String expectedCode) {
        String body = context.getLastResponseBody();
        String code = JsonPath.read(body, "$.code");
        assertThat(code).isEqualTo(expectedCode);
    }
}
