package com.adorsys.fineract.asset.bdd;

import com.adorsys.fineract.asset.client.FineractClient;
import com.adorsys.fineract.asset.client.FineractTokenProvider;
import com.adorsys.fineract.asset.client.GlAccountResolver;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import io.cucumber.spring.CucumberContextConfiguration;
import net.javacrumbs.shedlock.core.LockProvider;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

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

        /** No-op lock provider — bypasses Shedlock's MySQL-specific SQL in H2 BDD tests. */
        @Bean
        @Primary
        public LockProvider lockProvider() {
            return lockConfiguration -> Optional.of(() -> {});
        }

        @Bean
        public ResolvedGlAccounts resolvedGlAccounts() {
            ResolvedGlAccounts resolved = new ResolvedGlAccounts();
            resolved.setDigitalAssetInventoryId(47L);
            resolved.setCustomerDigitalAssetHoldingsId(65L);
            resolved.setTransfersInSuspenseId(48L);
            resolved.setIncomeFromInterestId(87L);
            resolved.setAssetIssuancePaymentTypeId(22L);
            resolved.setFundSourceId(502L);
            resolved.setFeeIncomeId(701L);
            resolved.setLpSettlementControlId(4011L);
            resolved.setLpSpreadPayableId(4012L);
            resolved.setLpTaxWithholdingId(4013L);
            resolved.setLpFundSourceId(5011L);
            resolved.setPlatformFeePayableId(4201L);
            resolved.setMtnMoMoId(5001L);
            resolved.setOrangeMoneyId(5002L);
            resolved.setUbaBankId(5011L);
            resolved.setAfrilandBankId(5012L);
            resolved.setTaxPayableFundSourceId(5031L);
            resolved.setClearingAccountId(901L);
            resolved.setFeeCollectionAccountId(900L);
            return resolved;
        }
    }
}
