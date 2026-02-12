package com.adorsys.fineract.asset.bdd;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

/**
 * Single Spring context shared across all Cucumber scenarios.
 * Boots once and is reused — mirrors the existing integration test setup.
 */
@CucumberContextConfiguration
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class CucumberSpringConfiguration {

    @MockBean
    FineractClient fineractClient;

    @MockBean
    FineractTokenProvider fineractTokenProvider;
}
