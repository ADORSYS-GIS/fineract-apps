package com.adorsys.fineract.asset.bdd.state;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MvcResult;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

/**
 * Scenario-scoped shared state between step definition classes.
 * Spring creates a new instance per Cucumber scenario (cucumber-glue scope),
 * preventing state leakage between tests.
 */
@Component
@Scope("cucumber-glue")
public class ScenarioContext {

    private MvcResult lastResult;
    private int lastStatusCode;
    private String lastResponseBody;
    private final Map<String, String> storedIds = new HashMap<>();
    private final Map<String, Object> storedValues = new HashMap<>();

    public MvcResult getLastResult() {
        return lastResult;
    }

    public void setLastResult(MvcResult result) {
        this.lastResult = result;
        try {
            this.lastStatusCode = result.getResponse().getStatus();
            this.lastResponseBody = result.getResponse().getContentAsString();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to read response body", e);
        }
    }

    public int getLastStatusCode() {
        return lastStatusCode;
    }

    public String getLastResponseBody() {
        return lastResponseBody;
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
