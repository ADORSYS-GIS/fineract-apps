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

    /** Short name of the Fineract savings product used for settlement currency (XAF) treasury accounts. */
    private String settlementCurrencyProductShortName = "VSAV";

    private MarketHours marketHours = new MarketHours();
    private Pricing pricing = new Pricing();
    private Orders orders = new Orders();
    private TradeLock tradeLock = new TradeLock();
    private Accounting accounting = new Accounting();
    private GlAccounts glAccounts = new GlAccounts();
    private Archival archival = new Archival();
    private Portfolio portfolio = new Portfolio();

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
    }

    @Data
    public static class Accounting {
        /** Optional. If set, spread is enabled and swept to this account. If null, spread is disabled. */
        private Long spreadCollectionAccountId;
    }

    @Data
    public static class GlAccounts {
        /** GL code for digital asset inventory account. Resolved to DB ID at startup. */
        private String digitalAssetInventory = "47";
        /** GL code for customer digital asset holdings account. Resolved to DB ID at startup. */
        private String customerDigitalAssetHoldings = "65";
        /** GL code for transfers in suspense account. Resolved to DB ID at startup. */
        private String transfersInSuspense = "48";
        /** GL code for income from interest account. Resolved to DB ID at startup. */
        private String incomeFromInterest = "87";
        /** GL code for expense account (interest on savings / write-off). Resolved to DB ID at startup. */
        private String expenseAccount = "91";
        /** Payment type name for asset issuance. Resolved to DB ID at startup. */
        private String assetIssuancePaymentType = "Asset Issuance";
        /** GL code for trading fee income account. Resolved to DB ID at startup. */
        private String feeIncome = "87";
        /** GL code for fund source / cash reference account. Resolved to DB ID at startup. */
        private String fundSource = "42";
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
    }
}
