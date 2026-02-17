package com.adorsys.fineract.asset.client;

import com.adorsys.fineract.asset.config.AssetServiceConfig;
import com.adorsys.fineract.asset.config.ResolvedGlAccounts;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * Resolves GL account codes and payment type names (from configuration) to their
 * actual Fineract database IDs at application startup.
 *
 * <p>Fineract auto-generates database IDs for GL accounts and payment types, so the
 * numeric GL code (e.g. "47") does not necessarily match the database ID. This
 * component queries the Fineract API to build a code-to-ID mapping and populates
 * the {@link ResolvedGlAccounts} bean that the rest of the application uses.</p>
 *
 * <p>Retries up to 5 times with exponential backoff (5s, 10s, 20s, 40s, 80s) since
 * Fineract may not be ready when the asset service starts.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class GlAccountResolver implements ApplicationRunner {

    private static final int MAX_RETRIES = 5;
    private static final long INITIAL_DELAY_MS = 5_000;

    private final FineractClient fineractClient;
    private final AssetServiceConfig assetServiceConfig;
    private final ResolvedGlAccounts resolvedGlAccounts;

    @Override
    public void run(ApplicationArguments args) {
        log.info("Resolving GL account codes and payment type names to Fineract database IDs...");

        AssetServiceConfig.GlAccounts glConfig = assetServiceConfig.getGlAccounts();

        Exception lastException = null;
        long delay = INITIAL_DELAY_MS;

        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                resolve(glConfig);
                log.info("GL account resolution completed successfully on attempt {}", attempt);
                return;
            } catch (Exception e) {
                lastException = e;
                log.warn("GL account resolution attempt {}/{} failed: {}. Retrying in {}ms...",
                        attempt, MAX_RETRIES, e.getMessage(), delay);
                if (attempt < MAX_RETRIES) {
                    sleep(delay);
                    delay *= 2; // exponential backoff
                }
            }
        }

        throw new IllegalStateException(
                "Failed to resolve GL accounts after " + MAX_RETRIES + " attempts. "
                + "Ensure Fineract is running and the configured GL codes/payment type names exist. "
                + "Last error: " + (lastException != null ? lastException.getMessage() : "unknown"),
                lastException);
    }

    private void resolve(AssetServiceConfig.GlAccounts glConfig) {
        // Resolve GL accounts by code
        Map<String, Long> glCodeToId = fineractClient.lookupGlAccounts();
        log.debug("Fetched {} GL accounts from Fineract", glCodeToId.size());

        resolvedGlAccounts.setDigitalAssetInventoryId(
                resolveGlCode(glCodeToId, glConfig.getDigitalAssetInventory(), "digitalAssetInventory"));
        resolvedGlAccounts.setCustomerDigitalAssetHoldingsId(
                resolveGlCode(glCodeToId, glConfig.getCustomerDigitalAssetHoldings(), "customerDigitalAssetHoldings"));
        resolvedGlAccounts.setTransfersInSuspenseId(
                resolveGlCode(glCodeToId, glConfig.getTransfersInSuspense(), "transfersInSuspense"));
        resolvedGlAccounts.setIncomeFromInterestId(
                resolveGlCode(glCodeToId, glConfig.getIncomeFromInterest(), "incomeFromInterest"));
        resolvedGlAccounts.setExpenseAccountId(
                resolveGlCode(glCodeToId, glConfig.getExpenseAccount(), "expenseAccount"));

        // Resolve payment type by name
        Map<String, Long> paymentTypeNameToId = fineractClient.lookupPaymentTypes();
        log.debug("Fetched {} payment types from Fineract", paymentTypeNameToId.size());

        resolvedGlAccounts.setAssetIssuancePaymentTypeId(
                resolvePaymentType(paymentTypeNameToId, glConfig.getAssetIssuancePaymentType(), "assetIssuancePaymentType"));

        log.info("Resolved GL accounts: digitalAssetInventory={} (code {}), "
                + "customerDigitalAssetHoldings={} (code {}), "
                + "transfersInSuspense={} (code {}), "
                + "incomeFromInterest={} (code {}), "
                + "expenseAccount={} (code {}), "
                + "assetIssuancePaymentType={} (name '{}')",
                resolvedGlAccounts.getDigitalAssetInventoryId(), glConfig.getDigitalAssetInventory(),
                resolvedGlAccounts.getCustomerDigitalAssetHoldingsId(), glConfig.getCustomerDigitalAssetHoldings(),
                resolvedGlAccounts.getTransfersInSuspenseId(), glConfig.getTransfersInSuspense(),
                resolvedGlAccounts.getIncomeFromInterestId(), glConfig.getIncomeFromInterest(),
                resolvedGlAccounts.getExpenseAccountId(), glConfig.getExpenseAccount(),
                resolvedGlAccounts.getAssetIssuancePaymentTypeId(), glConfig.getAssetIssuancePaymentType());
    }

    private Long resolveGlCode(Map<String, Long> codeToId, String glCode, String configName) {
        Long id = codeToId.get(glCode);
        if (id == null) {
            throw new IllegalStateException(
                    "GL account with code '" + glCode + "' not found in Fineract. "
                    + "Config property: asset-service.gl-accounts." + configName + ". "
                    + "Available GL codes: " + codeToId.keySet());
        }
        return id;
    }

    private Long resolvePaymentType(Map<String, Long> nameToId, String paymentTypeName, String configName) {
        Long id = nameToId.get(paymentTypeName);
        if (id == null) {
            throw new IllegalStateException(
                    "Payment type with name '" + paymentTypeName + "' not found in Fineract. "
                    + "Config property: asset-service.gl-accounts." + configName + ". "
                    + "Available payment types: " + nameToId.keySet());
        }
        return id;
    }

    private void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("GL account resolution interrupted", e);
        }
    }
}
