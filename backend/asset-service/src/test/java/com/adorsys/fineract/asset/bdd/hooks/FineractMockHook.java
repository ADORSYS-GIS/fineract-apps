package com.adorsys.fineract.asset.bdd.hooks;

import com.adorsys.fineract.asset.client.FineractClient;
import io.cucumber.java.Before;
import org.springframework.beans.factory.annotation.Autowired;

import static org.mockito.Mockito.reset;

/**
 * Resets FineractClient mocks before each Cucumber scenario
 * to prevent stub leakage between scenarios.
 */
public class FineractMockHook {

    @Autowired
    private FineractClient fineractClient;

    @Before(order = 2)
    public void resetMocks() {
        reset(fineractClient);
    }
}
