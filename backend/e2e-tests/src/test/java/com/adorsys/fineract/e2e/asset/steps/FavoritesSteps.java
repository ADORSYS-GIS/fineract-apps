package com.adorsys.fineract.e2e.asset.steps;

import com.adorsys.fineract.e2e.config.FineractInitializer;
import com.adorsys.fineract.e2e.support.E2EScenarioContext;
import com.adorsys.fineract.e2e.support.JwtTokenFactory;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Step definitions for favorites/watchlist operations.
 * Exercises: GET/POST/DELETE /api/favorites
 */
public class FavoritesSteps {

    @LocalServerPort
    private int port;

    @Autowired
    private E2EScenarioContext context;

    @When("the user adds asset {string} to favorites")
    public void addToFavorites(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .post("/api/favorites/" + assetId);
        context.setLastResponse(response);
    }

    @When("the user lists their favorites")
    public void listFavorites() {
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .get("/api/favorites");
        context.setLastResponse(response);
    }

    @When("the user removes asset {string} from favorites")
    public void removeFromFavorites(String symbolRef) {
        String assetId = resolveAssetId(symbolRef);
        Response response = RestAssured.given()
                .baseUri("http://localhost:" + port)
                .header("Authorization", "Bearer " + testUserJwt())
                .delete("/api/favorites/" + assetId);
        context.setLastResponse(response);
    }

    @Then("the favorites should contain asset {string}")
    public void favoritesShouldContainAsset(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath().getList("symbol");
        assertThat(symbols).contains(symbol);
    }

    @Then("the favorites should not contain asset {string}")
    public void favoritesShouldNotContainAsset(String symbol) {
        List<String> symbols = context.getLastResponse().jsonPath().getList("symbol");
        assertThat(symbols).doesNotContain(symbol);
    }

    private String testUserJwt() {
        return JwtTokenFactory.generateToken(
                FineractInitializer.TEST_USER_EXTERNAL_ID,
                FineractInitializer.getTestUserClientId(),
                List.of());
    }

    private String resolveAssetId(String ref) {
        String stored = context.getId("lastAssetId");
        String lastSymbol = context.getValue("lastSymbol");
        if (stored != null && ref.equals(lastSymbol)) {
            return stored;
        }
        return ref;
    }
}
