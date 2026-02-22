package com.adorsys.fineract.e2e.support;

import io.restassured.response.Response;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Scenario-scoped shared state between step definition classes.
 * A new instance is created for each Cucumber scenario via cucumber-glue scope.
 */
@Component
@Scope("cucumber-glue")
public class E2EScenarioContext {

    private static final AtomicInteger SCENARIO_COUNTER = new AtomicInteger(0);

    private Response lastResponse;
    private final Map<String, String> storedIds = new HashMap<>();
    private final Map<String, Object> storedValues = new HashMap<>();
    private final String scenarioSuffix;

    public E2EScenarioContext() {
        this.scenarioSuffix = String.valueOf(SCENARIO_COUNTER.incrementAndGet());
    }

    /** Unique suffix for this scenario (used to generate unique currency codes, symbols). */
    public String getScenarioSuffix() {
        return scenarioSuffix;
    }

    public Response getLastResponse() {
        return lastResponse;
    }

    public void setLastResponse(Response response) {
        this.lastResponse = response;
    }

    public int getStatusCode() {
        return lastResponse != null ? lastResponse.statusCode() : -1;
    }

    public String getBody() {
        return lastResponse != null ? lastResponse.body().asString() : "";
    }

    public <T> T jsonPath(String path) {
        return lastResponse != null ? lastResponse.jsonPath().get(path) : null;
    }

    public void storeId(String key, String value) {
        storedIds.put(key, value);
    }

    public String getId(String key) {
        return storedIds.get(key);
    }

    public void storeValue(String key, Object value) {
        storedValues.put(key, value);
    }

    @SuppressWarnings("unchecked")
    public <T> T getValue(String key) {
        return (T) storedValues.get(key);
    }
}
