package com.adorsys.fineract.e2e.config;

import com.adorsys.fineract.e2e.client.FineractTestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;

/**
 * Initializes Fineract with the required resources (GL accounts, payment types,
 * currencies, clients) before the asset-service Spring context boots.
 *
 * <p>This is necessary because {@code GlAccountResolver} runs at startup and
 * expects these resources to already exist in Fineract.
 */
public final class FineractInitializer {

    private static final Logger log = LoggerFactory.getLogger(FineractInitializer.class);
    private static boolean initialized = false;

    /** GL account IDs resolved after creation. */
    private static Long glAssetInventoryId;       // code 47 - Asset type
    private static Long glCustomerHoldingsId;     // code 65 - Liability type
    private static Long glTransfersInSuspenseId;  // code 48 - Liability type
    private static Long glIncomeFromInterestId;   // code 87 - Income type
    private static Long glExpenseAccountId;       // code 91 - Expense type
    private static Long glFundSourceId;           // code 42 - Asset type
    private static Long paymentTypeId;
    private static Integer xafSavingsProductId;
    private static Long treasuryClientId;
    private static Long testUserClientId;
    private static Long testUserXafAccountId;

    /** The external ID used for the test user in Fineract. */
    public static final String TEST_USER_EXTERNAL_ID = "e2e-test-user-001";
    public static final BigDecimal TEST_USER_INITIAL_BALANCE = new BigDecimal("5000000");

    private FineractInitializer() {}

    /**
     * Initialize Fineract with all required resources.
     * Idempotent — only runs once even if called multiple times.
     */
    public static synchronized void initialize(FineractTestClient client) {
        if (initialized) {
            log.info("Fineract already initialized, skipping.");
            return;
        }

        log.info("Initializing Fineract with GL accounts, payment types, and clients...");

        // 1. Create GL accounts
        // Type: 1=Asset, 2=Liability, 4=Income, 5=Expense
        // Usage: 2=Detail (for posting transactions)
        glAssetInventoryId = client.createGlAccount(
                "Digital Asset Inventory", "47", 1, 2);
        glFundSourceId = client.createGlAccount(
                "Fund Source", "42", 1, 2);
        glCustomerHoldingsId = client.createGlAccount(
                "Customer Digital Asset Holdings", "65", 2, 2);
        glTransfersInSuspenseId = client.createGlAccount(
                "Transfers In Suspense", "48", 2, 2);
        glIncomeFromInterestId = client.createGlAccount(
                "Income From Interest/Fees", "87", 4, 2);
        glExpenseAccountId = client.createGlAccount(
                "Expense Account", "91", 5, 2);

        log.info("Created GL accounts: 47={}, 42={}, 65={}, 48={}, 87={}, 91={}",
                glAssetInventoryId, glFundSourceId, glCustomerHoldingsId,
                glTransfersInSuspenseId, glIncomeFromInterestId, glExpenseAccountId);

        // 2. Create payment type
        paymentTypeId = client.createPaymentType("Asset Issuance", 20);
        log.info("Created payment type 'Asset Issuance': id={}", paymentTypeId);

        // 3. Register XAF currency
        client.registerCurrencies(List.of("XAF"));
        log.info("Registered currency: XAF");

        // 4. Create XAF savings product
        xafSavingsProductId = client.createSavingsProduct(
                "XAF Settlement Account", "VSAV", "XAF", 0,
                glAssetInventoryId,       // savingsReferenceAccountId
                glCustomerHoldingsId,     // savingsControlAccountId
                glTransfersInSuspenseId,  // transfersInSuspenseId
                glIncomeFromInterestId,   // incomeFromInterestId
                glExpenseAccountId        // expenseAccountId
        );
        log.info("Created XAF savings product: id={}", xafSavingsProductId);

        // 5. Create treasury client
        treasuryClientId = client.createClient("E2E", "Treasury", null);
        log.info("Created treasury client: id={}", treasuryClientId);

        // 6. Create test user client
        testUserClientId = client.createClient(
                "E2E", "TestUser", TEST_USER_EXTERNAL_ID);
        log.info("Created test user client: id={}, externalId={}",
                testUserClientId, TEST_USER_EXTERNAL_ID);

        // 7. Provision XAF account for test user and deposit initial balance
        testUserXafAccountId = client.provisionSavingsAccount(
                testUserClientId, xafSavingsProductId);
        client.depositToSavingsAccount(
                testUserXafAccountId, TEST_USER_INITIAL_BALANCE);
        log.info("Test user XAF account: id={}, balance={}",
                testUserXafAccountId, TEST_USER_INITIAL_BALANCE);

        initialized = true;
        log.info("Fineract initialization complete.");
    }

    // Accessors for use in step definitions
    public static Long getTreasuryClientId() { return treasuryClientId; }
    public static Long getTestUserClientId() { return testUserClientId; }
    public static Long getTestUserXafAccountId() { return testUserXafAccountId; }
    public static Integer getXafSavingsProductId() { return xafSavingsProductId; }
}
