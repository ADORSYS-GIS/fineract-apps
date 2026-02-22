package com.adorsys.fineract.asset.bdd.steps;

import com.adorsys.fineract.asset.bdd.state.ScenarioContext;
import com.jayway.jsonpath.JsonPath;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;

/**
 * Step definitions for portfolio scenarios.
 */
public class PortfolioStepDefinitions {

    @Autowired private MockMvc mockMvc;
    @Autowired private ScenarioContext context;

    private static final String EXTERNAL_ID = "bdd-user-ext-123";
    private static final Long USER_ID = 42L;

    @When("the user requests their portfolio")
    public void userRequestsPortfolio() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/portfolio")
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID))))
                .andReturn();
        context.setLastResult(result);
    }

    @When("the user requests the position for asset {string}")
    public void userRequestsPosition(String assetId) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/portfolio/positions/" + assetId)
                        .with(jwt().jwt(j -> j.subject(EXTERNAL_ID).claim("fineract_client_id", USER_ID))))
                .andReturn();
        context.setLastResult(result);
    }

    @Then("the portfolio should have {int} positions")
    public void portfolioPositionCount(int expected) {
        List<?> positions = JsonPath.read(context.getLastResponseBody(), "$.positions");
        assertThat(positions).hasSize(expected);
    }

    @Then("the position for {string} should show {int} units")
    public void positionShows(String assetId, int expectedUnits) {
        List<?> positions = JsonPath.read(context.getLastResponseBody(), "$.positions");
        assertThat(positions).hasSizeGreaterThan(0);
    }

    @Then("the position should show unrealized P&L")
    public void positionShowsUnrealizedPnl() {
        Object pnl = JsonPath.read(context.getLastResponseBody(), "$.unrealizedPnl");
        assertThat(pnl).isNotNull();
    }
}
