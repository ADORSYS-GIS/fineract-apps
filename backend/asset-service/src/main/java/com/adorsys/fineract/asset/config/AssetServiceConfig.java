package com.adorsys.fineract.asset.config;

import jakarta.annotation.PostConstruct;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.ZoneId;

/**
 * Asset service-specific configuration properties.
 */
@Data
@Configuration
@ConfigurationProperties(prefix = "asset-service")
public class AssetServiceConfig {

    /** ISO 4217 currency code for the settlement/cash currency. */
    private String settlementCurrency = "XAF";

    /** Short name of the Fineract savings product used for client settlement currency (XAF) accounts. */
    private String settlementCurrencyProductShortName = "VSAV";

    /** Short name of the Fineract savings product used for LP settlement (XAF) accounts. */
    private String lpSettlementProductShortName = "LSAV";

    /** Short name of the Fineract savings product used for LP spread collection accounts. */
    private String lpSpreadProductShortName = "LSPD";

    /** Short name of the Fineract savings product used for LP tax withholding accounts. */
    private String lpTaxProductShortName = "LTAX";

    private MarketHours marketHours = new MarketHours();
    private Pricing pricing = new Pricing();
    private Orders orders = new Orders();
    private TradeLock tradeLock = new TradeLock();
    private Accounting accounting = new Accounting();
    private GlAccounts glAccounts = new GlAccounts();
    private Archival archival = new Archival();
    private Portfolio portfolio = new Portfolio();
    private QueuedOrders queuedOrders = new QueuedOrders();
    private Quote quote = new Quote();
    private Rebalance rebalance = new Rebalance();

    /** Platform-wide max portfolio exposure per user in XAF. Null = unlimited. */
    private BigDecimal portfolioExposureLimitXaf;

    @Data
    public static class Archival {
        /** Number of months to retain records in hot tables before archiving. */
        private int retentionMonths = 12;
        /** Number of rows to process per batch during archival. */
        private int batchSize = 1000;
    }

    @Data
    public static class Portfolio {
        /** Cron expression for daily portfolio snapshot. Default: 20:30 daily. */
        private String snapshotCron = "0 30 20 * * *";
    }

    @Data
    public static class MarketHours {
        private String open = "08:00";
        private String close = "20:00";
        private String timezone = "Africa/Douala";
        private boolean weekendTradingEnabled = false;
    }

    @Data
    public static class Pricing {
        private String snapshotCron = "0 0 * * * *";
        /** Max price change percent before a warning is logged. Null to disable. */
        private BigDecimal maxChangePercent = new BigDecimal("50");
    }

    @Data
    public static class Orders {
        private int staleCleanupMinutes = 30;
    }

    @Data
    public static class TradeLock {
        private int ttlSeconds = 45;
        private int localFallbackTimeoutSeconds = 40;
    }

    @Data
    public static class Accounting {
        /** Optional. If set, spread is enabled and swept to this account. If null, spread is disabled. */
        private Long spreadCollectionAccountId;
        /** External ID of the platform-wide fee collection savings account. Resolved to DB ID at startup. */
        private String feeCollectionAccountExternalId = "PLATFORM-FEE-COLLECT";
        /** External ID of the clearing account for BUY trade routing. Resolved to DB ID at startup. */
        private String clearingAccountExternalId = "PLATFORM-CLEARING";
    }

    @Data
    public static class QueuedOrders {
        /** Max price change (%) from queue time before a queued order is rejected at market open. */
        private BigDecimal stalePriceThresholdPercent = new BigDecimal("5.0");
    }

    @Data
    public static class Quote {
        /** How long a quote remains valid, in seconds. */
        private int ttlSeconds = 60;
        /** Max active quotes a single user can hold simultaneously. */
        private int maxActivePerUser = 5;
        /** How often to run the expired quote cleanup scheduler, in milliseconds. */
        private long expiryCleanupIntervalMs = 30_000;
    }

    @Data
    public static class Rebalance {
        /** Default reserve % to keep in MoMo/Orange for client withdrawals (0.0 to 1.0). */
        private BigDecimal defaultReservePercent = new BigDecimal("0.20");
        /** Minimum transfer amount to include in a proposal (avoids dust entries). */
        private BigDecimal minTransferAmount = new BigDecimal("1");
    }

