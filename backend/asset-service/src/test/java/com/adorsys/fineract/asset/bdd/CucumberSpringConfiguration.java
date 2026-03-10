package com.adorsys.fineract.asset.bdd;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import com.adorsys.fineract.asset.client.GlAccountResolver;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import io.cucumber.spring.CucumberContextConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

/**
 * Single Spring context shared across all Cucumber scenarios.
 * Boots once and is reused — mirrors the existing integration test setup.
 */
@CucumberContextConfiguration
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
@Import(CucumberSpringConfiguration.TestResolvedGlAccountsConfig.class)
public class CucumberSpringConfiguration {

    @MockBean
    FineractClient fineractClient;

    @MockBean
    FineractTokenProvider fineractTokenProvider;

    /** Prevent GlAccountResolver from running during tests (it needs a live Fineract). */
    @MockBean
    GlAccountResolver glAccountResolver;

    /**
     * Provides a pre-populated ResolvedGlAccounts bean for integration tests,
     * overriding the empty one that would be created by the component scan.
     */
    @TestConfiguration
    static class TestResolvedGlAccountsConfig {
        @Bean
        public ResolvedGlAccounts resolvedGlAccounts() {
            ResolvedGlAccounts resolved = new ResolvedGlAccounts();
            resolved.setDigitalAssetInventoryId(47L);
            resolved.setCustomerDigitalAssetHoldingsId(65L);
            resolved.setTransfersInSuspenseId(48L);
            resolved.setIncomeFromInterestId(87L);
            resolved.setAssetIssuancePaymentTypeId(22L);
            return resolved;
        }
    }
}