    @Data
    public static class GlAccounts {
        // --- Client GL accounts ---
        /** GL code for fund source / cash reference account (client side). */
        private String fundSource = "502";
        /** GL code for client savings control (liability to clients). */
        private String savingsControl = "4101";
        /** GL code for customer digital asset holdings account. */
        private String customerDigitalAssetHoldings = "4102";

        // --- LP GL accounts ---
        /** GL code for LP settlement control (liability to LPs). */
        private String lpSettlementControl = "4011";
        /** GL code for LP spread payable (spread held by Azamra until settled). */
        private String lpSpreadPayable = "4012";
        /** GL code for LP tax withholding (tax withheld from LPs on sell). */
        private String lpTaxWithholding = "4013";
        /** GL code for LP fund source (UBA bank trust). */
        private String lpFundSource = "5011";

        // --- Trust accounts ---
        /** GL code for MTN MoMo trust. */
        private String mtnMoMo = "5001";
        /** GL code for Orange Money trust. */
        private String orangeMoney = "5002";
        /** GL code for UBA bank trust. */
        private String ubaBank = "5011";
        /** GL code for Afriland bank. */
        private String afrilandBank = "5012";

        // --- Inventory & suspense ---
        /** GL code for digital asset inventory account (LP token vault). */
        private String digitalAssetInventory = "301";
        /** GL code for transfers in suspense account. */
        private String transfersInSuspense = "4501";

        // --- Income ---
        /** GL code for platform fee payable (liability). */
        private String platformFeePayable = "4201";
        /** GL code for platform fee income. */
        private String platformFeeIncome = "701";
        /** GL code for LP spread income. */
        private String spreadIncome = "702";
        /** GL code for income from interest account. */
        private String incomeFromInterest = "701";
        /** GL code for trading fee income (alias for platformFeeIncome). */
        private String feeIncome = "701";

        // --- Expense ---
        /** GL code for expense account (interest on savings / write-off). */
        private String expenseAccount = "601";
        /** GL code for tax expense - registration duty. */
        private String taxExpenseRegDuty = "608";
        /** GL code for tax expense - capital gains. */
        private String taxExpenseCapGains = "608";
        /** GL code for tax expense - IRCM. */
        private String taxExpenseIrcm = "608";
        /** GL code for tax expense - TVA. */
        private String taxExpenseTva = "608";

        // --- Equity ---
        /** GL code for LP asset equity / capital. */
        private String assetEquity = "103";

        // --- Tax payable ---
        /** GL code for tax payable fund source (Afriland tax account). */
        private String taxPayableFundSource = "5031";

        // --- Payment types ---
        /** Payment type name for asset issuance. Resolved to DB ID at startup. */
        private String assetIssuancePaymentType = "Asset Issuance";
    }

    @PostConstruct
    public void validate() {
        if (settlementCurrency == null || !settlementCurrency.matches("[A-Z]{3}")) {
            throw new IllegalStateException(
                    "asset-service.settlement-currency must be a 3-letter ISO 4217 currency code. "
                    + "Current value: '" + settlementCurrency + "'");
        }
        try {
            ZoneId.of(marketHours.getTimezone());
        } catch (Exception e) {
            throw new IllegalStateException(
                    "asset-service.market-hours.timezone is invalid: '" + marketHours.getTimezone()
                    + "'. Must be a valid IANA timezone (e.g. 'Africa/Douala').", e);
        }
        if (tradeLock.getTtlSeconds() < 30) {
            throw new IllegalStateException(
                    "asset-service.trade-lock.ttl-seconds (" + tradeLock.getTtlSeconds()
                    + ") must be >= 30 to outlive the transaction timeout.");
        }
        if (tradeLock.getLocalFallbackTimeoutSeconds() < 10) {
            throw new IllegalStateException(
                    "asset-service.trade-lock.local-fallback-timeout-seconds ("
                    + tradeLock.getLocalFallbackTimeoutSeconds()
                    + ") must be >= 10 to allow trades to complete under local locking.");
        }
    }
}
